import { useMutation, useSubscription } from '@apollo/react-hooks';
import { Spinner } from '@ui-kitten/components';
import { Text, View } from 'native-base';
import React from 'react';
import { useCartContext } from '../../context/cart';
import { CART_BY_PK, UPDATE_CART } from '../../graphql';
import { styles } from './styles';

const PaymentProcessing = ({ navigation }) => {
  const { cart } = useCartContext();

  const [cartId, setCartId] = React.useState(undefined);
  const [progress, setProgress] = React.useState('Sending your order...');

  // Subscription
  const { data, loading, error } = useSubscription(CART_BY_PK, {
    variables: {
      id: cartId,
    },
  });

  // Mutation
  const [updateCart] = useMutation(UPDATE_CART, {
    onCompleted: () => {
      console.log('Cart confirmed!');
    },
    onError: (error) => {
      console.log(error);
    },
  });

  //Effects
  React.useEffect(() => {
    updateCart({
      variables: {
        id: cart.id,
        set: {
          status: 'PROCESS',
          amount: cart.totalPrice,
        },
      },
    });
    setCartId(cart.id);
  }, []);

  React.useEffect(() => {
    if (data) {
      switch (data.cartByPK.paymentStatus) {
        case 'PENDING': {
          return setProgress('Processing your payment...');
        }
        case 'SUCCEEDED': {
          if (data.cartByPK.status !== 'ORDER_PLACED') {
            return setProgress('Getting order details...');
          } else {
            return navigation.navigate('OrderPlaced', {
              orderId: data.cartByPK.orderId,
            });
            // return navigation.navigate('Home');
          }
        }
        case 'FAILED': {
          return setProgress('Payment failed :(');
        }
        default: {
          return setProgress('Something is not right...');
        }
      }
    }
  }, [data]);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <React.Fragment>
        {!error ? (
          <React.Fragment>
            <Text style={{ marginBottom: 20 }}>Wait! {progress}</Text>
            <Spinner status='success' />
          </React.Fragment>
        ) : (
          <Text>Unable to fetch live status! Check in your orders.</Text>
        )}
      </React.Fragment>
    </View>
  );
};

export default PaymentProcessing;
