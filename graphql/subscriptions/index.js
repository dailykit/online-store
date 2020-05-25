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
