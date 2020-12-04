import gql from 'graphql-tag'

export const CREATE_CUSTOMER = gql`
   mutation CreateCustomer($object: crm_customer_insert_input!) {
      createCustomer(object: $object) {
         id
         email
         keycloakId
         brandCustomers {
            id
            brandId
            keycloakId
         }
         platform_customer {
            email
            firstName
            lastName
            phoneNumber
            stripeCustomerId
            customerAddresses {
               id
               line1
               line2
               state
               zipcode
               city
               country
               notes
               lat
               lng
            }
            defaultCustomerAddress {
               id
               line1
               line2
               state
               zipcode
               city
               country
               notes
               lat
               lng
            }
            stripePaymentMethods {
               stripePaymentMethodId
               last4
               expMonth
               expYear
               brand
            }
            defaultPaymentMethodId
            defaultStripePaymentMethod {
               stripePaymentMethodId
               last4
               expMonth
               expYear
               brand
            }
         }
      }
   }
`

export const CREATE_BRAND_CUSTOMER = gql`
   mutation CreateBrandCustomer($object: crm_brand_customer_insert_input!) {
      createBrandCustomer(object: $object) {
         id
         brandId
         keycloakId
      }
   }
`

export const CREATE_CART = gql`
   mutation($object: crm_orderCart_insert_input!) {
      createCart(object: $object) {
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

export const UPDATE_CART = gql`
   mutation UpdateCart($id: Int!, $set: crm_orderCart_set_input) {
      updateCart(where: { id: { _eq: $id } }, _set: $set) {
         returning {
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
   }
`

export const UPDATE_CUSTOMER = gql`
   mutation platform_updateCustomer(
      $keycloakId: String!
      $_set: platform_customer_set_input!
   ) {
      platform_updateCustomer(
         _set: $_set
         pk_columns: { keycloakId: $keycloakId }
      ) {
         email
         lastName
         firstName
         keycloakId
         phoneNumber
      }
   }
`

export const CREATE_CUSTOMER_ADDRESS = gql`
   mutation platform_createCustomerAddress(
      $object: platform_customerAddress_insert_input!
   ) {
      platform_createCustomerAddress(object: $object) {
         id
         lat
         lng
         line1
         line2
         city
         state
         landmark
         country
         zipcode
         label
         notes
      }
   }
`

export const CREATE_STRIPE_PAYMENT_METHOD = gql`
   mutation paymentMethod($object: platform_stripePaymentMethod_insert_input!) {
      paymentMethod: platform_createStripePaymentMethod(object: $object) {
         keycloakId
         stripePaymentMethodId
      }
   }
`

export const DELETE_CARTS = gql`
   mutation DeleteCarts($ids: [Int!]) {
      deleteCarts(where: { id: { _in: $ids } }) {
         returning {
            id
         }
      }
   }
`

export const CREATE_ORDER_CART_REWARDS = gql`
   mutation OrderCartRewards($objects: [crm_orderCart_rewards_insert_input!]!) {
      createOrderCartRewards(objects: $objects) {
         returning {
            id
         }
      }
   }
`

export const DELETE_ORDER_CART_REWARDS = gql`
   mutation DeleteOrderCartRewards($cartId: Int!) {
      deleteOrderCartRewards(where: { orderCartId: { _eq: $cartId } }) {
         returning {
            id
         }
      }
   }
`
