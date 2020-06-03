import gql from 'graphql-tag';

export const CREATE_CUSTOMER = gql`
  mutation CreateCustomer($object: crm_customer_insert_input!) {
    createCustomer(object: $object) {
      id
      email
      keycloakId
    }
  }
`;

export const CREATE_CART = gql`
  mutation($object: crm_orderCart_insert_input!) {
    createCart(object: $object) {
      id
    }
  }
`;

export const UPDATE_CART = gql`
  mutation UpdateCart($id: Int!, $set: crm_orderCart_set_input) {
    updateCart(where: { id: { _eq: $id } }, _set: $set) {
      returning {
        id
      }
    }
  }
`;
