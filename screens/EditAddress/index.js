import { useMutation } from '@apollo/react-hooks'
import { Feather } from '@expo/vector-icons'
import { Button, Spinner } from 'react-native'
import React from 'react'
import { Text, TouchableOpacity, View } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import { useAppContext } from '../../context/app'
import { useCartContext } from '../../context/cart'
import { useDrawerContext } from '../../context/drawer'
import { UPDATE_CART } from '../../graphql'
import { styles } from './styles'

export default ({ navigation }) => {
   const { cart, customerDetails } = useCartContext()
   const { visual } = useAppContext()
   const { open, setIsDrawerOpen } = useDrawerContext()

   const [loading, setLoading] = React.useState(false)

   // Mutation
   const [updateCart] = useMutation(UPDATE_CART, {
      onCompleted: () => {
         setLoading(false)
         setIsDrawerOpen(false)
      },
      onError: error => {
         console.log(error)
         setLoading(false)
      },
   })

   // Handlers
   const select = address => {
      try {
         if (cart) {
            setLoading(true)
            updateCart({
               variables: {
                  id: cart.id,
                  set: {
                     address: address,
                  },
               },
            })
         }
      } catch (error) {
         setLoading(false)
         console.log(error)
      }
   }

   if (!customerDetails)
      return (
         <ScrollView style={styles.conatiner}>
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
                     open('DailyKeyBackup', { path: 'address/create' })
                  }
               >
                  <Text style={{ color: '#fff' }}>Add Address</Text>
               </Button>
            </View>
         </ScrollView>
      )

   if (loading)
      return (
         <View
            style={{ flex: 1, justifyContent: 'center', alignItems: ' center' }}
            onPress={() => navigation.goBack()}
         >
            <Spinner size="large" />
         </View>
      )

   return (
      <View style={styles.conatiner}>
         <Text style={styles.title}>Addresses</Text>
         <ScrollView style={styles.addressConatiner}>
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
                     <Text style={[styles.addressText, { fontWeight: 600 }]}>
                        {address.label}
                     </Text>
                     <Text style={styles.addressText}>{address.line1}</Text>
                     <Text style={styles.addressText}>{address.line2}</Text>
                     <Text style={styles.addressText}>{address.landmark}</Text>
                     <Text style={styles.addressText}>
                        {`${address.city}, ${address.state}, ${address.country} - ${address.zipcode} `}
                     </Text>
                     <Text
                        style={[styles.addressText, { fontStyle: 'italic' }]}
                     >
                        {address.notes}
                     </Text>
                  </View>
                  <View style={styles.addressSelectedContainer}>
                     <View
                        style={[
                           styles.checkContainer,
                           {
                              borderWidth: 1,
                              borderColor:
                                 address?.id === cart?.address?.id
                                    ? visual.color
                                    : '#dedede',
                              backgroundColor:
                                 address?.id === cart?.address?.id
                                    ? visual.color
                                    : '#fff',
                           },
                        ]}
                     >
                        {address?.id === cart?.address?.id && (
                           <Feather color="#fff" name="check" />
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
            onPress={() => open('DailyKeyBackup', { path: 'address/create' })}
         >
            <Text style={{ color: '#fff' }}>Add Address</Text>
         </Button>
      </View>
   )
}
