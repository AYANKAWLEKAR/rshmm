# CRUD App with Next.js, FastAPI, and Supabase

A full-stack CRUD application with Next.js frontend, FastAPI backend, and Supabase database.

## Project Structure

```
.
├── backend/          # FastAPI backend
│   ├── main.py      # Main FastAPI application
│   ├── database/    # Database configuration
│   │   ├── supabase_client.py
│   │   └── schema.sql
│   └── requirements.txt
├── frontend/        # Next.js frontend
│   ├── app/         # Next.js app directory
│   ├── components/  # React components
│   ├── types/       # TypeScript types
│   └── package.json
└── README.md
```

## Setup Instructions

### 1. Supabase Setup

1. Create a new project at [Supabase](https://supabase.com)
2. Go to SQL Editor and run the SQL from `backend/database/schema.sql`
3. Get your project URL and anon key from Settings > API

### 2. Backend Setup

```bash
cd backend

# Create virtual environment (recommended)
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
cp .env.example .env
# Edit .env and add your Supabase credentials:
# SUPABASE_URL=your_supabase_project_url
# SUPABASE_KEY=your_supabase_anon_key

# Run the server
python main.py
# Or use uvicorn directly:
# uvicorn main:app --reload
```

The backend will run on `http://localhost:8000`

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Create .env.local file (optional, defaults to http://localhost:8000)
# NEXT_PUBLIC_API_URL=http://localhost:8000

# Run the development server
npm run dev
```

The frontend will run on `http://localhost:3000`

## API Endpoints

- `GET /api/items` - Get all items
- `GET /api/items/{id}` - Get a single item
- `POST /api/items` - Create a new item
- `PUT /api/items/{id}` - Update an item
- `DELETE /api/items/{id}` - Delete an item

## Features

- ✅ Create, Read, Update, Delete operations
- ✅ Modern UI with Next.js and React
- ✅ Type-safe API with FastAPI
- ✅ Supabase database integration
- ✅ CORS configured for frontend-backend communication

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript
- **Backend**: FastAPI, Python
- **Database**: Supabase (PostgreSQL)
