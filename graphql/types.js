const pool = require('../database/db');
const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull
} = require('graphql');

const Country = new GraphQLObjectType({
  name: 'Country',
  description: 'Represents a country affected by the COVID-19 pandemic',
  fields: () => ({
    code: { type: GraphQLNonNull(GraphQLString) },
    name: { type: GraphQLNonNull(GraphQLString) },
    weeks: {
      type: GraphQLList(Week),
      resolve: (country) => pool.query(
          `SELECT row_number() OVER (ORDER BY DATE_TRUNC('week', day)) as index_number,
                  DATE_TRUNC('week', day)                              as timestamp,
                  MAX(country_code)                                    as country_code
           FROM covid_global
           WHERE country_code = $1
           GROUP BY timestamp`,
        [country.code])
        .then(res => res.rows)

    },
    week_timestamp: { type: GraphQLNonNull(GraphQLString) },
    statistics: {
      type: GraphQLNonNull(Statistics),
      resolve: (country) => pool.query(
          `SELECT DATE_TRUNC('week', day)         as week_timestamp,
                  SUM(deaths)                     as new_deaths,
                  MAX(cumulative_deaths)          as total_deaths,
                  SUM(confirmed_cases)            as new_cases,
                  MAX(cumulative_confirmed_cases) as total_cases
           FROM covid_global
           WHERE country_code = $1
             AND DATE_TRUNC('week', day) = $2
           GROUP BY week_timestamp`,
        [country.code, country.week_timestamp])
        .then(res => res.rows[0])
    }
  })
});

const Week = new GraphQLObjectType({
  name: 'Week',
  description: 'Represents a week during the COVID-19 pandemic',
  fields: () => ({
    index_number: { type: GraphQLNonNull(GraphQLInt) },
    timestamp: { type: GraphQLNonNull(GraphQLString) },
    countries: {
      type: GraphQLList(Country),
      resolve: (week) => pool.query(
          `SELECT DISTINCT country_code            as code,
                           country_name            as name,
                           DATE_TRUNC('week', day) as week_timestamp
           FROM covid_global
           WHERE DATE_TRUNC('week', day) = $1`,
        [week.timestamp])
        .then(res => res.rows)
    },
    country_code: { type: GraphQLNonNull(GraphQLString) },
    statistics: {
      type: GraphQLNonNull(Statistics),
      resolve: (week) => pool.query(
          `SELECT DATE_TRUNC('week', day)         as week_timestamp,
                  SUM(deaths)                     as new_deaths,
                  MAX(cumulative_deaths)          as total_deaths,
                  SUM(confirmed_cases)            as new_cases,
                  MAX(cumulative_confirmed_cases) as total_cases
           FROM covid_global
           WHERE country_code = $1
           GROUP BY week_timestamp
           OFFSET $2 - 1 LIMIT 1`,
        [week.country_code, week.index_number])
        .then(res => res.rows[0])
    }
  })
});

const Statistics = new GraphQLObjectType({
  name: 'Statistics',
  description: 'Represents incidence and death rate in a particular country during a particular week',
  fields: () => ({
    new_deaths: { type: GraphQLNonNull(GraphQLInt) },
    total_deaths: { type: GraphQLNonNull(GraphQLInt) },
    new_cases: { type: GraphQLNonNull(GraphQLInt) },
    total_cases: { type: GraphQLNonNull(GraphQLInt) }
  })
})

module.exports = { Country, Week };
