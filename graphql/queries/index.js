import gql from 'graphql-tag'

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
         procedures
         simpleRecipeYields(order_by: { yield: asc }) {
            id
            yield
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
   query Customer($keycloakId: String!) {
      customer(keycloakId: $keycloakId) {
         id
         email
         keycloakId
         isTest
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
         orderCarts(
            where: {
               status: { _eq: "PENDING" }
               cartSource: { _eq: "a-la-carte" }
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
      onlineStore_getMenu(args: { params: $params }) {
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
         isPopupAllowed
         defaultCartItem
         assets
         comboProductComponents {
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
               customizableProductOptions {
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
                     inventoryProductOptions {
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
                        where: { isActive: { _eq: true } }
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
               inventoryProductOptions {
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
      }
   }
`

export const CUSTOMIZABLE_PRODUCT = gql`
   query CustomizableProduct($id: Int!) {
      customizableProduct(id: $id) {
         id
         name
         isPopupAllowed
         defaultCartItem
         assets
         customizableProductOptions {
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
               inventoryProductOptions {
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
      }
   }
`

export const INVENTORY_PRODUCT = gql`
   query InventoryProduct($id: Int!) {
      inventoryProduct(id: $id) {
         id
         name
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
         inventoryProductOptions {
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
         inventoryProductOptions {
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
         where: { id: { _in: $ids }, isPublished: { _eq: true } }
      ) {
         id
         name
         isPopupAllowed
         defaultCartItem
         assets
         customizableProductOptions {
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
               inventoryProductOptions {
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
               simpleRecipeProductOptions {
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
      comboProducts(where: { id: { _in: $ids }, isPublished: { _eq: true } }) {
         id
         name
         isPopupAllowed
         defaultCartItem
         assets
         comboProductComponents {
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
               customizableProductOptions {
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
                     inventoryProductOptions {
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
                     simpleRecipeProductOptions {
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
               inventoryProductOptions {
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
               simpleRecipeProductOptions {
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
         isPopupAllowed
         defaultCartItem
         assets
         comboProductComponents {
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
               customizableProductOptions {
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
                     inventoryProductOptions {
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
                        where: { isActive: { _eq: true } }
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
               inventoryProductOptions {
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
         isPopupAllowed
         defaultCartItem
         assets
         customizableProductOptions {
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
               inventoryProductOptions {
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
         inventoryProductOptions {
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

export const SHOPS = gql`
   query Shops($domain: String!) {
      shops(where: { domain: { _eq: $domain } }) {
         id
      }
   }
`
