import { useMutation } from '@apollo/react-hooks';
import { Feather } from '@expo/vector-icons';
import { Spinner } from '@ui-kitten/components';
import { Button } from 'native-base';
import React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import CreditCardInput from '../../components/CreditCardInput';
import { useAppContext } from '../../context/app';
import { useCartContext } from '../../context/cart';
import { useDrawerContext } from '../../context/drawer';
import { UPDATE_CART } from '../../graphql';
import { styles } from './styles';

export default ({ navigation }) => {
  const { cart, customerDetails } = useCartContext();
  const { visual } = useAppContext();
  const { open } = useDrawerContext();

  const [loading, setLoading] = React.useState(false);

  const _onChange = (formData) =>
    console.log(JSON.stringify(formData, null, ' '));
  const _onFocus = (field) => console.log('focusing', field);
  const _setUseLiteCreditCardInput = (useLiteCreditCardInput) =>
    setUseLiteCreditCardInput(useLiteCreditCardInput);
  // Mutation
  const [updateCart] = useMutation(UPDATE_CART, {
    onCompleted: () => {
      console.log('Payment method updated!');
      navigation.goBack();
    },
    onError: (error) => {
      console.log(error);
      setLoading(false);
    },
  });

  // Handlers
  const select = (card) => {
    try {
      if (cart) {
        setLoading(true);
        updateCart({
          variables: {
            id: cart?.id,
            set: {
              paymentMethodId: card?.stripePaymentMethodId,
              stripeCustomerId: customerDetails?.stripeCustomerId,
            },
          },
        });
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  if (!customerDetails)
    return (
      <View style={styles.conatiner}>
        <Text style={styles.title}>Payment Cards</Text>
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Button
            style={{
              marginBottom: 20,
              backgroundColor: visual.color || '#3FA4FF',
              borderRadius: 0,
              marginHorizontal: 10,
              padding: 8,
              justifyContent: 'center',
            }}
            onPress={() => open('AddDetails', { path: 'card/create' })}
          >
            <Text style={{ color: '#fff' }}>Add Card</Text>
          </Button>
        </View>
      </View>
    );

  if (loading)
    return (
      <View
        style={{ flex: 1, justifyContent: 'center', alignItems: ' center' }}
      >
        <Spinner />
      </View>
    );

  return (
    <View style={styles.conatiner}>
      <Text style={styles.title}>Payment Cards</Text>
      <ScrollView style={styles.cardNumberConatiner}>
        {customerDetails.stripePaymentMethods.map((card) => (
          <TouchableOpacity
            key={card?.stripePaymentMethodId}
            onPress={() => select(card)}
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 8,
            }}
          >
            <CreditCardInput
              number={`XXXX XXXX XXXX ${card?.last4}`}
              expiry={`${card?.expMonth}/${card?.expYear}`}
              brand={card?.brand}
            />
            <View style={styles.cardNumberSelectedContainer}>
              <View
                style={[
                  styles.checkContainer,
                  {
                    borderWidth: 1,
                    borderColor:
                      card?.stripePaymentMethodId === cart?.paymentMethodId
                        ? visual.color
                          ? visual.color
                          : '#3fa4ff'
                        : '#dedede',
                    backgroundColor:
                      card?.stripePaymentMethodId === cart?.paymentMethodId
                        ? visual.color
                          ? visual.color
                          : '#3fa4ff'
                        : '#fff',
                  },
                ]}
              >
                {card?.stripePaymentMethodId === cart?.paymentMethodId && (
                  <Feather color='#fff' name='check' />
                )}
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <Button
        style={{
          marginBottom: 20,
          backgroundColor: visual.color || '#3FA4FF',
          borderRadius: 0,
          marginHorizontal: 10,
          padding: 8,
          justifyContent: 'center',
        }}
        onPress={() => open('AddDetails', { path: 'card/create' })}
      >
        <Text style={{ color: '#fff' }}>Add Card</Text>
      </Button>
    </View>
  );
};
