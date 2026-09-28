# 🎓 WDIG — AI-Powered Career Guidance Platform

**WDIG (What Do I Go for)** is an advanced, full-stack career guidance platform leveraging psychometric aptitude modeling, unsupervised machine learning clustering, AI-powered report synthesis, and continuous self-learning feedback loops.

---

## 📚 Documentation Quick Links

- 📖 **[Comprehensive System Architecture & Documentation (PROJECT_DOCUMENTATION.md)](PROJECT_DOCUMENTATION.md)**: Full guide covering Next.js frontend, Express backend, Python ML engine, PostgreSQL schema (`wdig_schema.sql`), API contracts, and user workflows.
- 📋 **[ML System Summary (PROJECT_SUMMARY.md)](PROJECT_SUMMARY.md)**: In-depth ML implementation, 8 thinking style classifications, feature engineering, and inference pipelines.

---

## ⚡ Quick Start

### 1. Prerequisites
- **Node.js**: v18+
- **Python**: v3.10+
- **PostgreSQL**: v14+

### 2. Database Initialization
```bash
psql -U postgres -c "CREATE DATABASE wdig_db;"
psql -U postgres -d wdig_db -f wdig_schema.sql
```

### 3. Backend Express Server (Port 5000)
```bash
cd backend
npm install
npm start
```

### 4. Machine Learning Engine (Port 8001)
```bash
cd ml
python -m venv venv
# Activate venv:
# Windows: venv\Scripts\activate | Linux/macOS: source venv/bin/activate
pip install -r requirements.txt
python app.py
```

### 5. Frontend Client (Port 3000)
```bash
# In the root directory
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🏗️ Core Architecture Overview

```
WDIG Ecosystem
│
├── 🌐 Next.js 15 Frontend (`src/`)       --> React 19, Tailwind CSS v4, Framer Motion
├── ⚙️ Express Backend Server (`backend/`)  --> Node.js, PostgreSQL `pg`, Puppeteer PDF Engine
├── 🧠 Python ML Engine (`ml/`)           --> Agglomerative Hierarchical Clustering, Self-Learning
└── 🗄️ PostgreSQL Database               --> Complete `wdig_schema.sql` schema & analytics views
```

For detailed specifications, API routes, and schema structures, refer to **[PROJECT_DOCUMENTATION.md](PROJECT_DOCUMENTATION.md)**.
