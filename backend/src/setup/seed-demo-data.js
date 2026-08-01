/**
 * Ledgerly AI — Demo Data Seeder
 *
 * Creates realistic demo data spanning ~3 months:
 * - 6 clients (realistic company names)
 * - 20 invoices (mix of paid, unpaid, overdue)
 * - 30 expenses across multiple categories
 * - Payments linked to paid invoices
 *
 * Run: node src/setup/seed-demo-data.js
 */

require('dotenv').config({ path: '.env' });
require('dotenv').config({ path: '.env.local' });

const mongoose = require('mongoose');
mongoose.connect(process.env.DATABASE);

// Load models
require('../models/coreModels/Admin');
require('../models/coreModels/AdminPassword');
require('../models/coreModels/Setting');
require('../models/appModels/Client');
require('../models/appModels/Invoice');
require('../models/appModels/Payment');
require('../models/appModels/Expense');

const Admin = mongoose.model('Admin');
const Client = mongoose.model('Client');
const Invoice = mongoose.model('Invoice');
const Payment = mongoose.model('Payment');
const Expense = mongoose.model('Expense');
const Setting = mongoose.model('Setting');

// ── Helpers ───────────────────────────────────────────────────────────────

function daysAgo(n) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d;
}

function randomBetween(min, max) {
  return Math.round((Math.random() * (max - min) + min) * 100) / 100;
}

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// ── Data Definitions ─────────────────────────────────────────────────────

const CLIENTS = [
  { name: 'Acme Corp', email: 'billing@acmecorp.com', phone: '+1-555-0101', country: 'United States', address: '123 Innovation Dr, San Francisco, CA 94102' },
  { name: 'Pinnacle Digital', email: 'accounts@pinnacledigital.io', phone: '+1-555-0102', country: 'United States', address: '456 Tech Ave, Austin, TX 78701' },
  { name: 'Meridian Studios', email: 'finance@meridianstudios.co', phone: '+44-20-7946-0958', country: 'United Kingdom', address: '12 Camden High St, London NW1 0JH' },
  { name: 'NovaTech Solutions', email: 'ap@novatech.dev', phone: '+1-555-0104', country: 'Canada', address: '789 Startup Lane, Toronto, ON M5V 2T6' },
  { name: 'Brightpath Agency', email: 'invoices@brightpath.agency', phone: '+1-555-0105', country: 'United States', address: '321 Creative Blvd, New York, NY 10001' },
  { name: 'Verdexa Inc', email: 'payments@verdexa.com', phone: '+1-555-0106', country: 'United States', address: '654 Enterprise Way, Seattle, WA 98101' },
];

const INVOICE_ITEMS = [
  { itemName: 'Web Development', description: 'Frontend and backend development', priceRange: [1500, 5000] },
  { itemName: 'UI/UX Design', description: 'Interface design and prototyping', priceRange: [800, 3000] },
  { itemName: 'SEO Optimization', description: 'Search engine optimization audit and implementation', priceRange: [500, 2000] },
  { itemName: 'Content Writing', description: 'Blog posts and marketing copy', priceRange: [300, 1200] },
  { itemName: 'Consulting', description: 'Technical consulting and architecture review', priceRange: [1000, 4000] },
  { itemName: 'API Integration', description: 'Third-party API integration and testing', priceRange: [600, 2500] },
  { itemName: 'Database Migration', description: 'Data migration and schema optimization', priceRange: [1200, 3500] },
  { itemName: 'DevOps Setup', description: 'CI/CD pipeline and infrastructure setup', priceRange: [900, 2800] },
];

const EXPENSES = [
  // Software & Subscriptions
  { vendor: 'AWS', category: 'Software & Subscriptions', description: 'Cloud hosting (EC2, S3, RDS)', amountRange: [85, 210] },
  { vendor: 'Vercel', category: 'Software & Subscriptions', description: 'Frontend hosting and deployments', amountRange: [20, 20] },
  { vendor: 'GitHub', category: 'Software & Subscriptions', description: 'Team plan subscription', amountRange: [44, 44] },
  { vendor: 'Figma', category: 'Software & Subscriptions', description: 'Design tool subscription', amountRange: [15, 15] },
  { vendor: 'Notion', category: 'Software & Subscriptions', description: 'Team workspace subscription', amountRange: [10, 10] },
  { vendor: 'Slack', category: 'Software & Subscriptions', description: 'Team communication', amountRange: [7.25, 7.25] },
  { vendor: 'Linear', category: 'Software & Subscriptions', description: 'Project management tool', amountRange: [8, 8] },

  // Marketing
  { vendor: 'Google Ads', category: 'Marketing', description: 'Search advertising campaign', amountRange: [200, 800] },
  { vendor: 'Meta Ads', category: 'Marketing', description: 'Social media advertising', amountRange: [150, 600] },
  { vendor: 'Mailchimp', category: 'Marketing', description: 'Email marketing platform', amountRange: [50, 50] },

  // Professional Services
  { vendor: 'Fiverr', category: 'Professional Services', description: 'Freelance design work', amountRange: [100, 500] },
  { vendor: 'Upwork', category: 'Professional Services', description: 'Contract development work', amountRange: [200, 1200] },
  { vendor: 'LegalZoom', category: 'Professional Services', description: 'Legal document preparation', amountRange: [150, 400] },

  // Office Supplies
  { vendor: 'Amazon', category: 'Office Supplies', description: 'Office supplies and equipment', amountRange: [25, 180] },
  { vendor: 'Staples', category: 'Office Supplies', description: 'Printer supplies', amountRange: [30, 90] },

  // Travel
  { vendor: 'United Airlines', category: 'Travel', description: 'Client meeting travel', amountRange: [250, 650] },
  { vendor: 'Hilton Hotels', category: 'Travel', description: 'Business trip accommodation', amountRange: [150, 350] },
  { vendor: 'Uber', category: 'Travel', description: 'Business transportation', amountRange: [15, 60] },

  // Utilities
  { vendor: 'Comcast Business', category: 'Utilities', description: 'Office internet service', amountRange: [89.99, 89.99] },

  // Equipment
  { vendor: 'Apple', category: 'Equipment', description: 'MacBook Pro for development', amountRange: [1999, 2499] },
  { vendor: 'Dell', category: 'Equipment', description: 'Monitor for workstation', amountRange: [299, 599] },
];

// ── Seed Logic ───────────────────────────────────────────────────────────

async function seed() {
  try {
    console.log('🌱 Starting Ledgerly AI demo data seed...\n');

    // Find the admin user
    const admin = await Admin.findOne({ removed: false, enabled: true });
    if (!admin) {
      console.error('❌ No admin user found. Run setup.js first.');
      process.exit(1);
    }
    console.log(`  Found admin: ${admin.email}`);

    // ── Clients ────────────────────────────────────────────────────
    console.log('\n📇 Creating clients...');
    const clientDocs = [];
    for (const c of CLIENTS) {
      const existing = await Client.findOne({ name: c.name, removed: false });
      if (existing) {
        clientDocs.push(existing);
        console.log(`  ⏭  ${c.name} (already exists)`);
      } else {
        const doc = await new Client({
          ...c,
          createdBy: admin._id,
          enabled: true,
        }).save();
        clientDocs.push(doc);
        console.log(`  ✅ ${c.name}`);
      }
    }

    // ── Get or set invoice number counter ──────────────────────────
    let invoiceNumber = 1001;
    const numSetting = await Setting.findOne({ settingKey: 'last_invoice_number' });
    if (numSetting) {
      invoiceNumber = (numSetting.settingValue || 1000) + 1;
    }

    // ── Invoices ───────────────────────────────────────────────────
    console.log('\n📄 Creating invoices...');
    const invoiceDocs = [];
    const now = new Date();
    const currentYear = now.getFullYear();

    const invoiceConfigs = [
      // Paid invoices (income)
      { daysAgo: 85, client: 0, itemCount: 2, status: 'sent', paymentStatus: 'paid' },
      { daysAgo: 78, client: 1, itemCount: 1, status: 'sent', paymentStatus: 'paid' },
      { daysAgo: 65, client: 2, itemCount: 3, status: 'sent', paymentStatus: 'paid' },
      { daysAgo: 55, client: 3, itemCount: 1, status: 'sent', paymentStatus: 'paid' },
      { daysAgo: 48, client: 0, itemCount: 2, status: 'sent', paymentStatus: 'paid' },
      { daysAgo: 40, client: 4, itemCount: 1, status: 'sent', paymentStatus: 'paid' },
      { daysAgo: 35, client: 5, itemCount: 2, status: 'sent', paymentStatus: 'paid' },
      { daysAgo: 25, client: 1, itemCount: 1, status: 'sent', paymentStatus: 'paid' },
      { daysAgo: 18, client: 2, itemCount: 2, status: 'sent', paymentStatus: 'paid' },
      { daysAgo: 10, client: 3, itemCount: 1, status: 'sent', paymentStatus: 'paid' },
      { daysAgo: 5, client: 4, itemCount: 2, status: 'sent', paymentStatus: 'paid' },

      // Unpaid invoices (still current)
      { daysAgo: 8, client: 5, itemCount: 1, status: 'sent', paymentStatus: 'unpaid', expiresDaysAgo: -22 },
      { daysAgo: 3, client: 0, itemCount: 2, status: 'sent', paymentStatus: 'unpaid', expiresDaysAgo: -27 },

      // Overdue invoices (past expiry)
      { daysAgo: 50, client: 1, itemCount: 1, status: 'sent', paymentStatus: 'unpaid', expiresDaysAgo: 20 },
      { daysAgo: 45, client: 3, itemCount: 2, status: 'sent', paymentStatus: 'unpaid', expiresDaysAgo: 15 },
      { daysAgo: 60, client: 5, itemCount: 1, status: 'sent', paymentStatus: 'unpaid', expiresDaysAgo: 30 },

      // Partially paid
      { daysAgo: 30, client: 2, itemCount: 2, status: 'sent', paymentStatus: 'partially', expiresDaysAgo: 5 },

      // Drafts
      { daysAgo: 2, client: 4, itemCount: 1, status: 'draft', paymentStatus: 'unpaid', expiresDaysAgo: -28 },
      { daysAgo: 1, client: 0, itemCount: 3, status: 'draft', paymentStatus: 'unpaid', expiresDaysAgo: -29 },
    ];

    for (const cfg of invoiceConfigs) {
      const items = [];
      const selectedItems = [];
      for (let i = 0; i < cfg.itemCount; i++) {
        let item;
        do {
          item = pick(INVOICE_ITEMS);
        } while (selectedItems.includes(item.itemName));
        selectedItems.push(item.itemName);

        const price = randomBetween(item.priceRange[0], item.priceRange[1]);
        const quantity = pick([1, 1, 1, 2]);
        items.push({
          itemName: item.itemName,
          description: item.description,
          quantity,
          price,
          total: Math.round(price * quantity * 100) / 100,
        });
      }

      const subTotal = items.reduce((sum, it) => sum + it.total, 0);
      const taxRate = pick([0, 0, 5, 7.5, 10]);
      const taxTotal = Math.round(subTotal * (taxRate / 100) * 100) / 100;
      const total = Math.round((subTotal + taxTotal) * 100) / 100;

      const invoiceDate = daysAgo(cfg.daysAgo);
      const expiresDays = cfg.expiresDaysAgo !== undefined ? cfg.expiresDaysAgo : -(30 - cfg.daysAgo);
      const expiredDate = daysAgo(expiresDays);

      const credit = cfg.paymentStatus === 'partially'
        ? Math.round(total * randomBetween(0.3, 0.6) * 100) / 100
        : cfg.paymentStatus === 'paid'
          ? total
          : 0;

      const invoiceData = {
        createdBy: admin._id,
        number: invoiceNumber++,
        year: currentYear,
        date: invoiceDate,
        expiredDate: expiredDate,
        client: clientDocs[cfg.client]._id,
        items,
        taxRate,
        subTotal: Math.round(subTotal * 100) / 100,
        taxTotal,
        total,
        credit,
        status: cfg.status,
        paymentStatus: cfg.paymentStatus,
        isOverdue: cfg.expiresDaysAgo > 0 && cfg.paymentStatus !== 'paid',
        currency: 'USD',
      };

      const doc = await new Invoice(invoiceData).save();
      invoiceDocs.push({ doc, config: cfg });
      console.log(`  ✅ INV-${doc.number} | ${clientDocs[cfg.client].name} | $${total.toFixed(2)} | ${cfg.paymentStatus}`);
    }

    // Update the invoice number counter
    await Setting.findOneAndUpdate(
      { settingKey: 'last_invoice_number' },
      { settingValue: invoiceNumber - 1 },
      { upsert: true }
    );

    // ── Payments (for paid invoices) ──────────────────────────────
    console.log('\n💳 Creating payments...');
    let paymentNumber = 1001;

    for (const { doc: inv, config: cfg } of invoiceDocs) {
      if (cfg.paymentStatus === 'paid' || cfg.paymentStatus === 'partially') {
        const amount = cfg.paymentStatus === 'paid' ? inv.total : inv.credit;
        const paymentDate = new Date(inv.date);
        paymentDate.setDate(paymentDate.getDate() + Math.floor(Math.random() * 14) + 1);

        const payment = await new Payment({
          createdBy: admin._id,
          number: paymentNumber++,
          client: inv.client,
          invoice: inv._id,
          date: paymentDate,
          amount,
          currency: 'USD',
          description: `Payment for Invoice #${inv.number}`,
        }).save();

        // Link payment to invoice
        await Invoice.findByIdAndUpdate(inv._id, {
          $push: { payment: payment._id },
        });

        console.log(`  ✅ PAY-${payment.number} | $${amount.toFixed(2)} for INV-${inv.number}`);
      }
    }

    // ── Expenses ──────────────────────────────────────────────────
    console.log('\n💸 Creating expenses...');
    const expenseRecords = [];

    // Generate ~30 expenses over the last 90 days
    // Monthly subscriptions (recurring)
    const monthlyServices = EXPENSES.filter(e =>
      ['Software & Subscriptions', 'Utilities'].includes(e.category) &&
      e.amountRange[0] === e.amountRange[1]
    );
    for (const svc of monthlyServices) {
      for (let month = 0; month < 3; month++) {
        expenseRecords.push({
          ...svc,
          amount: svc.amountRange[0],
          date: daysAgo(month * 30 + Math.floor(Math.random() * 5) + 1),
        });
      }
    }

    // Variable expenses (one-offs and variable amounts)
    const variableExpenses = EXPENSES.filter(e =>
      !(['Software & Subscriptions', 'Utilities'].includes(e.category) &&
        e.amountRange[0] === e.amountRange[1])
    );
    for (const exp of variableExpenses) {
      const count = exp.category === 'Equipment' ? 1 : pick([1, 1, 2]);
      for (let i = 0; i < count; i++) {
        expenseRecords.push({
          ...exp,
          amount: randomBetween(exp.amountRange[0], exp.amountRange[1]),
          date: daysAgo(Math.floor(Math.random() * 90)),
        });
      }
    }

    for (const exp of expenseRecords) {
      const doc = await new Expense({
        createdBy: admin._id,
        vendor: exp.vendor,
        amount: exp.amount,
        category: exp.category,
        date: exp.date,
        description: exp.description,
        currency: 'USD',
      }).save();
      console.log(`  ✅ ${exp.vendor} | $${exp.amount.toFixed(2)} | ${exp.category}`);
    }

    // ── Summary ──────────────────────────────────────────────────
    const totalInvoices = invoiceDocs.length;
    const totalExpenses = expenseRecords.length;
    const paidInvoices = invoiceDocs.filter(i => i.config.paymentStatus === 'paid').length;
    const overdueInvoices = invoiceDocs.filter(i =>
      i.config.paymentStatus === 'unpaid' && i.config.expiresDaysAgo > 0
    ).length;

    console.log('\n' + '─'.repeat(50));
    console.log('🎉 Demo data seeded successfully!\n');
    console.log(`  📇 Clients:        ${clientDocs.length}`);
    console.log(`  📄 Invoices:       ${totalInvoices} (${paidInvoices} paid, ${overdueInvoices} overdue)`);
    console.log(`  💳 Payments:       ${paidInvoices + invoiceDocs.filter(i => i.config.paymentStatus === 'partially').length}`);
    console.log(`  💸 Expenses:       ${totalExpenses}`);
    console.log('\n  Total income seeded: $' +
      invoiceDocs
        .filter(i => i.config.paymentStatus === 'paid')
        .reduce((sum, i) => sum + i.doc.total, 0)
        .toFixed(2)
    );
    console.log('  Total expenses seeded: $' +
      expenseRecords.reduce((sum, e) => sum + e.amount, 0).toFixed(2)
    );
    console.log('─'.repeat(50));

    process.exit(0);
  } catch (error) {
    console.error('\n❌ Seed failed:', error);
    process.exit(1);
  }
}

seed();
