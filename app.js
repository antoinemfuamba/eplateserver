var express = require('express');
const { ApolloServer, gql } = require('apollo-server-express');
const db = require('./models/db'); // Import the db connection object
const typeDefs = require('./schema');
const resolvers = require('./resolvers');
const subscriptions = require('./subscriptions');
const cors = require('cors');
var app = express();
const port = process.env.PORT || 4000;
require('dotenv').config();
const JwtConfig = require('./config/config.json').development;
const jwt = require('jsonwebtoken');

// Define an array of allowed origins
const allowedOrigins = ['http://localhost:3000', 'http://localhost:3001'];

// Enable CORS for all routes
app.use(
  cors({
    origin: allowedOrigins,
  })
);

// Create an instance of ApolloServer
//const server = new ApolloServer({ typeDefs, resolvers, uri: '/graphql'});

// Create an instance of ApolloServer
const server = new ApolloServer({
  typeDefs,
  resolvers,
  subscriptions,
  uri: '/graphql',
  context: ({ req }) => {
    // Get the authorization header from the request
    const authHeader = req.headers.authorization;

    if (authHeader) {
      // Extract the token from the authorization header (assuming Bearer token format)
      const token = authHeader.split(' ')[1];

      try {
        // Verify and decode the token to get the userId
        const decodedToken = jwt.verify(token, JwtConfig.JWT_SECRET);
        const userId = decodedToken.userId;

        // Add the userId to the context object
        return { userId };
      } catch (error) {
        // Token verification failed, handle accordingly (e.g., throw an error)
        throw new Error('Invalid token');
      }
    }
  },
});

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
