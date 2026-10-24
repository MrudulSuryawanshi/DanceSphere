USE dancesphere_db;
INSERT IGNORE INTO cities(name) VALUES ('Pune'),('Mumbai'),('Nashik'),('Bengaluru'),('Delhi'),('Hyderabad');
INSERT IGNORE INTO categories(name,description) VALUES
('Bollywood','Expressive choreography inspired by Indian film music'),
('Hip-Hop','Groove, foundations and freestyle'),
('Contemporary','Movement, floorwork and storytelling'),
('Classical','Traditional technique and expression'),
('Salsa','Partner work and social dance'),
('Ballet','Posture, balance and technique'),
('Jazz','Musicality and dynamic movement'),
('Zumba','Dance-based fitness');

-- Create a demo owner manually via the API registration endpoint, then attach a studio to that owner.
-- Demo class rows are inserted by the frontend demo data; database listings can be added through the owner API.
