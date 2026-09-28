# 🚀 WDIG Career Guidance Platform — Comprehensive System Documentation

Welcome to the central technical documentation for **WDIG (What Do I Go for) Career Guidance Platform**. This document provides an all-inclusive, end-to-end breakdown of the architecture, frontend, backend, machine learning engine, database schema, API integrations, and self-learning feedback pipeline.

---

## 📑 Table of Contents
1. [System Architecture Overview](#-system-architecture-overview)
2. [Technology Stack](#-technology-stack)
3. [Frontend Architecture (`src/`)](#-frontend-architecture-src)
4. [Backend Services & REST APIs (`backend/`)](#-backend-services--rest-apis-backend)
5. [Machine Learning Engine (`ml/`)](#-machine-learning-engine-ml)
6. [Database Schema & Analytics (`wdig_schema.sql`)](#-database-schema--analytics-wdig_schemasql)
7. [External AI & Third-Party Integrations](#-external-ai--third-party-integrations)
8. [End-to-End User Workflows](#-end-to-end-user-workflows)
9. [Environment Variables & Setup Guide](#-environment-variables--setup-guide)

---

## 🏛️ System Architecture Overview

WDIG is built on a 3-tier micro-service architecture consisting of:

```mermaid
graph TD
    Client[Next.js 15 Frontend<br/>React 19 + Tailwind v4 + Framer Motion]
    Auth[Firebase Authentication<br/>Google OAuth Provider]
    Express[Node.js Express Backend<br/>Port 5000]
    PythonML[Python ML Engine & PDF Service<br/>Port 8001 / Fast Inference]
    DB[(PostgreSQL Database<br/>wdig_db)]
    Groq[Groq / Gemini / Claude API]
    ONET[O*NET Web Services]
    GoogleMaps[Google Places API]

    Client -->|User Auth| Auth
    Client -->|API Requests / Proxy| Express
    Client -->|Next.js Server API Routes| Groq
    Express -->|SQL Queries & Snapshots| DB
    Express -->|Predict & Self-Learning| PythonML
    Express -->|AI Comprehensive Reports| Groq
    Express -->|Career Search| ONET
    Express -->|Institute Lookup| GoogleMaps
    PythonML -->|Training Data & Snapshots| DB
```

---

## 💻 Technology Stack

| Layer | Technology | Usage |
|---|---|---|
| **Frontend Framework** | **Next.js 15.2** (App Router), **React 19.2** | SSR, CSR, dynamic routing, component library |
| **Styling & UI** | **Tailwind CSS v4**, **Framer Motion**, **Lucide React** | Modern glassmorphic & responsive visuals |
| **Authentication** | **Firebase Auth** (v12) | Google OAuth & user session persistence |
| **Backend Server** | **Node.js Express** (v4.22) | Core REST APIs, user profile logic, PDF orchestration |
| **Database** | **PostgreSQL** | User profiles, sessions, answers, ML snapshots, feedback, metrics |
| **Machine Learning** | **Python 3.10+**, **scikit-learn**, **pandas**, **numpy** | Unsupervised Agglomerative Hierarchical Clustering |
| **PDF Generation** | **Puppeteer** (headless browser) | Pixel-perfect PDF report downloads from Next.js rendered HTML |
| **AI LLM Models** | **Groq SDK** (Llama 3 / Mixtral), **Google Gemini 2.0** | Comprehensive report synthesis & skills gap analysis |
| **External APIs** | **O*NET Web Services**, **Google Places API** | Standardized career data & college/institute locations |

---

## 🎨 Frontend Architecture (`src/`)

The Next.js 15 frontend is organized cleanly around the `app` router, modular components, and custom hooks/context.

### 🌐 Pages & App Routes (`src/app/`)

- **`/` (`page.jsx`)**: Landing page with Hero Section, features grid, dynamic stats, testimonials, and CTA.
- **`/about`**: Mission statement, team values, methodology overview.
- **`/aptitude`**: Interactive multi-stage psychometric & aptitude assessment test.
- **`/careers` & `/careers/[id]`**: Career exploration library powered by O*NET database data.
- **`/dashboard`**: Personal user hub displaying past test sessions, trait breakdowns, and quick action widgets.
- **`/explore`**: Interactive career paths, skills requirements, and industry insights.
- **`/help`**: FAQ accordions, troubleshooting, and direct support contact form.
- **`/institute`**: College & educational institute finder with search & location filters.
- **`/login` & `/register`**: Firebase authentication entry points.
- **`/mentors`**: Mentor directory and guidance consultation links.
- **`/profile`**: Comprehensive user profile management, trait snapshot, and profile edit gate.
- **`/report`**: Detailed, interactive career guidance report display (supports printable PDF mode `?pdf=1`).
- **`/results`**: Instant test results summary after finishing aptitude assessment.

### 🧩 Core Components (`src/components/`)

- `CareerProfileForm.tsx`: Dynamic form collecting educational background, target career preferences, and goals.
- `SkillsToAcquireWidget.tsx`: Widget rendering skill gaps, roadmap milestones, and learning resources.
- `ProfileGate.tsx` & `ProfileSnapshot.tsx`: Access control and user trait visualization cards.
- `HeroSection.tsx` & `DashboardBanner.tsx`: Animated headers and callout banners.
- `Navbar.jsx` & `Footer.jsx`: Global header navigation and site footer.
- `FloatingChatbot.jsx`: Floating AI career assistant powered by Gemini API.
- `animated-illustrations.tsx` & `rocket-path-illustration.tsx`: SVG dynamic illustrations.

---

## ⚙️ Backend Services & REST APIs (`backend/`)

The Express backend (`backend/server.js`) acts as the orchestrator between the database, ML engine, and client applications.

### 📡 API Endpoints Summary

| Endpoint Route | HTTP Method | Router File | Functionality |
|---|---|---|---|
| `/api/questions` | `GET` | `routes/questions.js` | Fetches aptitude & trait question banks |
| `/api/predict` | `POST` | `routes/predict.js` | Processes test answers, normalizes traits, calls ML engine, saves prediction |
| `/api/report` | `GET` / `POST` | `routes/report.js` | Generates AI report via Groq LLM & retrieves cached reports |
| `/api/pdf/generate` | `POST` | `server.js` | Uses Puppeteer to render and print report page to PDF |
| `/api/profile` | `GET` / `PUT` | `routes/profile.js` | Manages user profile metadata & traits |
| `/api/user` | `POST` | `routes/user.js` | Syncs Firebase authentication users with PostgreSQL `users` table |
| `/api/feedback` | `POST` | `routes/feedback.js` | Receives user ratings (1-5) and feeds into self-learning loop |
| `/api/history` | `GET` | `routes/history.js` | Retrieves user's historical test sessions and past reports |
| `/api/skills-gap` | `POST` | `routes/skillsGap.js` | Analyzes missing skills against target career via LLM |
| `/institutes` | `GET` | `routes/institutes.js` | Queries Google Places API for relevant colleges/institutes |

---

## 🧠 Machine Learning Engine (`ml/`)

The machine learning system evaluates **11 core trait dimensions** extracted from user assessment responses to identify natural cognitive styles and career suitability.

### 📊 The 11 Feature Dimensions
1. **Logical Reasoning** (`n_logical`)
2. **Analytical Ability** (`n_analytical`)
3. **Numerical Aptitude** (`n_numerical`)
4. **Verbal Ability** (`n_verbal`)
5. **Spatial Visualization** (`n_spatial`)
6. **Creativity & Innovation** (`n_creativity`)
7. **Discipline & Structure** (`n_discipline`)
8. **Resilience & Grit** (`n_resilience`)
9. **Independence** (`n_independence`)
10. **Communication** (`n_communication`)
11. **Leadership** (`n_leadership`)

### 🧩 8 Detected Thinking Styles
- **Analytical Thinker**: Data Science, Software Engineering, Quantitative Finance
- **Creative Innovator**: UI/UX Design, Product Design, Architecture
- **Strategic Leader**: Executive Management, Management Consulting, Entrepreneurship
- **Technical Specialist**: Mechanical/Electrical Engineering, Robotics, DevOps
- **Communicator**: Public Relations, Content Strategy, Journalism
- **Balanced Generalist**: Product Management, Business Operations, Product Marketing
- **Empathetic Organizer**: Healthcare Administration, HR, Educational Management
- **Independent Problem Solver**: Research Science, Cybersecurity, Systems Analysis

### 🔁 Continuous Self-Learning Pipeline
When users submit feedback (`/api/feedback`) rating their prediction accuracy $\ge 4$:
1. The record is flagged as a high-confidence candidate.
2. `ml/self_learning.py` updates the **`style_career_affinity`** affinity matrix.
3. The cluster weightings and distance thresholds automatically adjust over time without breaking historical model stability.

---

## 🗄️ Database Schema & Analytics (`wdig_schema.sql`)

The PostgreSQL database (`wdig_db`) features 11 tables, 3 analytics views, and indices optimized for rapid querying.

```
+-------------------+      +------------------+      +-----------------------+
|      users        | <--- |     sessions     | <--- |   trait_snapshots     |
+-------------------+      +------------------+      +-----------------------+
| id (PK)           |      | id (PK)          |      | id (PK)               |
| firebase_uid (UQ) |      | firebase_uid (FK)|      | session_id (FK, UQ)   |
| email, age_group  |      | started_at       |      | normalized_traits(JSON|
+-------------------+      | is_complete      |      +-----------------------+
                           +------------------+                  |
                                    |                            v
                                    v                  +-----------------------+
                           +------------------+        |      predictions      |
                           |     answers      |        +-----------------------+
                           +------------------+        | id (PK)               |
                           | session_id (FK)  |        | thinking_style_primary|
                           | question_id      |        | top_careers (JSONB)   |
                           | answer_value     |        +-----------------------+
                           +------------------+                  |
                                                                 v
                                                       +-----------------------+
                                                       |        reports        |
                                                       +-----------------------+
                                                       | prediction_id (FK,UQ)|
                                                       | report_text           |
                                                       +-----------------------+
```

### 📈 SQL Views
- **`v_user_profiles`**: Joins user metadata, session timing, dominant traits, primary thinking style, and top recommended careers.
- **`v_training_candidates`**: Pre-filtered dataset of trait snapshots with high accuracy feedback ($\ge 4$) ready for model retraining.
- **`v_career_distribution`**: Real-time aggregation of top-recommended careers across all user sessions.

---

## 🔌 External AI & Third-Party Integrations

1. **Firebase Authentication**: Seamless Google OAuth login and UID verification.
2. **Groq LLM SDK**: High-speed inference generating multi-page career development reports.
3. **Google Gemini API**: Dynamic chat assistance via the embedded `FloatingChatbot`.
4. **O*NET Web API**: Access to standard occupational classifications, task details, and required skills.
5. **Google Places API**: Nearby institute and university discovery with photos and ratings.

---

## 🔄 End-to-End User Workflows

```mermaid
sequenceDiagram
    autonumber
    actor User
    participant FE as Next.js Frontend
    participant BE as Express Backend
    participant ML as Python ML Engine
    participant DB as PostgreSQL
    participant AI as Groq / Gemini API

    User->>FE: Complete Aptitude Assessment
    FE->>BE: POST /api/predict (answers + UID)
    BE->>DB: Save raw session & answers
    BE->>ML: Send normalized trait vector
    ML-->>BE: Return Thinking Style & Career Matches
    BE->>DB: Store trait_snapshot & prediction
    BE-->>FE: Return top matches & style summary
    User->>FE: View Detailed Report
    FE->>BE: GET /api/report?uid=...
    BE->>AI: Generate comprehensive report text
    AI-->>BE: Markdown report
    BE->>DB: Cache generated report
    BE-->>FE: Display report
    User->>FE: Click "Download PDF"
    FE->>BE: POST /api/pdf/generate
    BE->>BE: Puppeteer prints HTML to PDF
    BE-->>FE: Return PDF binary stream
```

---

## 🛠️ Environment Variables & Setup Guide

### 1. Environment Configuration Files

#### Frontend (`.env.local`)
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_BASE_URL=http://localhost:3000
GEMINI_API_KEY=your_gemini_api_key
ONET_API_KEY=your_onet_api_key
GROQ_API_KEY=your_groq_api_key
```

#### Backend (`backend/.env`)
```env
PORT=5000
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/wdig_db
NEXT_PUBLIC_BASE_URL=http://localhost:3000
ML_API_URL=http://localhost:8001
GROQ_API_KEY=your_groq_api_key
GOOGLE_PLACES_KEY=your_google_places_key
```

### 2. Local Setup & Execution

#### Step 1: Database Setup
```bash
psql -U postgres -c "CREATE DATABASE wdig_db;"
psql -U postgres -d wdig_db -f wdig_schema.sql
```

#### Step 2: Start Backend Server
```bash
cd backend
npm install
npm start
```

#### Step 3: Start ML Engine
```bash
cd ml
python -m venv venv
# On Windows:
venv\Scripts\activate
# On Linux/macOS:
source venv/bin/activate

pip install -r requirements.txt
python app.py
```

#### Step 4: Start Frontend Client
```bash
# In the root directory
npm install
npm run dev
```

The platform will now be live on `http://localhost:3000` with the Express API on `http://localhost:5000` and the Python ML service on `http://localhost:8001`.

---
*Documentation maintained for WDIG Career Guidance Platform — Version 1.0.0*
