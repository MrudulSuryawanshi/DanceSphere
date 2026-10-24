# Database setup

1. Start MySQL.
2. Run `database/schema.sql`.
3. Run `database/seed.sql`.
4. Configure `server/.env` and `php-practicals/.env`.

The schema contains `users`, `cities`, `categories`, `studios`, `dance_classes`, and `enquiries`.

For owner class creation, a studio must reference an existing owner user and a city. The schema intentionally avoids hard-coded passwords. Use the API registration route to create users. For a local demo, associate an owner and studio using MySQL Workbench after registration.

Example SQL after creating an owner:
```sql
-- Replace the email with the owner email you registered.
INSERT INTO studios(owner_id, name, city_id, contact_email, description)
SELECT u.id, 'My Dance Studio', c.id, u.email, 'A welcoming dance studio'
FROM users u JOIN cities c ON c.name='Pune'
WHERE u.email='owner@example.com' AND u.role='owner';
```
