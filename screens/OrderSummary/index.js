import { Ionicons, Feather } from '@expo/vector-icons'
import React, { lazy } from 'react'
import moment from 'moment'
import {
   SafeAreaView,
   ScrollView,
   Text,
   TouchableOpacity,
   View,
} from 'react-native'
import BillingDetails from '../../components/BillingDetails'
import { CartSummary } from '../../components/Cart'
import { DefaultPaymentFloater } from '../../components/DefaultFloater'

const Summary = lazy(() => import('../../components/Summary'))
import { useCartContext } from '../../context/cart'
import { height, width } from '../../utils/Scalaing'
import { styles } from './styles'
import Header from '../../components/Header'
import { useDrawerContext } from '../../context/drawer'
import { useAppContext } from '../../context/app'
import Fulfillment from '../../components/Fulfillment'
import { useAuth } from '../../context/auth'

const OrderSummary = ({ navigation, ...restProps }) => {
   const { cart } = useCartContext()
   const { open } = useDrawerContext()
   const { visual } = useAppContext()
   const { isAuthenticated } = useAuth()

   const [editing, setEditing] = React.useState(false)

   let cartItems = cart?.cartInfo?.products
   return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
         <Header title="Home" navigation={navigation} />
         {cartItems?.length ? (
            <>
               <View style={styles.topBar}>
                  <Text style={styles.heading}>Cart</Text>
                  <Text style={styles.count}>{`${cartItems?.length} Item${
                     cartItems?.length > 1 ? 's' : ''
                  }`}</Text>
               </View>
               <ScrollView style={styles.scrollView}>
                  <View style={{ marginBottom: 20 }}>
                     {cartItems?.map((item, index) => {
                        return <Summary item={item} key={index} />
                     })}
                  </View>
                  <BillingDetails />
                  {isAuthenticated ? (
                     <>
                        <Text
                           style={{
                              fontWeight: 'bold',
                              color: '#666',
                              marginBottom: 5,
                           }}
                        >
                           Fulfillment:
                        </Text>
                        {!editing ? (
                           <View style={styles.title_container}>
                              {cart?.fulfillmentInfo ? (
                                 <>
                                    <View style={styles.title_container_left}>
                                       <Text
                                          style={[
                                             styles.deliver_on_text,
                                             { color: visual.color },
                                          ]}
                                       >
                                          {cart?.fulfillmentInfo?.type?.replace(
                                             '_',
                                             ' '
                                          )}
                                       </Text>
                                       <Text style={styles.time_text}>
                                          {moment
                                             .parseZone(
                                                cart?.fulfillmentInfo?.slot
                                                   ?.from
                                             )
                                             .format('MMMM Do YYYY, h:mm a')}
                                       </Text>
                                    </View>
                                 </>
                              ) : (
                                 <Text>
                                    Oops! We couldn't set default preference for
                                    you.
                                 </Text>
                              )}
                              <View style={styles.title_container_right}>
                                 <TouchableOpacity
                                    onPress={() => setEditing(true)}
                                    style={styles.edit}
                                 >
                                    <Text style={styles.edit_text}>
                                       edit{'  '}
                                    </Text>
                                    <Ionicons
                                       style={{ paddingTop: 2 }}
                                       size={16}
                                       name="ios-arrow-forward"
                                    />
                                 </TouchableOpacity>
                              </View>
                           </View>
                        ) : (
                           <View style={{ marginBottom: 10 }}>
                              <Fulfillment
                                 navigation={navigation}
                                 setEditing={setEditing}
                              />
                           </View>
                        )}
                        {cart.fulfillmentInfo?.type?.includes('DELIVERY') && (
                           <View style={{ marginBottom: 10 }}>
                              <Text
                                 style={{
                                    fontWeight: 'bold',
                                    color: '#666',
                                    marginBottom: 5,
                                 }}
                              >
                                 Address selected for deilvery:
                              </Text>
                              <Text>{`${cart.address.line1}, ${cart.address.line2}, ${cart.address.city}, ${cart.address.state}, ${cart.address.country}`}</Text>
                           </View>
                        )}
                        <Text
                           style={{
                              fontWeight: 'bold',
                              color: '#666',
                              marginBottom: 5,
                           }}
                        >
                           Payment card:
                        </Text>
                        <View style={{ marginBottom: 20 }}>
                           <DefaultPaymentFloater navigation={navigation} />
                        </View>
                        <View style={{ height: height * 0.1 }} />
                     </>
                  ) : (
                     <View style={{ textAlign: 'center' }}>
                        <Text
                           style={{
                              fontSize: '1.1rem',
                              fontWeight: 'bold',
                           }}
                        >
                           Almost there!
                        </Text>
                        <Text style={{ color: '#666', marginBottom: 10 }}>
                           Login or Singup to place your order
                        </Text>
                        <TouchableOpacity
                           onPress={() => open('Login')}
                           style={{
                              width: '100%',
                              backgroundColor: visual.color,
                              padding: 10,
                           }}
                        >
                           <Text style={{ fontWeight: 'bold', color: '#fff' }}>
                              CONTINUE
                           </Text>
                        </TouchableOpacity>
                     </View>
                  )}
               </ScrollView>
            </>
         ) : (
            <View
               style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                  padding: 20,
               }}
            >
               <Text
                  style={{
                     marginBottom: 10,
                     fontWeight: 'bold',
                     fontSize: width > 768 ? 24 : 16,
                     color: '#666',
                     textAlign: 'center',
                  }}
               >
                  Awww... This feels so light. Oh wait! It's empty.
               </Text>
               <Feather name="shopping-cart" size={64} color={visual.color} />
               <TouchableOpacity
                  style={{
                     backgroundColor: visual.color,
                     padding: 10,
                     borderRadius: 2,
                     marginTop: 30,
                  }}
                  onPress={() => navigation.navigate('Home')}
               >
                  <Text style={{ color: '#fff', fontSize: '1.1rem' }}>
                     Browse Products
                  </Text>
               </TouchableOpacity>
            </View>
         )}
         {isAuthenticated && (
            <CartSummary
               {...restProps}
               navigation={navigation}
               text="CONFIRM AND PAY"
               to="PaymentProcessing"
               pay
            />
         )}
      </SafeAreaView>
   )
}

export default OrderSummary
