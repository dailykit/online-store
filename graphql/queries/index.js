import gql from 'graphql-tag'

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

export const ORDER = gql`
   query Order($id: oid!) {
      order(id: $id) {
         itemTotal
         deliveryInfo
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
         name
         id
         comboProductComponents {
            id
            label
            customizableProductId
            inventoryProductId
            simpleRecipeProductId
            customizableProduct {
               customizableProductOptions {
                  simpleRecipeProduct {
                     simpleRecipeProductOptions {
                        price
                     }
                  }
               }
            }
            inventoryProduct {
               inventoryProductOptions {
                  price
               }
            }
            simpleRecipeProduct {
               simpleRecipeProductOptions {
                  price
               }
            }
         }
      }
   }
`

export const CUSTOMIZABLE_PRODUCT = gql`
   query CustomizableProduct($id: Int!) {
      customizableProduct(id: $id) {
         name
         id
         customizableProductOptions {
            id
            simpleRecipeProduct {
               name
               default
               id
               simpleRecipeProductOptions {
                  price
                  type
                  simpleRecipeYield {
                     yield
                  }
                  simpleRecipeYieldId
               }
               simpleRecipe {
                  author
                  cookingTime
                  assets
                  cuisine
                  description
                  id
                  image
                  name
                  procedures
                  show
                  utensils
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
         inventoryProductOptions {
            id
            price
            quantity
            label
            inventoryProductId
         }
      }
   }
`

export const SIMPLE_PRODUCT = gql`
   query SimpleRecipeProduct($id: Int!) {
      simpleRecipeProduct(id: $id) {
         name
         default
         id
         tags
         description
         assets
         simpleRecipeProductOptions {
            id
            price
            type
            simpleRecipeYield {
               yield
            }
            simpleRecipeYieldId
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
         sachetItem {
            unitSize
            unit
         }
         supplierItem {
            unitSize
            unit
         }
         inventoryProductOptions {
            id
            price
            quantity
            label
            inventoryProductId
         }
      }
   }
`

export const SIMPLE_RECIPE_PRODUCTS = gql`
   query SimpleRecipeProducts($ids: [Int!]!) {
      simpleRecipeProducts(where: { id: { _in: $ids } }) {
         name
         default
         id
         assets
         simpleRecipeProductOptions {
            id
            price
            type
            simpleRecipeYield {
               yield
            }
            simpleRecipeYieldId
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
         name
         id
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
               inventoryProductOptions {
                  id
                  price
                  quantity
                  label
                  inventoryProductId
               }
            }
            simpleRecipeProduct {
               name
               default
               assets
               id
               simpleRecipeProductOptions {
                  id
                  price
                  type
                  simpleRecipeYield {
                     yield
                  }
                  simpleRecipeYieldId
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
         name
         id
         comboProductComponents {
            id
            label
            customizableProductId
            inventoryProductId
            simpleRecipeProductId
            customizableProduct {
               id
               name
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
                     inventoryProductOptions {
                        id
                        price
                        quantity
                        label
                        inventoryProductId
                     }
                  }
                  simpleRecipeProduct {
                     name
                     default
                     id
                     simpleRecipeProductOptions {
                        id
                        price
                        type
                        simpleRecipeYield {
                           yield
                        }
                        simpleRecipeYieldId
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
               inventoryProductOptions {
                  id
                  price
                  quantity
                  label
                  inventoryProductId
               }
            }
            simpleRecipeProduct {
               name
               default
               id
               simpleRecipeProductOptions {
                  id
                  price
                  type
                  simpleRecipeYield {
                     yield
                  }
                  simpleRecipeYieldId
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
