var express = require('express');
const { createServer } = require('http');
const { execute, subscribe } = require('graphql');
const { SubscriptionServer } = require('subscriptions-transport-ws');
const { ApolloServer, gql } = require('apollo-server-express');
const db = require('./models/db'); // Import the db connection object
const { PubSub } = require('graphql-subscriptions');
const { makeExecutableSchema } = require('graphql-tools');
const pubsub = new PubSub();
const typeDefs = require('./schema');
const resolvers = require('./resolvers');
const subscriptions = require('./subscriptions');
const cors = require('cors');
const ws = require('ws');
const http = require('http');
var app = express();
const port = process.env.PORT || 4000;
require('dotenv').config();
const JwtConfig = require('./config/config.json').development;
const jwt = require('jsonwebtoken');
const executableSchema = makeExecutableSchema({ typeDefs, resolvers });

// Define an array of allowed origins
const allowedOrigins = [
'http://localhost:3000','https://drive.google.com/file/d/1HUcpbIG78DdoMKHtlVefjAZrWRRwwuA8/view?usp=sharing',
'http://localhost:3001','http://localhost:5000','ws://localhost:5000','https://admin.kizuri.co.za','https://iplate.kizuri.co.za','wss://admin.kizuri.co.za','wss://iplate.kizuri.co.za',
'https://www.lifcobooks.com/wp-content/themes/shopchild/images/placeholder_book.png',  'https://kizuri-production.up.railway.app/',
'wss://kizuri-production.up.railway.app/',
];

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
        const restaurantId = decodedToken.restaurantId;
        // Add the userId to the context object
        return {restaurantId, userId, pubsub };
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
  const httpServer = createServer(app);

  /*// Start the server
  app.listen(port, () => {
    console.log('Server started at port:' + port);
  });
  // Start the server
  const httpServer = createServer(app);
*/
  // Start WebSocket server for subscriptions
  SubscriptionServer.create(
    {
      schema: executableSchema,
      execute,
      subscribe,
    },
    {
      server: httpServer,
      path: '/graphql',
    }
  );

  httpServer.listen(port, () => {
    console.log('Server started at port:' + port);
  });
}).catch((error) => {
  console.error('Failed to start ApolloServer:', error);
});
