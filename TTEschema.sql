CREATE DATABASE TEngine;
USE TEngine;

CREATE TABLE categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    category_name VARCHAR(255) UNIQUE NOT NULL,
    description TEXT
);

CREATE TABLE data_sources (
    id INT AUTO_INCREMENT PRIMARY KEY,
    source_name VARCHAR(255),
    source_url TEXT,
    last_fetched TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE historical_data (
    id INT AUTO_INCREMENT PRIMARY KEY,
    category_id INT,
    event_name VARCHAR(255),
    value DECIMAL(10,2),
    record_date DATE,
    source_id INT,
    country VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE,
    FOREIGN KEY (source_id) REFERENCES data_sources(id) ON DELETE SET NULL
);

CREATE TABLE predictions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    category_id INT,
    predicted_value DECIMAL(10,2),
    predicted_date DATE,
    confidence_score DECIMAL(5,2),
    country VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
);

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('admin', 'user') DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE admin_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    admin_id INT,
    action VARCHAR(255),
    details TEXT,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (admin_id) REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE queries (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    category_id INT,
    start_date DATE,
    end_date DATE,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
);

CREATE TABLE favorites (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    event_id INT,
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (event_id) REFERENCES historical_data(id) ON DELETE CASCADE
);
INSERT INTO categories (category_name, description) VALUES
('Wars', 'Major wars and conflicts in history'),
('Natural Disasters', 'Earthquakes, floods, and other natural disasters'),
('Economic Indicators', 'GDP, inflation, and related metrics'),
('Health Crises', 'Pandemics and health emergencies'),
('Political Events', 'Elections, coups, and major political shifts'),
('Technological Milestones', 'Key tech breakthroughs in history'),
('Environmental Changes', 'Climate and environmental trends'),
('Social Movements', 'Civil rights, protests, revolutions');
INSERT INTO data_sources (source_name, source_url) VALUES
('Global Conflict Tracker', 'https://www.cfr.org/global-conflict-tracker'),
('World Bank', 'https://www.worldbank.org'),
('United Nations', 'https://www.un.org'),
('National Geographic', 'https://www.nationalgeographic.com'),
('WHO', 'https://www.who.int'),
('IMF', 'https://www.imf.org'),
('USGS', 'https://www.usgs.gov'),
('NASA', 'https://www.nasa.gov');
INSERT INTO users (username, email, password_hash, role) VALUES
('admin1', 'admin1@example.com', SHA2('adminpass123', 256), 'admin'),
('sabeeka', 'sabeeka@example.com', SHA2('mypassword', 256), 'user');
INSERT INTO admin_logs (admin_id, action, details) VALUES
(1, 'Inserted default categories', 'Initial seeding of categories table'),
(1, 'Inserted default data sources', 'Initial seeding of data_sources table');
INSERT INTO queries (user_id, category_id, start_date, end_date) VALUES
(2, 1, '1947-01-01', '2024-12-31'),
(2, 3, '2000-01-01', '2020-12-31');
select * from historical_data;
SELECT category_id, event_name, value, record_date, source_id, country
FROM historical_data
ORDER BY record_date ASC;
show tables;
-- select * from historical_data where category_id =1;
select count(*) from historical_data;

