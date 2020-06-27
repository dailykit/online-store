import gql from 'graphql-tag';

export const PREORDER_PICKUP = gql`
  subscription PreOrderPickup {
    preOrderPickup: fulfillmentTypes(
      where: { isActive: { _eq: true }, value: { _eq: "PREORDER_PICKUP" } }
    ) {
      recurrences(where: { isActive: { _eq: true } }) {
        id
        type
        rrule
        timeSlots(where: { isActive: { _eq: true } }) {
          id
          to
          from
          pickUpLeadTime
        }
      }
    }
  }
`;

export const ONDEMAND_PICKUP = gql`
  subscription OndemandPickup {
    onDemandPickup: fulfillmentTypes(
      where: { isActive: { _eq: true }, value: { _eq: "ONDEMAND_PICKUP" } }
    ) {
      recurrences(where: { isActive: { _eq: true } }) {
        id
        type
        rrule
        timeSlots(where: { isActive: { _eq: true } }) {
          id
          to
          from
          pickUpPrepTime
        }
      }
    }
  }
`;

export const PREORDER_DELIVERY = gql`
  subscription PreOrderDelivery($distance: numeric!) {
    preOrderDelivery: fulfillmentTypes(
      where: { isActive: { _eq: true }, value: { _eq: "PREORDER_DELIVERY" } }
    ) {
      recurrences(where: { isActive: { _eq: true } }) {
        id
        type
        rrule
        timeSlots(where: { isActive: { _eq: true } }) {
          id
          to
          from
          mileRanges(
            where: {
              isActive: { _eq: true }
              from: { _lte: $distance }
              to: { _gte: $distance }
            }
          ) {
            id
            to
            from
            isActive
            leadTime
            charges {
              id
              charge
              orderValueFrom
              orderValueUpto
            }
          }
        }
      }
    }
  }
`;

export const ONDEMAND_DELIVERY = gql`
  subscription OnDemandDelivery($distance: numeric!) {
    onDemandDelivery: fulfillmentTypes(
      where: { isActive: { _eq: true }, value: { _eq: "ONDEMAND_DELIVERY" } }
    ) {
      recurrences(where: { isActive: { _eq: true } }) {
        id
        type
        rrule
        timeSlots(where: { isActive: { _eq: true } }) {
          id
          to
          from
          mileRanges(
            where: {
              isActive: { _eq: true }
              from: { _lte: $distance }
              to: { _gte: $distance }
            }
          ) {
            id
            to
            from
            isActive
            prepTime
            charges {
              id
              charge
              orderValueFrom
              orderValueUpto
            }
          }
        }
      }
    }
  }
`;

export const ORDERS = gql`
  subscription Orders($id: Int!) {
    orders(
      where: { customerId: { _eq: $id } }
      order_by: { created_at: desc }
    ) {
      id
      orderStatus
      itemTotal
      deliveryInfo
      created_at
      deliveryPrice
      discount
      itemTotal
      tax
      tip
      transactionId
      orderInventoryProducts {
        inventoryProduct {
          name
        }
        inventoryProductOption {
          label
          price
        }
      }
      orderMealKitProducts {
        simpleRecipeProduct {
          name
        }
        simpleRecipeProductOption {
          price
          simpleRecipeYield {
            yield
          }
        }
      }
      orderReadyToEatProducts {
        simpleRecipeProduct {
          name
        }
        simpleRecipeProductOption {
          price
          simpleRecipeYield {
            yield
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
