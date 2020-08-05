import gql from 'graphql-tag'

export const CREATE_CUSTOMER = gql`
   mutation CreateCustomer($object: crm_customer_insert_input!) {
      createCustomer(object: $object) {
         id
         email
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
