# DanceSphere REST API

Base URL: `http://localhost:3000/api`

## Public endpoints
- `GET /health` — API status.
- `GET /cities` — list cities.
- `GET /categories` — list dance categories.
- `GET /classes?city=Pune&category=Bollywood&q=beginner&sort=fee-low&maxFee=3000` — approved classes with filters.
- `GET /classes/:id` — approved class detail.
- `POST /auth/register` — register a student or owner. Body: `{ "name": "...", "email": "...", "password": "...", "role": "student" }`.
- `POST /auth/login` — authenticate. Body: `{ "email": "...", "password": "...", "role": "owner" }`.
- `POST /enquiries` — create enquiry. Body: `{ "classId": 1, "name": "...", "email": "...", "message": "..." }`.

## Authenticated endpoints
Send `Authorization: Bearer <token>`.
- `GET /auth/me`
- `POST /classes` — owner/admin; new listings are pending.
- `PUT /classes/:id` — owner can edit own listing; admin can edit.
- `DELETE /classes/:id` — owner can delete own listing; admin can delete.
- `GET /enquiries/my` — current user's enquiries by email.
- `GET /owner/enquiries` — enquiries for owner's studio.
- `PATCH /owner/enquiries/:id` — body `{ "status": "contacted" }`, values: `new`, `contacted`, `closed`.
- `GET /admin/stats` — admin-only counts.
- `GET /admin/users` — admin-only user list.
- `PATCH /admin/classes/:id/approval` — admin-only body `{ "status": "approved" }`; values `approved`, `rejected`, `pending`.

## Notes
- Use `database/schema.sql` and `database/seed.sql` before starting the API.
- Create a studio and owner association in MySQL before using owner class creation.
- The React demo UI uses localStorage by default for an easy demonstration; the API service is provided in `client/src/api.js` for API integration/practical exercises.
- The API does not ship with a production admin password. Register an owner/student through the API and create an admin securely using a local development-only process.
