CREATE DATABASE Crime_Record_Management_System;
USE Crime_Record_Management_System;

CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password CHAR(32) NOT NULL,
    role ENUM('Admin','Officer') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE officers (
    officer_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    officer_name VARCHAR(100) NOT NULL,
    rank_name VARCHAR(50),
    contact_no VARCHAR(15),
    station_name VARCHAR(100),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id)
    REFERENCES users(user_id)
    ON DELETE CASCADE
);

CREATE TABLE crime_types (
    crime_type_id INT AUTO_INCREMENT PRIMARY KEY,
    crime_name VARCHAR(100) NOT NULL,
    description TEXT
);

-- 3NF to avoid repeating city and area data
CREATE TABLE locations (
    location_id INT AUTO_INCREMENT PRIMARY KEY,
    city VARCHAR(100),
    area VARCHAR(100),
    latitude DECIMAL(10,8),
    longitude DECIMAL(11,8)
);

CREATE TABLE criminals (
    criminal_id INT AUTO_INCREMENT PRIMARY KEY,
    criminal_name VARCHAR(100) NOT NULL,
    age INT,
    gender ENUM('Male','Female'),
    address VARCHAR(200),
    status ENUM('Arrested','Wanted','Released'),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE victims (
    victim_id INT AUTO_INCREMENT PRIMARY KEY,
    victim_name VARCHAR(100) NOT NULL,
    age INT,
    gender ENUM('Male','Female'),
    contact_no VARCHAR(15),
    address VARCHAR(200),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE cases (
    case_id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    crime_type_id INT,
    location_id INT,
    case_date DATE,
    status ENUM(
        'Open',
        'Under Investigation',
        'Solved',
        'Closed'
    ),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (crime_type_id)
    REFERENCES crime_types(crime_type_id),

    FOREIGN KEY (location_id)
    REFERENCES locations(location_id)
);

CREATE TABLE case_assignments (
    assignment_id INT AUTO_INCREMENT PRIMARY KEY,
    case_id INT,
    officer_id INT,
    assigned_date DATE,

    FOREIGN KEY (case_id)
    REFERENCES cases(case_id),

    FOREIGN KEY (officer_id)
    REFERENCES officers(officer_id)
);

CREATE TABLE case_criminals (
    case_id INT,
    criminal_id INT,

    PRIMARY KEY(case_id, criminal_id),

    FOREIGN KEY(case_id)
    REFERENCES cases(case_id),

    FOREIGN KEY(criminal_id)
    REFERENCES criminals(criminal_id)
);

CREATE TABLE case_victims (
    case_id INT,
    victim_id INT,

    PRIMARY KEY(case_id, victim_id),

    FOREIGN KEY(case_id)
    REFERENCES cases(case_id),

    FOREIGN KEY(victim_id)
    REFERENCES victims(victim_id)
);

-- officer_id added to know who registered the FIR
CREATE TABLE fir (
    fir_id INT AUTO_INCREMENT PRIMARY KEY,
    case_id INT,
    officer_id INT,
    fir_date DATE,
    complainant_name VARCHAR(100),
    details TEXT,

    FOREIGN KEY(case_id)
    REFERENCES cases(case_id),

    FOREIGN KEY(officer_id)
    REFERENCES officers(officer_id)
    ON DELETE SET NULL
);
CREATE TABLE evidence (
    evidence_id INT AUTO_INCREMENT PRIMARY KEY,
    case_id INT,
    evidence_type VARCHAR(100),
    description TEXT,

    FOREIGN KEY(case_id)
    REFERENCES cases(case_id)
);

CREATE TABLE complaints (
    complaint_id INT AUTO_INCREMENT PRIMARY KEY,
    case_id INT,
    complainant_name VARCHAR(100),
    contact_no VARCHAR(15),
    complaint_text TEXT,
    complaint_date DATE,

    FOREIGN KEY(case_id)
    REFERENCES cases(case_id)
    ON DELETE SET NULL
);

CREATE TABLE case_updates (
    update_id INT AUTO_INCREMENT PRIMARY KEY,
    case_id INT,
    update_details TEXT,
    update_date DATE,

    FOREIGN KEY(case_id)
    REFERENCES cases(case_id)
);

CREATE TABLE court_records (
    court_id INT AUTO_INCREMENT PRIMARY KEY,
    case_id INT,
    court_name VARCHAR(100),
    judge_name VARCHAR(100),
    hearing_date DATE,
    verdict VARCHAR(100),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY(case_id)
    REFERENCES cases(case_id)
);

CREATE TABLE prison_records (
    prison_id INT AUTO_INCREMENT PRIMARY KEY,
    criminal_id INT,
    prison_name VARCHAR(100),
    sentence_years INT,
    entry_date DATE,
    release_date DATE,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY(criminal_id)
    REFERENCES criminals(criminal_id)
);

CREATE TABLE case_priority (
    priority_id INT AUTO_INCREMENT PRIMARY KEY,
    case_id INT UNIQUE,
    priority_level ENUM(
        'Low',
        'Medium',
        'High'
    ),
    FOREIGN KEY(case_id)
    REFERENCES cases(case_id)
);

CREATE TABLE case_logs (
    log_id INT AUTO_INCREMENT PRIMARY KEY,
    case_id INT,
    action VARCHAR(200),
    action_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY(case_id)
    REFERENCES cases(case_id)
    ON DELETE CASCADE
);

-- TRIGGER 1 - INSERT ON CASES
DELIMITER $$
CREATE TRIGGER log_case_insert
AFTER INSERT ON cases
FOR EACH ROW
BEGIN
    INSERT INTO case_logs (case_id, action)
    VALUES (NEW.case_id, 'New Case Added');
END $$
DELIMITER ;

--          TRIGGER 2 - UPDATE ON CASES
DELIMITER $$
CREATE TRIGGER log_case_update
AFTER UPDATE ON cases
FOR EACH ROW
BEGIN
    INSERT INTO case_logs (case_id, action)
    VALUES (
        NEW.case_id,
        CONCAT(
            'Case Updated - Status changed from: ',
            OLD.status,
            ' to: ',
            NEW.status
        )
    );
END $$
DELIMITER ;

--          TRIGGER 3 - DELETE ON CASES
DELIMITER $$
CREATE TRIGGER log_case_delete
BEFORE DELETE ON cases
FOR EACH ROW
BEGIN
    INSERT INTO case_logs (case_id, action)
    VALUES (
        OLD.case_id,
        CONCAT(
            'Case Deleted - Title was: ',
            OLD.title
        )
    );
END $$
DELIMITER ;

--       TRIGGER 4 - UPDATE ON CRIMINALS
DELIMITER $$
CREATE TRIGGER log_criminal_update
AFTER UPDATE ON criminals
FOR EACH ROW
BEGIN
    INSERT INTO case_logs (case_id, action)
    VALUES (
        NULL,
        CONCAT(
            'Criminal Updated: ',
            OLD.criminal_name,
            ' status changed from ',
            OLD.status,
            ' to ',
            NEW.status
        )
    );
END $$
DELIMITER ;

INSERT INTO users VALUES
(1, 'admin1',         MD5('admin123'),   'Admin',   NOW()),
(2, 'ahmed_officer',  MD5('ahmed123'),   'Officer', NOW()),
(3, 'ali_officer',    MD5('ali123'),     'Officer', NOW()),
(4, 'sana_officer',   MD5('sana123'),    'Officer', NOW()),
(5, 'fatima_officer', MD5('fatima123'),  'Officer', NOW());

INSERT INTO officers
(officer_id, user_id, officer_name, rank_name, contact_no, station_name)
VALUES
(1, 2, 'Ahmed Khan',  'Inspector',     '03001234567', 'Islamabad Central'),
(2, 3, 'Ali Raza',    'Sub Inspector', '03111234567', 'Rawalpindi Station'),
(3, 4, 'Sana Malik',  'DSP',           '03221234567', 'Islamabad Central'),
(4, 5, 'Fatima Noor', 'Inspector',     '03331234567', 'Taxila Police Station');

INSERT INTO crime_types VALUES
(1, 'Theft',      'Property stealing cases'),
(2, 'Murder',     'Intentional killing'),
(3, 'Cyber Crime','Internet based crimes'),
(4, 'Kidnapping', 'Illegal abduction'),
(5, 'Fraud',      'Financial fraud cases');

INSERT INTO locations VALUES
(1, 'Islamabad', 'F-8',             33.70700000, 73.04790000),
(2, 'Rawalpindi','Saddar',          33.59730000, 73.04790000),
(3, 'Taxila',    'Main Bazar',      33.74550000, 72.78750000),
(4, 'Lahore',    'Johar Town',      31.46970000, 74.27280000),
(5, 'Karachi',   'Gulshan-e-Iqbal', 24.92000000, 67.09000000);

INSERT INTO criminals
(criminal_id, criminal_name, age, gender, address, status)
VALUES
(1, 'Bilal Ahmed', 32, 'Male',   'Rawalpindi', 'Arrested'),
(2, 'Usman Tariq', 28, 'Male',   'Islamabad',  'Wanted'),
(3, 'Kamran Ali',  40, 'Male',   'Lahore',     'Released'),
(4, 'Ayesha Khan', 30, 'Female', 'Karachi',    'Arrested'),
(5, 'Zain Malik',  26, 'Male',   'Taxila',     'Wanted');

INSERT INTO victims
(victim_id, victim_name, age, gender, contact_no, address)
VALUES
(1, 'Sana Ahmed',  25, 'Female', '03451234567', 'Islamabad'),
(2, 'Ali Hassan',  35, 'Male',   '03051234567', 'Rawalpindi'),
(3, 'Fatima Noor', 29, 'Female', '03161234567', 'Taxila'),
(4, 'Ahmed Raza',  41, 'Male',   '03271234567', 'Lahore'),
(5, 'Mariam Khan', 22, 'Female', '03381234567', 'Karachi');


--    Trigger fires automatically after each insert and logs into case_logs

INSERT INTO cases
(case_id, title, description, crime_type_id, location_id, case_date, status)
VALUES
(1, 'Mobile Theft Case',    'Mobile phone stolen from market', 1, 1, '2025-05-10', 'Open'),
(2, 'Murder Investigation', 'Suspicious murder case',          2, 2, '2025-05-12', 'Under Investigation'),
(3, 'Online Banking Fraud', 'Fraud through fake website',      5, 3, '2025-05-15', 'Solved'),
(4, 'Kidnapping Report',    'Child kidnapping complaint',      4, 4, '2025-05-18', 'Open'),
(5, 'Social Media Scam',    'Fake account scam case',          3, 5, '2025-05-20', 'Closed');

INSERT INTO case_assignments VALUES
(1, 1, 1, '2025-05-10'),
(2, 2, 2, '2025-05-12'),
(3, 3, 3, '2025-05-15'),
(4, 4, 4, '2025-05-18'),
(5, 5, 1, '2025-05-20');

INSERT INTO case_criminals VALUES
(1, 1),
(2, 2),
(3, 3),
(4, 5),
(5, 4);

INSERT INTO case_victims VALUES
(1, 1),
(2, 2),
(3, 3),
(4, 4),
(5, 5);

INSERT INTO fir VALUES
(1, 1, 1, '2025-05-10', 'Sana Ahmed',  'Phone theft complaint'),
(2, 2, 2, '2025-05-12', 'Ali Hassan',  'Murder FIR registered'),
(3, 3, 3, '2025-05-15', 'Fatima Noor', 'Fraud complaint'),
(4, 4, 4, '2025-05-18', 'Ahmed Raza',  'Kidnapping FIR'),
(5, 5, 1, '2025-05-20', 'Mariam Khan', 'Cyber scam complaint');

INSERT INTO evidence VALUES
(1, 1, 'CCTV Footage',     'Market camera recording'),
(2, 2, 'Fingerprint',      'Fingerprints collected'),
(3, 3, 'Bank Records',     'Fraud transaction details'),
(4, 4, 'Witness Statement','Statements from witnesses'),
(5, 5, 'Screenshots',      'Social media screenshots');

INSERT INTO complaints VALUES
(1, 1, 'Ali Ahmed',   '03001231234', 'Bike theft complaint',       '2025-05-01'),
(2, 2, 'Sana Malik',  '03111231234', 'Harassment complaint',       '2025-05-03'),
(3, 3, 'Ahmed Raza',  '03221231234', 'Fraud complaint',            '2025-05-05'),
(4, 4, 'Fatima Noor', '03331231234', 'Cyber bullying complaint',   '2025-05-06'),
(5, 5, 'Usman Tariq', '03441231234', 'Property dispute complaint', '2025-05-08');

INSERT INTO case_updates VALUES
(1, 1, 'Investigation started and CCTV footage collected',  '2025-05-11'),
(2, 2, 'Suspect identified and interrogation in progress',  '2025-05-13'),
(3, 3, 'Fraudulent bank account traced and case solved',    '2025-05-16'),
(4, 4, 'Search operation launched for kidnapped child',     '2025-05-19'),
(5, 5, 'Fake social media account blocked and case closed', '2025-05-21');

INSERT INTO court_records
(court_id, case_id, court_name, judge_name, hearing_date, verdict)
VALUES
(1, 1, 'Islamabad Court', 'Judge Akram',  '2025-06-01', 'Pending'),
(2, 2, 'Rawalpindi Court','Judge Salman', '2025-06-03', 'Pending'),
(3, 3, 'Taxila Court',    'Judge Tariq',  '2025-06-05', 'Guilty'),
(4, 4, 'Lahore Court',    'Judge Hamza',  '2025-06-08', 'Pending'),
(5, 5, 'Karachi Court',   'Judge Asad',   '2025-06-10', 'Closed');

INSERT INTO prison_records
(prison_id, criminal_id, prison_name, sentence_years, entry_date, release_date)
VALUES
(1, 1, 'Adiala Jail',         5, '2024-01-10', '2029-01-10'),
(2, 3, 'Kot Lakhpat Jail',    3, '2023-05-15', '2026-05-15'),
(3, 4, 'Karachi Central Jail',7, '2022-08-01', '2029-08-01');

INSERT INTO case_priority VALUES
(1, 1, 'Medium'),
(2, 2, 'High'),
(3, 3, 'Low'),
(4, 4, 'High'),
(5, 5, 'Medium');

SELECT * FROM users;
SELECT * FROM officers;
SELECT * FROM crime_types;
SELECT * FROM locations;
SELECT * FROM criminals;
SELECT * FROM victims;
SELECT * FROM cases;
SELECT * FROM case_assignments;
SELECT * FROM case_criminals;
SELECT * FROM case_victims;
SELECT * FROM fir;
SELECT * FROM evidence;
SELECT * FROM complaints;
SELECT * FROM case_updates;
SELECT * FROM court_records;
SELECT * FROM prison_records;
SELECT * FROM case_priority;

--     SHOW TRIGGER RESULT - ALL LOGS
SELECT * FROM case_logs;
