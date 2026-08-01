# 🤖 Ledgerly AI — Conversational AI Accounting & ERP SaaS

**Ledgerly AI** is a white-labeled, AI-native financial accounting SaaS platform. It adds a natural language conversational AI layer on top of a production-grade ERP engine (Invoicing, Expenses, Payments, Clients, Cash Flow Analysis), allowing users to log transactions in plain English, ask financial questions in natural language, and get proactive insights.

---

## 🏗️ Architecture

- **Backend**: Node.js, Express, MongoDB (Mongoose), JWT Authentication, Groq Node.js SDK
- **Frontend**: React 18, Ant Design 5, Redux Toolkit, React Router 6, Vite
- **AI Layer**: Groq LLM (`llama-3.3-70b-versatile`) with tool calling (5 tools for verified financial queries, natural language transaction parser, proactive insights engine)

---

## 📋 Prerequisites

Before running the application, ensure you have the following installed:
1. **Node.js**: v18.0.0 or higher
2. **MongoDB**: Local MongoDB instance running on `mongodb://127.0.0.1:27017` (or MongoDB Atlas URI)
3. **Groq API Key**: A valid Groq API key (from [console.groq.com](https://console.groq.com))

---

## 🚀 How to Run the Project (Step-by-Step)

### Step 1: Configure Backend Environment

Navigate to the `backend/` directory and check/create the `.env` file:

```bash
cd backend
```

Ensure `backend/.env` contains your database URI, JWT secret, and Groq API key:

```env
DATABASE="mongodb://127.0.0.1:27017/ledgerly_ai"
JWT_SECRET="your_private_jwt_secret_key"
NODE_ENV="development"
PUBLIC_SERVER_FILE="http://localhost:8888/"

# Ledgerly AI — Groq Configuration
GROQ_API_KEY="your_groq_api_key_here"
GROQ_MODEL="llama-3.3-70b-versatile"
```

---

### Step 2: Install Backend Dependencies & Seed Data

In the `backend/` directory, run:

```bash
# 1. Install dependencies
npm install

# 2. Run initial database setup (creates admin user & settings)
node src/setup/setup.js

# 3. Seed demo data (creates clients, 19 invoices, 39 expenses, payments)
node src/setup/seed-demo-data.js
```

---

### Step 3: Start the Backend Server

Start the backend server on `http://localhost:8888`:

```bash
npm run dev
```

---

### Step 4: Start the Frontend Application

Open a **new terminal tab/window**, navigate to `frontend/`, and run:

```bash
cd frontend

# 1. Install dependencies
npm install

# 2. Start Vite dev server
npm run dev
```

The frontend will run at `http://localhost:3000`.

---

## 🔐 Default Login Credentials

Once the setup and seed scripts are executed, log in at `http://localhost:3000/login` with:

- **Email**: `admin@admin.com`
- **Password**: `admin123`

---

## 💡 AI Feature Walkthrough

Once logged in, click **AI Assistant** in the sidebar navigation or top header:

1. **💬 Chat Assistant**:
   - Ask natural language questions: *"How much did I spend this month?"*, *"Which clients haven't paid me yet?"*, *"What are my top vendors by spend?"*.
   - All numbers are pulled directly from MongoDB via Groq tool calling.

2. **⚡ Smart Entry**:
   - Type plain text: `"Paid $340 to Fiverr for logo design yesterday"`.
   - The AI parses vendor, amount, category, date, and description into an editable **confirmation card**.
   - Click **Confirm & Save** to write directly to MongoDB.

3. **📊 Insights Dashboard**:
   - View automated spending trends, overdue invoice alerts, and net cash flow status.

---

## 🛠️ Build for Production

To build the frontend bundle:

```bash
cd frontend
npm run build
```

Production output will be generated in `frontend/dist/`.
