CREATE DATABASE IF NOT EXISTS dancesphere_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE dancesphere_db;

CREATE TABLE IF NOT EXISTS users (
 id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
 name VARCHAR(120) NOT NULL,
 email VARCHAR(190) NOT NULL UNIQUE,
 password_hash VARCHAR(255) NOT NULL,
 role ENUM('student','owner','admin') NOT NULL DEFAULT 'student',
 created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS cities (
 id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
 name VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS categories (
 id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
 name VARCHAR(100) NOT NULL UNIQUE,
 description VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS studios (
 id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
 owner_id BIGINT UNSIGNED NULL,
 name VARCHAR(160) NOT NULL,
 city_id INT UNSIGNED NOT NULL,
 address VARCHAR(255),
 contact_email VARCHAR(190),
 description TEXT,
 created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 CONSTRAINT fk_studio_owner FOREIGN KEY(owner_id) REFERENCES users(id) ON DELETE SET NULL,
 CONSTRAINT fk_studio_city FOREIGN KEY(city_id) REFERENCES cities(id)
);

CREATE TABLE IF NOT EXISTS dance_classes (
 id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
 studio_id BIGINT UNSIGNED NOT NULL,
 city_id INT UNSIGNED NOT NULL,
 category_id INT UNSIGNED NOT NULL,
 name VARCHAR(180) NOT NULL,
 description TEXT NOT NULL,
 fee DECIMAL(10,2) NOT NULL,
 level VARCHAR(40) NOT NULL DEFAULT 'Beginner',
 timing VARCHAR(160),
 duration VARCHAR(60) DEFAULT '60 min',
 age_group VARCHAR(40) DEFAULT '16+',
 instructor VARCHAR(120),
 image_url VARCHAR(500),
 status ENUM('pending','approved','rejected') NOT NULL DEFAULT 'pending',
 created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 CONSTRAINT fk_class_studio FOREIGN KEY(studio_id) REFERENCES studios(id) ON DELETE CASCADE,
 CONSTRAINT fk_class_city FOREIGN KEY(city_id) REFERENCES cities(id),
 CONSTRAINT fk_class_category FOREIGN KEY(category_id) REFERENCES categories(id),
 INDEX idx_class_status_city(status,city_id),
 INDEX idx_class_category(category_id)
);

CREATE TABLE IF NOT EXISTS enquiries (
 id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
 class_id BIGINT UNSIGNED NOT NULL,
 name VARCHAR(120) NOT NULL,
 email VARCHAR(190) NOT NULL,
 message TEXT NOT NULL,
 status ENUM('new','contacted','closed') NOT NULL DEFAULT 'new',
 created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 CONSTRAINT fk_enquiry_class FOREIGN KEY(class_id) REFERENCES dance_classes(id) ON DELETE CASCADE,
 INDEX idx_enquiry_email(email)
);
