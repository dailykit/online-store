import gql from 'graphql-tag';

export const CUSTOMERS = gql`
  query Customers($dailyKeyID: String!, $email: String!) {
    customers(
      where: { dailyKeyUserId: { _eq: $dailyKeyID }, email: { _eq: $email } }
    ) {
      id
    }
  }
`;

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
          line1
          line2
          state
          zipcode
          city
          country
        }
        defaultCustomerAddress {
          line1
          line2
          state
          zipcode
          city
          country
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
`;

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
`;
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
`;

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
`;

export const INVENTORY_PRODUCT = gql`
  query InventoryProduct($id: Int!) {
    inventoryProduct(id: $id) {
      assets
      default
      description
      id
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
  }
`;

export const SIMPLE_PRODUCT = gql`
  query SimpleRecipeProduct($id: Int!) {
    simpleRecipeProduct(id: $id) {
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
`;
