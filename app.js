var express = require('express');
const { ApolloServer, gql } = require('apollo-server-express');
const db = require('./models/db'); // Import the db connection object
const typeDefs = require('./schema');
const resolvers = require('./resolvers');
const cors = require('cors');
var app = express();
const port = process.env.PORT || 4000;
require('dotenv').config();

// Define an array of allowed origins
const allowedOrigins = ['http://localhost:3000', 'http://localhost:3001'];

// Enable CORS for all routes
app.use(
  cors({
    origin: allowedOrigins,
  })
);

// Create an instance of ApolloServer
const server = new ApolloServer({ typeDefs, resolvers, uri: '/graphql'});

// Start the ApolloServer and then apply the middleware to Express
server.start().then(() => {
  server.applyMiddleware({ app });

  // Route for testing
  app.get('/', (req, res) => {
    res.send('foobar');
  });

  // Start the server
  app.listen(port, () => {
    console.log('Server started at port:' + port);
  });
}).catch((error) => {
  console.error('Failed to start ApolloServer:', error);
});
