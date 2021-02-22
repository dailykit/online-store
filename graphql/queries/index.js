import gql from 'graphql-tag'

export const PAYMENT_PARTNERSHIP = gql`
   query PaymentPartnership($brandId: Int!) {
      brands_brand_paymentPartnership(
         where: {
            _and: [{ brandId: { _eq: $brandId } }, { isActive: { _eq: true } }]
         }
      ) {
         brandId
         paymentPartnershipId
      }
   }
`

export const CART_PAYMENT = gql`
   query cart($id: Int!) {
      cart: cartByPK(id: $id) {
         id
         paymentStatus
         payment {
            id
            paymentStatus
            paymentRequestId
            paymentTransactionId
         }
      }
   }
`

export const FETCH_CART = gql`
   query FetchCart($id: Int!) {
      cartByPK(id: $id) {
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

export const SIMPLE_RECIPE = gql`
   query SimpleRecipe($id: Int!) {
      simpleRecipe(id: $id) {
         simpleRecipeProducts {
            id
            recommendations
         }
         id
         name
         image
         author
         type
         cookingTime
         cuisine
         description
         utensils
         notIncluded
         showIngredients
         showIngredientsQuantity
         showProcedures
         richResult
         instructionSets(order_by: { position: desc_nulls_last }) {
            id
            title
            instructionSteps(order_by: { position: desc_nulls_last }) {
               id
               title
               description
               assets
               isVisible
            }
         }
         simpleRecipeYields(order_by: { yield: asc }) {
            id
            yield
            nutritionalInfo
            allergens
            ingredientSachets(
               where: {
                  simpleRecipeIngredientProcessing: {
                     isArchived: { _eq: false }
                  }
               }
               order_by: {
                  simpleRecipeIngredientProcessing: {
                     position: desc_nulls_last
                  }
               }
            ) {
               ingredientSachetId
               slipName
               isVisible
               ingredientSachet {
                  unit
                  quantity
                  ingredient {
                     image
                  }
               }
            }
         }
      }
   }
`

export const CUSTOMER = gql`
   query Customer($keycloakId: String!, $brandId: Int!) {
      customer(keycloakId: $keycloakId) {
         id
         email
         keycloakId
         isTest
         brandCustomers {
            id
            brandId
            keycloakId
         }
         customerReferralDetails {
            id
            signupStatus
            referralStatus
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
               label
               landmark
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
               label
               landmark
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
         orderCarts(
            where: {
               status: { _eq: "PENDING" }
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
         }
      }
   }
`

export const GET_MENU = gql`
   query GetMenu($params: jsonb!) {
      onDemand_getMenuV2(args: { params: $params }) {
         id
         data
      }
   }
`

export const GET_STORE_PRODUCT = gql`
   query GetStoreProduct($id: Int!, $type: String!) {
      onDemand_getOnlineStoreProduct(
         args: { productid: $id, producttype: $type }
      ) {
         id
         data
      }
   }
`

export const STRIPE_PK = gql`
   query StripePublishableKey {
      organizations {
         stripePublishableKey
      }
   }
`

export const SET_REFERRAL_CODE = gql`
   query SetReferralCode($params: jsonb!) {
      crm_setReferralCode(args: { params: $params }) {
         success
         message
      }
   }
`

export const SETTINGS = gql`
   query StoreSettings($brandId: Int!, $identifier: String!, $type: String!) {
      storeSettings(
         where: { identifier: { _eq: $identifier }, type: { _eq: $type } }
      ) {
         value
         brandSettings(where: { brandId: { _eq: $brandId } }) {
            value
         }
      }
   }
`

export const ALL_COUPONS = gql`
   query Coupons($brandId: Int!) {
      coupons(
         where: {
            isActive: { _eq: true }
            isArchived: { _eq: false }
            brands: { brandId: { _eq: $brandId }, isActive: { _eq: true } }
         }
      ) {
         id
         code
         metaDetails
      }
   }
`
