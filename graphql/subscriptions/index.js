import gql from 'graphql-tag';

export const INVENTORY_PRODUCTS = gql`
  subscription InventoryProducts($ids: [Int!]!) {
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
`;

export const SIMPLE_RECIPE_PRODUCTS = gql`
  subscription SimpleRecipeProducts($ids: [Int!]!) {
    simpleRecipeProducts(where: { id: { _in: $ids } }) {
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
`;

export const CUSTOMIZABLE_PRODUCTS = gql`
  subscription CustomizableProducts($ids: [Int!]!) {
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
`;

export const COMBO_PRODUCTS = gql`
  subscription ComboProducts($ids: [Int!]!) {
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
`;

export const STORE_SETTINGS = gql`
  subscription {
    storeSettings {
      type
      value
      identifier
    }
  }
`;

export const CUSTOMER = gql`
  subscription Customers($keycloakId: String!, $email: String!) {
    customers(
      where: { email: { _eq: $email }, keycloakId: { _eq: $keycloakId } }
    ) {
      id
      orderCarts(where: { status: { _eq: "PENDING" } }) {
        id
        address
        customerInfo
        cartInfo
        customerId
        id
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
`;

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
`;

export const CART_BY_PK = gql`
  subscription CartByPK($id: Int!) {
    cartByPK(id: $id) {
      paymentStatus
      status
      id
      orderId
    }
  }
`;
