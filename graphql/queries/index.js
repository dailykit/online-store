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
         procedures
         richResult
         simpleRecipeYields(order_by: { yield: asc }) {
            id
            yield
            nutritionalInfo
            allergens
            ingredientSachets(where: { isVisible: { _eq: true } }) {
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

export const COMBO_PRODUCT = gql`
   query ComboProduct($id: Int!) {
      comboProduct(id: $id) {
         id
         name
         additionalText
         description
         tags
         isPopupAllowed
         defaultCartItem
         assets
         price
         richResult
         comboProductComponents(where: { isArchived: { _eq: false } }) {
            id
            label
            options
            customizableProductId
            inventoryProductId
            simpleRecipeProductId
            customizableProduct {
               id
               name
               price
               defaultCustomizableProductOption {
                  inventoryProduct {
                     assets
                  }
                  simpleRecipeProduct {
                     assets
                  }
               }
               customizableProductOptions(
                  where: { isArchived: { _eq: false } }
               ) {
                  id
                  options
                  inventoryProduct {
                     id
                     assets
                     default
                     description
                     name
                     tags
                     sachetItem {
                        unitSize
                        unit
                     }
                     supplierItem {
                        unitSize
                        unit
                     }
                     defaultInventoryProductOption {
                        id
                        price
                        quantity
                        label
                        inventoryProductId
                        modifier {
                           id
                           data
                        }
                     }
                     inventoryProductOptions(
                        where: { isArchived: { _eq: false } }
                     ) {
                        id
                        price
                        quantity
                        label
                        inventoryProductId
                        modifier {
                           id
                           data
                        }
                     }
                  }
                  simpleRecipeProduct {
                     name
                     default
                     id
                     assets
                     defaultSimpleRecipeProductOption {
                        id
                        price
                        type
                        simpleRecipeYield {
                           yield
                        }
                        simpleRecipeYieldId
                        modifier {
                           id
                           data
                        }
                     }
                     simpleRecipeProductOptions(
                        where: {
                           isActive: { _eq: true }
                           isArchived: { _eq: false }
                        }
                     ) {
                        id
                        price
                        type
                        simpleRecipeYield {
                           yield
                        }
                        simpleRecipeYieldId
                        modifier {
                           id
                           data
                        }
                     }
                     simpleRecipe {
                        author
                        cuisine
                        id
                        name
                        show
                        type
                     }
                  }
               }
            }
            inventoryProduct {
               id
               assets
               default
               description
               name
               tags
               defaultInventoryProductOption {
                  id
                  price
                  quantity
                  label
                  inventoryProductId
                  modifier {
                     id
                     data
                  }
               }
               inventoryProductOptions(where: { isArchived: { _eq: false } }) {
                  id
                  price
                  quantity
                  label
                  inventoryProductId
                  modifier {
                     id
                     data
                  }
               }
            }
            simpleRecipeProduct {
               name
               default
               id
               assets
               defaultSimpleRecipeProductOption {
                  id
                  price
                  type
                  simpleRecipeYield {
                     yield
                  }
                  simpleRecipeYieldId
                  modifier {
                     id
                     data
                  }
               }
               simpleRecipeProductOptions(
                  where: { isActive: { _eq: true }, isArchived: { _eq: false } }
               ) {
                  id
                  price
                  type
                  simpleRecipeYield {
                     yield
                  }
                  simpleRecipeYieldId
                  modifier {
                     id
                     data
                  }
               }
               simpleRecipe {
                  author
                  cuisine
                  id
                  name
                  show
                  type
               }
            }
         }
      }
   }
`

export const CUSTOMIZABLE_PRODUCT = gql`
   query CustomizableProduct($id: Int!) {
      customizableProduct(id: $id) {
         id
         name
         additionalText
         description
         tags
         isPopupAllowed
         defaultCartItem
         assets
         price
         richResult
         customizableProductOptions(where: { isArchived: { _eq: false } }) {
            id
            options
            inventoryProduct {
               id
               assets
               default
               description
               name
               tags
               sachetItem {
                  unitSize
                  unit
               }
               supplierItem {
                  unitSize
                  unit
               }
               defaultInventoryProductOption {
                  id
                  price
                  quantity
                  label
                  inventoryProductId
                  modifier {
                     id
                     data
                  }
               }
               inventoryProductOptions(where: { isArchived: { _eq: false } }) {
                  id
                  price
                  quantity
                  label
                  inventoryProductId
                  modifier {
                     id
                     data
                  }
               }
            }
            simpleRecipeProduct {
               name
               default
               assets
               id
               defaultSimpleRecipeProductOption {
                  id
                  price
                  type
                  simpleRecipeYield {
                     yield
                  }
                  simpleRecipeYieldId
                  modifier {
                     id
                     data
                  }
               }
               simpleRecipeProductOptions(
                  where: { isActive: { _eq: true }, isArchived: { _eq: false } }
               ) {
                  id
                  price
                  type
                  simpleRecipeYield {
                     yield
                  }
                  simpleRecipeYieldId
                  modifier {
                     id
                     data
                  }
               }
               simpleRecipe {
                  author
                  cuisine
                  id
                  name
                  show
                  type
               }
            }
         }
      }
   }
`

export const INVENTORY_PRODUCT = gql`
   query InventoryProduct($id: Int!) {
      inventoryProduct(id: $id) {
         id
         name
         additionalText
         description
         tags
         assets
         recommendations
         default
         isPopupAllowed
         defaultCartItem
         allergens
         nutritionalInfo
         richResult
         defaultInventoryProductOption {
            id
            price
            quantity
            label
            inventoryProductId
            modifier {
               id
               data
            }
         }
         inventoryProductOptions(where: { isArchived: { _eq: false } }) {
            id
            price
            quantity
            label
            inventoryProductId
            modifier {
               id
               data
            }
         }
      }
   }
`

export const SIMPLE_PRODUCT = gql`
   query SimpleRecipeProduct($id: Int!) {
      simpleRecipeProduct(id: $id) {
         id
         name
         additionalText
         default
         tags
         description
         recommendations
         assets
         isPopupAllowed
         defaultCartItem
         defaultSimpleRecipeProductOption {
            id
            price
            type
            simpleRecipeYield {
               yield
            }
            simpleRecipeYieldId
            modifier {
               id
               data
            }
         }
         simpleRecipeProductOptions(
            where: { isActive: { _eq: true }, isArchived: { _eq: false } }
         ) {
            id
            price
            type
            simpleRecipeYield {
               yield
            }
            simpleRecipeYieldId
            modifier {
               id
               data
            }
         }
         simpleRecipe {
            author
            cuisine
            id
            name
            show
            type
         }
      }
   }
`

export const INVENTORY_PRODUCTS = gql`
   query InventoryProducts($ids: [Int!]!) {
      inventoryProducts(
         where: { id: { _in: $ids }, isPublished: { _eq: true } }
      ) {
         id
         assets
         default
         description
         name
         additionalText
         tags
         isPopupAllowed
         defaultCartItem
         sachetItem {
            unitSize
            unit
         }
         supplierItem {
            unitSize
            unit
         }
         defaultInventoryProductOption {
            id
            price
            quantity
            label
            inventoryProductId
            modifier {
               id
               data
            }
         }
         inventoryProductOptions(where: { isArchived: { _eq: false } }) {
            id
            price
            quantity
            label
            inventoryProductId
            modifier {
               id
               data
            }
         }
      }
   }
`

export const SIMPLE_RECIPE_PRODUCTS = gql`
   query SimpleRecipeProducts($ids: [Int!]!) {
      simpleRecipeProducts(
         where: { id: { _in: $ids }, isPublished: { _eq: true } }
      ) {
         id
         name
         additionalText
         default
         assets
         isPopupAllowed
         defaultCartItem
         defaultSimpleRecipeProductOption {
            id
            price
            type
            simpleRecipeYield {
               yield
            }
            simpleRecipeYieldId
            modifier {
               id
               data
            }
         }
         simpleRecipeProductOptions(where: { isActive: { _eq: true } }) {
            id
            price
            type
            simpleRecipeYield {
               yield
            }
            simpleRecipeYieldId
            modifier {
               id
               data
            }
         }
         simpleRecipe {
            author
            cuisine
            id
            name
            show
            type
         }
      }
   }
`

export const CUSTOMIZABLE_PRODUCTS = gql`
   query CustomizableProducts($ids: [Int!]!) {
      customizableProducts(
         where: {
            id: { _in: $ids }
            isPublished: { _eq: true }
            isArchived: { _eq: false }
         }
      ) {
         id
         name
         additionalText
         isPopupAllowed
         defaultCartItem
         assets
         price
         customizableProductOptions(where: { isArchived: { _eq: false } }) {
            id
            options
            inventoryProduct {
               id
               assets
               default
               description
               name
               tags
               sachetItem {
                  unitSize
                  unit
               }
               supplierItem {
                  unitSize
                  unit
               }
               defaultInventoryProductOption {
                  id
                  price
                  quantity
                  label
                  inventoryProductId
                  modifier {
                     id
                     data
                  }
               }
               inventoryProductOptions(where: { isArchived: { _eq: false } }) {
                  id
                  price
                  quantity
                  label
                  inventoryProductId
                  modifier {
                     id
                     data
                  }
               }
            }
            simpleRecipeProduct {
               name
               default
               assets
               id
               defaultSimpleRecipeProductOption {
                  id
                  price
                  type
                  simpleRecipeYield {
                     yield
                  }
                  simpleRecipeYieldId
                  modifier {
                     id
                     data
                  }
               }
               simpleRecipeProductOptions(
                  where: { isActive: { _eq: true }, isArchived: { _eq: false } }
               ) {
                  id
                  price
                  type
                  simpleRecipeYield {
                     yield
                  }
                  simpleRecipeYieldId
                  modifier {
                     id
                     data
                  }
               }
               simpleRecipe {
                  author
                  cuisine
                  id
                  name
                  show
                  type
               }
            }
         }
      }
   }
`

export const COMBO_PRODUCTS = gql`
   query ComboProducts($ids: [Int!]!) {
      comboProducts(
         where: {
            id: { _in: $ids }
            isPublished: { _eq: true }
            isArchived: { _eq: false }
         }
      ) {
         id
         name
         additionalText
         isPopupAllowed
         defaultCartItem
         assets
         price
         comboProductComponents(where: { isArchived: { _eq: false } }) {
            id
            label
            options
            customizableProductId
            inventoryProductId
            simpleRecipeProductId
            customizableProduct {
               id
               name
               price
               defaultCustomizableProductOption {
                  inventoryProduct {
                     assets
                  }
                  simpleRecipeProduct {
                     assets
                  }
               }
               customizableProductOptions(
                  where: { isArchived: { _eq: false } }
               ) {
                  id
                  options
                  inventoryProduct {
                     id
                     assets
                     default
                     description
                     name
                     tags
                     sachetItem {
                        unitSize
                        unit
                     }
                     supplierItem {
                        unitSize
                        unit
                     }
                     defaultInventoryProductOption {
                        id
                        price
                        quantity
                        label
                        inventoryProductId
                        modifier {
                           id
                           data
                        }
                     }
                     inventoryProductOptions(
                        where: { isArchived: { _eq: false } }
                     ) {
                        id
                        price
                        quantity
                        label
                        inventoryProductId
                        modifier {
                           id
                           data
                        }
                     }
                  }
                  simpleRecipeProduct {
                     name
                     assets
                     default
                     id
                     defaultSimpleRecipeProductOption {
                        id
                        price
                        type
                        simpleRecipeYield {
                           yield
                        }
                        simpleRecipeYieldId
                        modifier {
                           id
                           data
                        }
                     }
                     simpleRecipeProductOptions(
                        where: {
                           isActive: { _eq: true }
                           isArchived: { _eq: false }
                        }
                     ) {
                        id
                        price
                        type
                        simpleRecipeYield {
                           yield
                        }
                        simpleRecipeYieldId
                        modifier {
                           id
                           data
                        }
                     }
                     simpleRecipe {
                        author
                        cuisine
                        id
                        name
                        show
                        type
                     }
                  }
               }
            }
            inventoryProduct {
               id
               assets
               default
               description
               name
               tags
               defaultInventoryProductOption {
                  id
                  price
                  quantity
                  label
                  inventoryProductId
                  modifier {
                     id
                     data
                  }
               }
               inventoryProductOptions(where: { isArchived: { _eq: false } }) {
                  id
                  price
                  quantity
                  label
                  inventoryProductId
                  modifier {
                     id
                     data
                  }
               }
            }
            simpleRecipeProduct {
               name
               default
               id
               assets
               defaultSimpleRecipeProductOption {
                  id
                  price
                  type
                  simpleRecipeYield {
                     yield
                  }
                  simpleRecipeYieldId
                  modifier {
                     id
                     data
                  }
               }
               simpleRecipeProductOptions(
                  where: { isActive: { _eq: true }, isArchived: { _eq: false } }
               ) {
                  id
                  price
                  type
                  simpleRecipeYield {
                     yield
                  }
                  simpleRecipeYieldId
                  modifier {
                     id
                     data
                  }
               }
               simpleRecipe {
                  author
                  cuisine
                  id
                  name
                  show
                  type
               }
            }
         }
      }
   }
`

export const SEARCH_PRODUCTS = gql`
   query(
      $comboProducts: [Int!]!
      $customizableProducts: [Int!]!
      $simpleRecipeProducts: [Int!]!
      $inventoryProducts: [Int!]!
      $name: String!
      $tag: jsonb!
   ) {
      comboProducts(
         where: {
            _and: [
               {
                  id: { _in: $comboProducts }
                  _or: [
                     { name: { _ilike: $name } }
                     { tags: { _contains: $tag } }
                  ]
                  isPublished: { _eq: true }
               }
            ]
         }
      ) {
         id
         name
         additionalText
         isPopupAllowed
         defaultCartItem
         assets
         comboProductComponents(where: { isArchived: { _eq: false } }) {
            id
            label
            customizableProductId
            inventoryProductId
            simpleRecipeProductId
            customizableProduct {
               id
               name
               defaultCustomizableProductOption {
                  inventoryProduct {
                     assets
                  }
                  simpleRecipeProduct {
                     assets
                  }
               }
               customizableProductOptions(
                  where: { isArchived: { _eq: false } }
               ) {
                  id
                  inventoryProduct {
                     id
                     assets
                     default
                     description
                     name
                     tags
                     sachetItem {
                        unitSize
                        unit
                     }
                     supplierItem {
                        unitSize
                        unit
                     }
                     defaultInventoryProductOption {
                        id
                        price
                        quantity
                        label
                        inventoryProductId
                        modifier {
                           id
                           data
                        }
                     }
                     inventoryProductOptions(
                        where: { isArchived: { _eq: false } }
                     ) {
                        id
                        price
                        quantity
                        label
                        inventoryProductId
                        modifier {
                           id
                           data
                        }
                     }
                  }
                  simpleRecipeProduct {
                     name
                     default
                     id
                     assets
                     defaultSimpleRecipeProductOption {
                        id
                        price
                        type
                        simpleRecipeYield {
                           yield
                        }
                        simpleRecipeYieldId
                        modifier {
                           id
                           data
                        }
                     }
                     simpleRecipeProductOptions(
                        where: {
                           isActive: { _eq: true }
                           isArchived: { _eq: false }
                        }
                     ) {
                        id
                        price
                        type
                        simpleRecipeYield {
                           yield
                        }
                        simpleRecipeYieldId
                        modifier {
                           id
                           data
                        }
                     }
                     simpleRecipe {
                        author
                        cuisine
                        id
                        name
                        show
                        type
                     }
                  }
               }
            }
            inventoryProduct {
               id
               assets
               default
               description
               name
               tags
               defaultInventoryProductOption {
                  id
                  price
                  quantity
                  label
                  inventoryProductId
                  modifier {
                     id
                     data
                  }
               }
               inventoryProductOptions(where: { isArchived: { _eq: false } }) {
                  id
                  price
                  quantity
                  label
                  inventoryProductId
                  modifier {
                     id
                     data
                  }
               }
            }
            simpleRecipeProduct {
               name
               default
               id
               assets
               defaultSimpleRecipeProductOption {
                  id
                  price
                  type
                  simpleRecipeYield {
                     yield
                  }
                  simpleRecipeYieldId
                  modifier {
                     id
                     data
                  }
               }
               simpleRecipeProductOptions(
                  where: { isActive: { _eq: true }, isArchived: { _eq: true } }
               ) {
                  id
                  price
                  type
                  simpleRecipeYield {
                     yield
                  }
                  simpleRecipeYieldId
                  modifier {
                     id
                     data
                  }
               }
               simpleRecipe {
                  author
                  cuisine
                  id
                  name
                  show
                  type
               }
            }
         }
      }
      customizableProducts(
         where: {
            _and: [
               {
                  id: { _in: $customizableProducts }
                  _or: [
                     { name: { _ilike: $name } }
                     { tags: { _contains: $tag } }
                  ]
                  isPublished: { _eq: true }
               }
            ]
         }
      ) {
         id
         name
         additionalText
         isPopupAllowed
         defaultCartItem
         assets
         customizableProductOptions(where: { isArchived: { _eq: false } }) {
            id
            inventoryProduct {
               id
               assets
               default
               description
               name
               tags
               sachetItem {
                  unitSize
                  unit
               }
               supplierItem {
                  unitSize
                  unit
               }
               defaultInventoryProductOption {
                  id
                  price
                  quantity
                  label
                  inventoryProductId
                  modifier {
                     id
                     data
                  }
               }
               inventoryProductOptions(where: { isArchived: { _eq: false } }) {
                  id
                  price
                  quantity
                  label
                  inventoryProductId
                  modifier {
                     id
                     data
                  }
               }
            }
            simpleRecipeProduct {
               name
               default
               assets
               id
               defaultSimpleRecipeProductOption {
                  id
                  price
                  type
                  simpleRecipeYield {
                     yield
                  }
                  simpleRecipeYieldId
                  modifier {
                     id
                     data
                  }
               }
               simpleRecipeProductOptions(
                  where: { isActive: { _eq: true }, isArchived: { _eq: false } }
               ) {
                  id
                  price
                  type
                  simpleRecipeYield {
                     yield
                  }
                  simpleRecipeYieldId
                  modifier {
                     id
                     data
                  }
               }
               simpleRecipe {
                  author
                  cuisine
                  id
                  name
                  show
                  type
               }
            }
         }
      }
      simpleRecipeProducts(
         where: {
            _and: [
               {
                  id: { _in: $simpleRecipeProducts }
                  _or: [
                     { name: { _ilike: $name } }
                     { tags: { _contains: $tag } }
                  ]
                  isPublished: { _eq: true }
               }
            ]
         }
      ) {
         id
         name
         additionalText
         default
         tags
         description
         assets
         isPopupAllowed
         defaultCartItem
         defaultSimpleRecipeProductOption {
            id
            price
            type
            simpleRecipeYield {
               yield
            }
            simpleRecipeYieldId
            modifier {
               id
               data
            }
         }
         simpleRecipeProductOptions(
            where: { isActive: { _eq: true }, isArchived: { _eq: false } }
         ) {
            id
            price
            type
            simpleRecipeYield {
               yield
            }
            simpleRecipeYieldId
            modifier {
               id
               data
            }
         }
         simpleRecipe {
            author
            cuisine
            id
            name
            show
            type
         }
      }
      inventoryProducts(
         where: {
            _and: [
               {
                  id: { _in: $inventoryProducts }
                  _or: [
                     { name: { _ilike: $name } }
                     { tags: { _contains: $tag } }
                  ]
                  isPublished: { _eq: true }
               }
            ]
         }
      ) {
         id
         name
         additionalText
         description
         tags
         assets
         default
         isPopupAllowed
         defaultCartItem
         defaultInventoryProductOption {
            id
            price
            quantity
            label
            inventoryProductId
            modifier {
               id
               data
            }
         }
         inventoryProductOptions(where: { isArchived: { _eq: false } }) {
            id
            price
            quantity
            label
            inventoryProductId
            modifier {
               id
               data
            }
         }
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

export const BRANDS = gql`
   query BRANDS($domain: String!) {
      brands(
         where: {
            _or: [{ domain: { _eq: $domain } }, { isDefault: { _eq: true } }]
         }
      ) {
         id
         isDefault
         domain
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
