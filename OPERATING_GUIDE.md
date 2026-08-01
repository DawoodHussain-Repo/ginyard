# 📘 Ginyard AI — Comprehensive Enterprise Operating Guide

Welcome to **Ginyard AI**, the next-generation AI-native financial SaaS and Enterprise Resource Planning (ERP/CRM) platform. This guide provides an in-depth operational walkthrough of all AI intelligence capabilities, core accounting modules, billing workflows, and system configurations.

---

## 📑 Table of Contents
1. [Executive Platform Architecture](#1-executive-platform-architecture)
2. [🤖 Deep Dive: AI Financial Intelligence Engine](#2--deep-dive-ai-financial-intelligence-engine)
   - [2.1 Conversational Financial AI Assistant](#21-conversational-financial-ai-assistant)
   - [2.2 Natural Language Smart Transaction Entry](#22-natural-language-smart-transaction-entry)
   - [2.3 Global Floating AI Assistant Widget](#23-global-floating-ai-assistant-widget)
3. [📄 Invoices & Billing Operations](#3--invoices--billing-operations)
4. [🏷️ Quotations & Estimates ("Add Quote")](#4-️-quotations--estimates-add-quote)
5. [👥 Customer & Client CRM ("Add Customer")](#5--customer--client-crm-add-customer)
6. [💸 Expense Management ("Add Expense")](#6--expense-management-add-expense)
7. [📦 Product & Services Catalog ("Add Item")](#7--product--services-catalog-add-item)
8. [💳 Payment Records & Settlement](#8--payment-records--settlement)
9. [⚙️ System Configurations & Tax Rules ("Add Tax")](#9-️-system-configurations--tax-rules-add-tax)
10. [🌓 Theme Engine & Session Security](#10--theme-engine--session-security)

---

## 1. Executive Platform Architecture

Ginyard AI bridges double-entry enterprise accounting operations with autonomous tool-calling intelligence. Built on a high-speed modular architecture, the system provides real-time transaction processing, automated tax compliance, quotation-to-invoice conversions, and instant natural language financial analytics.

---

## 2. 🤖 Deep Dive: AI Financial Intelligence Engine

The Ginyard AI Engine consists of three core components designed to eliminate manual bookkeeping:

### 2.1 Conversational Financial AI Assistant (`/ai-assistant`)

The Conversational AI Assistant is powered by an autonomous tool-calling agent that reads directly from your active MongoDB ledger database.

#### How It Works:
1. **User Prompt**: You ask a question in natural English (e.g., *"Which clients owe me money?"* or *"What was my total spend on cloud servers last month?"*).
2. **Autonomous Tool Selection**: The AI engine determines the required tool call (e.g., `get_overdue_invoices()`, `query_expenses_by_category()`, `calculate_cashflow()`).
3. **Database Execution**: The backend executes the structured database query against your real accounting data.
4. **Natural Synthesis**: The AI returns a precise response formatted with accurate numbers, customer names, and dollar totals.

#### Prompt Examples to Try:
- *"Am I spending more than I'm earning this quarter?"*
- *"Who are my top 3 highest revenue clients?"*
- *"List all unpaid invoices older than 30 days."*
- *"How much revenue did we log in software subscriptions last month?"*

#### How to Use:
1. Click **AI Assistant** on the left navigation menu.
2. Select the **Conversational Chat** tab.
3. Type your question in the bottom text field or click one of the pre-formatted **Suggested Question Chips**.
4. Review the AI's response along with the executed tool-calling badges displayed beneath the response bubble.

---

### 2.2 Natural Language Smart Transaction Entry (`TransactionEntry`)

Smart Entry converts unformatted English text into structured accounting records without manual form filling.

#### How It Works:
1. **Natural Input**: You enter a informal sentence, such as *"Paid $340 to Fiverr for logo design yesterday"* or *"Spent $49.99 on Notion subscription today"*.
2. **NLP Data Extraction**: The AI parses the text into structured JSON fields:
   - **Vendor / Recipient**: `Fiverr`
   - **Amount**: `$340.00`
   - **Category**: `Software & Subscriptions` / `Marketing`
   - **Date**: Auto-calculated relative date (e.g., `yesterday` -> `2026-07-31`)
   - **Transaction Type**: `Expense`
3. **Verification & Edit**: The system presents a structured confirmation card. You can toggle **Edit** to modify any field (Vendor, Amount, Category, Date, or Description).
4. **Ledger Commitment**: Click **Confirm & Save** to write the expense directly to your master ledger.

#### How to Use:
1. Navigate to **AI Assistant** -> **Smart Entry** tab.
2. Enter your sentence or click one of the **Try an Example** chips.
3. Click **Parse**.
4. Verify extracted details and click **Confirm & Save**.

---

### 2.3 Global Floating AI Assistant Widget

The Floating AI Widget provides persistent access to AI financial insights from any page in the platform.

1. Click the **Floating AI Bot** icon in the bottom-right corner of your screen.
2. A sliding drawer opens instantly, providing the full conversational chat interface.
3. To close the widget, click the **X (Close)** button at the top-left corner of the drawer header. The bottom trigger button automatically hides while the panel is open to prevent UI clutter.

---

## 3. 📄 Invoices & Billing Operations

### What Does Creating an Invoice Do?
Creating an **Invoice** generates an official bill for goods or services delivered to a client.

#### Step-by-Step Workflow:
1. Go to **Invoices** -> Click **Add Invoice**.
2. **Select Client**: Choose an existing client profile or create a new customer on the fly.
3. **Set Dates & Terms**: Specify Issue Date and Due Date (e.g., Net 15, Net 30).
4. **Add Items**: Select product catalog items or add custom line items with Description, Quantity, Unit Price, and Tax rate.
5. **Auto-Calculations**: The system automatically computes Subtotal, Tax Total, and Grand Total.
6. **Save & Finalize**: Click **Save**.

#### Actions & Lifecycle:
- **Download PDF**: Generates a clean, branded PDF invoice complete with your company logo, tax breakdown, and payment instructions.
- **Send via Email**: Emails the PDF invoice directly to the client's registered contact.
- **Record Payment**: Click **Record Payment** on any invoice to record full or partial client payments.
- **Status Lifecycle**:
  - `Draft`: Unsent draft bill.
  - `Sent` / `Pending`: Finalized and delivered.
  - `Paid`: Settled in full.
  - `Partially Paid`: Partial balance received.
  - `Overdue`: Past due date without full payment.

---

## 4. 🏷️ Quotations & Estimates ("Add Quote")

### What Does "Add Quote" Do?
A **Quotation** (or Estimate/Proposal) is a formal cost estimate sent to a potential client prior to contract execution or job commencement.

#### Step-by-Step Workflow:
1. Go to **Quotations** -> Click **Add Quote**.
2. **Select Client & Validity**: Choose the client and specify how long the price offer is valid.
3. **Add Scope & Products**: Specify proposed items, custom line descriptions, quantities, unit costs, and applicable discounts.
4. **Deliver Proposal**: Download as PDF or email to the client for review.

#### 1-Click "Convert to Invoice":
- When the client accepts your price quote, navigate to the Quotation view.
- Click **Convert to Invoice**.
- The system automatically creates a complete billable Invoice with identical line items, quantities, and tax calculations, eliminating redundant manual typing.

---

## 5. 👥 Customer & Client CRM ("Add Customer")

### What Does "Add Customer" Do?
Registers a corporate entity or individual client into your central CRM repository.

#### Information Tracked:
- **Company Profile**: Business Name, Primary Contact, Email, Phone, Website.
- **Tax & Financial Credentials**: Tax ID Number, Billing Address, Shipping Address.
- **Client Ledger History**: View lifetime revenue generated, total paid invoices, outstanding credit balances, and quote history in a single view.

---

## 6. 💸 Expense Management ("Add Expense")

### What Does "Add Expense" Do?
Logs business expenditures and operational overhead to ensure accurate cash flow reporting and tax deductibility.

#### Workflow:
1. Go to **Expenses** -> Click **Add Expense**.
2. Enter **Vendor Name**, **Total Amount**, **Date**, and **Category** (e.g., Office Supplies, Travel, Software, Professional Services).
3. Save to update your net profitability dashboards instantly.

---

## 7. 📦 Product & Services Catalog ("Add Item")

### What Does "Add Item" Do?
Establishes a standardized catalog of products and billable services.

#### Workflow:
1. Go to **Items** -> Click **Add Item**.
2. Specify **Item Name**, **Description**, **Default Unit Price**, and **Default Tax Rate**.
3. When building invoices or quotes, selecting an item auto-fills pricing and tax calculations.

---

## 8. 💳 Payment Records & Settlement

### What Does "Record Payment" Do?
Logs cash, check, wire transfer, or credit card settlements against open invoices.

#### Workflow:
1. Select an unpaid or partially paid invoice.
2. Click **Record Payment**.
3. Enter **Amount Received**, **Payment Date**, and **Payment Method** (Bank Transfer, Credit Card, Cash, Check).
4. The invoice status automatically updates to `Paid` or `Partially Paid`, and customer balances reflect the change immediately.

---

## 9. ⚙️ System Configurations & Tax Rules ("Add Tax")

### What Does "Add Tax" Do?
Configures regional tax structures (e.g., VAT 20%, Sales Tax 8.875%, GST 5%, State Tax 6%).

#### Workflow:
1. Go to **Settings** -> **Taxes** -> Click **Add Tax**.
2. Enter **Tax Name** (e.g., `VAT`) and **Tax Rate Percentage** (e.g., `20%`).
3. Once defined, tax rates can be selected per line item on quotes and invoices, generating itemized tax breakdowns on PDFs.

---

## 10. 🌓 Theme Engine & Session Security

### Theme Switcher (Light / Dark Mode)
- Toggle between **Light Mode** and **Dark Mode** via the iOS-style Sun/Moon switch at the bottom of the left sidebar.
- **Light Mode**: Features high-contrast pitch-black text (`#0f172a`) on clean light cards (`#ffffff`). Dual-tone auth visual uses pitch-black background with white logo.
- **Dark Mode**: Features pure white text (`#f8fafc`) on deep dark cards (`#141417`). Dual-tone auth visual uses pure white background with dark logo.

### Session Security & Logout
- Click the **Centered Red Logout Button** at the bottom of the sidebar to destroy your session and safely return to the login screen.

---

*Ginyard AI — Enterprise Accounting & Autonomous Financial Intelligence.*
