import gql from 'graphql-tag';

export const CUSTOMER = gql`
  subscription Customers($keycloakId: String!, $email: String!) {
    customers(
      where: { keycloakId: { _eq: $keycloakId }, email: { _eq: $email } }
    ) {
      id
      email
      keycloakId
      orderCarts(where: { status: { _eq: "PENDING" } }) {
        cartInfo
        customerId
        id
        isValid
        paymentMethodId
        stripeCustomerId
        addressId
        fulfillmentInfo
        deliveryPrice
        itemTotal
        tip
        taxPercent
        tax
        totalPrice
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
