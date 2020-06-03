import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  Switch,
} from 'react-native';
import HeaderBack from '../components/HeaderBack';
import { useCartContext } from '../context/cart';
import EStyleSheet from 'react-native-extended-stylesheet';
import { Feather, AntDesign } from '@expo/vector-icons';
import { Spinner } from '@ui-kitten/components';
import Cart from '../components/Cart';
import { UPDATE_CART } from '../graphql';
import { useMutation } from '@apollo/react-hooks';

import { height, width } from '../utils/Scalaing';
import { Button } from 'native-base';
import { useAppContext } from '../context/app';
import {
  CreditCardInput,
  LiteCreditCardInput,
} from 'react-native-credit-card-input';

export const SelectPaymentMethod = ({ navigation }) => {
  const { cart, customerDetails } = useCartContext();
  const { visual } = useAppContext();

  const [loading, setLoading] = React.useState(false);
  const [useLiteCreditCardInput, setUseLiteCreditCardInput] = useState(true);

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
            id: cart.id,
            set: {
              paymentMethodId: card.stripePaymentMethodId,
              stripeCustomerId: customerDetails.stripeCustomerId,
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
        <HeaderBack navigation={navigation} title='Go Back' />
        <Text style={styles.title}>Payment Cards</Text>
        <View
          style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
          onPress={() => navigation.goBack()}
        >
          {/* TODO : EXAMPLE COMPONENT (REMOVE IN PRODUCTION) */}
          <CreditCardInput
            labelStyle={styles.label}
            inputStyle={styles.input}
            validColor={'black'}
            invalidColor={'red'}
            placeholderColor={'darkgray'}
            onFocus={_onFocus}
            placeholder={{
              number: '4335 3245 2343 5678',
              expiry: '12/24',
              cvc: '123',
            }}
            values={{
              number: '4335 3245 2343 5678',
              expiry: '12/24',
              cvc: '123',
            }}
            onChange={_onChange}
            additionalInputsProps={{
              display: 'none',
              height: 0,
              width: 0,
              margin: 0,
              padding: 0,
              borderWidth: 0,
            }}
            inputContainerStyle={{
              borderBottomWidth: 0,
            }}
          />
          <Button
            style={{
              marginBottom: 20,
              backgroundColor: visual.color || '#3FA4FF',
              borderRadius: 0,
              marginHorizontal: 10,
              padding: 8,
              justifyContent: 'center',
            }}
            onPress={() =>
              navigation.navigate('Add Details', { path: 'cards' })
            }
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
        onPress={() => navigation.goBack()}
      >
        <Spinner />
      </View>
    );

  return (
    <View style={styles.conatiner}>
      <HeaderBack navigation={navigation} title='Go Back' />
      <Text style={styles.title}>Payment Cards</Text>
      <View style={styles.cardNumberConatiner}>
        {customerDetails.stripePaymentMethods.map((card) => (
          <CreditCardInput
            labelStyle={styles.label}
            inputStyle={styles.input}
            validColor={'black'}
            invalidColor={'red'}
            placeholderColor={'darkgray'}
            onFocus={_onFocus}
            values={{
              number: '4335 3245 2343 5678',
              expiry: '12/24',
              cvc: '123',
            }}
            onChange={_onChange}
            additionalInputsProps={{
              display: 'none',
              height: 0,
              width: 0,
              margin: 0,
              padding: 0,
              borderWidth: 0,
            }}
            inputContainerStyle={{
              borderBottomWidth: 0,
            }}
          />
          // <TouchableOpacity
          //   key={card.stripePaymentMethodId}
          //   onPress={() => select(card)}
          //   style={[
          //     styles.cardNumberOptionConatiner,
          //     {
          //       backgroundColor:
          //         card.stripePaymentMethodId === cart?.paymentMethodId
          //           ? '#fff'
          //           : '#f3f3f3',
          //     },
          //   ]}
          // >
          //   <View style={styles.cardNumberTextContainer}>
          //     <Text style={styles.cardNumberText}>
          //       <AntDesign name='creditcard' /> {'  '}
          //       XXXX XXXX XXXX {card.last4}
          //     </Text>
          //     <Text style={styles.cardNumberText}>{card.brand}</Text>
          //   </View>
          //   <View style={styles.cardNumberSelectedContainer}>
          //     <View
          //       style={[
          //         styles.checkContainer,
          //         {
          //           borderWidth: 1,
          //           borderColor:
          //             card.stripePaymentMethodId === cart?.paymentMethodId
          //               ? visual.color
          //                 ? visual.color
          //                 : '#3fa4ff'
          //               : '#dedede',
          //           backgroundColor:
          //             card.stripePaymentMethodId === cart?.paymentMethodId
          //               ? visual.color
          //                 ? visual.color
          //                 : '#3fa4ff'
          //               : '#fff',
          //         },
          //       ]}
          //     >
          //       {card.stripePaymentMethodId === cart?.paymentMethodId && (
          //         <Feather color='#fff' name='check' />
          //       )}
          //     </View>
          //   </View>
          // </TouchableOpacity>
        ))}
      </View>

      <Button
        style={{
          marginBottom: 20,
          backgroundColor: visual.color || '#3FA4FF',
          borderRadius: 0,
          marginHorizontal: 10,
          padding: 8,
          justifyContent: 'center',
        }}
        onPress={() => navigation.navigate('Add Details', { path: 'cards' })}
      >
        <Text style={{ color: '#fff' }}>Add Card</Text>
      </Button>
    </View>
  );
};

const styles = EStyleSheet.create({
  conatiner: {
    flex: 1,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: '$xl',
    padding: 20,
  },
  cardNumberConatiner: {
    flexDirection: 'column',
    flex: 1,
  },
  cardNumberOptionConatiner: {
    justifyContent: 'center',
    height: height * 0.12,
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#dedede',
    marginBottom: 4,
  },
  cardNumberTextContainer: {
    flex: 3,
    justifyContent: 'center',
  },
  cardNumberText: {
    width: width * 0.7,
    paddingLeft: 20,
  },
  cardNumberSelectedContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkContainer: {
    backgroundColor: '#3fa4ff',
    height: 24,
    width: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  switch: {
    alignSelf: 'center',
    marginTop: 20,
    marginBottom: 20,
  },

  label: {
    color: 'black',
    fontSize: 12,
    display: 'none',
    height: 0,
    width: 0,
    margin: 0,
    padding: 0,
    borderWidth: 0,
  },
  input: {
    fontSize: 16,
    color: 'black',
    display: 'none',
    height: 0,
    width: 0,
    margin: 0,
    padding: 0,
    borderWidth: 0,
  },
});
