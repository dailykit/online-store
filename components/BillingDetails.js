import { useMutation } from '@apollo/react-hooks';
import { Input, Modal } from '@ui-kitten/components';
import { Button } from 'native-base';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useCartContext } from '../context/cart';
import { UPDATE_CART } from '../graphql';

const BillingDetails = () => {
  const { cart } = useCartContext();
  const [isVisible, setIsVisible] = React.useState(false);
  const [tip, setTip] = React.useState(cart?.tip);

  // Mutation
  const [updateCart] = useMutation(UPDATE_CART, {
    onCompleted: () => {
      console.log('Tip updated!');
      setIsVisible(false);
    },
    onError: (error) => {
      console.log(error);
    },
  });

  // Handler
  const addTip = () => {
    if (!isNaN(tip)) {
      const tipFloat = parseFloat(tip);
      updateCart({
        variables: {
          id: cart.id,
          set: {
            tip: tipFloat,
          },
        },
      });
    }
  };

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
          <Text style={styles.billing_details_right_text}>
            $ {cart?.itemTotal}
          </Text>
        </View>
      </View>
      <View style={styles.bill_child_container}>
        <View style={styles.bill_child_container_left}>
          <Text style={styles.billing_details_left_text}>Delivery Fee</Text>
        </View>
        <View style={styles.bill_child_container_right}>
          <Text style={styles.billing_details_right_text}>
            $ {cart?.deliveryPrice}
          </Text>
        </View>
      </View>
      <View style={styles.bill_child_container}>
        <View style={styles.bill_child_container_left}>
          <Text style={styles.billing_details_left_text}>Tip</Text>
        </View>
        <View style={styles.bill_child_container_right}>
          <Text style={styles.billing_details_right_text}>$ {cart?.tip}</Text>
          <TouchableOpacity
            style={{ marginLeft: 8 }}
            onPress={() => setIsVisible(true)}
          >
            <Text>edit</Text>
          </TouchableOpacity>
          <Modal
            visible={isVisible}
            onBackdropPress={() => setIsVisible(false)}
          >
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <View
                style={{
                  padding: 16,
                  backgroundColor: '#fff',
                  borderRadius: 6,
                }}
              >
                <Input
                  placeholder='Add your tip'
                  value={tip}
                  onChangeText={(nextValue) => setTip(nextValue)}
                />
                <Button onPress={addTip} style={styles.button_container_left}>
                  <Text style={{ color: 'white' }}>Add</Text>
                </Button>
              </View>
            </View>
          </Modal>
        </View>
      </View>
      <View style={styles.bill_child_container}>
        <View style={styles.bill_child_container_left}>
          <Text style={styles.billing_details_left_text}>
            Tax @{cart?.taxPercent}%
          </Text>
        </View>
        <View style={styles.bill_child_container_right}>
          <Text style={styles.billing_details_right_text}>$ {cart?.tax}</Text>
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
            $ {cart?.totalPrice}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  billing_details: {
    // paddingHorizontal: 30,
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
    fontSize: '$m',
  },
  billing_details_title_text: {
    fontSize: '$m',
    color: 'rgba(0,0,0,0.6)',
    fontWeight: 'bold',
  },
  billing_details_left_text: {
    fontSize: '$m',
  },
  button_container_left: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3fa4ff',
  },
});

export default BillingDetails;
