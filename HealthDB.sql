-- ============================================================
--  SmartHealthCare — HealthDB.sql
--  Database: healthsetu
--  Generated for: Sanket-378/SmartHealthCare
-- ============================================================

CREATE DATABASE IF NOT EXISTS healthsetu;
USE healthsetu;

-- ------------------------------------------------------------
-- 1. users
--    Stores all user accounts: patients, doctors, admins
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
  id           BIGINT        NOT NULL AUTO_INCREMENT,
  name         VARCHAR(100)  NOT NULL,
  email        VARCHAR(150)  NOT NULL UNIQUE,
  password     VARCHAR(255)  NOT NULL,          -- bcrypt hash
  phone        VARCHAR(15)   DEFAULT NULL,
  role         ENUM('patient','doctor','admin') NOT NULL DEFAULT 'patient',
  age          INT           DEFAULT NULL,
  city         VARCHAR(100)  DEFAULT NULL,
  profile_pic  VARCHAR(255)  DEFAULT NULL,       -- file path / URL
  is_active    TINYINT(1)    NOT NULL DEFAULT 1,
  created_at   TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at   TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  INDEX idx_users_email (email),
  INDEX idx_users_role  (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ------------------------------------------------------------
-- 2. doctor_profiles
--    Extended profile for users with role = 'doctor'
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS doctor_profiles (
  id               BIGINT        NOT NULL AUTO_INCREMENT,
  user_id          BIGINT        NOT NULL,
  specialization   VARCHAR(150)  DEFAULT NULL,
  qualification    VARCHAR(255)  DEFAULT NULL,
  experience_years INT           DEFAULT 0,
  bio              TEXT          DEFAULT NULL,
  consultation_fee DECIMAL(10,2) DEFAULT 0.00,
  license_number   VARCHAR(100)  DEFAULT NULL,
  license_file     VARCHAR(255)  DEFAULT NULL,   -- uploads/licenses path
  is_verified      TINYINT(1)    NOT NULL DEFAULT 0,
  created_at       TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at       TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_doctor_user (user_id),
  CONSTRAINT fk_dp_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ------------------------------------------------------------
-- 3. slots
--    Available time slots created by doctors
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS slots (
  id           BIGINT       NOT NULL AUTO_INCREMENT,
  doctor_id    BIGINT       NOT NULL,
  slot_date    DATE         NOT NULL,
  start_time   TIME         NOT NULL,
  end_time     TIME         NOT NULL,
  is_booked    TINYINT(1)   NOT NULL DEFAULT 0,
  is_active    TINYINT(1)   NOT NULL DEFAULT 1,
  created_at   TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  INDEX idx_slots_doctor (doctor_id),
  INDEX idx_slots_date   (slot_date),
  CONSTRAINT fk_slots_doctor FOREIGN KEY (doctor_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ------------------------------------------------------------
-- 4. appointments
--    Booking record linking patient, doctor, and slot
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS appointments (
  id           BIGINT        NOT NULL AUTO_INCREMENT,
  patient_id   BIGINT        NOT NULL,
  doctor_id    BIGINT        NOT NULL,
  slot_id      BIGINT        NOT NULL,
  status       ENUM('PENDING','CONFIRMED','CANCELLED','COMPLETED')
               NOT NULL DEFAULT 'CONFIRMED',
  notes        TEXT          DEFAULT NULL,       -- patient symptoms / reason
  created_at   TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at   TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  INDEX idx_appt_patient (patient_id),
  INDEX idx_appt_doctor  (doctor_id),
  UNIQUE KEY uq_slot_booked (slot_id),           -- one booking per slot
  CONSTRAINT fk_appt_patient FOREIGN KEY (patient_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_appt_doctor  FOREIGN KEY (doctor_id)  REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_appt_slot    FOREIGN KEY (slot_id)    REFERENCES slots(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ------------------------------------------------------------
-- 5. medical_records  (NEW — recommended addition)
--    Doctor writes records after each appointment
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS medical_records (
  id              BIGINT       NOT NULL AUTO_INCREMENT,
  appointment_id  BIGINT       NOT NULL,
  patient_id      BIGINT       NOT NULL,
  doctor_id       BIGINT       NOT NULL,
  diagnosis       TEXT         DEFAULT NULL,
  prescription    TEXT         DEFAULT NULL,
  notes           TEXT         DEFAULT NULL,
  follow_up_date  DATE         DEFAULT NULL,
  created_at      TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at      TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  INDEX idx_mr_patient (patient_id),
  INDEX idx_mr_doctor  (doctor_id),
  CONSTRAINT fk_mr_appointment FOREIGN KEY (appointment_id) REFERENCES appointments(id) ON DELETE CASCADE,
  CONSTRAINT fk_mr_patient     FOREIGN KEY (patient_id)     REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_mr_doctor      FOREIGN KEY (doctor_id)      REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ------------------------------------------------------------
-- 6. notifications  (NEW — recommended addition)
--    In-app notifications for appointment updates
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS notifications (
  id         BIGINT        NOT NULL AUTO_INCREMENT,
  user_id    BIGINT        NOT NULL,
  message    VARCHAR(500)  NOT NULL,
  type       ENUM('APPOINTMENT','REMINDER','SYSTEM') NOT NULL DEFAULT 'SYSTEM',
  is_read    TINYINT(1)    NOT NULL DEFAULT 0,
  created_at TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  INDEX idx_notif_user (user_id),
  CONSTRAINT fk_notif_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

