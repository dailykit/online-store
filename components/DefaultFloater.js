import React from 'react';
import { Text, View, Dimensions, TouchableOpacity } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import { Feather, AntDesign, Ionicons } from '@expo/vector-icons';
import { useCartContext } from '../context/cart';

import { height, width } from '../utils/Scalaing';

export const DefaultPaymentFloater = ({ navigation }) => {
   const { cart, customerDetails } = useCartContext();
   const [card, setCard] = React.useState(undefined);

   React.useEffect(() => {
      if (cart && customerDetails) {
         const card = customerDetails.stripePaymentMethods.find(
            card => card.stripePaymentMethodId === cart.paymentMethodId
         );
         if (card) {
            setCard(card);
         }
      }
   }, [cart]);

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
                  <AntDesign name="creditcard" /> {'  '}
                  XXXX XXXX XXXX {card.last4}
               </Text>
            ) : (
               <Text style={styles.cardNumberText}>Select a Card</Text>
            )}
         </View>
         <View style={styles.cardNumberSelectedContainer}>
            <View>
               <Text>
                  edit {'    '} <Ionicons name="ios-arrow-forward" />
               </Text>
            </View>
         </View>
      </TouchableOpacity>
   );
};

export const DefaultAddressFloater = ({ navigation }) => {
   const { cart, customerDetails } = useCartContext();

   return (
      <TouchableOpacity
         onPress={() => {
            navigation.navigate('EditAddressScreen');
         }}
         style={styles.conatiner}
      >
         <View style={styles.cardNumberTextContainer}>
            {cart?.address ? (
               <Text style={styles.cardNumberText}>
                  {cart.address.line1}, {cart.address.line2},{' '}
                  {cart.address.city}
               </Text>
            ) : (
               <Text style={styles.cardNumberText}>Select an Address</Text>
            )}
         </View>
         <View style={styles.cardNumberSelectedContainer}>
            <View>
               <Text>
                  edit {'    '} <Ionicons name="ios-arrow-forward" />
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
      paddingLeft: 20,
      paddingRight: 20,
      justifyContent: 'space-between',
   },
   title: {
      fontSize: '$xl',
      padding: 20,
   },
   cardNumberConatiner: {
      flexDirection: 'column',
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
      justifyContent: 'center',
      alignItems: 'center',
   },
   cardNumberText: {
      width: 'auto',
   },
   cardNumberSelectedContainer: {
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
