# DanceSphere — Dance Class Discovery & Management

A student-friendly Web Technologies project with a warm, editorial visual style: beige, cream, muted terracotta, and olive. It includes a React frontend, Express REST API, MySQL schema/seed data, and a separate PHP practical module.

## What's included
- Responsive React + Vite frontend with 20+ page views
- City selection, category filtering, text search, fee sorting, class details
- Student, dance-owner, and admin experiences
- Demo mode using localStorage so the frontend can be explored without configuring a database
- Express REST API and MySQL schema/seed scripts for the backend practicals
- PHP form validation, sessions, string functions, and PDO CRUD demonstration
- `docs/SYLLABUS_MAPPING.md` maps the project to all 15 syllabus practicals

## Requirements
- Node.js LTS (18+ recommended)
- MySQL 8 (optional for demo-only frontend; required for API persistence)
- PHP 8+ (optional, for PHP practical module)

## Run the frontend
Open PowerShell in this folder:

```powershell
cd client
npm install
npm run dev
```

Open the local URL printed by Vite (usually `http://localhost:5173`).

The frontend includes demo data and works without the Express API. In demo mode, changes are saved in your browser's localStorage.

## Run the Express API
Open a second PowerShell window:

```powershell
cd server
npm install
Copy-Item .env.example .env
```

Edit `.env` with your local MySQL credentials, create the database using `database/schema.sql`, then run `database/seed.sql` in MySQL Workbench or the MySQL CLI.

```powershell
npm run dev
```

API health check: `http://localhost:3000/api/health`

## Run PHP practical
Requires PHP installed and MySQL configured if you want database-backed enquiry CRUD.

```powershell
cd php-practicals
Copy-Item .env.example .env
php -S localhost:8000
```

Open `http://localhost:8000`. Configure `.env` with the same database details if using the MySQL functionality.

## Demo access
The frontend demo login accepts any non-empty email/password and lets you select a demo role (Student, Studio Owner, or Admin). This is deliberately a frontend demonstration only. The Express API has a separate real authentication implementation; seed a demo admin/owner account yourself before using it in a real environment.

## Important
- Sample studios and class listings are fictional demo records, not verified real-world businesses.
- Do not publish this project as-is with demo authentication.
- Never commit real passwords or production secrets.
