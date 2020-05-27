import gql from 'graphql-tag';

export const CUSTOMER = gql`
  subscription Customers($keycloakId: String!, $email: String!) {
    customers(
      where: { email: { _eq: $email }, keycloakId: { _eq: $keycloakId } }
    ) {
      id
      orderCarts(where: { status: { _eq: "PENDING" } }) {
        id
        address
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
