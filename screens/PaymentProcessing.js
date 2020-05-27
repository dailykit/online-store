import React from 'react';
import { View, Text, Spinner } from 'native-base';
import { useCartContext } from '../context/cart';

const PaymentProcessing = ({ navigation }) => {
  const { cart } = useCartContext();

  //Effect
  React.useEffect(() => {
    if (cart.paymentStatus === 'DONE') {
      navigation.navigate('OrderPlaced');
    }
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      {cart.paymentStatus === 'PENDING' ? (
        <React.Fragment>
          <Text style={{ marginBottom: 20 }}>
            Wait! We're trying to process your payment...
          </Text>
          <Spinner />
        </React.Fragment>
      ) : (
        <Text style={{ marginBottom: 20 }}>Payment failed!</Text>
      )}
    </View>
  );
};

export default PaymentProcessing;
