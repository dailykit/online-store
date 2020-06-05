import { useMutation } from '@apollo/react-hooks';
import { Spinner } from '@ui-kitten/components';
import { Button } from 'native-base';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import HeaderBack from '../../components/HeaderBack';
import { useAppContext } from '../../context/app';
import { useCartContext } from '../../context/cart';
import { UPDATE_CART } from '../../graphql';
import { styles } from './styles';

export default ({ navigation }) => {
   const { cart, customerDetails } = useCartContext();
   const { visual } = useAppContext();

   const [loading, setLoading] = React.useState(false);

   // Mutation
   const [updateCart] = useMutation(UPDATE_CART, {
      onCompleted: () => {
         console.log('Address updated!');
         navigation.goBack();
      },
      onError: error => {
         console.log(error);
         setLoading(false);
      },
   });

   // Handlers
   const select = address => {
      try {
         if (cart) {
            setLoading(true);
            updateCart({
               variables: {
                  id: cart.id,
                  set: {
                     address: address,
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
            <HeaderBack navigation={navigation} title="Go Back" />
            <Text style={styles.title}>Addresses</Text>
            <View
               style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
               }}
               onPress={() => navigation.goBack()}
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
                  onPress={() =>
                     navigation.navigate('Add Details', { path: 'address' })
                  }
               >
                  <Text style={{ color: '#fff' }}>Add Address</Text>
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
         <HeaderBack navigation={navigation} title="Go Back" />
         <Text style={styles.title}>Addresses</Text>
         <View style={styles.addressConatiner}>
            {customerDetails?.customerAddresses.map(address => (
               <TouchableOpacity
                  key={address.id}
                  onPress={() => select(address)}
                  style={[
                     styles.addressOptionConatiner,
                     {
                        backgroundColor:
                           address === cart?.address ? '#fff' : '#f3f3f3',
                     },
                  ]}
               >
                  <View style={styles.addressTextContainer}>
                     <Text style={styles.addressText}>{address.line1}</Text>
                     <Text style={styles.addressText}>{address.line2}</Text>
                     <Text style={styles.addressText}>
                        {address.city + ', ' + address.state}
                     </Text>
                     <Text style={styles.addressText}>{address.country}</Text>
                     <Text style={styles.addressText}>{address.zipcode}</Text>
                  </View>
                  {/* <View style={styles.addressSelectedContainer}>
              <View
                style={[
                  styles.checkContainer,
                  {
                    borderWidth: 1,
                    borderColor:
                      address.id === cart.addressId ? '#3fa4ff' : '#dedede',
                    backgroundColor:
                      address.id === cart.addressId ? '#3fa4ff' : '#fff',
                  },
                ]}
              >
                {address.id === cart.addressId && (
                  <Feather color='#fff' name='check' />
                )}
              </View>
            </View> */}
               </TouchableOpacity>
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
            onPress={() =>
               navigation.navigate('Add Details', { path: 'address' })
            }
         >
            <Text style={{ color: '#fff' }}>Add Address</Text>
         </Button>
      </View>
   );
};

