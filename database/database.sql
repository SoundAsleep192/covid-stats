CREATE DATABASE covidstats;

CREATE TABLE covid_global
(
    day                        DATE,
    country_code               VARCHAR(2),
    country_name               VARCHAR(56),
    region                     VARCHAR(5),
    deaths                     INTEGER,
    cumulative_deaths          INTEGER,
    confirmed_cases            INTEGER,
    cumulative_confirmed_cases INTEGER
);

COPY covid_global FROM '*absolute_path*\WHO-COVID-19-global-data.csv' DELIMITER ',' CSV HEADER;

DELETE
FROM covid_global
WHERE country_code IS NULL
   OR country_name IS NULL;

/* Weeks */
SELECT row_number() OVER (ORDER BY DATE_TRUNC('week', day)) as index_number,
       DATE_TRUNC('week', day)                              as week_timestamp,
       SUM(deaths)                                          as new_deaths,
       MAX(cumulative_deaths)                               as total_deaths,
       SUM(confirmed_cases)                                 as new_cases,
       MAX(cumulative_confirmed_cases)                      as total_cases
FROM covid_global
WHERE country_code = 'RU'
GROUP BY week_timestamp;

/* Countries */
SELECT DISTINCT country_code            as code,
                country_name            as name,
                DATE_TRUNC('week', day) as week_timestamp
FROM covid_global
WHERE DATE_TRUNC('week', day) = '2020-05-11 00:00:00+03';
