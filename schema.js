const { gql } = require('apollo-server-express');

const typeDefs = gql`

input PaypalConfigurationInput {
  clientId: String!
  clientSecret: String!
  sandbox: Boolean!
}

input CurrencyConfigurationInput {
  currency: String!
  currencySymbol: String!
}

input StripeConfigurationInput {
  publishableKey: String!
  secretKey: String!
}

input EmailConfigurationInput {
  email: String!
  emailName: String!
  password: String!
  enableEmail: Boolean!
}

  type Owner {
    _id:ID!
    userId: ID!
    name: String!
    email: String!
    token: String!
    phone: String
    userType: String!
    password: String!
    address: String
    orders: [Order]!
    otp: String
    restaurants:[Vendor!]!
    phoneIsVerified: String
    emailIsVerified: String
    createdAt: String!
    updatedAt: String!
  }
  type UpdateWithdrawRequestResponse {
    success: Boolean!
    message: String!
    data: UpdateWithdrawRequestData
  }
  
  type UpdateWithdrawRequestData {
    rider: Rider!
    withdrawRequest: WithdrawRequest!
  }

  type WithdrawRequest {
    _id: ID!
    requestId: ID
    requestAmount: Float
    requestTime: String
    rider: Rider
    status: String
  }
  
  type Vendor {
    _id: ID!
    name: String
    email: String
    username: String!
    password: String!
    sections: [Section!]!
    offers: [Offer!]!
    orderId: String!
    orderPrefix: String!
    image: String!
    slug: String
    location: [Location!]!
    address: String!
    userType: String!
    deliveryTime: String!
    minimumOrder: String!
    tax: String!
    reviewData: [ReviewData!]!
    categories: [Category!]!
    options: [Option!]!
    addons: [Addon!]!
    zone: [Zone!]!
    restaurants: [Restaurant]!
    rating: String!
    isAvailable: Boolean!
    isActive: Boolean
    openingTimes: [OpeningTime!]!
    createdAt: String!
    updatedAt: String!
  }

  type Restaurant {
    _id: ID!
    name: String
    username: String
    password: String
    email: String
    sections: [Section!]
    offers: [Offer!]
    orderId: Int
    orderPrefix: String
    image: String
    slug: String
    location: Location
    deliveryBounds: Coordinates
    address: String
    userType: String!
    deliveryTime: Int
    minimumOrder: Int
    salesTax: Float
    tax: Float
    commissionRate: String
    owner: Vendor
    isActive: Boolean
    foods: [Food]
    reviewData: [ReviewData!]
    categories: [Category!]
    options: [Option!]
    addons: [Addon]
    zone: Zone
    rating: String
    stripeDetailsSubmitted: Boolean
    isAvailable: Boolean
    openingTimes: [OpeningTime]
    createdAt: String!
    updatedAt: String!
  }

  type Variation {
    _id: ID!
    title: String!
    price: Float!
    discounted: Float
    addons: [String!]!
    createdAt: String!
    updatedAt: String!
  }

  type ResetPasswordResult {
    result: String
  }

  type ResetPasswordResponse {
    result: String!
  }

  type ChatMessage {
    _id: ID!
    message: String!
    user: User!
    createdAt: String!
  }
  
  type SendChatMessageResponse {
    success: Boolean!
    message: String!
    data: ChatMessage
  }
  
  input ChatMessageInput {
    message: String!
  }

  type SendOtpResponse {
    result: String
  }

  type SendOtpResult {
    success: Boolean!
    message: String
  }


  type UpdateDeliveryBoundsAndLocationResult {
    success: Boolean!
    message: String!
    data: Restaurant!
  }

  type Delivery {
    _id: ID!
    deliveryBounds: DeliveryBounds!
    location: Coordinates!
  }

  type DeliveryBounds {
    coordinates: [[[Float!]]]!
   
  }

  type Coordinates {
    coordinates: [[[Float!]]]
  }

  input CoordinatesInput {
    latitude: Float!
    longitude: Float!
  }

  type ReviewData {
    _id: ID!
    total: String
    ratings: String
    reviews: [Review]
    # Include other reviewData fields
  }
  input ReviewDataInput {
    id: ID!
    total: String
    ratings: String
    reviews: [ReviewInput]
    createdAt: String!
    updatedAt: String!
    # Include other reviewData fields
  }

  type CartFood {
    _id: ID!
    title: String!
    description: String!
    variation: Variation!
    image: String!
    isActive: Boolean!
    createdAt: String!
    updatedAt: String!
  }

  type CartVariation {
    _id: ID!
    title: String!
    price: Float!
    discounted: Float
    addons: [CartAddon!]!
  }
  type CartAddon {
    _id: ID!
    title: String!
    description: String
    quantityMinimum: Int  
    quantityMaximum: Int
    options: [Option] 
  }

  type Category {
    _id: ID!
    title: String!
    foods: [Food]

    # Include other category fields
  }
  
  input CategoryInput {
    _id:ID
    restaurant: String!
    title: String!
    foods: [FoodInput]
  }

  type CreateOptionsResponse {
    _id: ID!
    options: [Option!]!
  }
  
  input CreateOptionInput {
    restaurant: ID!
    options: [OptionInput!]!
  }

  type Option {
    _id: ID!
    title: String!
    description: String!
    price: Float!
    # Include other option fields
  }
  
  input OptionInput {
    title: String!
    description: String!
    price: Float!
  }
  input editOptionInput {
    _id: ID!
    optionInput: OptionInput!
  }
  
  type EditOptionResponse {
    _id: ID!
    options: [Option!]!
  }
  type CreateAddonResponse {
    _id: ID!
    addons: [Addon!]
  }

  type Addon {
    _id: ID!
    title: String
    description: String
    quantityMinimum: Int
    quantityMaximum: Int
    options: [String]
    # Include other addon fields
  }
  type WebAddon {
    _id: ID!
    title: String
    description: String
    quantityMinimum: Int
    quantityMaximum: Int
    options: [Option]
    # Include other addon fields
  }
  input AddonInput {
    restaurant: String!
    addons: [AddonInputItem!]!
  }

  input AddonInputItem {
    title: String
    description: String
    quantityMinimum: Int
    quantityMaximum: Int
    options: [String]
  }
  type AddonOption {
    _id: ID!
    title: String
    description: String
    price: Float
  }
  
  input AddonOptionInput {
    title: String!
    price: Float!
  }

  type Zone {
    _id:ID!
    title: String!
    description: String!
    location: Location!
    isActive: Boolean!
    tax: String

  }

  input ZoneInput {
    _id:ID
    title: String!
    description: String!
    coordinates: [[[Float]]]!
  }

  type CreateCategoryResponse {
    _id: ID!
    categories: [Category]
  }

  type EditCategoryResponse {
    _id: ID!
    categories: [Category!]!
  }


  type EditRestaurantPayload {
    _id: ID
    orderId: Int
    orderPrefix: String
    name: String
    image: String
    slug: String
    address: String
    username: String
    password: String
    location: Location
    isAvailable: Boolean
    minimumOrder: Float
    tax: Float
    salesTax: Float
    openingTimes: [OpeningTime]
  }

  type Notification {
    _id: ID!
    recipient: String!
    message: String!
    status: String!
    createdAt: String!
    updatedAt: String!
  }

  type Offer {
    _id: ID!
    name: String!
    tag: String
    restaurants: [ID!]!
  }

  type Review {
    _id: ID!
    foodId: ID!
    userId: ID!
    rating: Float!
    review: String!   
    order: Order!
    description: String!                                 
    createdAt: String!
    updatedAt: String!
  }
  input ReviewInput {
    id: ID!
    FoodId: ID!
    userId: ID!
    rating: Float!
    review: String!
    createdAt: String!
    updatedAt: String!
    # Include other review fields
  }
  type Order {
    _id: ID!
    orderId: String
    deliveryAddress: DeliveryAddress
    items: [OrderItem]
    user: User
    addons: [Addon]
    rider: Rider
    reason: String
    review: Review
    paidAmount: Float
    isActive: Boolean
    orderStatus: String
    deliveryCharges: Float
    tipping: Float
    taxationAmount: Float
    createdAt: String
    status: Boolean
    completionTime: String
    cancelledAt: String
    assignedAt: String
    foods: [OrderFood]!
    deliveredAt: String
    acceptedAt: String
    restaurant: Restaurant
    zone:Zone
    paymentStatus: String
    paymentMethod: String
    orderAmount: Float
    orderDate: String
    pickedAt: String
    expectedTime: String
    isPickedUp: Boolean
    isRiderRinged: Boolean
    preparationTime: String
  }

  type CreateFoodResponse {
    _id: ID!
    categories: [Category!]!
  }
  type DeleteFoodResponse {
    _id: ID!
    categories: [Category!]!
  }
  type Food {
    _id: ID!
    title: String!
    price: Float
    image: String!
    isActive: Boolean
    categories: Category!
    description: String
    variations: [Variation!]!
    restaurant: Restaurant!
    createdAt: String!
    updatedAt: String!
  }

  type RestaurantList {
    offers: [Offer!]
    sections: [WebSection!]
    restaurants: [Restaurant!]
    options: [Option!]
    addons: [WebAddon]
  }

  input RestaurantProfileInput {
    _id: ID!
    name: String
    image: String
    slug: String
    address: String
    username: String
    password: String
    orderPrefix: String
    location: LocationInput
    isAvailable: Boolean
    minimumOrder: Float
    tax: Float
    salesTax: Float
    deliveryTime: Int
    openingTimes: [TimingsInput]
  }

  input RestaurantInput {
    _id: ID
    orderId: Int
    orderPrefix: String
    name: String
    image: String
    slug: String
    address: String
    username: String
    password: String
    location: LocationInput
    isAvailable: Boolean
    minimumOrder: Float
    tax: Float
    salesTax: Float
    deliveryTime: Int
    openingTimes: [TimingsInput]
  }

  type Coupon {
    _id: ID!
    title: String!
    discount: Float!
    enabled: Boolean!
  }

  input CouponInput {
    _id:ID!
    title: String!
    discount: Float!
    enabled: Boolean!
  }

  type Tax {
    _id: ID!
    taxationCharges: Float!
    enabled: Boolean!
  }

  type Tipping {
    _id: ID!
    tipVariations: [Float]!
    enabled: Boolean!
  }
  type Commission {
    _id: ID!
    commissionRate: Float!
  }
  
  input TippingInput {
    _id:ID
    tipVariations: [Float]!
    enabled: Boolean!
  }
  type Rider {
    _id: ID!
    userId: String
    name: String!
    email: String
    token: String
    notificationToken: String
    username: String!
    password: String!
    phone: String!
    available: Boolean!
    zone: Zone!
    currentWalletAmount: Float
    totalWalletAmount: Float
    withdrawnWalletAmount: Float
    location: Location!
  }
  
  input RiderInput {
    _id:ID
    name: String!
    email: String
    phone: String!
    password: String!
    available: Boolean!
    zone:ID
  }

  type Location {
    _id: ID!
    coordinates: [Float]!
    type: String
    # Include other location fields
  }
  type Locat {
    _id: ID!
    coordinates: [Float]!
    type: String
    # Include other location fields
  }
  input LocationInput {
    coordinates: [Float]!
    type: String
  }
  input LocatInput {
    coordinates: [Float]!
    type: String
  }

  type OpeningTime {
    _id: ID
    day: String
    times: [Times]
    # Include other openingTime fields
  }
  
  input TimingsInput {
    day: String
    times: [OpeningTimeInput]
  }
  
  type Times {
    _id: ID
    startTime: [String]
    endTime: [String]
    # Include other Times fields
  }
  
  type NotificationStatus {
    _id: ID!
    notificationToken: String!
    isOrderNotification: Boolean!
    isOfferNotification: Boolean!
  }

  input OpeningTimeInput {
    startTime: [String]
    endTime: [String]
  }
scalar hour
scalar minute
  type Promotion {
    id: ID!
    promotionCode: String!
    discountPercentage: Float!
    expirationDate: String!
    associatedFoods: [String]!
    createdAt: String!
    updatedAt: String!
  }
  
  type Section {
    _id: ID!
    name: String!
    enabled: Boolean
    restaurants: [Restaurant!]!
  }
  type WebSection {
    _id: ID!
    name: String!
    enabled: Boolean
    restaurants: [ID!]!
  }

  input SectionInput {
    _id: ID
    name: String!
    enabled: Boolean!
    restaurants: [ID!]!
  }

  input RiderInput {
    name: String!
    username: String!
    phone: String!
    password: String!
  }
  type Payment {
    id: ID!
    paymentStatus: String!
    paidAmount: Float!
  }
  type Addresses {
    _id: ID!
    location: [Location!]!
    deliveryAddress: String

  }
  type Address {
    _id: ID!
    label: String
    deliveryAddress: String
    details: String
    location: Location
    selected: Boolean
    
  }
  input AddressInput {
    _id: ID
    label: String
    deliveryAddress: String
    details: String
    latitude: Float
    longitude: Float
    
  }
  type User {
    _id: ID!
    userId:ID!
    pushToken: String
    name: String!
    email: String!
    password: String!
    phone: String
    token: String
    tokenExpiration: String
    address: String
    favourite: [ID]
    phoneIsVerified: String
    emailIsVerified: String
    appleId: String
    otp: String
    isOrderNotification: Boolean
    isOfferNotification: Boolean
    notificationToken: String
    addresses: [Address!]!
    orders: [Order!]!
    createdAt: String!
    updatedAt: String!
    userType: String!
    restaurants: [Restaurant!]!
  }

  input UserInput {
    name: String!
    email: String!
    password: String!
    phone: String
    address: String
  }
  type ActiveOrder {
    _id: ID!
    zone: Zone
    orderId: ID
    restaurant: Restaurant
    deliveryAddress: DeliveryAddress
    items: [Item]
    user: User
    paymentMethod: String
    paidAmount: Float
    orderAmount: Float
    orderStatus: String
    isPickedUp: Boolean
    status: String
    paymentStatus: String
    reason: String
    isActive: Boolean
    createdAt: String
    deliveryCharges: Float
    rider: Rider
  }
  type Item {
    _id: ID!
    title: String
    description: String
    image: String
    quantity: Int
    variation: Variation
    food: String
    addons: [Addon]
    specialInstructions: String
    reviewData: ReviewData
    isActive: Boolean
    createdAt: String
    updatedAt: String
  }

  input ItemInput {
    _id: ID!
    title: String
    description: String
    image: String
    quantity: Int
    variation: VariationInput
    addons: [AddonInput]
    food: String
    specialInstructions: String
    isActive: Boolean
    reviewData: ReviewDataInput
    createdAt: String
    updatedAt: String
  }

  type Tip {
    _id: ID!
    tipVariations: [Float!]!
    enabled: Boolean!
  }

  type DeliveryAddress {
    location: Location
    deliveryAddress: String
    details: String
    label: String
  }
  
  type Pagination {
    total: Int!
  }

  type OrderInfo {
    day: String!
    amount: Float!
  }
  type OrderItem {
    _id: ID!
    title: String
    food: String
    description: String
    image: String
    quantity: Int
    variation: Variation
    addons: [Addon]
    specialInstructions: String
    isActive: Boolean
    createdAt: String
    updatedAt: String
  }
  type OrderFood {
    food: Food!
    quantity: Int!
  }
input OrderFoodInput {
  food: ID!
  quantity: Int!
}
  type DashboardSales {
    orders: [OrderInfo!]!
  }
  input OrderInput {
    food: ID!
    quantity: Int!
    variation: ID # Include this field if variations are allowed
    addons: [ID] # Include this field if addons are allowed
    specialInstructions: String
  }
  type DashboardOrder {
    day: String!
    count: Int!
  }

  type DashboardTotal {
    totalOrders: Int
    totalSales: Float
  }
  
  type DashboardOrdersResponse {
    orders: [DashboardOrder!]!
  }

  type Configuration {
    _id: ID!
    configuration_id: String!
    email: String!
    emailName: String!
    password: String!
    enableEmail: Boolean!
    clientId: String
    clientSecret: String
    sandbox: Boolean
    publishableKey: String
    secretKey: String
    currency: String
    currencySymbol: String
    deliveryRate: Float
  }
  
  type WithdrawRequestResponse {
    success: Boolean!
    message: String!
    data: [WithdrawRequest!]!
    pagination: Pagination!
  }

  type AuthPayload {
    userId: ID!
    token: String!
    tokenExpiration: Int!
    name: String!
    email: String!
    phone: String
    appleId: String
  }

  type DeleteCategoryResponse {
    _id: ID!
    categories: [Category!]!
  }

  type SubscriptionZoneOrder {
    zoneId: String
    origin: String
    order: Order
  }

  type Subscription {
    subscriptionOrder(id: String!): OrderSubscriptionPayload
    orderStatusChanged(userId: String!): OrderStatusChangedSubscriptionPayload
    subscribePlaceOrder(restaurant: String!): PlaceOrderSubscriptionPayload
    subscriptionZoneOrders(zoneId: String!): SubscriptionZoneOrder
    subscriptionAssignRider(riderId: String!): AssignRiderPayload!
    subscriptionRiderLocation(riderId: String!): Rider!
    subscriptionNewMessage(order: ID!): Message!

  }
  type Message {
    _id: ID!
    message: String!
    user: User!
    createdAt: String!
  }

  type OrderSubscriptionPayload {
    _id: ID!
    orderStatus: String
    rider: Rider
    completionTime: String
  }
  
  type OrderStatusChangedSubscriptionPayload {
    userId: String!
    orderStatus: String
  }
  
  type PlaceOrderSubscriptionPayload {
    userId: String!
    origin: String!
    order: Order!
  }

  input EarningsInput {
    orderId: ID!
    deliveryFee: Float!
    orderStatus: String!
    paymentMethod: String!
    deliveryTime: String!
  }

  type Earning {
    rider: Rider!
    orderId: ID!
    deliveryFee: Float!
    orderStatus: String!
    paymentMethod: String!
    deliveryTime: String!
    _id: ID!
  }

  type Query {
    getUser(id: ID!): Owner
    getUsers: [User]!
    users: [User]!
    getDashboardSales(startingDate: String, endingDate: String, restaurant: String): DashboardSales!
    getDashboardOrders(startingDate: String, endingDate: String, restaurant: String): DashboardOrdersResponse!
    getDashboardTotal(startingDate: String, endingDate: String, restaurant: String!): DashboardTotal
    restaurantByOwner(id: String): Vendor!
    ridersByZone(id: String!): [Rider!]!
    vendors: [Vendor]!
    getActiveOrders(restaurantId: ID): [Order]
    getAllWithdrawRequests(offset: Int): WithdrawRequestResponse!
    getVendor(_id:ID!): Vendor!
    getCategories: [Category!]!
    getCategory(id: ID!): Category
    riders: [Rider!]!
    availableRiders: [Rider]
    ordersByRestId(
      restaurant: String!
      page: Int
      rows: Int
      search: String
    ): [Order]
    profile: User
    userFavourite(latitude: Float, longitude: Float): [Restaurant]!
    sendChatMessage(orderId: ID!, messageInput: ChatMessageInput!): SendChatMessageResponse!
    orders(offset: Int): [Order!]!
    order(id: String!): Order
    orderCount(restaurant: String!): Int!
    restaurant(id: String, slug: String): Restaurant
    restaurantDetail(id: String): Restaurant
    restaurants: [Restaurant]!
    restaurantList: [Restaurant!]!
    nearByRestaurants(latitude: Float, longitude: Float): RestaurantList!
    getNotification(id: ID!): Notification
    getNotifications: [Notification]!
    getReview(id: ID!): Review
    getReviews: [Review]!
    reviews(restaurant: String!): [Review!]!
    getOrder(id: ID!): Order
    getOrders: [Order]!
    getFood(id: ID!): Food
    getFoods: [Food]!
    getPromotion(id: ID!): Promotion
    getPromotions: [Promotion]!
    getOption(id: ID!): Option
    getOptions: [Option!]!
    getAddon(id: ID!): Addon
    coordinates: [Coordinates!]!
    getAddons: [Addon!]!
    getZone(_id: ID!): Zone
    getZones: [Zone]
    zones: [Zone!]!
    taxes: [Tax!]!
    tips: Tip
    rider(id: String!): Rider
    getSection(id: ID!): Section
    getSections: [Section]
    sections: [Section!]!
    getOpeningTime(id: ID!): OpeningTime
    getOpeningTimes: [OpeningTime]
    getOffer(id: ID!): Offer
    getOffers: [Offer]
    coupons: [Coupon!]!
    chat(order: ID!): [ChatMessage]
    configuration: Configuration
    riderOrders: [Order]
    riderEarnings(riderEarningsId: String, offset: Int): [Earning]
    riderWithdrawRequests(riderWithdrawRequestsId: String, offset: Int): [WithdrawRequest]
    
  }

  type Mutation {
    savePaypalConfiguration(configurationInput:PaypalConfigurationInput!): Configuration!
    saveStripeConfiguration(configurationInput:StripeConfigurationInput!): Configuration!
    saveCurrencyConfiguration(configurationInput: CurrencyConfigurationInput!): Configuration!
    saveDeliveryRateConfiguration(deliveryRate:Float): Configuration!
    saveEmailConfiguration(configurationInput: EmailConfigurationInput!): Configuration!
    updateCommission(id: String!, commissionRate: Float!): Commission
    createCoupon(couponInput: CouponInput!): Coupon!
    editCoupon(couponInput: CouponInput!): Coupon!
    deleteCoupon(id: String!): String!
    updateWithdrawReqStatus(id: ID!, status: String!): UpdateWithdrawRequestResponse
    editOption(optionInput: OptionInput): EditOptionResponse!
    updateDeliveryBoundsAndLocation(id: ID!, bounds: [[[Float!]]], location: CoordinatesInput!): UpdateDeliveryBoundsAndLocationResult!
    editRestaurant(restaurantInput: RestaurantProfileInput!): Restaurant
    createTipping(tippingInput: TippingInput!): Tipping!
    editTipping(tippingInput: TippingInput!): Tipping!
    createCoordinates(coordinatesInput: CoordinatesInput!): Coordinates!
    createUser(phone: String!, notificationToken: String!, name: String!, email: String!, password: String!, appleId: String): User!
    updateUser(name: String!, phone: String, phoneIsVerified: Boolean, emailIsVerified: Boolean): User
    deleteUser(id: ID!): User
    addFavourite(id: String!): User
    sendOtpToEmail(email: String!, otp: String!): SendOtpResponse
    sendOtpToPhoneNumber(phone: String, otp: String): SendOtpResponse!
    createAddress(addressInput: AddressInput!): User!
    editAddress(addressInput: AddressInput!): User!
    placeOrder(
      restaurant: String!
      orderInput: [OrderInput!]!
      paymentMethod: String!
      couponCode: String
      tipping: Float!
      taxationAmount: Float!
      address: AddressInput!
      orderDate: String!
      isPickedUp: Boolean!
      deliveryCharges: Float!
    ): Order!
    deleteZone(id: String!): Zone
    updatePaymentStatus(id: String!, status: String!): Payment
    toggleAvailability(_id: String): Rider
    assignRider(id: String!, riderId: String!): Order
    updateOrderStatus(id: ID!, status: String!, reason: String): Order
    updateStatus(id: ID!, orderStatus: String!): Order
    uploadToken(id: ID!, pushToken: String!): User
    resetPassword(password: String!, token: String!): ResetPasswordResult
    createRider(riderInput: RiderInput!): Rider!
    editRider(riderInput: RiderInput!): Rider!
    deleteRider(id: String!): Rider!
    createRestaurant(restaurant: RestaurantInput!, owner: ID!): Restaurant!
    deleteRestaurant(_id:String!): Restaurant
    createVendor(vendorInput: VendorInput): Vendor!
    editVendor(vendorInput: VendorInput): Vendor!
    deleteVendor(_id: ID!): Vendor
    createNotification(recipient: String!, message: String!, status: String!): Notification
    updateNotificationStatus(
      offerNotification: Boolean!
      orderNotification: Boolean!
    ): NotificationStatus!
    updateNotification(id: ID!, recipient: String, message: String, status: String): Notification
    deleteNotification(id: ID!): Notification
    createReview(FoodId: ID!, userId: ID!, rating: Float!, review: String!): Review
    updateReview(id: ID!, FoodId: ID, userId: ID, rating: Float, review: String): Review
    deleteReview(id: ID!): Review
    createOrder(customer: ID!, Foods: [OrderFoodInput]!, totalPrice: Float!, deliveryAddress: String!, status: String!): Order
    updateOrder(id: ID!, customer: ID, Foods: [OrderFoodInput], totalPrice: Float, deliveryAddress: String, status: String): Order
    deleteOrder(id: ID!): Order
    createFood(foodInput: FoodInput!): Food!
    editFood(foodInput: FoodInput!): Restaurant
    deleteFood(id: String!, restaurant: String!, categoryId: String!): Restaurant
    updateTimings(id: String!, openingTimes: [TimingsInput]): Restaurant
    createPromotion(promotionCode: String!, discountPercentage: Float!, expirationDate: String!, associatedFoods: [String]!): Promotion
    updatePromotion(id: ID!, promotionCode: String, discountPercentage: Float, expirationDate: String, associatedFoods: [String]): Promotion
    deletePromotion(id: ID!): Promotion
    ownerLogin(email: String!, password: String!): Owner
    login(email: String!, password: String!, appleId: String, name: String, notificationToken: String): AuthPayload
    emailExist(email: String!): User
    phoneExist(phone: String): User
    logout: Boolean
    createCategory(category: CategoryInput): CreateCategoryResponse
    editCategory(category: CategoryInput): EditCategoryResponse
    deleteCategory(id: String!, restaurant: String!): DeleteCategoryResponse
    createOptions(optionInput: CreateOptionInput): CreateOptionsResponse!
    createAddons(addonInput: AddonInput): CreateAddonResponse
    createZone(zone: ZoneInput!): Zone!
    editZone(zone: ZoneInput!): Zone!
    createSection(section: SectionInput): Section
    editSection(section: SectionInput!): Section!
    deleteSection(id: String!): Boolean!
    createOffer(offer: OfferInput!): Offer
    editOffer(offer: OfferInput!): Offer
    deleteOffer(id: String!): String
    assignOrder(id: String!): Order
    updateRiderLocation(latitude: String!, longitude: String!): Rider
    createWithdrawRequest(amount: Float!): WithdrawRequest
    createEarning(earningsInput: EarningsInput): Earning
    sendChatMessage(orderId: ID!, messageInput: ChatMessageInput!): SendChatMessageResponse
    riderLogin(username: String, password: String, notificationToken: String): AuthPayload
    updateOrderStatusRider(id: String!, status: String!): Order
    saveNotificationTokenWeb(token: String!): NotificationTokenResponse!

  }
  type AssignRiderPayload {
    order: Order!
    origin: String!
  }
  type NotificationTokenResponse {
    success: Boolean!
    message: String!
  }
  input OfferInput {
    name: String!
    tag: String!
    restaurants: [RestaurantInput!]!
  }

  input VendorInput {
   _id:ID
    name: String
    address: String
    email: String!
    password: String!
    
  }

  input VariationInput {
    title: String!
    price: Float!
    discounted: Float!
    addons: [String]!
  }

  input FoodInput {
    _id: ID
    title: String!
    restaurant: ID!
    description: String!
    variations: [VariationInput!]!
    image: String!
    isActive: Boolean
    category: ID!
  }

`;

module.exports = typeDefs;
                                