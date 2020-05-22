import gql from "graphql-tag";

export const CREATE_CUSTOMER = gql`
  mutation CreateCustomer($object: crm_customer_insert_input!) {
    createCustomer(object: $object) {
      id
    }
  }
`;
