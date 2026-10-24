# DanceSphere Project Plan

## Architecture
- `client/`: React + Vite single-page application.
- `server/`: Express REST API with MySQL integration and bcrypt password hashing.
- `database/`: MySQL schema and seed records.
- `php-practicals/`: Separate PHP demonstration of form processing, validation, sessions, string manipulation, and PDO CRUD.
- `docs/`: syllabus mapping and API reference.

## Main entities
Users (role: student/owner/admin), studios, cities, categories, classes, enquiries.

## Main flows
1. Visitors select a city, search by keyword, and filter by category or fee.
2. Visitors view details and submit an enquiry.
3. Owners can review a dashboard and manage their class listings.
4. Admins can review listing status and view platform metrics.
5. Demo frontend persists changes locally; Express API provides database-backed routes.

## Design
Warm paper-like background, cream surfaces, muted terracotta primary action, olive accents, dark brown text, serif editorial headings, thin borders, modest radii, restrained transitions. No neon gradients or generic AI-dashboard look.

## Syllabus
See `docs/SYLLABUS_MAPPING.md`.
