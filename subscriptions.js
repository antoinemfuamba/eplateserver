const { withFilter } = require('graphql-subscriptions');

const subscriptionResolvers = {
  Subscription: {
     subscriptionOrder: {
        subscribe: withFilter(
          (_, { id }, context) => {
            // Your logic to validate the subscription and ensure the user has the necessary permissions
            // For example, you might check if the user is authenticated and has access to the specified order (id)
            if (!context.userId || !checkUserHasAccessToOrder(context.userId, id)) {
              throw new Error('Unauthorized');
            }
  
            // Return the async iterator for the subscription
            return context.pubsub.asyncIterator(`ORDER_${id}`);
          },
          (payload, variables) => {
            // Ensure the payload is sent only to subscribers who are interested in updates for the specified order (id)
            return payload.subscriptionOrder._id === variables.id;
          }
        ),
      },
     orderStatusChanged: {
         subscribe: withFilter(
          () => pubsub.asyncIterator('ORDER_STATUS_CHANGED'),
          (payload, variables) => {
            return payload.orderStatusChanged.userId === variables.userId;
          }
        ),
      },
    subscribePlaceOrder: {
        subscribe: withFilter(
          (_, { restaurant }, context) => {
            // Your logic to validate the subscription and ensure the user has the necessary permissions
            // For example, you might check if the user is authenticated and has access to the specified restaurant
            // Also, you can create a pubsub channel specific to the restaurant, for example: `subscribePlaceOrder_${restaurant}`
            if (!context.userId || !checkUserHasAccessToRestaurant(context.userId, restaurant)) {
              throw new Error('Unauthorized');
            }
            
            // Return the async iterator for the subscription
            return context.pubsub.asyncIterator(`subscribePlaceOrder_${restaurant}`);
          },
          (payload, variables) => {
            // Ensure the payload is sent only to subscribers who are interested in updates for the specified restaurant
            return payload.subscribePlaceOrder.restaurant._id === variables.restaurant;
          }
        ),
      },
    
  },
};

module.exports = subscriptionResolvers;
