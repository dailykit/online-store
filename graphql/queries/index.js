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
         simpleRecipeYields {
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

export const CUSTOMERS = gql`
   query Customers($dailyKeyID: String!, $email: String!) {
      customers(
         where: { dailyKeyUserId: { _eq: $dailyKeyID }, email: { _eq: $email } }
      ) {
         id
      }
   }
`

export const CUSTOMER_DETAILS = gql`
   query CustomerDetails($keycloakId: String!) {
      platform_customerByClients(where: { keycloakId: { _eq: $keycloakId } }) {
         customer {
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

export const GET_MENU = gql`
   query GetMenu($year: Int!, $month: Int!, $day: Int!) {
      getMenu(year: $year, month: $month, day: $day) {
         name
         comboProducts
         customizableProducts
         inventoryProducts
         simpleRecipeProducts
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
      inventoryProducts(where: { id: { _in: $ids } }) {
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
      simpleRecipeProducts(where: { id: { _in: $ids } }) {
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
      customizableProducts(where: { id: { _in: $ids } }) {
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
      comboProducts(where: { id: { _in: $ids } }) {
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
