-- Refugee Database
--
-- Tables to create
-- User, user_m to refugee association table
-- Report
-- ngo

-- User
DROP TABLE IF EXISTS user_m CASCADE;
DROP TABLE IF EXISTS ngo CASCADE;
DROP TABLE IF EXISTS refugee CASCADE;
DROP TABLE IF EXISTS associated_person;
DROP TABLE IF EXISTS refugee_ngo;
DROP TABLE IF EXISTS report;


CREATE TABLE IF NOT EXISTS user_m (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100),
    email VARCHAR(100),
    password_hash VARCHAR(100),
    created_date DATE NOT NULL DEFAULT CURRENT_DATE
);

CREATE TABLE IF NOT EXISTS ngo (
    id SERIAL PRIMARY KEY,
    user_id INTEGER references user_m(id),
    organization VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS refugee (
    id SERIAL PRIMARY KEY,
    user_id INTEGER references user_m(id),
    name VARCHAR(200)
);

CREATE TABLE IF NOT EXISTS associated_person (
    id SERIAL PRIMARY KEY,
    refugee_id INTEGER references refugee(id) ON DELETE CASCADE ON UPDATE CASCADE,
    name VARCHAR(255),
    association_date DATE NOT NULL DEFAULT CURRENT_DATE,
    disassociation_date DATE
);

CREATE TABLE IF NOT EXISTS refugee_ngo (
    id SERIAL PRIMARY KEY,
    refugee_id INTEGER references refugee(id),
    ngo_id INTEGER references ngo(id),
    start_date DATE NOT NULL DEFAULT CURRENT_DATE,
    end_date DATE
);

-- add constraint for longitude, latitude
CREATE TABLE IF NOT EXISTS report (
    id SERIAL PRIMARY KEY,
    refugee_id INTEGER references refugee(id),
    location_name VARCHAR(255),
    longitude FLOAT NOT NULL,
    latitude FLOAT NOT NULL,
    description TEXT,
    creation_date DATE NOT NULL DEFAULT CURRENT_DATE,
    edit_date DATE
);