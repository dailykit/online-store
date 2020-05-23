import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

import { useCartContext } from '../context/cart';
import EStyleSheet from 'react-native-extended-stylesheet';

const BillingDetails = () => {
  const { totalPrice } = useCartContext();
  return (
    <View style={styles.billing_details}>
      <View style={styles.bill_child_container}>
        <Text style={styles.billing_details_title_text}>Bill Details</Text>
      </View>
      <View style={styles.bill_child_container}>
        <View style={styles.bill_child_container_left}>
          <Text style={styles.billing_details_left_text}>Item Total</Text>
        </View>
        <View style={styles.bill_child_container_right}>
          <Text style={styles.billing_details_right_text}>$ {totalPrice}</Text>
        </View>
      </View>
      <View style={styles.bill_child_container}>
        <View style={styles.bill_child_container_left}>
          <Text style={styles.billing_details_left_text}>Delivery Fee</Text>
        </View>
        <View style={styles.bill_child_container_right}>
          <Text style={styles.billing_details_right_text}>$ 1.50</Text>
        </View>
      </View>
      <View style={styles.bill_child_container}>
        <View style={styles.bill_child_container_left}>
          <Text style={styles.billing_details_left_text}>Tax @2.5%</Text>
        </View>
        <View style={styles.bill_child_container_right}>
          <Text style={styles.billing_details_right_text}>$ 2.50</Text>
        </View>
      </View>
      <View style={styles.bill_child_container}>
        <View style={styles.bill_child_container_left}>
          <Text style={styles.billing_details_left_text}>Tip</Text>
        </View>
        <View style={styles.bill_child_container_right}>
          <Text
            style={[
              styles.billing_details_right_text,
              {
                fontWeight: 'bold',
                color: '#3fa4fd',
              },
            ]}
          >
            Add
          </Text>
        </View>
      </View>
      <View style={styles.bill_child_container}>
        <View style={styles.bill_child_container_left}>
          <Text
            style={[styles.billing_details_left_text, { fontWeight: 'bold' }]}
          >
            To Pay
          </Text>
        </View>
        <View style={styles.bill_child_container_right}>
          <Text
            style={[styles.billing_details_right_text, { fontWeight: 'bold' }]}
          >
            $ 7.50
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  billing_details: {
    paddingHorizontal: 30,
  },
  bill_child_container: {
    flexDirection: 'row',
    height: 40,
  },
  bill_child_container_left: {
    flex: 4,
  },
  bill_child_container_right: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  billing_details_right_text: {
    flex: 1,
    fontSize: 16,
  },
  billing_details_title_text: {
    fontSize: 16,
    color: 'rgba(0,0,0,0.6)',
    fontWeight: 'bold',
  },
  billing_details_left_text: {
    fontSize: 16,
  },
});

export default BillingDetails;
