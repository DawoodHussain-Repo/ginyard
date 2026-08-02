require('module-alias/register');
require('dotenv').config({ path: '.env' });
require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');
const { globSync } = require('glob');
const path = require('path');

async function runTests() {
  console.log('GROQ API KEY:', process.env.GROQ_API_KEY ? 'FOUND' : 'MISSING');
  await mongoose.connect(process.env.DATABASE);
  console.log('Connected to Database');

  const modelsFiles = globSync('./src/models/**/*.js');
  for (const filePath of modelsFiles) {
    require(path.resolve(filePath));
  }

  const { chat } = require('./controllers/appControllers/aiController/chatService');
  const Admin = mongoose.model('Admin');
  const Client = mongoose.model('Client');
  const Invoice = mongoose.model('Invoice');

  const admin = await Admin.findOne();
  const adminId = admin ? admin._id.toString() : null;
  console.log('Using Admin ID:', adminId);

  // Seed sample client & invoice so update / payment / quote tests find existing DB records
  let client = await Client.findOne({ name: /Acme Corp/i, removed: false });
  if (!client) {
    client = await new Client({ name: 'Acme Corp', createdBy: adminId }).save();
  }

  let invoice = await Invoice.findOne({ client: client._id, removed: false });
  if (!invoice) {
    invoice = await new Invoice({
      client: client._id,
      number: 1,
      year: new Date().getFullYear(),
      status: 'draft',
      paymentStatus: 'unpaid',
      items: [{ itemName: 'Fertilizer bag', quantity: 15, price: 1000, total: 15000 }],
      subTotal: 15000,
      taxRate: 0,
      taxTotal: 0,
      total: 15000,
      createdBy: adminId,
    }).save();
  }
  console.log('Seeded DB Records for Acme Corp (Client ID:', client._id.toString(), 'Invoice ID:', invoice._id.toString(), ')');

  const testPrompts = [
    {
      id: 1,
      name: 'New Client & Invoice Creation',
      prompt: 'Make a new client named Acme Corp and create a draft invoice for 15 fertilizer bags at 1000 PKR each',
    },
    {
      id: 2,
      name: 'Update Invoice Status & Payment',
      prompt: 'Change the status of Acme Corp invoice to sent and payment status to paid',
    },
    {
      id: 3,
      name: 'Quote Creation & Conversion',
      prompt: 'Create a quote for Acme Corp for 10 office chairs at 500 PKR each',
    },
    {
      id: 4,
      name: 'Record Payment',
      prompt: 'Record a Bank Transfer payment of 15000 PKR received from Acme Corp',
    },
    {
      id: 5,
      name: 'Check Registered Tax Variants',
      prompt: 'What tax variants are available in my system?',
    },
  ];

  for (const test of testPrompts) {
    console.log(`\n==================================================`);
    console.log(`TEST ${test.id}: ${test.name}`);
    console.log(`PROMPT: "${test.prompt}"`);
    console.log(`==================================================`);

    try {
      const result = await chat(test.prompt, [], adminId);
      console.log('STATUS: SUCCESS');
      console.log('TOOLS CALLED:', result.tool_calls_made);
      if (result.action_proposal) {
        console.log('PROPOSAL TYPE:', result.action_proposal.action_type);
        console.log('PROPOSAL TITLE:', result.action_proposal.preview_title);
        console.log('PROPOSAL DETAILS:', JSON.stringify(result.action_proposal, null, 2));
      }
      console.log('AI RESPONSE SNEAK PEEK:', result.response?.substring(0, 300));
    } catch (err) {
      console.error('TEST ERROR:', err.status, err.message || err);
    }
  }

  await mongoose.disconnect();
  console.log('\nAll tests completed.');
  process.exit(0);
}

runTests();
