import gql from 'graphql-tag';

export const CART = gql`
  subscription Cart($customerId: Int!) {
    cart(
      where: {
        customerId: { _eq: $customerId }
        paymentStatus: { _eq: "PENDING" }
      }
    ) {
      id
      isValid
      cartInfo
      fulfillmentInfo
    }
  }
`;
