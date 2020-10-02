import gql from 'graphql-tag'

export const ORDER = gql`
   subscription Order($id: oid!) {
      order(id: $id) {
         id
         deliveryInfo
         fulfillmentType
         orderStatus
         amountPaid
         currency
         deliveryPrice
         transactionId
         discount
         tax
         tip
         itemTotal
         orderCart {
            cartInfo
         }
      }
   }
`

export const PREORDER_PICKUP = gql`
   subscription PreOrderPickup {
      preOrderPickup: fulfillmentTypes(
         where: { isActive: { _eq: true }, value: { _eq: "PREORDER_PICKUP" } }
      ) {
         recurrences(where: { isActive: { _eq: true } }) {
            id
            type
            rrule
            timeSlots(where: { isActive: { _eq: true } }) {
               id
               to
               from
               pickUpLeadTime
            }
         }
      }
   }
`

export const ONDEMAND_PICKUP = gql`
   subscription OndemandPickup {
      onDemandPickup: fulfillmentTypes(
         where: { isActive: { _eq: true }, value: { _eq: "ONDEMAND_PICKUP" } }
      ) {
         recurrences(where: { isActive: { _eq: true } }) {
            id
            type
            rrule
            timeSlots(where: { isActive: { _eq: true } }) {
               id
               to
               from
               pickUpPrepTime
            }
         }
      }
   }
`

export const PREORDER_DELIVERY = gql`
   subscription PreOrderDelivery($distance: numeric!) {
      preOrderDelivery: fulfillmentTypes(
         where: { isActive: { _eq: true }, value: { _eq: "PREORDER_DELIVERY" } }
      ) {
         recurrences(where: { isActive: { _eq: true } }) {
            id
            type
            rrule
            timeSlots(where: { isActive: { _eq: true } }) {
               id
               to
               from
               mileRanges(
                  where: {
                     isActive: { _eq: true }
                     from: { _lte: $distance }
                     to: { _gte: $distance }
                  }
               ) {
                  id
                  to
                  from
                  isActive
                  leadTime
                  charges {
                     id
                     charge
                     orderValueFrom
                     orderValueUpto
                  }
               }
            }
         }
      }
   }
`

export const ONDEMAND_DELIVERY = gql`
   subscription OnDemandDelivery($distance: numeric!) {
      onDemandDelivery: fulfillmentTypes(
         where: { isActive: { _eq: true }, value: { _eq: "ONDEMAND_DELIVERY" } }
      ) {
         recurrences(where: { isActive: { _eq: true } }) {
            id
            type
            rrule
            timeSlots(where: { isActive: { _eq: true } }) {
               id
               to
               from
               mileRanges(
                  where: {
                     isActive: { _eq: true }
                     from: { _lte: $distance }
                     to: { _gte: $distance }
                  }
               ) {
                  id
                  to
                  from
                  isActive
                  prepTime
                  charges {
                     id
                     charge
                     orderValueFrom
                     orderValueUpto
                  }
               }
            }
         }
      }
   }
`

export const ORDERS = gql`
   subscription Orders($keycloakId: String!, $brandId: Int!) {
      orders(
         where: { keycloakId: { _eq: $keycloakId }, brandId: { _eq: $brandId } }
         order_by: { created_at: desc }
      ) {
         id
         deliveryInfo
         fulfillmentType
         orderStatus
         amountPaid
         currency
         deliveryPrice
         transactionId
         discount
         tax
         tip
         itemTotal
         created_at
         orderCart {
            cartInfo
         }
      }
   }
`

export const STORE_SETTINGS = gql`
   subscription StoreSettings($brandId: Int!) {
      storeSettings {
         id
         type
         value
         identifier
         brandSettings(where: { brandId: { _eq: $brandId } }) {
            value
         }
      }
   }
`

export const CART = gql`
   subscription Carts($customerId: Int!, $brandId: Int!) {
      cart(
         where: {
            status: { _eq: "PENDING" }
            customerId: { _eq: $customerId }
            cartSource: { _eq: "a-la-carte" }
            brandId: { _eq: $brandId }
         }
         order_by: { created_at: desc }
      ) {
         id
         address
         customerInfo
         cartInfo
         customerId
         isValid
         paymentMethodId
         stripeCustomerId
         fulfillmentInfo
         deliveryPrice
         itemTotal
         tip
         taxPercent
         tax
         totalPrice
         status
         paymentStatus
         orderId
         discount
      }
   }
`

export const SAFETY_CHECK = gql`
   {
      safety_safetyCheck(order_by: { created_at: desc }, limit: 1) {
         id
         created_at
         SafetyCheckPerUsers {
            id
            usesMask
            usesSanitizer
            temperature
            user {
               id
               firstName
               lastName
            }
         }
      }
   }
`

export const CART_BY_PK = gql`
   subscription CartByPK($id: Int!) {
      cartByPK(id: $id) {
         paymentStatus
         status
         id
         orderId
      }
   }
`

export const COUPONS = gql`
   subscription Coupons($params: jsonb, $brandId: Int!) {
      coupons(
         where: {
            isActive: { _eq: true }
            brands: { brandId: { _eq: $brandId }, isActive: { _eq: true } }
         }
      ) {
         id
         code
         isRewardMulti
         rewards(order_by: { priority: desc }) {
            id
            condition {
               isValid(args: { params: $params })
            }
         }
         metaDetails
         visibilityCondition {
            isValid(args: { params: $params })
         }
      }
   }
`

export const ORDER_CART_REWARDS = gql`
   subscription OrderCartRewards($cartId: Int!, $params: jsonb) {
      orderCartRewards(where: { orderCartId: { _eq: $cartId } }) {
         reward {
            id
            coupon {
               id
               code
            }
            condition {
               isValid(args: { params: $params })
            }
         }
      }
   }
`

export const LOYALTY_POINTS = gql`
   subscription LoyaltyPoints($keycloakId: String!, $brandId: Int!) {
      loyaltyPoints(
         where: { keycloakId: { _eq: $keycloakId }, brandId: { _eq: $brandId } }
      ) {
         id
         points
      }
   }
`

export const WALLETS = gql`
   subscription Wallets($keycloakId: String!, $brandId: Int!) {
      wallets(
         where: { keycloakId: { _eq: $keycloakId }, brandId: { _eq: $brandId } }
      ) {
         id
         amount
      }
   }
`

export const CUSTOMER_REFERRAL = gql`
   subscription CustomerReferral($keycloakId: String!, $brandId: Int!) {
      customerReferrals(
         where: { keycloakId: { _eq: $keycloakId }, brandId: { _eq: $brandId } }
      ) {
         id
         signupStatus
         referralStatus
         referralCode
         referredByCode
      }
   }
`
