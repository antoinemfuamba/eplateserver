const { withFilter } = require('graphql-subscriptions');

const subscriptionResolvers = {
  Subscription: {
    //Test
     subscriptionOrder: {
        subscribe: withFilter(
          (_, { id }, context) => {
            // Your logic to validate the subscription and ensure the user has the necessary permissions
            // For example, you might check if the user is authenticated and has access to the specified order (id)
            if (!context.userId) {
              throw new Error('Unauthorized');
            }
  
            // Return the async iterator for the subscription
            return context.pubsub.asyncIterator(`ORDER_STATUS_CHANGED`);
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
            if (!context.userId) {
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
      subscriptionRiderLocation: {
        subscribe: withFilter(
          (_, { riderId }, context) => {
            // Your logic to validate the subscription and ensure the user has the necessary permissions
            // For example, you might check if the user is authenticated and has access to the specified rider (riderId)
            if (!context.userId) {
              throw new Error('Unauthorized');
            }
  
            // Return the async iterator for the subscription
            return context.pubsub.asyncIterator(`RIDER_LOCATION_${riderId}`);
          },
          (payload, variables) => {
            // Ensure the payload is sent only to subscribers who are interested in updates for the specified rider (riderId)
            return payload.subscriptionRiderLocation._id === variables.riderId;
          }
        ),
      },
      subscriptionNewMessage: {
        // Define the subscribe resolver function
        subscribe: withFilter(
          (_, { order }, context) => {
            // Your logic to validate the subscription and ensure the user has the necessary permissions
            // For example, you might check if the user is authenticated and has access to the specified order
            if (!context.userId) {
              throw new Error('Unauthorized');
            }
  
            // Return the async iterator for the subscription
            return context.pubsub.asyncIterator(`NEW_MESSAGE_${order}`);
          },
          (payload, variables) => {
            // Ensure the payload is sent only to subscribers who are interested in updates for the specified order
            return payload.subscriptionNewMessage.order === variables.order;
          }
        ),
      },
      //Testing
      subscriptionZoneOrders: {
        subscribe: withFilter(
          (_, { zoneId }, { pubsub }) => {
            const channel = `ZONE_ORDER_PLACED`;
            return pubsub.asyncIterator(channel);
          },
          (payload, variables) => {
            return payload.subscriptionZoneOrders.zoneId === variables.zoneId;
          }
        ),
      },
      subscriptionAssignRider: {
        subscribe: withFilter(
          (_, { riderId }, { pubsub }) => {
            const channel = 'ASSIGN_RIDER';
            return pubsub.asyncIterator(channel);
          },
          (payload, variables) => {
            return payload.subscriptionAssignRider.riderId === variables.riderId;
          }
        ),
      },
      subscribeOrderStatus: {
        subscribe: withFilter(
          (_, { _id }, { pubsub }) => {
            const channel = `ORDER_STATUS_${_id}`;
            return pubsub.asyncIterator(channel);
          },
          (payload, variables) => {
            return payload.subscribeOrderStatus._id === variables._id;
          }
        ),
      },
  
  },
};

module.exports = subscriptionResolvers;
