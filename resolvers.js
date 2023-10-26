// Import your models
const Owner = require('./models/Owner');
const User = require('./models/users');
const Food = require('./models/foods');
const Earning = require('./models/earning');
const Vendor = require('./models/vendors');
const Promotion = require('./models/promotions');
const Review = require('./models/reviews');
const ReviewData = require('./models/reviewData');
const Delivery = require('./models/delivery');
const ChatMessage = require('./models/chatmessage');
const Restaurant = require('./models/restaurants');
const Variation = require('./models/variations');
const Commission = require('./models/commission');
const WithdrawRequest = require('./models/withdrawrequest');
const Category = require('./models/categories');
const Tipping = require('./models/tipping');
const Option = require('./models/options');
const Notification = require('./models/notifications');
const Coupon = require('./models/coupon');
const Times = require('./models/times');
const Addon = require('./models/addons');
const Location = require('./models/locations');
const Locat = require('./models/locat');
const Zone = require('./models/zone');
const OpeningTime = require('./models/openingTimes');
const Configuration = require('./models/configuration');
const Section = require('./models/sections');
const Offer = require('./models/offers');
const Payment = require('./models/payment');
const Rider = require('./models/rider');
const Order = require('./models/orders');
const Addresses = require('./models/addresses');
const parseTimeString = require('./config/helpers');
const Item = require('./models/items');
const { withFilter } = require('graphql-subscriptions');
const { PubSub } = require('graphql-subscriptions'); // Import PubSub
// Create an instance of PubSub
const pubsub = new PubSub();
const { ObjectId } = require('mongodb');
const { v4: uuidv4 } = require('uuid');
const {assignZoneToRestaurant,getDistanceFromLatLonInMeters, generateUniqueCode, isLocationWithinZone} = require('./config/distance');
const db  = require('./models/db'); // Replace with your database connection code
const jwt = require('jsonwebtoken');
const { ApolloError } = require('apollo-server-express');
const JwtConfig = require("./config/config.json").development;
const bcrypt = require('bcryptjs');
const subscriptionResolvers = require('./subscriptions');

const resolvers = {
  ...subscriptionResolvers,
  Query: {
    /****************************************************************************************************************************
                                        ADMIN QUERIES -START
    *****************************************************************************************************************************/
    configuration: async () => {
      try {
 // Fetch the global configuration document using the configuration_id
 const configuration_id = "global_configuration"; // Set the identifier for the global configuration
 const globalConfiguration = await Configuration.findOne({ configuration_id });

 // Return the global configuration object
 return globalConfiguration ? globalConfiguration._doc : null;
      } catch (error) {
        throw new Error('Unable to fetch configuration.');
      }
    },
    //DONE
    ridersByZone: async (_, { id }) => {
      try {
        // Find riders in the specified zone by their zone ID
        const riders = await Rider.find({ zone: id }).populate('zone');

        return riders;
      } catch (error) {
        console.error(error);
        throw new Error('Failed to fetch riders by zone');
      }
    },
    //DONE
    restaurantByOwner: async (_, { id }) => {
      try {
        const user = await Vendor.findById(id).populate('restaurants');
        return {
          _id: user._id,
          email: user.email,
          userType: user.userType,
          restaurants: user.restaurants,
        };
      } catch (error) {
        throw new Error('Failed to fetch restaurant by owner');
      }
    }, 
    //DONE
    getUser: async (_, { id }) => {
      try {
        // Fetch the user from the database using the provided ID
        const user = await Owner.findById(id);
        return user;
      } catch (error) {
        console.error(error);
        throw new Error('Failed to fetch user');
      }
    },
    //DONE
    users: async () => {
      try {
        const users = await User.find();
        return users;
      } catch (error) {
        console.error(error);
        throw new Error('Failed to fetch users');
      }
    },
    //DONE
    riders: async () => {
      try {
        const riders = await Rider.find().populate('zone');
        return riders;
      } catch (error) {
        console.error(error);
        throw new Error('Failed to fetch Riders');
      }
    },
    //DONE
    getCategory: async (_, { id }) => {
      try {
        const category = await Category.findById(id);
        return category;
      } catch (error) {
        console.error(error);
        throw new Error('Failed to fetch category');
      }
    },
    //DONE
    getCategories: async () => {
      try {
        const categories = await Category.find();
        return categories;
      } catch (error) {
        console.error(error);
        throw new Error('Failed to fetch categories');
      }
    },
    //DONE
    getOrder: async (_, { id }) => {
      try {
        const order = await Order.findById(id);
        return order;
      } catch (error) {
        console.error(error);
        throw new Error('Failed to fetch order');
      }
    },
    getOrders: async () => {
      try {
        const orders = await Order.find();
        return orders;
      } catch (error) {
        console.error(error);
        throw new Error('Failed to fetch orders');
      }
    },
    getFood: async (_, { id }) => {
      try {
        const product = await Food.findById(id);
        return product;
      } catch (error) {
        console.error(error);
        throw new Error('Failed to fetch product');
      }
    },
    coupons: async () => {
      try {
        const coupons = await Coupon.find();
        return coupons;
      } catch (error) {
        throw new Error('Failed to fetch coupons');
      }
    },
    getFoods: async () => {
      try {
        const products = await Food.find();
        return products;
      } catch (error) {
        console.error(error);
        throw new Error('Failed to fetch products');
      }
    },
    //DONE
    getOption: async (_, { id }) => {
      // Retrieve and return the Option with the provided ID
      return Option.findById(id);
    },
    //DONE
    getOptions: async () => {
      // Retrieve and return all Options
      return Option.find();
    },
    //DONE
    getSection: async (_, { id }) => {
      // Retrieve and return the Section with the provided ID
      return Section.findById(id);
    },
    //DONE
    sections: async () => {
      try {
        const sections = await Section.find();
        return sections;
      } catch (error) {
        console.error(error);
        throw new Error('Failed to fetch sections');
      }
    },
    //DONE
    restaurants: async () => {
      try {
        const restaurants = await Restaurant.find().populate('owner');
        return restaurants;
      } catch (error) {
        console.error(error);
        throw new Error('Failed to fetch restaurants');
      }
    },
    //DONE -The categories-The Option
    restaurantin: async (_, { id }) => {
      try {
        const restaurant = await Restaurant.findById(id)
        .populate({
          path: 'categories',
          populate: {
            path: 'foods',
            populate: {
              path: 'variations',
            },
          },
        })
        .populate('options')
        .populate('addons.options');

      if (!restaurant) {
        throw new Error('Restaurant not found');
      }

      return restaurant;
      } catch (error) {
        console.error(error);
        throw new Error('Failed to fetch restaurant data');
      }
    },
    
    //DONE -PROFILE (Vendor: This, deliverybounds and openingtimes )
    restaurantin: async (_, { id }) => {
      try {
        const restaurant = await Restaurant.findById(id)
          .populate('location')
          .populate('deliveryBounds')
          .populate('openingTimes')
          .populate('owner');
        
        return restaurant;
      }catch (error) {
        console.error(error);
        throw new Error('Failed to fetch vendor');
      }
    },

    getPromotion: async (_, { id }) => {
      try {
        const promotion = await Promotion.findById(id);
        return promotion;
      } catch (error) {
        console.error(error);
        throw new Error('Failed to fetch promotion');
      }
    },
    //DONE
    getDashboardOrders: async (_, { startingDate, endingDate, restaurant }) => {
      try {
        const startDate = new Date(startingDate);
        const endDate = new Date(endingDate);

        // Fetch the orders within the specified date range and for the given restaurant
        const orders = await Order.find({
          restaurant,
          createdAt: {
            $gte: startDate,
            $lte: endDate,
          },
        });

        // Group and count the orders by day
        const orderCountsByDay = {};
        orders.forEach((order) => {
          const orderDate = order.createdAt.toISOString().split('T')[0]; // Extract the date part from the timestamp
          if (orderCountsByDay[orderDate]) {
            orderCountsByDay[orderDate] += 1;
          } else {
            orderCountsByDay[orderDate] = 1;
          }
        });

        // Format the order counts into the expected response shape
        const dashboardOrders = Object.entries(orderCountsByDay).map(([day, count]) => ({
          day,
          count,
        }));

        return { orders: dashboardOrders };
      } catch (error) {
        console.error(error);
        throw new Error('Failed to fetch dashboard orders');
      }
    },
    //DONE
    getDashboardSales: async (_, { startingDate, endingDate, restaurant }) => {
      try {
        const startDate = new Date(startingDate);
        const endDate = new Date(endingDate);

        // Fetch the orders within the specified date range and for the given restaurant
        const orders = await Order.find({
          restaurant,
          createdAt: {
            $gte: startDate,
            $lte: endDate,
          },
        });

        // Group and calculate the total sales amount by day
        const salesByDay = {};
        orders.forEach((order) => {
          const orderDate = order.createdAt.toISOString().split('T')[0]; // Extract the date part from the timestamp
          if (salesByDay[orderDate]) {
            salesByDay[orderDate] += order.totalAmount;
          } else {
            salesByDay[orderDate] = order.totalAmount;
          }
        });

        // Format the sales data into the expected response shape
        const dashboardSales = Object.entries(salesByDay).map(([day, amount]) => ({
          day,
          amount,
        }));

        return { orders: dashboardSales };
      } catch (error) {
        console.error(error);
        throw new Error('Failed to fetch dashboard sales');
      }
    },
    //DONE
    getDashboardTotal: async (_, { startingDate, endingDate, restaurant }) => {
      try {
        const startDate = new Date(startingDate);
        const endDate = new Date(endingDate);

        // Fetch the total number of orders within the specified date range and for the given restaurant
        const totalOrders = await Order.countDocuments({
          restaurant,
          createdAt: {
            $gte: startDate,
            $lte: endDate,
          },
        });

        // Fetch the total sales amount within the specified date range and for the given restaurant
        const totalSales = await Order.aggregate([
          {
            $match: {
              restaurant,
              createdAt: {
                $gte: startDate,
                $lte: endDate,
              },
            },
          },
          {
            $group: {
              _id: null,
              totalAmount: { $sum: '$totalAmount' },
            },
          },
        ]);

        const dashboardTotal = {
          totalOrders,
          totalSales: totalSales.length > 0 ? totalSales[0].totalAmount : 0,
        };

        return dashboardTotal;
      } catch (error) {
        console.error(error);
        throw new Error('Failed to fetch dashboard total');
      }
    },
    orderCount: async (_, { restaurant }) => {
      try {
        // Query the database to count the number of orders for the specified restaurant
        const count = await Order.countDocuments({ restaurant });
        return count;
      } catch (error) {
        throw new Error('Failed to fetch order count');
      }
    },
    //DONE
    ordersByRestId: async (_, { restaurant, page, rows, search }) => {

      try {
        const totalOrders = await Order.countDocuments({ restaurant });
//
        if (totalOrders === 0) {
          // No data in the database yet, return an empty array or appropriate response
          return [];
        }
    
        // Ensure that the 'page' and 'rows' values are non-negative integers
        const normalizedPage = Math.max(page, 1); // Ensure page is at least 1
        const normalizedRows = Math.max(rows, 1); // Ensure rows is at least 1

        // Calculate the skip value based on pagination
        const skip = (normalizedPage - 1) * normalizedRows;

        const orders = await Order.find({ restaurant })
          .limit(normalizedRows)
          .skip(skip);
    
        return orders;
      } catch (error) {
        console.error('Error: Failed to fetch orders', error);
        throw new Error('Failed to fetch orders');
      }
    },
    getPromotions: async () => {
      try {
        const promotions = await Promotion.find();
        return promotions;
      } catch (error) {
        console.error(error);
        throw new Error('Failed to fetch promotions');
      }
    },
    getReview: async (_, { id }) => {
      try {
        const review = await Review.findById(id);
        return review;
      } catch (error) {
        console.error(error);
        throw new Error('Failed to fetch review');
      }
    },
    //DONE
    reviews: async (_, { restaurant }) => {
        try {
          // Find all reviews for the specified restaurant
          const reviews = await Review.find({ 'restaurant._id': restaurant });
  
          // Populate order details and user details for each review
          const populatedReviews = await Promise.all(
            reviews.map(async (review) => {
              // Populate order details
              const populatedOrder = await Order.findById(review.order._id)
                .populate('items', 'title')
                .populate('user', '_id name email');
  
              // Populate restaurant details
              const populatedRestaurant = await Restaurant.findById(review.restaurant._id);
  
              return {
                ...review._doc,
                order: populatedOrder,
                restaurant: populatedRestaurant,
              };
            })
          );
  
          return populatedReviews;
        } catch (error) {
          console.error('Error: Failed to fetch reviews', error);
          throw new Error('Failed to fetch reviews');
        }
    },
    
  availableRiders: async () => {
    try {
      const riders = await Rider.find({ available: true }).populate('zone');
      return riders;
    } catch (error) {
      console.error(error);
      throw new Error('Failed to fetch available riders');
    }
  },

    getNotification: async (_, { id }) => {
      try {
        const notification = await Notification.findById(id);
        return notification;
      } catch (error) {
        console.error(error);
        throw new Error('Failed to fetch notification');
      }
    },
    getNotifications: async () => {
      try {
        const notifications = await Notification.find();
        return notifications;
      } catch (error) {
        console.error(error);
        throw new Error('Failed to fetch notifications');
      }
    },
    //DONE
   /* getActiveOrders: async (_, { restaurantId }) => {
      try {
        // Fetch active orders based on restaurantId

        const activeOrders = await Order.find({ restaurant: restaurantId})
          .populate({
            path: 'restaurant',
            populate: {
              path: 'location', // Replace with the actual path to location if needed
            },
          })
          .populate({
            path: 'items.food', // Populate the 'foods' field
            
          })
          .populate('zone'); // Add this line to populate the 'zone' field
          
           for (const order of activeOrders) {
      // Get the updated restaurant object to access the zone field
      const updatedRestaurant = await Restaurant.findById(restaurantId);

      // Set the zone field for the order
      order.zone = updatedRestaurant.zone;
    }
          
        return activeOrders;
      } catch (error) {
        console.error('Error: Failed to fetch active orders', error);
        throw new Error('Failed to fetch active orders');
      }
    },*/
    getActiveOrders: async (_, { restaurantId }) => {
      try {
        // Define the query conditions based on the presence of restaurantId
        const queryConditions = restaurantId
          ? { restaurant: restaurantId }
          : {}; // If restaurantId is not provided, an empty query condition fetches all active orders.
    
        // Fetch active orders based on the query conditions
        const activeOrders = await Order.find(queryConditions)
          .populate({
            path: 'restaurant',
            populate: {
              path: 'location', // Replace with the actual path to location if needed
            },
          })
          .populate({
            path: 'items.food', // Populate the 'foods' field
          })
          .populate('zone');
    
        // If restaurantId is provided, set the zone field for each order
        if (restaurantId) {
          for (const order of activeOrders) {
            const updatedRestaurant = await Restaurant.findById(restaurantId);
            order.zone = updatedRestaurant.zone;
          }
        }
    
        return activeOrders;
      } catch (error) {
        console.error('Error: Failed to fetch active orders', error);
        throw new Error('Failed to fetch active orders');
      }
    },
    
    //DONE
    getAddon: async (_, { id }) => {
      // Retrieve and return the Addon with the provided ID
      return Addon.findById(id);
    },
    //DONE
    getAddons: async () => {
      // Retrieve and return all Addons
      return Addon.find();
    },
    //DONE
    getZone: async (_, { _id }) => {
      // Retrieve and return the Zone with the provided ID
      return Zone.findById(_id);
    },
    //DONE
    zones: async () => {
      try {
        const zones = await Zone.find().populate('location');
        return zones;
      } catch (error) {
        console.error(error);
        throw new Error('Failed to fetch zones');
      }
    },
    
    //DONE
    getOffer: async (_, { id }) => {
      // Retrieve and return the Offer with the provided ID
      return Offer.findById(id);
    },
    //DONE
    getOffers: async () => {
      // Retrieve and return all Offers
      return Offer.find();
    },
    //DONE
    vendors: async () => {
      try {
        const vendors = await Vendor.find().populate({
          path: 'restaurants',
          populate: { path: 'zone' },
        });
        return vendors;
      } catch (error) {
        console.error(error);
        throw new Error('Failed to fetch vendors');
      }
    },
    getVendor: async (_, { _id }) => {
      try {
        const vendor = await Vendor.findById(_id).populate('restaurants.zone');
        if (!vendor) {
          throw new Error('Vendor not found');
        }
        return vendor;
      } catch (error) {
        console.error(error);
        throw new Error('Failed to fetch vendor');
      }
    },
    restaurantList: async () => {
      try {
        const restaurants = await Restaurant.find();
        return restaurants;
      } catch (error) {
        console.error(error);
        throw new Error('Failed to fetch restaurant list');
      }
    },
    //DONE
    /*tips: async () => {
      try {
        const tips = await Tipping.find();
        return tips;
      } catch (error) {
        throw new Error('Failed to fetch tips');
      }
    },*/
    getAllWithdrawRequests: async (_, { offset }) => {
      try {
        const withdrawRequests = await WithdrawRequest.find()
          .populate('rider')
          .skip(offset)
          .limit(10)
          .sort({ requestTime: -1 });

        const total = await WithdrawRequest.countDocuments();

        return {
          success: true,
          message: 'Withdraw requests retrieved successfully',
          data: withdrawRequests,
          pagination: {
            total,
          },
        };
      } catch (error) {
        throw new Error('Failed to fetch withdraw requests');
      }
    },     
    
        /****************************************************************************************************************************
                                        ADMIN QUERIES - END
    *****************************************************************************************************************************/

       /****************************************************************************************************************************
                                        WEB QUERIES - START
    *****************************************************************************************************************************/ 

    /*configuration: async () => {
      try {
        // Fetch the global configuration document using the configuration_id
        const configuration_id = "global_configuration"; // Set the identifier for the global configuration
        const configuration = await Configuration.findOne({ configuration_id });
    
        if (configuration) {
          // If the configuration exists, return the required fields
          const { _id, currency, currencySymbol, deliveryRate } = configuration;
          return { _id, currency, currencySymbol, deliveryRate };
        } else {
          // If the configuration doesn't exist, return null or throw an error
          // depending on your use case
          // For this example, we'll return null
          return null;
        }
      } catch (error) {
        throw new Error('Unable to fetch configuration.');
      }
    },*/
    //DONE
    profile: async (_,__,context) => {
          try {

            const {userId} = context;
            // Fetch user data from the database and populate the 'favourite' field with 'Item' objects
            const user = await User.findById(userId);
    
            // Ensure that the user exists
            return user; } catch (error) {
        console.error(error);
        throw new Error('Failed to fetch user');
      }
    },
    userFavourite: async (_, { latitude, longitude },context) => {
      try {
        const {userId} = context;
                // Ensure that latitude and longitude are valid numbers
                if (isNaN(latitude) || isNaN(longitude)) {
                  throw new Error('Invalid coordinates provided');
                }
        
    // Find the user by some identifier, e.g., user ID, and populate the 'favourite' field.
    const user = await User.findById(userId).populate('favourite');
    
    if (!user) {
      // User not found, return an empty array.
      return [];
    }

    // Extract the favorite restaurants from the user model.
    const favoriteRestaurants = user.favourite;

   
                console.log('Favorite Restaurants:', favoriteRestaurants);
                return favoriteRestaurants;
      } catch (error) {
        console.error(error);
        throw new Error('Failed to fetch favorite restaurants');
      }
    },
    orders: async (_, { offset = 0 },context) => {
      try {

        const { userId } = context;
        if (!userId) {
          throw new Error("User not found");
        }
    
        
        const orders = await Order.find({ user: userId })
        .populate({
          path: "restaurant",
          select: "_id name image slug address location.coordinates",
        })
        .populate({
          path: "deliveryAddress.location",
        })
        .populate({
          path: "address.deliveryAddress",
        })
        .populate({
          path: "items",
          populate: [
            {
              path: "food",
              select: "_id title description",
            },
            {
              path: "variation.options",
              select: "_id title description price",
            },
            {
              path: "addons.options",
            },
          ],
        })
        .populate({
          path: "user",
          select: "_id name phone",
        })
        .populate({
          path: "rider",
          select: "_id name",
        })
        .populate({
          path: "review",
          select: "_id",
        })
        .select(
          "_id orderId paymentMethod paidAmount orderAmount orderStatus deliveryCharges tipping taxationAmount orderDate expectedTime isPickedUp createdAt completionTime cancelledAt assignedAt deliveredAt acceptedAt pickedAt preparationTime"
        )
        .skip(offset)
        .limit(10);
      
        return orders;

      } catch (error) {
        console.error(`Error while fetching orders: ${error.message}`);
        throw new Error(`Failed to fetch orders: ${error.message}`);
      }
    },
    order: async (_, { id }) => {
      try {
        const order = await Order.findById(id)
        .populate({
          path: 'deliveryAddress.location',
        })
        .populate({
          path: 'items.variation.options',
        })
        .populate({
          path: 'items.addons.options',
        })
        .populate('user');

      return order;
      } catch (error) {
        console.error(error);
        throw new Error('Failed to fetch order');
      }
    },
    rider: async (_, { id },{ pubsub }) => {
      try {
        // Fetch the rider by ID (you should replace this with your own logic)
        const rider = await Rider.findById(id);

        if (!rider) {
          throw new Error('Rider not found');
        }

        // After fetching the rider, activate the subscription for this rider's location
        pubsub.publish(`RIDER_LOCATION_${rider._id}`, { subscriptionRiderLocation: rider });

        return rider;
      } catch (error) {
        console.error('Error fetching rider:', error.message);
        throw new Error(`Failed to fetch rider: ${error.message}`);
      }
    },
    //DONE -PROFILE
    restaurant: async (_, { id, slug }) => {
      try {
    // Logic to fetch the restaurant based on 'id' or 'slug'
    const restaurant = await Restaurant.findOne({ $or: [{ _id: id }, { slug }] })
        .populate({
          path: 'categories',
          populate: {
            path: 'foods',
            populate: {
              path: 'variations',
            },
          },
          })
          .populate('options')
          .populate('addons')
        .populate('zone')
        .populate('openingTimes')
        .populate({
          path: 'reviewData.reviews',
          populate: {
            path: 'order.user',
          },
        });

        
        return restaurant;
      }catch (error) {
        console.error(error);
        throw new Error('Failed to fetch restaurant');
      }
    },
    //DONE
    nearByRestaurants: async (_, { longitude, latitude }) => {
  try {
    // Ensure that the latitude and longitude are provided
    if (!latitude || !longitude) {
      throw new Error('Latitude and longitude must be provided.');
    }

    // Find all restaurants
    const allRestaurants = await Restaurant.find();

    // Calculate the maximum distance to consider a restaurant as nearby (in meters)
    const maxDistance = 5000; // Adjust this value as per your requirement
    // Filter nearby restaurants based on the distance from the user's location
    const nearbyRestaurants = [];
    for (const restaurant of allRestaurants) {
      // Fetch the location document using the ObjectId reference in the restaurant document
      const location = await Locat.findById(restaurant.location);

      // Ensure that the location is found and contains the coordinates
      if (!location || !location.coordinates) {
        // Handle cases where the location or coordinates are missing
        continue;
      }

      const restaurantLat = location.coordinates[1];
      const restaurantLong = location.coordinates[0];

      // Calculate the distance between the user's location and the restaurant's location
      const distance = getDistanceFromLatLonInMeters(latitude, longitude, restaurantLat, restaurantLong);
      console.log('Distance in meters:', distance);

      // If the distance is less than or equal to the maximum distance, include the restaurant in nearbyRestaurants
      if (distance <= maxDistance) {
            // Exclude __typename from the restaurant data
        nearbyRestaurants.push(restaurant);
      }
    }
    // Fetch offers for all nearby restaurants in parallel
    const offers = await Promise.all(
      nearbyRestaurants.map(async (restaurant) => {
        return await Offer.find({ restaurants: restaurant._id });
      })
    );

    // Fetch sections for all nearby restaurants in parallel
    const sections = await Promise.all(
      nearbyRestaurants.map(async (restaurant) => {
        return await Section.find({ restaurants: restaurant._id });
      })
    );
// Fetch global options and addons data
    // Fetch sections for all nearby restaurants in parallel
    const options = await Promise.all(
      nearbyRestaurants.map(async (restaurant) => {
        return await Option.find({ restaurants: restaurant._id });
      })
    );
        // Fetch sections for all nearby restaurants in parallel
        const addons = await Promise.all(
          nearbyRestaurants.map(async (restaurant) => {
            return await Addon.find({ restaurants: restaurant._id });
          })
        );
    return {
      offers: offers.flat(), // Convert the array of arrays to a single flat array
      sections: sections.flat(), // Convert the array of arrays to a single flat array
      restaurants: nearbyRestaurants,
      options: options.flat(),
      addons: addons.flat()
    };
    } catch (error) {
    console.error(error);
    throw new Error("Failed to fetch Restaurants");
  }
    },
    taxes: async () => {
      try {
        const taxes = await Tax.find();
        return taxes;
      } catch (error) {
        console.error(error);
        throw new Error('Failed to fetch taxes');
      }
    },
    getPromotion: async (_, { id }) => {
      try {
        const promotion = await Promotion.findById(id);
        return promotion;
      } catch (error) {
        console.error(error);
        throw new Error('Failed to fetch promotion');
      }
    },
    getPromotions: async () => {
      try {
        const promotions = await Promotion.find();
        return promotions;
      } catch (error) {
        console.error(error);
        throw new Error('Failed to fetch promotions');
      }
    },
    getReview: async (_, { id }) => {
      try {
        const review = await Review.findById(id);
        return review;
      } catch (error) {
        console.error(error);
        throw new Error('Failed to fetch review');
      }
    },
    getReviews: async () => {
      try {
        const reviews = await Review.find();
        return reviews;
      } catch (error) {
        console.error(error);
        throw new Error('Failed to fetch reviews');
      }
    },
    getNotification: async (_, { id }) => {
      try {
        const notification = await Notification.findById(id);
        return notification;
      } catch (error) {
        console.error(error);
        throw new Error('Failed to fetch notification');
      }
    },
    getNotifications: async () => {
      try {
        const notifications = await Notification.find();
        return notifications;
      } catch (error) {
        console.error(error);
        throw new Error('Failed to fetch notifications');
      }
    },
    //DONE
    tips: async () => {
      try {
        const tips = await Tipping.find();
        if (tips.length > 0) {
          // Return the first Tip object in the array
          return tips[0];
        } else {
          // Handle the case where no Tip objects were found
          return null; // or throw an error, depending on your requirements
        }
      } catch (error) {
        throw new Error('Failed to fetch tips');
      }
    },
    //DONE
    getZone: async (_, { id }) => {
      // Retrieve and return the Zone with the provided ID
      return Zone.findById(id);
    },
    //DONE
    getZones: async () => {
      // Retrieve and return all Zones
      return Zone.find();
    },
    //DONE
    getOpeningTime: async (_, { id }) => {
      // Retrieve and return the OpeningTime with the provided ID
      return OpeningTime.findById(id);
    },
    //DONE
    getOpeningTimes: async () => {
      // Retrieve and return all OpeningTimes
      return OpeningTime.find();
    },
    //DONE
    getOffer: async (_, { id }) => {
      // Retrieve and return the Offer with the provided ID
      return Offer.findById(id);
    },
    //DONE
    getOffers: async () => {
      // Retrieve and return all Offers
      return Offer.find();
    },
      /****************************************************************************************************************************
                                        WEB QUERIES -END
    *****************************************************************************************************************************/

       /****************************************************************************************************************************
                                        RIDER QUERIES - START
    *****************************************************************************************************************************/

          //DONE
        /*  configuration: async (_, args, context) => {
                
            try { 
              const { userId } = context;
          const configuration = await Configuration.findById(userId);

          if (!configuration) {
            throw new Error('Configuration not found');
          }

          return configuration;
        } catch (error) {
          console.error(error);
          throw new Error('Failed to fetch configuration');
        }
        },*/
        //DONE
        riderOrders: async (_, args, context) => {
          try {
            // Extract the userId from the context
            const { userId } = context;
        
            // Find the rider by userId
            const rider = await Rider.findOne({ userId }).populate('zone');
        
            if (!rider) {
              throw new Error('Rider not found');
            }
            // Find all restaurants in the same zone as the rider
           const restaurantsInZone = await Restaurant.find({ zone: rider.zone });

           // Find orders associated with those restaurants
           const orders = await Order.find({ restaurant: { $in: restaurantsInZone } })
              .populate({
                path: 'restaurant',
                select: '_id name address',
              })
              .populate({
                path: 'deliveryAddress.location',
                select: 'coordinates deliveryAddress label details',
              })
              .populate({
                path: 'items',
                select: '_id title food description quantity',
                populate: {
                  path: 'variation',
                  select: '_id title price',
                }
              })
              .populate({
                path: 'items.addons',
                select: '_id title description quantityMinimum quantityMaximum',
                populate: {
                  path: 'options',
                  select: '_id title price',
                },
              })
              .populate({
                path: 'user',
                select: '_id name phone',
              })
              .populate({
                path: 'rider',
                select: '_id name username',
              });
        
            return orders;
          } catch (error) {
            console.error(error);
            throw new Error('Failed to fetch rider orders');
          }
        },
        
        riderEarnings: async (_, { riderEarningsId, offset }) => {
        try {
          // Logic to fetch rider earnings based on the provided riderEarningsId and offset

          // Example code to fetch earnings from a database
          const earnings = await Earning.find({ riderEarningsId })
            .skip(offset)
            .limit(10);

          return earnings;
        } catch (error) {
          console.error(error);
          throw new Error('Failed to fetch rider earnings');
        }
        },
        riderWithdrawRequests: async (_, { riderWithdrawRequestsId, offset }) => {
        try {
          // Logic to fetch rider withdraw requests based on the provided riderWithdrawRequestsId and offset

          // Example code to fetch withdraw requests from a database
          const withdrawRequests = await WithdrawRequest.find({ riderWithdrawRequestsId })
            .skip(offset)
            .limit(10);

          return withdrawRequests;
        } catch (error) {
          console.error(error);
          throw new Error('Failed to fetch rider withdraw requests');
        }
        },
        chat: async (_, { order }) => {
        try {
          // Logic to fetch chat messages based on the provided order

          // Example code to fetch chat messages from a database
          const messages = await ChatMessage.find({ order });

          return messages;
        } catch (error) {
          console.error(error);
          throw new Error('Failed to fetch chat messages');
        }
        },
        rider: async (_, args, context) => {

        try { 
          const { userId } = context;
            const rider = await Rider.findById(userId).populate({
              path: 'zone',
              populate: {
                path: 'location',
                model: Location,
              },
            });

            if (!rider) {
              throw new Error('Rider not found');
            }

            if (!rider.zone) {
              throw new Error('Rider zone not found');
            }

            const coordinates = rider.zone.location.coordinates;
            rider.coordinates = coordinates;
            
            return rider; 
          
        }catch (error) {
          console.error(error);
          throw new Error('Failed to fetch rider');
        }
        },    
      /****************************************************************************************************************************
                                        RIDER QUERIES - END
    *****************************************************************************************************************************/

      /****************************************************************************************************************************
                                        RESTAURANT QUERIES - START
    *****************************************************************************************************************************/
    restaurantOrders: async () => {
      try {
        const orders = await Order.find();
        return orders;
      } catch (error) {
        console.error(error);
        throw new Error('Failed to fetch restaurant orders');
      }
    },

      /****************************************************************************************************************************
                                        RESTAURANT QUERIES - END
    *****************************************************************************************************************************/
       /****************************************************************************************************************************
                                        APP QUERIES - START
    *****************************************************************************************************************************/

      /****************************************************************************************************************************
                                        APP QUERIES - END
    *****************************************************************************************************************************/
  },
  Mutation: {
        /****************************************************************************************************************************
                                        ADMIN MUTATIONS - START
    *****************************************************************************************************************************/

    updateWithdrawReqStatus: async (_, { id, status }) => {

      // Perform the update and fetch necessary data from your database
      try {
        // Update withdraw request status in your database
        const updatedWithdrawRequest = await WithdrawRequest.findByIdAndUpdate(
          id,
          { status },
          { new: true }
        );

        // Fetch rider data and update wallet amount
        const rider = await Rider.findById(updatedWithdrawRequest.riderId);
        rider.currentWalletAmount -= updatedWithdrawRequest.amount;
        await rider.save();

        return {
          success: true,
          message: 'Withdrawal request updated successfully',
          data: {
            rider: {
              _id: rider._id,
              currentWalletAmount: rider.currentWalletAmount,
            },
            withdrawRequest: {
              _id: updatedWithdrawRequest._id,
              status: updatedWithdrawRequest.status,
            },
          },
        };
      } catch (error) {
        console.error(error);
        throw new Error('An error occurred while updating withdrawal request');
      }
    },
    //NOT DONE
    editOption: async (_, { optionInput }) => {
      try {
        const { optionId, optionData } = optionInput;

        // Update the option using the provided optionId and optionData
        const updatedOption = await Option.findOneAndUpdate(
          { _id: ObjectId(optionId) },
          { $set: optionData },
          { new: true }
        );

        if (!updatedOption) {
          throw new Error('Option not found');
        }

        // Find the restaurant that contains the updated option
        const restaurant = await Restaurant.findOne({ 'options._id': ObjectId(optionId) });

        if (!restaurant) {
          throw new Error('Restaurant not found');
        }

        // Update the options array in the restaurant
        const updatedOptions = restaurant.options.map((opt) =>
          opt._id.toString() === optionId ? updatedOption : opt
        );

        restaurant.options = updatedOptions;
        await restaurant.save();

        return {
          _id: updatedOption._id,
          options: [updatedOption],
        };
      } catch (error) {
        console.error(error);
        throw new Error('Failed to edit option');
      }
    },
    //Done
    createUser: async (_, { name, email, password, address }) => {
      try {
        const oldUser = await Owner.findOne({email});
        if(oldUser){
          throw new ApolloError('A user is already registered with the email' + email);
        }
        const user = await Owner.create({ name, email, password, address });

        return user;
      } catch (error) {
        console.error(error);
        throw new Error('Failed to create user');
      }
    },
    //DONE
    editRestaurant: async (_, { restaurantInput }) => {
      try {
        // Assuming you have a model called Restaurant for the restaurants
        // Update the restaurant based on the provided input
        const updatedRestaurant = await Restaurant.findByIdAndUpdate(
          restaurantInput._id,
          {
            $set: {
              name: restaurantInput.name,
              image: restaurantInput.image,
              slug: restaurantInput.slug,
              address: restaurantInput.address,
              username: restaurantInput.username,
              password: restaurantInput.password,
              location: restaurantInput.location,
              isAvailable: restaurantInput.isAvailable,
              minimumOrder: restaurantInput.minimumOrder,
              tax: restaurantInput.tax,
              salesTax: restaurantInput.salesTax,
              openingTimes: restaurantInput.openingTimes,
            },
          },
          { new: true } // Return the updated restaurant
        );
    
        return updatedRestaurant;
      } catch (error) {
        console.error('Error: Failed to update restaurant', error);
        throw new Error('Failed to update restaurant');
      }
    },
    updateCommission: async (_, { id, commissionRate }) => {
      try {
        // Assuming you have a Commission model or data source
        const commission = await Commission.findByIdAndUpdate(
          id,
          { commissionRate },
          { new: true }
        );
        return commission;
      } catch (error) {
        console.error(error);
        throw new Error('Failed to update commission');
      }
    },
//DONE

    updateTimings: async (_, { id, openingTimes }) => {
        try {
          // Find the restaurant by ID
          const restaurant = await Restaurant.findById(id);

  // Process the openingTimes data
  const updatedOpeningTimes = [];
  for (const { day, times } of openingTimes) {
  const existingOpeningTime = await OpeningTime.findOne({ day,restaurant: id });

 
    if (existingOpeningTime) {
      // If the openingTime for the day already exists, update it
      existingOpeningTime.times = times.map(({ startTime, endTime }) => ({
        startTime: startTime,
        endTime: endTime,
      }));

      await existingOpeningTime.save();
      updatedOpeningTimes.push(existingOpeningTime._id);
    } else {
      // If the openingTime for the day does not exist, create a new document
      const newOpeningTime = new OpeningTime({
        day,
        times: times.map(({ startTime, endTime }) => ({
          startTime: startTime,
          endTime: endTime,
        })),
        restaurant: id, // Associate the opening time with the current restaurant

      });

      const savedOpeningTime = await newOpeningTime.save();
      updatedOpeningTimes.push(savedOpeningTime._id);
    }
  }

  // Update the openingTimes references in the restaurant document
  restaurant.openingTimes = updatedOpeningTimes;
  await restaurant.save();

  // Now, fetch the populated openingTimes to match the GraphQL schema definition
  const populatedRestaurant = await Restaurant.findById(id).populate('openingTimes');
  return populatedRestaurant;

        } catch (error) {
        console.error('Error: Failed to update timings', error);
        throw new Error('Failed to update timings');
      }
    },
    createTipping: async (_, { tippingInput }) => {
      try {
        const tipping = await Tipping.create(tippingInput);
        return tipping;
      } catch (error) {
        console.error(error);
        throw new Error('Failed to create tipping');
      }
    },
    editTipping: async (_, { tippingInput }) => {
      try {
        const { _id, ...updateData } = tippingInput;
        const tipping = await Tipping.findByIdAndUpdate(_id, updateData, {
          new: true,
        });
        return tipping;
      } catch (error) {
        console.error(error);
        throw new Error('Failed to edit tipping');
      }
    },
    //DONE
    createCategory: async (_, { category }) => {
      try {
        // Omit the _id field when creating a new category
        const { _id, ...categoryData } = category;
        
        const createdCategory = await Category.create(categoryData);

        // Find the corresponding restaurant by ID
        const restaurant = await Restaurant.findById(category.restaurant);

        if (!restaurant) {
          throw new Error('Restaurant not found');
        }

        // Push the created category's _id to the categories array in the restaurant
        restaurant.categories.push(createdCategory._id);

        // Save the updated restaurant
        await restaurant.save();

        console.log(createdCategory);
        return {
          _id: createdCategory._id,
          categories: [createdCategory],
        };
      } catch (error) {
        throw new Error(error.message);
      }
    },
    //DONE
    editCategory: async (_, { category }) => {
      try {
        const { _id, title, foods, createdAt, updatedAt } = category;
        const updatedCategory = await Category.findByIdAndUpdate(
          _id,
          { title, foods, createdAt, updatedAt },
          { new: true }
        );
        return {
          _id: updatedCategory._id,
          categories: [updatedCategory],
        };
      } catch (error) {
        throw new Error('Failed to update category');
      }
    },
    //DONE
    deleteCategory: async (_, { id, restaurant }) => {
      try {
       // Find the vendor based on the restaurant ID
       const vendor = await Restaurant.findOne({ _id: restaurant });
       if (!vendor) {
         throw new Error('Vendor not found');
       }

       // Find the category within the vendor's categories array
       const foundCategoryIndex = vendor.categories.findIndex(cat => cat.toString() === id);
       if (foundCategoryIndex === -1) {
         throw new Error('Category not found');
       }

       // Remove the category ID from the vendor's categories array
       vendor.categories.splice(foundCategoryIndex, 1);

       // Remove the category from the database
       await Category.findByIdAndDelete(id);

       await vendor.save();

       return vendor;
      } catch (error) {
        throw new Error('Failed to delete category');
      }
    },

    createOrder: async (_, { customerId, products, totalPrice, deliveryAddress }) => {
      try {
        const order = await Order.create({ customer: customerId, products, totalPrice, deliveryAddress });
        return order;
      } catch (error) {
        console.error(error);
        throw new Error('Failed to create order');
      }
    },

    //DONE
    createFood: async (_, { foodInput }) => {
      try {
        // Destructure the foodInput object to get the necessary data
        const {
          title,
          restaurant,
          description,
          variations,
          image,
          isActive,
          category,
        } = foodInput;


          // Ensure the restaurant and category exist
          const existingRestaurant = await Restaurant.findById(restaurant);
          if (!existingRestaurant) {
            throw new Error('Restaurant not found');
          }

        // Find the corresponding category by ID
        const existingCategory = await Category.findById(category);
        if (!existingCategory) {
          throw new Error('Category not found');
        }

        // Create the variations for the food item
        const variationIds = await Promise.all(
          variations.map(async (variationInput) => {
            const newVariation = await Variation.create(variationInput);
            return newVariation._id;
          })
        );

        // Create the food item and link it to the category and variations
        const newFood = await Food.create({
          title,
          restaurant,
          description,
          variations: variationIds,
          image,
          isActive,
          category: existingCategory._id, // Link to the existing category
        });

        // Populate the categories field with the existingCategory object
        newFood.categories = existingCategory;

        // Update the category's foods array with the newly created food item
        existingCategory.foods.push(newFood._id);
        await existingCategory.save();

                // Update the restaurant's foods array with the newly created food item
        existingRestaurant.foods.push(newFood._id);
        await existingRestaurant.save();
        
        return newFood;
      } catch (error) {
        throw new Error(error.message);
      }
    },
    // Mutation to edit food for a Restaurant
    editFood: async (_, { foodInput }) => {
      try {
        const { _id,image, title, description, isActive,variations } = foodInput;

    // Find the food item by ID
    const existingFood = await Food.findById(_id);

    if (!existingFood) {
      throw new Error('Food not found');
    }

    // Update the food properties
    existingFood.title = title;
    existingFood.description = description;
    existingFood.variations = variations; // Assuming variations is an array of VariationInput objects
    existingFood.image = image;
    existingFood.isActive = isActive;

    // Save the updated food item to the database
    const updatedFood = await existingFood.save();

    return updatedFood;
      }  catch (error) {
        // Handle the error
        console.error(error);
        throw new Error('Failed to edit food');
      }
    },

      // Mutation to delete food for a Restaurant
   deleteFood: async (_, {  id, restaurant, categoryId }) => {
    try {
      // Find the vendor based on the restaurant ID
      const vendor = await Restaurant.findOne({ _id: restaurant });
      if (!vendor) {
        throw new Error('Vendor not found');
      }
  
      // Find the category within the vendor
      const foundCategory = vendor.categories.find(category => category._id.toString() === categoryId);
      if (!foundCategory) {
        throw new Error('Category not found');
      }
  
      // Find the index of the food within the category
      const foundFoodIndex = foundCategory.foods.findIndex(food => food._id.toString() === id);
      if (foundFoodIndex === -1) {
        throw new Error('Food not found');
      }
  
      // Remove the food from the category's foods array
      foundCategory.foods.splice(foundFoodIndex, 1);
  
      // Save the updated vendor to the database
      await vendor.save();
  
      return vendor;
  
        } catch (error) {
          // Handle the error
          console.error(error);
          throw new Error('Failed to delete food');
        }
    },
    createVendor: async (_, { vendorInput }) => {
      try {
        const { email, password } = vendorInput;
        const vendor = await Vendor.create({email, password});
        return vendor;
      } catch (error) {
        console.error(error);
        throw new Error('Failed to create vendor');
      }
    },
    //DONE
    editVendor: async (_, { vendorInput }) => {
      try {
        const { _id, name, email, password, location } = vendorInput;
        // Find the vendor by ID
        const vendor = await Vendor.findById(vendorInput._id);
        
        if (!vendor) {
          throw new Error('Vendor not found');
        }
        
        // Update the vendor's properties
        vendor.name = name;
        vendor.email = email;
        vendor.password = password;
        vendor.location = location;
        
        // Save the updated vendor to the database
        await vendor.save();
        
        return vendor;
      } catch (error) {
        console.error(error);
        throw new Error('Failed to edit vendor');
      }
    },
   // Delete a vendor
    deleteVendor: async (_, { _id }) => {
      try {
        // Find the vendor by ID
        const vendor = await Vendor.findById(_id);
        
        if (!vendor) {
          throw new Error('Vendor not found');
        }
        
        // Delete the vendor from the database
        await vendor.remove();
        
        return vendor;
      } catch (error) {
        console.error(error);
        throw new Error('Failed to delete vendor');
      }
    }, 
    //DONE
    createRestaurant: async (_, { restaurant, owner }) => {
      try {
        // Find the owner user
        const user = await Vendor.findById(owner);
        if (!user) {
          throw new Error('Owner not found');
        }

        // Generate orderPrefix and assign slug
        const orderPrefix = uuidv4().substr(0, 4); // Generate a 4-character prefix
        const slug = restaurant.name.toLowerCase().replace(/\s+/g, '-');


        // Create the restaurant
        const newRestaurant = new Restaurant({
          ...restaurant,
          orderPrefix,
          slug,
          owner,
          email: user.email,
        });

        const savedRestaurant = await newRestaurant.save();

        // Add the restaurant to the owner's restaurants array
        user.restaurants.push(savedRestaurant._id);
        await user.save();

        return savedRestaurant;
      } catch (error) {
        console.error(error);
        throw new Error('Failed to create restaurant');
      }
    },

    // Delete a restaurant
    deleteRestaurant: async (_, { _id }) => {
  try {
    const restaurant = await Restaurant.findById(_id);
    if (!restaurant) {
      throw new Error('Restaurant not found');
    }
    
    restaurant.isActive = !restaurant.isActive; // Toggle isActive field
    
    const updatedRestaurant = await restaurant.save(); // Save the updated restaurant
    
    return updatedRestaurant;
   } catch (error) {
    console.error(error);
    throw new Error('Failed to delete restaurant');
  }
    },

    createPromotion: async (_, { promotionCode, discountPercentage, expirationDate, associatedProducts }) => {
      try {
        const promotion = await Promotion.create({ promotionCode, discountPercentage, expirationDate, associatedProducts });
        return promotion;
      } catch (error) {
        console.error(error);
        throw new Error('Failed to create promotion');
      }
    },
    createReview: async (_, { productId, userId, rating, review }) => {
      try {
        const review = await Review.create({ productId, userId, rating, review });
        return review;
      } catch (error) {
        console.error(error);
        throw new Error('Failed to create review');
      }
    },
    createNotification: async (_, { recipient, message, status }) => {
      try {
        const notification = await Notification.create({ recipient, message, status });
        return notification;
      } catch (error) {
        console.error(error);
        throw new Error('Failed to create notification');
      }
    },
    //DONE
    createOptions: async (_, { optionInput }) => {
      try {
        // Destructure the optionInput object to get the necessary data
        const { restaurant, options } = optionInput;

        // Find the corresponding restaurant by ID
        const existingRestaurant = await Restaurant.findById(restaurant);
        if (!existingRestaurant) {
          throw new Error('Restaurant not found');
        }

        // Create an array to store the newly created options
        const newOptions = [];

        // Loop through the options array and create each option
        for (const optionData of options) {
          const { title, description, price } = optionData;
          const newOption = await Option.create({ title, description, price });
          newOptions.push(newOption);
        }

        // Update the restaurant's options array with the newly created options
        existingRestaurant.options.push(...newOptions.map((option) => option._id));
        await existingRestaurant.save();

        return {
          _id: existingRestaurant._id,
          options: newOptions,
        };
      } catch (error) {
        throw new Error(error.message);
      }
    },
    //Done
    ownerLogin: async (_, { email, password }) => {
      try {
    
         // Find the user with the provided email
    const Owner = db.model('owners'); // Replace 'User' with the name of your Mongoose model
    const user = await Owner.findOne({ email });
        // Handle case when user does not exist or password is incorrect
        if (!user || !bcrypt.compareSync(password, user.password)) {
          throw new ApolloError('Invalid email or password');
        }
    
        // Generate a new token
        const token = jwt.sign({ userId: user._id.toString() }, JwtConfig.JWT_SECRET);
    
        // Update the user's token in the database
        user.token = token;
        await user.save();

        // Retrieve the owner's restaurants
        const restaurants = await Restaurant.find({ userId: user._id }); // Replace 'Restaurant' with the name of your Mongoose model

        // Return the user and token
        return {
          userId: user._id.toString(),
          token,
          name: user.name,
          email: user.email,
          phone: user.phone,
          userType: 'ADMIN',
          restaurants
        };
      } catch (error) {
        console.error(error);
        throw new Error('Failed to login');
      }
    },
    //DONE
    saveEmailConfiguration: async (_, { configurationInput }) => {
      try {
        const { email, emailName, password, enableEmail } = configurationInput;
    const configuration_id = "global_configuration"; // Set the identifier for the global configuration

    // Fetch the global configuration document using the configuration_id
    const existingConfiguration = await Configuration.findOne({ configuration_id });


     if (existingConfiguration) {
       // If the configuration exists, update the fields with the new data
       existingConfiguration.email = email;
       existingConfiguration.emailName = emailName;
       existingConfiguration.password = password;
       existingConfiguration.enableEmail = enableEmail;
       const updatedConfiguration = await existingConfiguration.save();
       console.log('Updated configuration:', updatedConfiguration); // Log the updated configuration
       return updatedConfiguration;
     } else {
       // If the configuration doesn't exist, create a new configuration
       const configuration = new Configuration({
         email,
         emailName,
         password,
         enableEmail,
       });
       const savedConfiguration = await configuration.save();
       console.log('Saved configuration:', savedConfiguration); // Log the saved configuration
       return savedConfiguration;
     }
      } catch (error) {
        throw new Error('Unable to save email configuration.');
      }
    },
    //DONE
    savePaypalConfiguration: async (_, { configurationInput }) => {
      try {
        const { clientId, clientSecret, sandbox } = configurationInput;
        const configuration_id = "global_configuration"; // Set the identifier for the global configuration
    
        // Fetch the global configuration document using the configuration_id
        const existingConfiguration = await Configuration.findOne({ configuration_id });
    
        if (existingConfiguration) {
          // If the configuration exists, update the fields with the new data
          existingConfiguration.clientId = clientId;
          existingConfiguration.clientSecret = clientSecret;
          existingConfiguration.sandbox = sandbox;
          const updatedConfiguration = await existingConfiguration.save();
          console.log('Updated Paypal configuration:', updatedConfiguration); // Log the updated configuration
          return updatedConfiguration;
        } else {
          // If the configuration doesn't exist, create a new configuration
          const configuration = new Configuration({
            configuration_id,
            clientId,
            clientSecret,
            sandbox,
          });
          const savedConfiguration = await configuration.save();
          console.log('Saved Paypal configuration:', savedConfiguration); // Log the saved configuration
          return savedConfiguration;
        }
      } catch (error) {
        throw new Error('Unable to save Paypal configuration.');
      }
    },
    //DONE
    saveStripeConfiguration: async (_, { configurationInput }) => {
      try {
        const { publishableKey, secretKey } = configurationInput;
        const configuration_id = "global_configuration"; // Set the identifier for the global configuration
    
        // Fetch the global configuration document using the configuration_id
        const existingConfiguration = await Configuration.findOne({ configuration_id });
    
        if (existingConfiguration) {
          // If the configuration exists, update the fields with the new data
          existingConfiguration.publishableKey = publishableKey;
          existingConfiguration.secretKey = secretKey;
          const updatedConfiguration = await existingConfiguration.save();
          console.log('Updated Stripe configuration:', updatedConfiguration); // Log the updated configuration
          return updatedConfiguration;
        } else {
          // If the configuration doesn't exist, create a new configuration
          const configuration = new Configuration({
            configuration_id,
            publishableKey,
            secretKey,
          });
          const savedConfiguration = await configuration.save();
          console.log('Saved Stripe configuration:', savedConfiguration); // Log the saved configuration
          return savedConfiguration;
        }
      } catch (error) {
        throw new Error('Unable to save Stripe configuration.');
      }
    },
    //DONE
    saveCurrencyConfiguration: async (_, { configurationInput }) => {
      try {
        const { currency, currencySymbol } = configurationInput;
        const configuration_id = "global_configuration"; // Set the identifier for the global configuration
    
        // Fetch the global configuration document using the configuration_id
        const existingConfiguration = await Configuration.findOne({ configuration_id });
    
        if (existingConfiguration) {
          // If the configuration exists, update the fields with the new data
          existingConfiguration.currency = currency;
          existingConfiguration.currencySymbol = currencySymbol;
          const updatedConfiguration = await existingConfiguration.save();
          console.log('Updated Currency configuration:', updatedConfiguration); // Log the updated configuration
          return updatedConfiguration;
        } else {
          // If the configuration doesn't exist, create a new configuration
          const configuration = new Configuration({
            configuration_id,
            currency,
            currencySymbol,
          });
          const savedConfiguration = await configuration.save();
          console.log('Saved Currency configuration:', savedConfiguration); // Log the saved configuration
          return savedConfiguration;
        }
      } catch (error) {
        throw new Error('Unable to save Currency configuration.');
      }
    },
    //DONE
    saveDeliveryRateConfiguration: async (_, { deliveryRate }) => {
      try {
        const configuration_id = "global_configuration"; // Set the identifier for the global configuration
    
        // Fetch the global configuration document using the configuration_id
        const existingConfiguration = await Configuration.findOne({ configuration_id });
    
        if (existingConfiguration) {
          // If the configuration exists, update the fields with the new data
          existingConfiguration.deliveryRate = deliveryRate;
          const updatedConfiguration = await existingConfiguration.save();
          console.log('Updated DeliveryRate configuration:', updatedConfiguration); // Log the updated configuration
          return updatedConfiguration;
        } else {
          // If the configuration doesn't exist, create a new configuration
          const configuration = new Configuration({
            configuration_id,
            deliveryRate,
          });
          const savedConfiguration = await configuration.save();
          console.log('Saved DeliveryRate configuration:', savedConfiguration); // Log the saved configuration
          return savedConfiguration;
        }
      } catch (error) {
        throw new Error('Unable to save delivery rate configuration.');
      }
    },
  //Done
  logout: async (_, __, { user }) => {
    try {
      // Remove the token from the user object and save the user
      user.token = undefined;
      await user.save();

      return true; // Indicate successful logout
    } catch (error) {
      console.error(error);
      throw new Error('Failed to logout');
    }
  },
  //Done
  emailExist: async (_, { email }) => {
    try {
      const user = await Owner.findOne({ email });
      return { id: user ? user.id : null }; // Return the user's ID or null if not found
    } catch (error) {
      console.error(error);
      throw new Error('Failed to check email existence');
    }
  },
  
  //DONE
  createSection: async (_, { section }) => {
    try {
      // Create a new section with the provided details
      const newSection = await Section.create({
        name: section.name,
        enabled: section.enabled,
        restaurants: section.restaurants, // Assign the restaurant IDs directly to the new section
      });
  
      // Fetch the details of the restaurants using their IDs
      const restaurantDetails = await Restaurant.find({
        _id: { $in: section.restaurants },
      }).select('_id name');
  
      // Map the restaurant details to the desired format
      const populatedRestaurants = restaurantDetails.map((restaurant) => ({
        _id: restaurant._id.toString(),
        name: restaurant.name,
        __typename: 'SectionRestaurant',
      }));
  
      // Update the restaurants array in the new section with the populated details
      newSection.restaurants = populatedRestaurants;
  
      // Save the changes to the section
      await newSection.save();
  
      return newSection;
    } catch (error) {
      // Handle any errors
      throw new Error(`Failed to create section: ${error.message}`);
    }
  },
  //DONE
  editSection: async (_, { section }) => {
    try {
      // Find the existing section to be edited
      const existingSection = await Section.findById(section._id);

      if (!existingSection) {
        throw new Error('Section not found');
      }

      // Update the section fields with the new values
      existingSection.name = section.name;
      existingSection.enabled = section.enabled;
      existingSection.restaurants = section.restaurants;

      // Save the updated section
      const updatedSection = await existingSection.save();

      return updatedSection;
    } catch (error) {
      throw new Error(`Failed to edit section: ${error.message}`);
    }
  },
  //DONE
  deleteSection: async (_, { id }) => {
    try {
      // Find the section by ID and delete it
      const deletedSection = await Section.findByIdAndDelete(id);
      if (!deletedSection) {
        throw new Error('Section not found');
      }
      // Delete the section's reference from associated restaurants
      await Restaurant.updateMany(
        { sections: id },
        { $pull: { sections: id } }
      );
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  },
    //Done
  phoneExist: async (_, { phone }) => {
      try {
        const user = await Owner.findOne({ phone });
        return { id: user ? user.id : ''}; // Return the user's ID or null if not found
      } catch (error) {
        console.error(error);
        throw new Error('Failed to check phone existence');
      }
    },
  updateUser: async (_, { name, phoneIsVerified, emailIsVerified }, { user }) => {
    try {
      if (!user) {
        throw new Error('User not authenticated');
      }
  
      const updatedUser = await Owner.findByIdAndUpdate(
        user.id,
        { name, phoneIsVerified, emailIsVerified },
        { new: true }
      );
  
      if (!updatedUser) {
        throw new Error('User not found');
      }
  
      return updatedUser;
    } catch (error) {
      console.error(error);
      throw new Error('Failed to update user');
    }
  },
  sendOtpToPhoneNumber: async (_, { phone, otp }) => {
    try {
      // Perform your logic to send the OTP to the provided phone number
      // This could involve using an SMS service or any other third-party service
  
      // For demonstration purposes, let's assume we're logging the OTP
      console.log(`OTP sent to ${phone}: ${otp}`);
  
      // Return the updated user object
      return {
        phone,
        otp,
      };
    } catch (error) {
      console.error(error);
      throw new Error('Failed to send OTP to phone number');
    }
  },
  
  sendOtpToEmail: async (_, { email, otp }) => {
    try {
      // Perform your logic to send the OTP to the provided email
      // This could involve using an email service or any other third-party service
  
      // For demonstration purposes, let's assume we're logging the OTP
      console.log(`OTP sent to ${email}: ${otp}`);
  
   // Return the updated user object
      return {
        email,
        otp,
      };
    } catch (error) {
      console.error(error);
      throw new Error('Failed to send OTP to email');
    }
  },  
  //DONE
  createAddons: async (_, { addonInput }) => {
    try {
      const { restaurant, addons } = addonInput;

      // Find the restaurant by its ID
      const foundRestaurant = await Restaurant.findById(restaurant);
  
      if (!foundRestaurant) {
        throw new Error('Restaurant not found');
      }
  
      const createdAddons = [];
  
      // Loop through each addon in the addons array
      for (const addonItem of addons) {
        // Create a new Addon document
        const newAddon = new Addon({
          title: addonItem.title,
          description: addonItem.description,
          quantityMinimum: addonItem.quantityMinimum,
          quantityMaximum: addonItem.quantityMaximum,
          options: addonItem.options,
        });
  
        const savedAddon = await newAddon.save();
  
        // Fetch the detailed information of the selected options
        const selectedOptions = await Option.find({
          _id: { $in: addonItem.options },
        });
  
        // Create an array to store the IDs of the selected options
        const selectedOptionIds = selectedOptions.map((option) => option._id);
  
        // Add the new addon's details to the restaurant's addons array
        foundRestaurant.addons.push({
          _id: savedAddon._id,
          options: selectedOptionIds,
          title: savedAddon.title,
          description: savedAddon.description,
          quantityMinimum: savedAddon.quantityMinimum,
          quantityMaximum: savedAddon.quantityMaximum,
        });
  
        createdAddons.push(savedAddon);
      }
  
      // Save the restaurant to update the addons field
      await foundRestaurant.save();
  
      return {
        _id: foundRestaurant._id,
        addons: createdAddons,
      };
      } catch (error) {
      throw new Error('Failed to create addon');
    }
  },

  //DONE
  createZone: async (_, { zone }) => {
    try {
      const newZone = new Zone({
        title: zone.title,
        description: zone.description,
        isActive: true,
      });

      // Process the location coordinates
      const processedLocationCoordinates = zone.coordinates.map(layer =>
        layer.map(point => [point[0], point[1]])
      );

      // Create a new Location document
      const location = new Location({
        type: 'Point', // Set the appropriate type for your use case
        coordinates: processedLocationCoordinates,
      });

      newZone.location = await location.save();

    console.log('Creating Zone document...');
    const savedZone = await Zone.create(newZone);
    console.log('Zone document created:', savedZone);

    return savedZone
    }  catch (error) {
      console.error('Failed to create zone:', error);
      throw new Error('Failed to create zone');
    }
  },
  //Done
  editZone: async (_, { zone }) => {

    try {
      
        // Find the zone by ID
        const existingZone = await Zone.findById(zone._id);

        // Check if the zone exists
        if (!existingZone) {
          throw new Error('Zone not found');
        }

        // Update the zone properties
        existingZone.title = zone.title;
        existingZone.description = zone.description;
       // existingZone.isActive = zone.isActive;

        // Process the location coordinates if provided
        if (zone.coordinates) {
          const processedLocationCoordinates = zone.coordinates.map(layer =>
            layer.map(point => [point[0], point[1]])
          );

          // Update the existing location with the new coordinates
          existingZone.location.coordinates = processedLocationCoordinates;
        }

        // Save the updated zone
        const updatedZone = await existingZone.save();

        return updatedZone;
      } catch (error) {
        console.error(error);
        throw new Error('Failed to edit zone');
      }
  },
  deleteZone: async (_, { id }) => {
    try {
      // Find the zone by ID
      const deletedZone = await Zone.findByIdAndDelete(id);
  
      if (!deletedZone) {
        throw new Error('Zone not found');
      }
  
      return deletedZone;
    } catch (error) {
      console.error('Failed to delete zone:', error);
      throw new Error('Failed to delete zone');
    }
  },
  //DONE
  createRider: async (_, { riderInput }) => {
    try {
      console.log('Creating Rider document...');
      // Remove the _id field from the riderInput object
      const { _id, ...riderData } = riderInput;
  
 // Generate a new token
 const token = jwt.sign({ userId: _id }, JwtConfig.JWT_SECRET, { expiresIn: '2h' });

 // Add the token and userId to the riderData object
 riderData.token = token;
 riderData.userId = _id;

      // Create the Rider document
      const newRider = new Rider(riderData);
  
      const savedRider = await newRider.save();
       // Assign the correct userId value
    savedRider.userId = savedRider._id.toString();

        // Update the rider document in the database with the correct userId
        await Rider.findByIdAndUpdate(savedRider._id, { userId: savedRider.userId });

      console.log('Rider document created:', savedRider);
      return savedRider;
    } catch (error) {
      console.error(error);
      throw new Error('Failed to create rider');
    }
  },
  //DONE
  editRider: async (_, { riderInput }) => {
    try {
      // Find the rider by the provided _id
      const rider = await Rider.findById(riderInput._id);
      if (!rider) {
        throw new Error('Rider not found');
      }
  
      // Update rider details
      rider.name = riderInput.name;
      rider.username = riderInput.username;
      rider.phone = riderInput.phone;
  
      // If a new zone ID is provided, update the rider's zone
      if (riderInput.zone) {
        rider.zone = riderInput.zone;
      }
  
      // Save the updated rider
      const updatedRider = await rider.save();
  
      // Return the updated rider
      return updatedRider;
    } catch (error) {
      console.error(error);
      throw new Error('Failed to edit rider');
    }
  },
  //DONE
  deleteRider: async (_, { id }) => {
    try {
      const deletedRider = await Rider.findByIdAndDelete(id);
      if (!deletedRider) {
        throw new Error('Rider not found');
      }
      return deletedRider;
    } catch (error) {
      console.error(error);
      throw new Error('Failed to delete rider');
    }
  }, 

  //DONE
  resetPassword: async (_, { password, token }) => {
    try {
      // Check if the token is valid and not expired
      const user = await User.findOne({ resetToken: token, resetTokenExpiration: { $gt: Date.now() } });
      if (!user) {
        throw new Error('Invalid or expired reset token');
      }

      // Generate a hash of the new password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Update the user's password with the new password
      user.password = hashedPassword;
      user.resetToken = null;
      user.resetTokenExpiration = null;
      await user.save();

      // Return a success message or result
      return { result: 'Password reset successful' };
    } catch (error) {
      console.error(error);
      throw new Error('Failed to reset password');
    }
  },
  //DONE
  uploadToken: async (_, { id, pushToken }) => {
    try {
      // Find the user by the provided ID
      const user = await User.findById(id);
      if (!user) {
        throw new Error('User not found');
      }

      // Update the user's push token
      user.pushToken = pushToken;
      await user.save();

      // Return the updated user
      return user;
    } catch (error) {
      console.error(error);
      throw new Error('Failed to upload push token');
    }
  },
//DONE
  updateOrderStatus: async (_, { id, status, reason }) => {
    try {
      // Find the order by the provided ID
      const order = await Order.findById(id);
      if (!order) {
        throw new Error('Order not found');
      }

      // Update the order's status and reason
      order.status = status;
      order.reason = reason || null;
      await order.save();

      // Return the updated order
      return order;
    } catch (error) {
      console.error(error);
      throw new Error('Failed to update order status');
    }
  },
  //DONE
  updateStatus: async (_, { id, orderStatus }) => {
    try {
      // Find the order by the provided ID
      const order = await Order.findById(id);
      if (!order) {
        throw new Error('Order not found');
      }

          // Notify subscribers about the status change
    pubsub.publish('ORDER_STATUS_CHANGED', {
      subscriptionOrder: {
        _id: order._id,
        orderStatus: order.orderStatus,
        rider: order.rider,
      },
    });

      // Update the order's status
      order.orderStatus = orderStatus;
      await order.save();

      // Return the updated order
      return order;
    } catch (error) {
      console.error(error);
      throw new Error('Failed to update status');
    }
  },
  //DONE
  toggleAvailability: async (_, { id },context) => {
    try {
            if (!id) {
        throw new Error('ID parameter is required');
      }
  
      const { userId} = context.userId;
      if (userId) {
        // Toggle restaurant availability
        const restaurant = await Restaurant.findById(userId);
        if (!restaurant) {
          throw new Error('Restaurant not found');
        }
        restaurant.isAvailable = !restaurant.isAvailable;
        await restaurant.save();
        return restaurant;
      } else if (id) {
        // Toggle rider availability
        const rider = await Rider.findById(id);
        if (!rider) {
          throw new Error('Rider not found');
        }
        rider.available = !rider.available;
        await rider.save();
        return rider;
      } else {
        throw new Error('Invalid context');
      }
    } catch (error) {
      console.error(error);
      throw new Error('Failed to toggle rider availability');
    }
  },
  /*toggleAvailability: async (_, { id }, context) => {
    try {
      if (!id) {
        throw new Error('ID parameter is required');
      }
  
      const { restaurantId, _id } = context;
  
      if (restaurantId) {
        // Toggle restaurant availability
        const restaurant = await Restaurant.findById(restaurantId);
        if (!restaurant) {
          throw new Error('Restaurant not found');
        }
        restaurant.isAvailable = !restaurant.isAvailable;
        await restaurant.save();
        return restaurant;
      } else if (_id) {
        // Toggle rider availability
        const rider = await Rider.findById(id);
        if (!rider) {
          throw new Error('Rider not found');
        }
        rider.available = !rider.available;
        await rider.save();
        return rider;
      } else {
        throw new Error('Invalid context');
      }
    } catch (error) {
      console.error(error);
      throw new Error('Failed to toggle availability');
    }
  },
  */
  //DONE
  assignRider: async (_, { _id, riderId }) => {
    try {
    // Find the order by the provided ID
    const order = await Order.findById(_id);
    if (!order) {
      throw new Error('Order not found');
    }

    // Find the rider by the provided rider ID
    const rider = await Rider.findById(riderId);
    if (!rider) {
      throw new Error('Rider not found');
    }

    // Check if the rider is available (you can add this check)
    if (!rider.available) {
      throw new Error('Rider is not available');
    }

      // After successfully assigning the rider, trigger the subscription
      pubsub.publish('ASSIGN_RIDER', {
        subscriptionAssignRider: {
          order, // Include the updated order data
          origin: 'new' // Indicate that a new assignment occurred
        }
      });
  
    // Assign the rider to the order
    order.rider = rider;
    order.orderStatus = 'ASSIGNED'; // or the desired status
           // Calculate the preparation time in minutes from the current time
      /*  const currentTime = new Date();
        const preparationTimeInMinutes = parseInt(time, 10); // Parse the time as an integer
        if (!isNaN(preparationTimeInMinutes)) {
          currentTime.setMinutes(currentTime.getMinutes() + preparationTimeInMinutes);
          order.assignedAt = currentTime;
        } else {
          throw new Error('Invalid preparation time');
        }*/
        order.assignedAt = new Date();

    await order.save();


        // After successfully assigning the rider, trigger the subscription
        pubsub.publish(SUBSCRIPTION_ASSIGN_RIDER, {
          subscriptionAssignRider: {
            order, // Include the updated order data
            origin: 'new' // Indicate that a new assignment occurred
          }
        });
    

      // Return the updated order
      return order;
    } catch (error) {
      console.error(error);
      throw new Error('Failed to assign rider to the order');
    }
  },
  //DONE
  updatePaymentStatus: async (_, { id, status }) => {
    try {
      // Find the payment by the provided ID
      const payment = await Payment.findById(id);
      if (!payment) {
        throw new Error('Payment not found');
      }

      // Update the payment status
      payment.paymentStatus = status;
      await payment.save();

      // Return the updated payment
      return payment;
    } catch (error) {
      console.error(error);
      throw new Error('Failed to update payment status');
    }
  },
  //DONE - The Old
 /* updateDeliveryBoundsAndLocation: async (_, { id, bounds, location }) => {
    try {

    // Update the delivery bounds
    const updatedRestaurant = await Restaurant.findByIdAndUpdate(
      id,
      { "deliveryBounds.coordinates": bounds },
      { new: true }
    );

    if (!updatedRestaurant) {
      return {
        success: false,
        message: 'Restaurant not found.',
        data: null
      };
    }

    // Fetch an existing restaurant to get the zone value
const existingRestaurant = await Restaurant.findById(id);

if (!existingRestaurant) {
  return {
    success: false,
    message: 'Restaurant not found.',
    data: null
  };
}

   // Fetch the existing location or create a new one
   let existingLocation = null;

   if (updatedRestaurant.location) {
     existingLocation = await Locat.findById(updatedRestaurant.location.toString());
   }

    // Convert the location coordinates to a nested array of numbers
    const coordinates = [location.longitude, location.latitude];
    // Declare the variable to hold the new or updated location
  
        // If the location exists, update its coordinates
        if (existingLocation) {
          existingLocation.coordinates = coordinates;
          await existingLocation.save();
        } else {
          // Create a new location
          const newLocation = new Locat({
            type: 'Point',
            coordinates: coordinates
          });
          // Save the new location
          const savedLocation = await newLocation.save();
          // Update the restaurant's location
          updatedRestaurant.location = savedLocation._id;
          await updatedRestaurant.save();
        }
  
      return {
        success: true,
        message: 'Delivery bounds and location updated successfully.',
        data: {
          _id: updatedRestaurant._id,
          deliveryBounds: updatedRestaurant.deliveryBounds,
          location: updatedRestaurant.location,
      }
      };
    }  catch (error) {
      console.error(error);
      throw new Error('Failed to update delivery bounds and location');
    }
  },*/  //DONE
  updateDeliveryBoundsAndLocation: async (_, { id, bounds, location }) => {
    try {
      // Update the delivery bounds
      const updatedRestaurant = await Restaurant.findByIdAndUpdate(
        id,
        { 'deliveryBounds.coordinates': bounds },
        { new: true }
      );
  
      if (!updatedRestaurant) {
        return {
          success: false,
          message: 'Restaurant not found.',
          data: null,
        };
      }
  
      // Fetch an existing restaurant to get the zone value
      const existingRestaurant = await Restaurant.findById(id);
  
      if (!existingRestaurant) {
        return {
          success: false,
          message: 'Restaurant not found.',
          data: null,
        };
      }
  
      // Fetch the existing location or create a new one
      let existingLocation = null;
  
      if (updatedRestaurant.location) {
        existingLocation = await Locat.findById(updatedRestaurant.location.toString());
      }
  
      // Convert the location coordinates to a nested array of numbers
      const coordinates = [location.longitude, location.latitude];
  
      // Declare the variable to hold the new or updated location
      let updatedLocation;
  
      // If the location exists, update its coordinates
      if (existingLocation) {
        existingLocation.coordinates = coordinates;
        updatedLocation = await existingLocation.save();
      } else {
        // Create a new location
        const newLocation = new Locat({
          type: 'Point',
          coordinates: coordinates,
        });
        // Save the new location
        updatedLocation = await newLocation.save();
      }
      
    // Call the function to assign the zone based on coordinates
    await assignZoneToRestaurant(updatedRestaurant._id, coordinates);

  
      // Update the restaurant's location and zone
      updatedRestaurant.location = updatedLocation._id;
      await updatedRestaurant.save();
  
      return {
        success: true,
        message: 'Delivery bounds, location, and zone updated successfully.',
        data: {
          _id: updatedRestaurant._id,
          deliveryBounds: updatedRestaurant.deliveryBounds,
          location: updatedLocation,
          zone: updatedRestaurant.zone,
        },
      };
    } catch (error) {
      console.error(error);
      throw new Error('Failed to update delivery bounds, location, and zone');
    }
  },
  
  createOffer: async (_, { offer }) => {
    try {
      // Extract data from the offer input
      const { name, tag, restaurants } = offer;

      // Create an array to hold the restaurant models
      const restaurantModels = [];

      // Iterate over the restaurant inputs and create restaurant models
      for (const restaurantInput of restaurants) {
        const { id, name, address } = restaurantInput;
        const restaurant = new Vendor({ id, name, address });
        restaurantModels.push(restaurant);
      }

      // Create the offer with the provided data
      const createdOffer = await Offer.create({ name, tag, restaurants: restaurantModels });

      // Return the created offer
      return createdOffer;
    } catch (error) {
      console.error(error);
      throw new Error('Failed to create offer');
    }
  },
  //DONE
  editOffer: async (_, { offer }) => {
    try {
      // Extract data from the offer input
      const { id, name, tag, restaurants } = offer;

      // Find the offer by the provided ID
      const existingOffer = await Offer.findById(id);
      if (!existingOffer) {
        throw new Error('Offer not found');
      }

      // Update the offer with the provided data
      existingOffer.name = name;
      existingOffer.tag = tag;

      // Create an array to hold the restaurant models
      const restaurantModels = [];

      // Iterate over the restaurant inputs and create restaurant models
      for (const restaurantInput of restaurants) {
        const { id, name, address } = restaurantInput;
        const restaurant = new Restaurant({ id, name, address });
        restaurantModels.push(restaurant);
      }

      existingOffer.restaurants = restaurantModels;

      // Save the updated offer
      await existingOffer.save();

      // Return the updated offer
      return existingOffer;
    } catch (error) {
      console.error(error);
      throw new Error('Failed to edit offer');
    }
  },
  //DONE
  deleteOffer: async (_, { id }) => {
    try {
      // Find the offer by the provided ID
      const deletedOffer = await Offer.findByIdAndDelete(id);
      if (!deletedOffer) {
        throw new Error('Offer not found');
      }

      // Return a success message
      return 'Offer deleted successfully';
    } catch (error) {
      console.error(error);
      throw new Error('Failed to delete offer');
    }
  },
  //DONE
  createCoupon: async (_, { couponInput }) => {
    try {
      const newCoupon = await Coupon.create(couponInput);
      return newCoupon;
    } catch (error) {
      throw new Error('Failed to create coupon');
    }
    
  },
  //DONE
  editCoupon: async (_, { couponInput }) => {
    try {
      // Find the coupon by ID
      const coupon = await Coupon.findById(couponInput._id);

      if (!coupon) {
        throw new Error('Coupon not found');
      }

      // Update coupon fields
      coupon.title = couponInput.title;
      coupon.discount = couponInput.discount;
      coupon.enabled = couponInput.enabled;

      // Save the updated coupon
      const updatedCoupon = await coupon.save();

      return updatedCoupon;
    } catch (error) {
      console.error('Error editing coupon:', error);
      throw new Error('Failed to edit coupon');
    }
  },
  //DONE
  deleteCoupon: async (_, { id }) => {
    try {
      const deletedCoupon = await Coupon.findByIdAndDelete(id);
      if (!deletedCoupon) {
        throw new Error('Coupon not found');
      }
      return 'Coupon deleted successfully';
    } catch (error) {
      console.error(error);
      throw new Error('Failed to delete coupon');
    }
  },
          /****************************************************************************************************************************
                                        ADMIN MUTATIONS - END
    *****************************************************************************************************************************/

        /****************************************************************************************************************************
                                        WEB MUTATIONS - START
    *****************************************************************************************************************************/
   updateNotificationStatus : async (_, { offerNotification, orderNotification }, context) => {
      try {
        // Assuming you have a User model representing the user's notification settings
        const user = await User.findById(context.userId);
    
        if (!user) {
          throw new Error("User not found");
        }
    
        // Update the notification settings
        user.isOrderNotification = orderNotification;
        user.isOfferNotification = offerNotification;
    
        await user.save();
    
        return {
          _id: user._id,
          notificationToken: user.notificationToken,
          isOrderNotification: user.isOrderNotification,
          isOfferNotification: user.isOfferNotification,
        };
      } catch (error) {
        console.error("Error: Failed to update notification status", error);
        throw new Error("Failed to update notification status");
      }
    },
    //Not Done
    sendOtpToEmail: async (_, { email, otp }) => {
      try {
        // Create a Nodemailer transporter (you need to configure this)
        const transporter = nodemailer.createTransport({
          service: 'YourEmailServiceProvider', // e.g., 'gmail', 'hotmail', etc.
          auth: {
            user: 'your-email@example.com',
            pass: 'your-email-password',
          },
        });

        // Define the email message
        const mailOptions = {
          from: 'noreply@kizuri.co.za',
          to: email,
          subject: 'OTP Verification',
          text: `Your OTP code is: ${otp}`,
        };

        // Send the email
        await transporter.sendMail(mailOptions);

        // Return a success message
        return {
          result: 'OTP sent successfully',
        };
      } catch (error) {
        console.error('Error sending OTP:', error);
        throw new Error('Failed to send OTP');
      }
    },

    sendOtpToPhoneNumber : async (_, { phone, otp }, {user}) => {
      const accountSid = process.env.TWILIO_ACCOUNTSID;
      const authToken = process.env.TWILIO_AUTHTOKEN;

      const client = new twilio(accountSid, authToken);
      try {
        // Generate an OTP if it's not provided
        if (!otp) {
          throw new Error('OTP is required');
        }
    
        // Send the OTP via SMS using Twilio
        const message = await client.messages.create({
          body: `Your Kizuri OTP is: ${otp}`,
          from: '+16562184338', // Trial Twilio phone number
          to: phone, // The recipient's phone number
        });
    
        console.log(`OTP sent with SID: ${message.sid}`);
    
        // Return a success response
        return { success: true, message: 'OTP sent successfully' };
      } catch (error) {
        console.error(`Error sending OTP: ${error.message}`);
    
        // Return an error response
        return { success: false, message: 'Failed to send OTP' };
      }
    },

    sendChatMessage: async (_, { orderId, messageInput }, context) => {
      try {
        // Assuming you have a ChatMessage and Order model
        const order = await Order.findById(orderId);
        if (!order) {
          throw new Error("Order not found");
        }
    
        const chatMessage = {
          message: messageInput.message,
          user: context.userId, // Assuming you have the authenticated user in context
          createdAt: new Date(),
        };
    
        order.chatMessages.push(chatMessage);
        await order.save();
        // Publish the chat message
        pubsub.publish('CHAT_MESSAGE_SENT', {
          subscriptionNewMessage: {
            orderId,
            message: chatMessage,
          },
        });
        return {
          success: true,
          message: "Message sent successfully",
          data: chatMessage,
        };
      } catch (error) {
        console.error("Error: Failed to send chat message", error);
        throw new Error("Failed to send chat message");
      }
    },
    resetPassword : async (_, { password, email }) => {
      try {
        // Assuming you have a User model representing the user accounts
        const user = await User.findOne({ email });
    
        if (!user) {
          throw new Error("User not found");
        }
    
        // Update the user's password
        user.password = password;
        await user.save();
    
        return {
          result: "Password reset successful",
        };
      } catch (error) {
        console.error("Error: Failed to reset password", error);
        throw new Error("Failed to reset password");
      }
    },
    //NOT DONE
    placeOrder : async (_, args, context) => {
      try {
          // Extract the necessary data from the arguments
    const {
      restaurant,
      orderInput,
      paymentMethod,
      couponCode,
      tipping,
      taxationAmount,
      address,
      isPickedUp,
      deliveryCharges,
    } = args;

    // Get the user ID from the context (assuming it's already available in the context)
    const { userId } = context;

    // Ensure that the user is authenticated (you can implement this check as needed)
    if (!userId) {
      throw new Error('User not authenticated');
    }
    // Convert latitude and longitude to floats
    const latitude = parseFloat(address.latitude);
    const longitude = parseFloat(address.longitude);

    // Check if the conversion was successful
    if (isNaN(latitude) || isNaN(longitude)) {
      throw new Error('Invalid latitude or longitude values');
    }

    // Calculate the order total
    let orderTotal = 0;
    for (const orderItem of orderInput) {
      const quantity = orderItem.quantity;
      const variationId = orderItem.variation;
    
      // Fetch the variation based on the provided variationId
      const variation = await Variation.findById(variationId);
    
      if (!variation) {
        throw new Error(`Variation with ID ${variationId} not found`);
      }
    
      // Access the price property from the fetched variation
      const itemPrice = variation.price;
    
      orderTotal += itemPrice * quantity;
      console.log('Item:', orderItem);
    }

      // Log the intermediate values
      console.log('Subtotal:', orderTotal);
    // Handle pickup orders
    if (isPickedUp) {
      // Set delivery charges to 0 for pickup orders
      deliveryCharges = 0;

      // Define a default pickup location (restaurant's address)
      const defaultPickupLocation = {
        latitude: restaurant.location.coordinates[1],
        longitude: restaurant.location.coordinates[0],
        deliveryAddress: restaurant.address,
        details: 'Pickup at restaurant',
        label: 'Restaurant Pickup',
      };

      // Use the default pickup location as the delivery address
      address = defaultPickupLocation;

     // Implement payment processing logic here
     let paymentStatus = 'PENDING';
     if (paymentMethod === 'CREDIT_CARD') {
       // Implement credit card payment processing logic here
       // Example: Call a payment gateway API
       // if successful, set paymentStatus to 'PAID'
       // else, keep it as 'PENDING' or 'FAILED'
     } else if (paymentMethod === 'PAYPAL') {
       // Implement PayPal payment processing logic here
       // Example: Make an API request to PayPal
       // if successful, set paymentStatus to 'PAID'
       // else, keep it as 'PENDING' or 'FAILED'
     } else if (paymentMethod === 'COD') {
       // Cash on Delivery (COD) does not require online payment processing
       // Set paymentStatus to 'PAID' immediately
       paymentStatus = 'PAID';
     }
    } else {
      // Calculate delivery charges, tipping, and taxation for delivery orders
      orderTotal += deliveryCharges + tipping + taxationAmount;
    }
      // Add delivery charges, tipping, and taxation
     // orderTotal += deliveryCharges + tipping + taxationAmount;

      // Log the final orderTotal
      console.log('Final Order Total:', orderTotal);
    // Ensure that orderTotal is a valid number
    if (isNaN(orderTotal)) {
      throw new Error('Invalid order total');
    }

    // Convert orderTotal to a number
    const orderAmount = parseFloat(orderTotal);

    if (isNaN(latitude) || isNaN(longitude) || !restaurant) {
      throw new Error('Invalid restaurant or location coordinates');
    }

        // Populate the `deliveryAddress` field
    const deliveryAddress = {
      location: {
        type: 'Point', // Assuming you're using GeoJSON Point
        coordinates: [longitude, latitude], // Make sure these are valid coordinates
      },
      deliveryAddress: address.deliveryAddress, // Assuming you have a 'deliveryAddress' property in the input
      details: address.details,
      label: address.label
    };

      // Populate the `items` field
      const items = await Promise.all(
        orderInput.map(async (item) => {
          const foodId = item.food;
          const quantity = item.quantity;

          // Fetch the food based on the provided foodId
          const food = await Food.findById(foodId);

          if (!food) {
            throw new Error(`Food with ID ${foodId} not found`);
          }

          // Check if a variation ID is provided
          let variation = null;
          if (item.variation) {
            const variationId = item.variation;
            // Fetch the variation based on the provided variationId
            variation = await Variation.findById(variationId);
            if (!variation) {
              throw new Error(`Variation with ID ${variationId} not found`);
            }
          }

          // Check if addons IDs are provided
          let addons = [];
          if (item.addons && item.addons.length > 0) {
            // Fetch the addons based on the provided addon IDs
            addons = await Addon.find({ _id: { $in: item.addons } });
            if (addons.length !== item.addons.length) {
              throw new Error('One or more addons not found');
            }
          }

        // Construct the item object
        const newItem = new Item({
          title: food.title, // Set the appropriate title for the item
          food: foodId, // Set the correct food ID here
          description: food.description, // Set the appropriate description
          quantity: quantity, // Set the quantity
          variation: variation, // Set the variation
          addons: item.addons || [], // Set the addons
          specialInstructions: item.specialInstructions || '', // Include special instructions if provided
        });

        // Save the item to the Item collection
        const savedItem = await newItem.save();

        // Return the saved item
        return savedItem;
      })
      );
    // Generate a random unique code (4 characters) for the orderId
    const uniqueCode = generateUniqueCode(4);
      console.log(restaurant);
    // Extract the restaurant name (you may need to adjust this based on your data model)
    const restaurantInfo = await Restaurant.findById(restaurant);
      const restaurantName = restaurantInfo.name;
    // Generate the orderId in the format: xxxx-restaurantname-xx
    const orderId = `${uniqueCode}-${restaurantName}-${uniqueCode}`;

    // Implement payment processing logic here
    let paymentStatus = 'PENDING';
    if (paymentMethod === 'CREDIT_CARD') {
      // Implement credit card payment processing logic here
      // Example: Call a payment gateway API
      // if successful, set paymentStatus to 'PAID'
      // else, keep it as 'PENDING' or 'FAILED'
    } else if (paymentMethod === 'PAYPAL') {
      // Implement PayPal payment processing logic here
      // Example: Make an API request to PayPal
      // if successful, set paymentStatus to 'PAID'
      // else, keep it as 'PENDING' or 'FAILED'
    } else if (paymentMethod === 'COD') {
      // Cash on Delivery (COD) does not require online payment processing
      // Set paymentStatus to 'PAID' immediately
      paymentStatus = 'PAID';
    }
  
    // Create the order object and save it in the database
    const newOrder = new Order({
      orderId,
      restaurant,
      items,
      paymentMethod,
      couponCode,
      tipping,
      taxationAmount,
      address,
      paidAmount: orderAmount,
      orderDate: new Date(),
      isPickedUp,
      deliveryAddress,
      deliveryCharges,
      isActive: true,
      user: userId, // Assign the user ID to the order
      orderStatus: 'PENDING', // Set the initial order status as pending or any default value you prefer
      orderAmount: orderAmount,
      paymentStatus,
      createdAt: new Date(),
  
    });

    const savedOrder = await newOrder.save();
        // Publish a message to activate the subscription
    // Publish a message to activate the subscription for the restaurant's zone
    pubsub.publish('ZONE_ORDER_PLACED', {
      subscriptionZoneOrders: {
        zoneId: restaurantInfo.zone, // Adjust this based on your data model
        origin: 'new',
        order: savedOrder, // Include the order details
      },
    });


    return savedOrder;
      } catch (error) {
        console.error(error);
        throw new Error('Failed to place order');
      }
    },
    //DONE
    addFavourite: async (_, { id }, context) => {
      try {
        const { userId } = context;
        if (!userId) {
          throw new Error('User not authenticated');
        }
        const user = await User.findById(userId);
        if (!user) {
          throw new Error('User not found');
        }
        if (!user.favourite.includes(id)) {
          user.favourite.push(id);
          await user.save();
        }
        return user;
      } catch (error) {
        console.error(error);
        throw new Error('Failed to add favourite restaurant');
      }
    },
    //Done
    createUser: async (_, { phone, email, password, name, notificationToken, appleId }) => {
      try {
        // Check if the user with the provided email already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
          throw new Error('User with this email already exists');
        }

        // Hash the password
        //const hashedPassword = await bcrypt.hash(password);

        // Create a new user
        const newUser = new User({
          phone,
          email,
          password,
          name,
          notificationToken,
          appleId,
        });

        // Save the user to the database
        const savedUser = await newUser.save();
        // Generate the token
        const token = jwt.sign({ userId: savedUser.id }, JwtConfig.JWT_SECRET, { expiresIn: '2h' });

        // Return the created user with the token
        return {
          userId: savedUser._id,
          token, // Generate or retrieve the actual token here
          tokenExpiration: 7200, // Set the expiration time for the token
          name: savedUser.name,
          email: savedUser.email,
          phone: savedUser.phone,
        };
      } catch (error) {
        console.error(error);
        throw new Error('Failed to create user');
      }
    },
    //Done
    createAddress: async (_, { addressInput },context) => {
      try {
        // Find the user by userId
        const {userId } = context;
        if(!userId){
          throw new Error('User Not Authenticated');
        }
        const user = await User.findById(userId);

        if(!user){
          throw new Error('User Not Found')
        }
        // Create a new address
        const newAddress = new Addresses({
          location: {
            coordinates: [addressInput.longitude, addressInput.latitude],
            type: 'Point',
          },
          deliveryAddress: addressInput.deliveryAddress,
          details: addressInput.details,
          label: addressInput.label,
        });
        // Initialize the 'addresses' property if it doesn't exist
        if (!user.addresses) {
          user.addresses = [];
        }

        // Save the new address
        const savedAddress = await newAddress.save();

        // Add the new address to the user's addresses array
        user.addresses.push(savedAddress);

        // Save the updated user
        await user.save();

        return user;
      } catch (error) {
        console.error("Error creating address:", error);
        throw new Error("Failed to create address");
      }
    },
    editAddress: async (_, {addressInput},context) => {
      try {
        const {userId} = context;
        if(!userId){
          throw new Error('User Not Authenticated');
        }
        const user = await User.findById(userId);
        if(!user){
          throw new Error('User Not Found');
        }
        // Update the existing address with the provided data
        const updatedAddress = await Addresses.findByIdAndUpdate(
          addressInput._id,
          {
            latitude: addressInput.latitude,
            longitude: addressInput.longitude,
            deliveryAddress: addressInput.deliveryAddress,
            details: addressInput.details,
            label: addressInput.label,
          },
          { new: true }
        );

        if (!updatedAddress) {
          throw new Error('Address not found');
        }

        return updatedAddress;
      }
      catch (error) {
        console.error(error);
        throw new Error('Failed to edit Address');
      }
    },

    //Done
  login: async (_, { email, password }) => {
    try {
      // Find the user with the provided email
      const user = await User.findOne({ email });

      // Handle case when user does not exist or password is incorrect
      if (!user || !bcrypt.compareSync(password, user.password)) {
        throw new ApolloError('Invalid email or password');
      }

      // Generate a new token
      const token = jwt.sign({ userId: user.id }, JwtConfig.JWT_SECRET);

      // Update the user's token in the database
      user.token = token;
      await user.save();

      // Return the user and token
      return { 
        userId: user.id,
        token: token,
        name: user.name,
        email: user.email,
        phone: user.phone };
    } catch (error) {
      console.error(error);
      throw new Error('Failed to login');
    }
  },
  //Done
  logout: async (_, __, { user }) => {
    try {
      // Remove the token from the user object and save the user
      user.token = undefined;
      await user.save();

      return true; // Indicate successful logout
    } catch (error) {
      console.error(error);
      throw new Error('Failed to logout');
    }
  },
  //Done
  emailExist: async (_, { email }) => {
    try {
      const user = await User.findOne({ email });
      return { _id: user ? user._id : null }; // Return the user's ID or null if not found
    } catch (error) {
      console.error(error);
      throw new Error('Failed to check email existence');
    }
  },
    //Done
    phoneExist: async (_, { phone}, context) => {
      try {
        const {userId} = context;
        // Check if a user with the given userId exists
        const user = await User.findById(userId);

        if (!user) {
          throw new Error('User does not exist');
        }

        // Check if the user's phone matches the entered value
        if (user.phone !== phone) {
          throw new Error('Phone number does not match');
        }

        // If both checks pass, return the user's _id as non-null
        return {
          _id: user._id.toString(),
        };
      } catch (error) {
        // Handle errors gracefully and log them
        console.error('Error checking phone existence:', error);
        throw new Error('Failed to check phone existence');
      }
    },
  updateUser: async (_, { name, phone, phoneIsVerified, emailIsVerified }, context) => {
    try {
      const {userId} = context;
      if (!userId) {
        throw new Error('User not authenticated');
      }
  
        // Construct the update object based on provided fields
        const updateFields = {};
        if (name) {
          updateFields.name = name;
        }
        if (phone) {
          updateFields.phone = phone;
        }
        if (phoneIsVerified !== undefined) {
          updateFields.phoneIsVerified = phoneIsVerified;
        }
        if (emailIsVerified !== undefined) {
          updateFields.emailIsVerified = emailIsVerified;
        }

        // Update the user document
        const updatedUser = await User.findByIdAndUpdate(
          userId,
          updateFields,
          { new: true }
        );
  
      if (!updatedUser) {
        throw new Error('User not found');
      }
  
      return updatedUser;
    } catch (error) {
      console.error(error);
      throw new Error('Failed to update user');
    }
  },

           /****************************************************************************************************************************
                                        WEB MUTATIONS - END
    *****************************************************************************************************************************/

           /****************************************************************************************************************************
                                        RIDER MUTATIONS - START
    *****************************************************************************************************************************/
       //DONE
       riderLogin: async (_, { username, password, notificationToken}) => {
        try {
      // Replace 'User' with the name of your Mongoose model
      const user = await Rider.findOne({ username });
          // Handle case when user does not exist or password is incorrect
    // Handle case when user does not exist
    if (!user) {
      throw new ApolloError('User not found');
    }

    // Handle case when password is incorrect
    if (!bcrypt.compareSync(password, user.password)) {
      throw new ApolloError('Invalid password');
    }
          // Generate a new token
          const token = jwt.sign({ userId: user._id.toString() }, JwtConfig.JWT_SECRET);
          // Update the user's token in the database
          user.token = token;
          user.notificationToken = notificationToken; 
          await user.save();
console.log(user);
          return {
            user,
            userId: user._id.toString(),
            token,
            notificationToken
          };
        } catch (error) {
          console.error(error);
          throw new Error('Failed to login');
        }
      },
    updateOrderStatusRider: async (_, { id, status }) => {
    
  
        // Perform the necessary logic to update the order status
        try {
          // Assuming you have a model named 'Order' for working with orders
          const order = await Order.findById(id);
  
          if (!order) {
            throw new Error('Order not found');
          }
  
          // Update the order status
          order.orderStatus = status;
          // Save the updated order
        const updatedOrder = await order.save();
        
        return updatedOrder;
        } catch (error) {
          console.error(error);
          throw new Error('Failed to update order status');
        }
      },
    assignOrder: async (_, {id}, context) => {
        
        try { 
          const { userId } = context;
          // Assuming you have a model named 'Order' for working with orders
          const order = await Order.findById(id);
  
          if (!order) {
            throw new Error('Order not found');
          }
  
          // Assuming you have a model named 'Rider' for working with riders
          const rider = await Rider.findOne({ available: true });
  
          if (!rider) {
            throw new Error('No available rider found');
          }
  
          // Assign the order to the rider
          order.rider = rider._id;
          order.orderStatus = 'ASSIGNED';
        
          // Save the updated order
          const updatedOrder = await order.save();
          
          return updatedOrder;
        } catch (error) {
          console.error(error);
          throw new Error('Failed to assign order');
        }
      }, 
      //DONE
    updateRiderLocation: async (_, { latitude, longitude }) => {
      try {
        // Assuming you have a method in your Rider model to update the location
        const rider = await Rider.findOneAndUpdate({}, { latitude, longitude }, { new: true });
        return rider;
      } catch (error) {
        console.error(error);
        throw new Error('Failed to update rider location');
      }
    },

    createWithdrawRequest: async (_, { amount }, context) => {
     try{
        // Check if the user is authenticated as a rider
        if (!context.isAuthenticated || !context.isRider) {
          throw new Error('Authentication required');
        }

        // Get the authenticated rider's ID
        const riderId = context.userId;

        // Create the withdrawal request
        const withdrawRequest = new WithdrawRequest({
          amount,
          rider: riderId,
          status: 'Pending',
          requestTime: new Date()
        });

        // Save the withdrawal request
        const createdRequest = await withdrawRequest.save();

        // Populate the rider details in the response
        await createdRequest.populate('rider', 'name email accountNumber').execPopulate();

        return createdRequest;
        } catch (error) {
          console.error(error);
          throw new Error('Failed to create withdraw request');
        }
      },
    createEarning: async (_, { earningsInput }) => {
        // Check if the user is authenticated (e.g., using context or authorization middleware)
        try {
          const earning = await Earning.create(earningsInput);
          return earning;
        
        } catch (error) {
          console.error(error);
          throw new Error('Failed to create earning');
        }
      },
    sendChatMessage: async (_, { orderId, messageInput }) => {
        try {
          // Create a new chat message document
          const chatMessage = await ChatMessage.create({
            orderId,
            message: messageInput.message,
            user: {
              id: messageInput.user._id, // Use correct field names
              name: messageInput.user.name, // Use correct field names
            },
          });
  
          // Return the success status, message, and created chat message data
          return {
            success: true,
            message: 'Chat message sent successfully',
            data: chatMessage
          };
        } catch (error) {
          console.error('Error in sendChatMessage resolver:', error);
          throw new Error('Failed to send chat message');
        }
      },
           /****************************************************************************************************************************
                                        RIDER MUTATIONS - END
    *****************************************************************************************************************************/
           /****************************************************************************************************************************
                                        RESTAURANT MUTATIONS - START
    *****************************************************************************************************************************/
    restaurantLogin: async (_, { username, password }) => {
          try {
          
            // Find the user with the provided email
      const Restaurant = db.model('restaurants'); // Replace 'User' with the name of your Mongoose model
      const user = await Restaurant.findOne({ username });
          // Handle case when user does not exist or password is incorrect
    // Handle case when user does not exist
    if (!user) {
      throw new ApolloError('User not found');
    }

    // Handle case when password is incorrect
    if (!bcrypt.compareSync(password, user.password)) {
      throw new ApolloError('Invalid password');
    }
          // Generate a new token
          const token = jwt.sign({ restaurantId: user._id.toString() }, JwtConfig.JWT_SECRET);
          // Update the user's token in the database
          user.token = token;
          // user.notificationToken = notificationToken; 
          await user.save();

          // Return the user and token
          return {
            restaurantId: user._id.toString(),
            token,
            
          };
          } catch (error) {
            console.error(error);
            throw new Error('Failed to login');
          }
    },
    acceptOrder: async (_, { _id, time }) => {
      try {
        // Validate inputs and perform necessary checks

        // Find the order by the provided ID
        const order = await Order.findById(_id);

        if (!order) {
          throw new Error('Order not found');
        }

        // Update the order status and preparation time
        order.orderStatus = 'ACCEPTED';
                // Calculate the preparation time in minutes from the current time
        const currentTime = new Date();
        const preparationTimeInMinutes = parseInt(time, 10); // Parse the time as an integer
        if (!isNaN(preparationTimeInMinutes)) {
          currentTime.setMinutes(currentTime.getMinutes() + preparationTimeInMinutes);
          order.preparationTime = currentTime;
        } else {
          throw new Error('Invalid preparation time');
        }

        order.acceptedAt = new Date();
        // Save the updated order
        const updatedOrder = await order.save();

        return updatedOrder;
      } catch (error) {
        console.error(error);
        throw new Error('Failed to accept order');
      }
    },
    cancelOrder: async (_, { _id, reason }) => {
      try {
        // Validate inputs and perform necessary checks

        // Find the order by the provided ID
        const order = await Order.findById(_id);

        if (!order) {
          throw new Error('Order not found');
        }

        // Update the order status and reason
        order.orderStatus = 'CANCELLED';
        order.reason = reason;
        order.cancelledAt = new Date();

        // Save the updated order
        const updatedOrder = await order.save();

        return updatedOrder;
      } catch (error) {
        console.error(error);
        throw new Error('Failed to cancel order');
      }
    },
    orderPickedUp: async (_, { _id }) => {
      try {
        // Validate inputs and perform necessary checks

        // Find the order by the provided ID
        const order = await Order.findById(_id);

        if (!order) {
          throw new Error('Order not found');
        }

        // Update the order status to "picked up"
        order.orderStatus = 'PICKED';
        order.pickedAt = new Date();
        // Save the updated order
        const updatedOrder = await order.save();

        return updatedOrder;
      } catch (error) {
        console.error(error);
        throw new Error('Failed to update order status');
      }
    },
    saveRestaurantToken: async (_, { token, isEnabled }, context) => {
      try {
        const {restaurantId} = context;

        // Find the restaurant by the provided ID
        const restaurant = await Restaurant.findById(restaurantId);

        if (!restaurant) {
          throw new Error('Restaurant not found');
        }

        // Update the notification token and enableNotification status
        restaurant.notificationToken = token;
        restaurant.enableNotification = isEnabled;

        // Save the updated restaurant
        const updatedRestaurant = await restaurant.save();

        return updatedRestaurant;
      } catch (error) {
        console.error(error);
        throw new Error('Failed to save restaurant token');
      }
    },

           /****************************************************************************************************************************
                                        RESTAURANT MUTATIONS - END
    *****************************************************************************************************************************/
           /****************************************************************************************************************************
                                        APP MUTATIONS - START
    *****************************************************************************************************************************/
           /****************************************************************************************************************************
                                        APP MUTATIONS - END
    *****************************************************************************************************************************/
},
  WithdrawRequest: {
  rider: async (parent) => {
    try {
      const rider = await Rider.findById(parent.rider);
      return rider;
    } catch (error) {
      throw new Error('Failed to fetch rider');
    }
  },
  },
  Owner: {
    orders: async (user) => {
      try {
        const orders = await Order.find({ customer: Owner.id });
        return orders;
      } catch (error) {
        console.error(error);
        throw new Error('Failed to fetch user orders');
      }
    },
  },
  User: {
    orders: async (user) => {
      try {
        // Fetch and return the user's orders from the database
        const orders = await Order.find({ userId: user._id });
        return orders;
      } catch (error) {
        console.error(error);
        throw new Error('Failed to fetch user orders');
      }
    },
    addresses: async (user) => {
      try {
        // Fetch and return the user's addresses from the database
        const userAddresses = await Addresses.find({ _id: { $in: user.addresses } });
        return userAddresses;
      } catch (error) {
        console.error(error);
        throw new Error('Failed to fetch user addresses');
      }
    },
  },
  Order: {
    user: async (order) => {
      try {
        const customer = await User.findById(order.user);
        return customer;
      } catch (error) {
        console.error(error);
        throw new Error('Failed to fetch order customer');
      }
    },
    foods: async (order) => {
      try {
        const populatedOrder = await Order.findById(order.id).populate('foods.Food');
        return populatedOrder.products;
      } catch (error) {
        console.error(error);
        throw new Error('Failed to fetch order products');
      }
    },
    restaurant: async (order) => {
      try {
        // Fetch restaurant data based on restaurant id
        const restaurant = await Restaurant.findById(order.restaurant);
        return restaurant;
      } catch (error) {
        console.error(error);
        throw new Error('Failed to fetch restaurant');
      }
    },
    deliveryAddress: async (order) => {
      if (order.deliveryAddress && order.deliveryAddress.location) {
        return {
          location: {
            coordinates: order.deliveryAddress.location.coordinates,
            __typename: "Point",
          },
          deliveryAddress: order.address.deliveryAddress,
          __typename: "OrderAddress",
        };
      } else {
        // Handle the case where deliveryAddress is not properly defined
        return null; // or handle it as needed
      }
    },
    items: async (order) => {
      try {
        // Fetch the items associated with the order using order's items field
        const items = await Item.find({ _id: { $in: order.items } }).populate('variation');
        return items;
        } catch (error) {
        console.error(error);
        throw new Error('Failed to fetch order items');
      }
    }, 
    rider: async (order) => {
      try {
        // Fetch the associated rider using order's rider ID
        const rider = await Rider.findById(order.rider);
        return rider;
      } catch (error) {
        throw new Error('Failed to fetch rider');
      }
    },
    review: async (order) => {
      if (order.review) {
        try {
          const review = await Review.findById(order.review);
          return review;
        } catch (error) {
          throw new Error('Failed to fetch review');
        }
      } else {
        return null;
      }
    },
    addons: async (order) => {
      try {
        // Fetch the options associated with the restaurant using the restaurant's 'options' field
        const addons = await Addon.find({ _id: { $in: order.addons } });
        return addons;
      } catch (error) {
        throw new Error('Failed to fetch addons');
      }
    },
    zone: async (order) => {
      try {
 // Get the restaurant's ID from the order
 const restaurantId = order.restaurant;

 // Fetch the restaurant to access its zone
 const restaurant = await Restaurant.findById(restaurantId);

 if (restaurant && restaurant.zone) {
   // If the restaurant has a valid zone, return it
   const zone = await Zone.findById(restaurant.zone);
   return zone;
  } else {
    // Handle cases where the restaurant or zone is not found
    return null;
  }
} catch (error) {
  console.error('Failed to fetch zone:', error);
  throw new Error('Failed to fetch zone');
}
},
  },
  WebOrder: {
    user: async (weborder) => {
      try {
        const customer = await User.findById(weborder.user);
        return customer;
      } catch (error) {
        console.error(error);
        throw new Error('Failed to fetch order customer');
      }
    },
    foods: async (weborder) => {
      try {
        const populatedOrder = await Order.findById(weborder.id).populate('foods.Food');
        return populatedOrder.products;
      } catch (error) {
        console.error(error);
        throw new Error('Failed to fetch order products');
      }
    },
    restaurant: async (weborder) => {
      try {
        // Fetch restaurant data based on restaurant id
        const restaurant = await Restaurant.findById(weborder.restaurant);
        return restaurant;
      } catch (error) {
        console.error(error);
        throw new Error('Failed to fetch restaurant');
      }
    },
    deliveryAddress: async (weborder) => {
      if (weborder.deliveryAddress && order.deliveryAddress.location) {
        return {
          location: {
            coordinates: weborder.deliveryAddress.location.coordinates,
            __typename: "Point",
          },
          deliveryAddress: weborder.address.deliveryAddress,
          __typename: "OrderAddress",
        };
      } else {
        // Handle the case where deliveryAddress is not properly defined
        return null; // or handle it as needed
      }
    },
    items: async (weborder) => {
      try {
        // Fetch the items associated with the order using order's items field
        const items = await Item.find({ _id: { $in: weborder.items } }).populate('variation');
        return items;
        } catch (error) {
        console.error(error);
        throw new Error('Failed to fetch order items');
      }
    }, 
    rider: async (weborder) => {
      try {
        // Fetch the associated rider using order's rider ID
        const rider = await Rider.findById(weborder.rider);
        return rider;
      } catch (error) {
        throw new Error('Failed to fetch rider');
      }
    },
    review: async (weborder) => {
      if (weborder.review) {
        try {
          const review = await Review.findById(weborder.review);
          return review;
        } catch (error) {
          throw new Error('Failed to fetch review');
        }
      } else {
        return null;
      }
    },
    addons: async (weborder) => {
      try {
        // Fetch the options associated with the restaurant using the restaurant's 'options' field
        const addons = await Addon.find({ _id: { $in: weborder.addons } });
        return addons;
      } catch (error) {
        throw new Error('Failed to fetch addons');
      }
    },
    zone: async (weborder) => {
      try {
        const locationCoordinates = weborder.deliveryAddress.location.coordinates;
        console.log('Location Coordinates:', locationCoordinates);

        // Find the zone that contains the locationCoordinates
        const zone = await Zone.findOne({
          "location.coordinates": {
            $geoIntersects: {
              $geometry: {
                type: 'Point',
                coordinates: locationCoordinates,
              },
            },
          },
        });
        return zone;
      } catch (error) {
        console.error('Failed to fetch zone:', error);
        throw new Error('Failed to fetch zone');
      }
    },
  },
  Food: {
    restaurant: async (food) => {
      try {
        const restaurant = await Restaurant.findById(food.restaurant);
        return restaurant;
      } catch (error) {
        console.error(error);
        throw new Error('Failed to fetch product vendor');
      }
    },
    variations: async (food) => {
      try {
        // Fetch the variations associated with the food using the food's _id
        const variations = await Variation.find({ _id: { $in: food.variations } });
        return variations;
      } catch (error) {
        throw new Error('Failed to fetch variations');
      }
    },
  },
  Zone: {
    location: async (zone) => {
      if (!zone.location) {
        return null;
      }
      try {
        const location = await Location.findById(zone.location).select('coordinates');
        return location;
      } catch (error) {
        console.error('Failed to fetch location:', error);
        throw new Error('Failed to fetch location');
      }
    },
  },
  Vendor: {
    reviewData: async (vendor) => {
      try {
        const populatedRestaurant = await Vendor.findById(vendor._id).populate('reviewData');
        return populatedRestaurant.reviewData;
      } catch (error) {
        console.error(error);
        throw new Error('Failed to fetch reviewData for restaurant');
      }
    },
  },
  Section: {
    restaurants: async (parent) => {
      try {
        const restaurantIds = parent.restaurants.map((restaurant) => restaurant._id);
        const restaurants = await Restaurant.find({ _id: { $in: restaurantIds } });
        return restaurants.map((restaurant) => ({
          _id: restaurant._id.toString(),
          name: restaurant.name,
          __typename: 'SectionRestaurant',
        }));
      } catch (error) {
        console.error(error);
        throw new Error('Failed to fetch restaurants');
      }
    },
  }, 
  ActiveOrder: {
    restaurant: async (activeOrder) => {
      try {
        const restaurant = await Restaurant.findById(activeOrder.restaurant);
        return restaurant;
      } catch (error) {
        console.error(error);
        throw new Error('Failed to fetch restaurant');
      }
    },

    deliveryAddress: async (activeOrder) => {
      try {
        const deliveryAddress = await DeliveryAddress.findById(activeOrder.deliveryAddress);
        return deliveryAddress;
      } catch (error) {
        console.error(error);
        throw new Error('Failed to fetch delivery address');
      }
    },

    items: async (activeOrder) => {
      try {
        const items = await Item.find({ _id: { $in: activeOrder.items } })
          .populate('variation')
          .populate('addons.options');
        return items;
      } catch (error) {
        console.error(error);
        throw new Error('Failed to fetch items');
      }
    },

    user: async (activeOrder) => {
      try {
        const user = await User.findById(activeOrder.user);
        return user;
      } catch (error) {
        console.error(error);
        throw new Error('Failed to fetch user');
      }
    },

    rider: async (activeOrder) => {
      try {
        const rider = await Rider.findById(activeOrder.rider);
        return rider;
      } catch (error) {
        console.error(error);
        throw new Error('Failed to fetch rider');
      }
    },
  },
  ReviewData: {
    reviews: async (reviewData) => {
      try {
        // Fetch the foods associated with the category using the category's _id
        const reviews = await Review.find({ _id: { $in: reviewData.reviews } });
        return reviews;
      } catch (error) {
        throw new Error('Failed to fetch foods');
      }
    },
  },
  Rider: {
    zone: async (parent) => {
      try {
        if (!parent.zone) {
          console.log('No Zone Data');
          return null;
        }
        console.log('Fetching Zone Data');
        const zone = await Zone.findById(parent.zone);
        console.log('Fetched Zone:', zone);
        return zone;
      
      } catch (error) {
        throw new Error('Failed to fetch rider zone');
      }
    },
  },
  Restaurant: {
    //_id: (restaurant) => restaurant._id.toString(), // Convert ObjectId to string
    location: async (restaurant) => {
      try {
        const location = await Locat.findById(restaurant.location);
        return location;
      } catch (error) {
        console.error(error);
        throw new Error('Failed to fetch restaurant location');
      }
    },
    owner: async (restaurant) => {
      try {
        const owner = await Vendor.findById(restaurant.owner);
        return owner;
      } catch (error) {
        console.error(error);
        throw new Error('Failed to fetch owner');
      }
    },
    categories: async (restaurant) => {
      try {
        // Fetch the categories associated with the restaurant using the restaurant's _id
        const categories = await Category.find({ _id: { $in: restaurant.categories } });
        return categories;
      } catch (error) {
        throw new Error('Failed to fetch categories');
      }
    },
    options: async (restaurant) => {
      try {
        // Fetch the options associated with the restaurant using the restaurant's 'options' field
        const options = await Option.find({ _id: { $in: restaurant.options } });
        return options;
      } catch (error) {
        throw new Error('Failed to fetch options');
      }
    },
    addons: async (restaurant) => {
      try {
        // Fetch the options associated with the restaurant using the restaurant's 'addons' field
        const addons = await Addon.find({ _id: { $in: restaurant.addons } });
        return addons;
      } catch (error) {
        throw new Error('Failed to fetch options');
      }
    },
    openingTimes: async (restaurant) => {
      try {
        // Fetch the options associated with the restaurant using the restaurant's 'options' field
        const openingTime = await OpeningTime.find({ _id: { $in: restaurant.openingTimes } });
        return openingTime;
      } catch (error) {
        throw new Error('Failed to fetch addons');
      }
    },
    reviewData: async (restaurant) => {
      try {
       
        // Populate the array of review data
        const populatedReviewData = await ReviewData.find({ _id: { $in: restaurant.reviewData } });

        return populatedReviewData;
      } catch (error) {
        console.error(error);
        throw new Error('Failed to fetch review data for restaurant');
      }
    },
  },
  WebRestaurant: {
    //_id: (restaurant) => restaurant._id.toString(), // Convert ObjectId to string
    location: async (restaurant) => {
      try {
        const location = await Locat.findById(restaurant.location);
        return location;
      } catch (error) {
        console.error(error);
        throw new Error('Failed to fetch restaurant location');
      }
    },
    owner: async (restaurant) => {
      try {
        const owner = await Vendor.findById(restaurant.owner);
        return owner;
      } catch (error) {
        console.error(error);
        throw new Error('Failed to fetch owner');
      }
    },
    categories: async (restaurant) => {
      try {
        // Fetch the categories associated with the restaurant using the restaurant's _id
        const categories = await Category.find({ _id: { $in: restaurant.categories } });
        return categories;
      } catch (error) {
        throw new Error('Failed to fetch categories');
      }
    },
    options: async (restaurant) => {
      try {
        // Fetch the options associated with the restaurant using the restaurant's 'options' field
        const options = await Option.find({ _id: { $in: restaurant.options } });
        return options;
      } catch (error) {
        throw new Error('Failed to fetch options');
      }
    },
    addons: async (restaurant) => {
      try {
        // Fetch the options associated with the restaurant using the restaurant's 'addons' field
        const addons = await Addon.find({ _id: { $in: restaurant.addons } });
        return addons;
      } catch (error) {
        throw new Error('Failed to fetch options');
      }
    },
    openingTimes: async (restaurant) => {
      try {
        // Fetch the options associated with the restaurant using the restaurant's 'options' field
        const openingTime = await OpeningTime.find({ _id: { $in: restaurant.openingTimes } });
        return openingTime;
      } catch (error) {
        throw new Error('Failed to fetch addons');
      }
    },
    reviewData: async (restaurant) => {
      try {
       
        // Populate the array of review data
        const populatedReviewData = await ReviewData.find({ _id: { $in: restaurant.reviewData } });

        return populatedReviewData;
      } catch (error) {
        console.error(error);
        throw new Error('Failed to fetch review data for restaurant');
      }
    },
  },
  RestaurantList: {
    // This resolver handles the "restaurants" field in the "nearByRestaurants" response
    restaurants: (parent) => parent.restaurants,

  },
  Delivery: {
    deliveryBounds: (parent) => parent.deliveryBounds.coordinates
  },
  Category: {
    foods: async (category) => {
      try {
        // Fetch the foods associated with the category using the category's _id
        const foods = await Food.find({ _id: { $in: category.foods } });
        return foods;
      } catch (error) {
        throw new Error('Failed to fetch foods');
      }
    },
  },
  Configuration: {
    // Resolver for the subfields of the Configuration type
    // This assumes that the fields in the Configuration type map directly to the fields in the MongoDB model
    // If there are any differences, adjust the field names accordingly
    _id: (configuration) => configuration._id,
    email: (configuration) => configuration.email,
    emailName: (configuration) => configuration.emailName,
    password: (configuration) => configuration.password,
    enableEmail: (configuration) => configuration.enableEmail,
    clientId: (configuration) => configuration.clientId,
    clientSecret: (configuration) => configuration.clientSecret,
    sandbox: (configuration) => configuration.sandbox,
    publishableKey: (configuration) => configuration.publishableKey,
    secretKey: (configuration) => configuration.secretKey,
    currency: (configuration) => configuration.currency,
    currencySymbol: (configuration) => configuration.currencySymbol,
    deliveryRate: (configuration) => configuration.deliveryRate,
  },
  WebAddon: {
    options: async (webaddons) => {
      try {
        // Fetch the options associated with the addon using the addon's 'options' field
        const populatedOptions = await Option.find({ _id: { $in: webaddons.options } });
  
      return populatedOptions;
      } catch (error) {
        throw new Error('Failed to fetch options');
      }
    },
  },
  Address: {
    location: async (parent) => {
      try {
        const address = await Addresses.findById(parent._id).populate('location');
        return address.location;
      } catch (error) {
        throw new Error("Failed to fetch location");
      }
    },

  },
  Location: {
    coordinates: (location) => location.coordinates,

  },
  Item: {
    variation: async (item) => {
      try {
        // Fetch the associated variation using item's variation ID
        const variation = await Variation.findById(item.variation);
        return variation;
      } catch (error) {
        throw new Error('Failed to fetch variation');
      }
    },
    addons: async (item) => {
      try {
        // Fetch the addons associated with the item using item's addons field
        const addons = await Addon.find({ _id: { $in: item.addons } });
        return addons;
      } catch (error) {
        throw new Error('Failed to fetch addons');
      }
    },
  },
};

module.exports = resolvers;
