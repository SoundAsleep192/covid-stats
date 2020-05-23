const express = require('express');
const expressGraphQL = require('express-graphql');
const { covidStatsGraphQLSchema } = require('./graphql/root');
const app = express();

// middleware
app.use(express.json());
app.use('/graphql', expressGraphQL({
  schema: covidStatsGraphQLSchema,
  graphiql: true
}));

app.listen(8000, () => {
  console.log(`GraphQL server is ready at http://localhost:8000/graphql`);
});
