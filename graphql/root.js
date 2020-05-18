const pool = require('../database/db');
const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLList,
  GraphQLString,
  GraphQLInt
} = require('graphql');
const { Country, Week } = require('./types');

const RootQueryType = new GraphQLObjectType({
  name: 'Query',
  description: 'Root Query',
  fields: () => ({
    country: {
      type: Country,
      description: 'A single country',
      args: {
        code: { type: GraphQLString },
        name: { type: GraphQLString }
      },
      resolve: (_, args) => pool.query(
          `SELECT DISTINCT country_name AS name,
                           country_code AS code
           FROM covid_global
           WHERE country_code = $1
              OR country_name = $2`,
        [args.code, args.name])
        .then(res => res.rows[0])
    },
    countries: {
      type: GraphQLList(Country),
      description: 'The list of all countries',
      resolve: () => pool.query(
          `SELECT DISTINCT country_code as code,
                           country_name as name
           FROM covid_global
           ORDER BY name`)
        .then(res => res.rows)
    },
    week: {
      type: Week,
      description: 'A single week',
      args: {
        index_number: { type: GraphQLInt }
      },
      resolve: (_, args) => pool.query(
          `SELECT row_number() OVER (ORDER BY DATE_TRUNC('week', day)) as index_number,
                  DATE_TRUNC('week', day)                              as timestamp
           FROM covid_global
           GROUP BY timestamp
           OFFSET $1 - 1 LIMIT 1`,
        [args.index_number])
        .then(res => res.rows[0])
    },
    weeks: {
      type: GraphQLList(Week),
      description: 'The list of all weeks since the start of the COVID-19 pandemic',
      resolve: () => pool.query(
          `SELECT row_number() OVER (ORDER BY DATE_TRUNC('week', day)) as index_number,
                  DATE_TRUNC('week', day)                              as timestamp
           FROM covid_global
           GROUP BY timestamp`)
        .then(res => res.rows)
    }
  })
});

const covidStatsGraphQLSchema = new GraphQLSchema({
  query: RootQueryType
});

module.exports = { covidStatsGraphQLSchema };
