CREATE DATABASE covidstats;

CREATE TABLE covid_global(
    day DATE,
    country_code VARCHAR(2),
    country_name VARCHAR(56),
    region VARCHAR(5),
    deaths INTEGER,
    cumulative_deaths INTEGER,
    confirmed_cases INTEGER,
    cumulative_confirmed_cases INTEGER
);

COPY covid_global FROM '*absolute_path*\WHO-COVID-19-global-data.csv' DELIMITER ',' CSV HEADER;

SELECT MIN(day) FROM covid_global;
