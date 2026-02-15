# Billing System

Built with a FastAPI backend and a Next.js frontend with Tailwind CSS v4.

## 🚀 Tech Stack

- **Frontend**: Next.js 15, React 19, Tailwind CSS v4, Redux Toolkit
- **Backend**: FastAPI, SQLAlchemy, PostgreSQL
- **Database**: PostgreSQL (main data store)

---

## 🛠️ Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+)
- [Python](https://www.python.org/) (v3.10+)
- [PostgreSQL](https://www.postgresql.org/) (running locally or remotely)

### 1. Backend Setup

1.  **Navigate to the backend directory**:
    ```bash
    cd backend
    ```

2.  **Create a virtual environment**:
    ```bash
    python -m venv venv
    source venv/bin/activate  # On Windows: venv\Scripts\activate
    ```

3.  **Install dependencies**:
    ```bash
    pip install -r requirements.txt
    ```

4.  **Configure Environment Variables**:
    Create a `.env` file in the `backend/` folder:
    ```env
    DATABASE_URL=postgresql://username:password@localhost/billing_system
    SECRET_KEY=your_generated_secret_key
    ALGORITHM=HS256
    ACCESS_TOKEN_EXPIRE_MINUTES=30
    EMAIL_HOST=[EMAIL_ADDRESS]
    EMAIL_PORT=587
    EMAIL_USERNAME=[EMAIL_ADDRESS]
    EMAIL_PASSWORD=[PASSWORD]
    EMAIL_USE_TLS=True
    ```

5.  **Initialize Database & Seed Data**:
    Run the seed scripts to set up the administrator, products, and denominations:
    ```bash
    python seed-data/admin.py
    python seed-data/product.py
    python seed-data/denomination.py
    ```

6.  **Start the Backend Server**:
    ```bash
    python main.py
    # OR
    uvicorn main:app --reload --port 8000
    ```

### 2. Frontend Setup

1.  **Navigate to the frontend directory**:
    ```bash
    cd frontend
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Start the Development Server**:
    ```bash
    npm run dev
    ```
    The app will be available at [http://localhost:3000](http://localhost:3000).

---

## 📂 Project Structure

```text
billing-system/
├── backend/            # FastAPI Backend
│   ├── endpoints/      # API Route Handlers
│   ├── models/         # SQLAlchemy Models
│   ├── schemas/        # Pydantic Schemas
│   ├── seed-data/      # Database Initialization Scripts
│   └── utils/          # Utility Functions
├── frontend/           # Next.js Frontend
│   ├── src/
│   │   ├── app/        # Pages and Layouts (App Router)
│   │   ├── components/ # Reusable UI Components
│   │   └── store/      # Redux Toolkit State Management
├── .gitignore          # Root Git Ignore
└── README.md           # Project Documentation
```

## 🛡️ License

© 2026 BillSystem • All Rights Reserved
