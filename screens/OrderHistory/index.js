import { Divider, Spinner } from '@ui-kitten/components';
import * as moment from 'moment';
import { Accordion } from 'native-base';
import React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useCartContext } from '../../context/cart';
import { ORDERS } from '../../graphql';
import { styles } from './styles';
import { useSubscription } from '@apollo/react-hooks';
import { Header } from '../../components';

export default ({ navigation }) => {
  const { customer } = useCartContext();

  const whatColor = (status) => {
    switch (status) {
      case 'PENDING':
        return '#F6AD55';
      case 'READY_TO_DISPATCH':
        return '#4299E1';
      case 'DELIVERED':
        return '#48BB78';
      default:
        return '#aaa';
    }
  };

  // Query
  const { data, loading, error } = useSubscription(ORDERS, {
    variables: {
      id: customer?.id,
    },
  });

  if (loading) {
    return (
      <View style={styles.center}>
        <Spinner />
      </View>
    );
  }

  if (error) {
    return (
      <>
        <Header title='Home' navigation={navigation} />
        <View style={styles.center}>
          <Text>Oops! We could not get orders. Check again later!</Text>
        </View>
      </>
    );
  }

  return (
    <View style={{ backgroundColor: '#fff', flex: 1 }}>
      <Header title='Home' navigation={navigation} />
      <View style={styles.outerContainer}>
        <Text style={styles.heading}>Order History</Text>
        <ScrollView style={styles.container}>
          {data?.orders
            .filter((order) => order?.deliveryInfo)
            .map((order) => (
              <>
                <TouchableOpacity
                  key={order?.id}
                  // onPress={() => navigation.navigate('DeliveryScreen')}
                  style={styles.card}
                >
                  <View style={styles.head}>
                    <Text style={styles.title}>Order ID: {order?.id}</Text>
                    <Text
                      style={[
                        styles.status,
                        {
                          backgroundColor: whatColor(order.orderStatus),
                        },
                      ]}
                    >
                      {order.orderStatus.replace(/_/g, ' ')}
                    </Text>
                  </View>
                  <Text style={[styles.muted, styles.bold]}>
                    Ordered on:{' '}
                    <Text style={styles.lite}>
                      {moment(order?.created_at).format('LLLL')}
                    </Text>
                  </Text>
                  {/* <Text style={[styles.muted, styles.bold]}>
                           Deliver on: <Text style={styles.lite}>NA</Text>
                        </Text> */}
                  <Text style={styles.muted}>
                    {order?.deliveryInfo?.dropoff?.dropoffInfo?.customerAddress
                      ?.line1 +
                      ', ' +
                      order?.deliveryInfo?.dropoff?.dropoffInfo?.customerAddress
                        ?.line2 +
                      ', ' +
                      order?.deliveryInfo?.dropoff?.dropoffInfo?.customerAddress
                        ?.city +
                      ', ' +
                      order?.deliveryInfo?.dropoff?.dropoffInfo?.customerAddress
                        ?.state +
                      ', ' +
                      order?.deliveryInfo?.dropoff?.dropoffInfo?.customerAddress
                        ?.country}{' '}
                    -{' '}
                    {
                      order?.deliveryInfo.dropoff?.dropoffInfo?.customerAddress
                        ?.zipcode
                    }
                  </Text>
                  <Accordion
                    headerStyle={styles.header}
                    dataArray={[
                      {
                        title: `${
                          order.orderInventoryProducts.length +
                          order.orderMealKitProducts.length +
                          order.orderReadyToEatProducts.length
                        }  Item${
                          order.orderInventoryProducts.length +
                            order.orderMealKitProducts.length +
                            order.orderReadyToEatProducts.length >
                          1
                            ? 's'
                            : ''
                        }`,
                        content: (
                          <View style={{ width: '100%' }}>
                            {order.orderInventoryProducts.map((product) => (
                              <View style={styles.product}>
                                <View style={styles.productInfo}>
                                  <Text>{product.inventoryProduct.name}</Text>
                                  <Text style={styles.productOption}>
                                    {product.inventoryProductOption.label}
                                  </Text>
                                </View>
                                <Text style={styles.productPrice}>
                                  ${' '}
                                  {
                                    product.inventoryProductOption.price[0]
                                      .value
                                  }
                                </Text>
                              </View>
                            ))}
                            {order.orderMealKitProducts.map((product) => (
                              <View style={styles.product}>
                                <View style={styles.productInfo}>
                                  <Text>
                                    {product.simpleRecipeProduct.name}
                                  </Text>
                                  <Text style={styles.productOption}>
                                    Meal Kit Serving:{' '}
                                    {
                                      product.simpleRecipeProductOption
                                        .simpleRecipeYield.yield.serving
                                    }
                                  </Text>
                                </View>
                                <Text style={styles.productPrice}>
                                  ${' '}
                                  {
                                    product.simpleRecipeProductOption.price[0]
                                      .value
                                  }
                                </Text>
                              </View>
                            ))}
                            {order.orderReadyToEatProducts.map((product) => (
                              <View style={styles.product}>
                                <View style={styles.productInfo}>
                                  <Text>
                                    {product.simpleRecipeProduct.name}
                                  </Text>
                                  <Text style={styles.productOption}>
                                    Ready to Eat Serving:{' '}
                                    {
                                      product.simpleRecipeProductOption
                                        .simpleRecipeYield.yield.serving
                                    }
                                  </Text>
                                </View>
                                <Text style={styles.productPrice}>
                                  ${' '}
                                  {
                                    product.simpleRecipeProductOption.price[0]
                                      .value
                                  }
                                </Text>
                              </View>
                            ))}
                          </View>
                        ),
                      },
                      {
                        title: 'Bill Details',
                        content: (
                          <View style={styles.rowContainer}>
                            <View style={styles.row}>
                              <Text>Txn ID</Text>
                              <Text>{order.transactionId}</Text>
                            </View>
                            <View style={styles.row}>
                              <Text>Delivery Price</Text>
                              <Text>$ {order.deliveryPrice}</Text>
                            </View>
                            {order.tip && (
                              <View style={styles.row}>
                                <Text>Tip</Text>
                                <Text>$ {order.tip}</Text>
                              </View>
                            )}
                            <View style={styles.row}>
                              <Text>Tax</Text>
                              <Text>$ {order.tax}</Text>
                            </View>
                            <View style={styles.row}>
                              <Text>Total Price</Text>
                              <Text>$ {order.itemTotal}</Text>
                            </View>
                          </View>
                        ),
                      },
                    ]}
                  />
                  <View style={styles.flexContainer}>
                    <Text style={styles.total}>Total</Text>
                    <Text style={styles.total}>$ {order?.itemTotal}</Text>
                  </View>
                </TouchableOpacity>
                <Divider />
              </>
            ))}
        </ScrollView>
      </View>
    </View>
  );
};
