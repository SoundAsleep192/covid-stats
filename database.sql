CREATE DATABASE covidstats;

CREATE TABLE countries(
    country_id SERIAL PRIMARY KEY,
    country_code VARCHAR(2),
    country_name VARCHAR(56)
);
