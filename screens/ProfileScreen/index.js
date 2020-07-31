import { Feather, Ionicons, AntDesign } from '@expo/vector-icons'
import React from 'react'
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import HeaderBack from '../../components/HeaderBack'
import { useCartContext } from '../../context/cart'
import { useDrawerContext } from '../../context/drawer'
import { styles } from './styles'
import { Header } from '../../components'
import { useAppContext } from '../../context/app'
import AppSkeleton from '../../components/skeletons/app'
import Auth from '../../components/error/Auth'
import PlatformError from '../../components/error/PlatformError'

export default ({ navigation }) => {
   const { customer, customerDetails } = useCartContext()
   const { open } = useDrawerContext()
   const { masterLoading } = useAppContext()

   if (masterLoading) {
      return <AppSkeleton />
   }

   if (!customer) {
      return <Auth navigation={navigation} />
   }

   // if (!customerDetails) {
   //    return <PlatformError navigation={navigation} />
   // }

   return (
      <View style={{ backgroundColor: '#fff', height: '100%' }}>
         <Header title="Home" navigation={navigation} />
         <View style={styles.container}>
            <View style={styles.userDetailsContainer}>
               <View style={styles.avatar}>
                  <Image
                     source={require('../../assets/imgs/default-profile.png')}
                     style={styles.image}
                  />
               </View>
               <View
                  style={{
                     flexDirection: 'row',
                     alignItems: 'center',
                  }}
               >
                  <Text style={styles.userName}>
                     {customerDetails?.firstName
                        ? `${customerDetails?.firstName || ''} ${
                             customerDetails?.lastName || ''
                          }`
                        : 'Add your name'}
                  </Text>
                  <TouchableOpacity
                     style={{ marginLeft: 24 }}
                     onPress={() =>
                        open('AddDetails', { path: 'profile/create' })
                     }
                  >
                     <Feather name="edit" size={24} />
                  </TouchableOpacity>
               </View>
            </View>
            <ScrollView>
               {/* Address card */}
               <TouchableOpacity
                  onPress={() =>
                     customerDetails?.customerAddresses?.length
                        ? open('EditAddress')
                        : open('AddDetails', { path: 'address/create' })
                  }
                  style={styles.card}
               >
                  <Text style={styles.cardTitle}>My Addresses</Text>
                  <Text style={styles.default}>DEFAULT</Text>
                  <View style={styles.content}>
                     <View style={styles.cardNumberTextContainer}>
                        <Text style={styles.cardNumberText}>
                           {customerDetails?.defaultCustomerAddress ? (
                              <React.Fragment>
                                 {customerDetails.defaultCustomerAddress.line1 +
                                    ', ' +
                                    customerDetails.defaultCustomerAddress
                                       .line2 +
                                    ', ' +
                                    customerDetails.defaultCustomerAddress
                                       .city +
                                    ', ' +
                                    customerDetails.defaultCustomerAddress
                                       .state}
                              </React.Fragment>
                           ) : (
                              <React.Fragment>NA</React.Fragment>
                           )}
                        </Text>
                     </View>
                     <View style={styles.cardNumberSelectedContainer}>
                        <View>
                           <Text>
                              <Ionicons size={20} name="ios-arrow-forward" />
                           </Text>
                        </View>
                     </View>
                  </View>
               </TouchableOpacity>
               {/* Payment Card */}
               <TouchableOpacity
                  onPress={() =>
                     customerDetails?.stripePaymentMethods?.length
                        ? open('SelectPaymentMethod')
                        : open('AddDetails', { path: 'card/create' })
                  }
                  style={styles.card}
               >
                  <Text style={styles.cardTitle}>My Payment cards</Text>
                  <Text style={styles.default}>DEFAULT</Text>
                  <View style={styles.content}>
                     <View style={styles.cardNumberTextContainer}>
                        <Text style={styles.cardNumberText}>
                           <AntDesign name="creditcard" /> {'  '}
                           XXXX XXXX XXXX{' '}
                           {customerDetails?.defaultStripePaymentMethod
                              ?.last4 || 'XXXX'}
                        </Text>
                     </View>
                     <View style={styles.cardNumberSelectedContainer}>
                        <View>
                           <Text>
                              <Ionicons size={20} name="ios-arrow-forward" />
                           </Text>
                        </View>
                     </View>
                  </View>
               </TouchableOpacity>
               {/* Order History Card */}
               {/* <TouchableOpacity onPress={() => {}} style={styles.card}>
          <Text style={styles.cardTitle}>Order History</Text>
          <View style={styles.content}>
            <View style={styles.cardNumberTextContainer}>
              <Text style={[styles.cardNumberText, { color: 'grey' }]}>
                0 orders so far
              </Text>
            </View>
            <View style={styles.cardNumberSelectedContainer}>
              <View>
                <Text>
                  <Ionicons size={20} name='ios-arrow-forward' />
                </Text>
              </View>
            </View>
          </View>
        </TouchableOpacity> */}
            </ScrollView>
         </View>
      </View>
   )
}
