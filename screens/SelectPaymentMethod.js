import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
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

export const SelectPaymentMethod = ({ navigation }) => {
  const { cart, customerDetails } = useCartContext();

  const [loading, setLoading] = React.useState(false);

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
      <View
        style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
        onPress={() => navigation.goBack()}
      >
        <Text>Error loading data!</Text>
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
          <TouchableOpacity
            key={card.stripePaymentMethodId}
            onPress={() => select(card)}
            style={[
              styles.cardNumberOptionConatiner,
              {
                backgroundColor:
                  card.stripePaymentMethodId === cart?.paymentMethodId
                    ? '#fff'
                    : '#f3f3f3',
              },
            ]}
          >
            <View style={styles.cardNumberTextContainer}>
              <Text style={styles.cardNumberText}>
                <AntDesign name='creditcard' /> {'  '}
                XXXX XXXX XXXX {card.last4}
              </Text>
              <Text style={styles.cardNumberText}>{card.brand}</Text>
            </View>
            <View style={styles.cardNumberSelectedContainer}>
              <View
                style={[
                  styles.checkContainer,
                  {
                    borderWidth: 1,
                    borderColor:
                      card.stripePaymentMethodId === cart?.paymentMethodId
                        ? '#3fa4ff'
                        : '#dedede',
                    backgroundColor:
                      card.stripePaymentMethodId === cart?.paymentMethodId
                        ? '#3fa4ff'
                        : '#fff',
                  },
                ]}
              >
                {card.stripePaymentMethodId === cart?.paymentMethodId && (
                  <Feather color='#fff' name='check' />
                )}
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </View>
      <Button
        style={{
          marginBottom: 20,
          backgroundColor: '#3FA4FF',
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
});
