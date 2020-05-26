import React from 'react';
import { Text, View, Dimensions, TouchableOpacity } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import { Feather, AntDesign, Ionicons } from '@expo/vector-icons';
import { useCartContext } from '../context/cart';

const { height, width } = Dimensions.get('window');

export const DefaultPaymentFloater = ({ navigation }) => {
  const { cart, customerDetails } = useCartContext();
  const [card, setCard] = React.useState(undefined);

  React.useEffect(() => {
    if (customerDetails) {
      const card = customerDetails.stripePaymentMethods.find(
        (card) => card.stripePaymentMethodId === cart.paymentMethodId
      );
      if (card) {
        setCard(card);
      }
    }
  }, []);

  return (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate('SelectPaymentMethodScreen');
      }}
      style={styles.conatiner}
    >
      <View style={styles.cardNumberTextContainer}>
        {card ? (
          <Text style={styles.cardNumberText}>
            <AntDesign name='creditcard' /> {'  '}
            XXXX XXXX XXXX {card.last4}
          </Text>
        ) : (
          <Text style={styles.cardNumberText}>Select a Card</Text>
        )}
      </View>
      <View style={styles.cardNumberSelectedContainer}>
        <View>
          <Text>
            edit {'    '} <Ionicons name='ios-arrow-forward' />
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export const DefaultAddressFloater = ({ navigation }) => {
  const { cart, customerDetails } = useCartContext();
  const [address, setAddress] = React.useState(undefined);

  React.useEffect(() => {
    if (customerDetails) {
      const address = customerDetails.customerAddresses.find(
        (address) => address.id === cart.addressId
      );
      if (address) {
        setAddress(address);
      }
    }
  }, []);

  return (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate('EditAddressScreen');
      }}
      style={styles.conatiner}
    >
      <View style={styles.cardNumberTextContainer}>
        {address ? (
          <Text style={styles.cardNumberText}>
            {address.line1}, {address.line2}, {address.city}
          </Text>
        ) : (
          <Text style={styles.cardNumberText}>Select an Address</Text>
        )}
      </View>
      <View style={styles.cardNumberSelectedContainer}>
        <View>
          <Text>
            edit {'    '} <Ionicons name='ios-arrow-forward' />
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = EStyleSheet.create({
  conatiner: {
    height: height * 0.07,
    backgroundColor: '#ededed',
    flexDirection: 'row',
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
    alignItems: 'center',
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
