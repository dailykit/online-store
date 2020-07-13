import { Ionicons, Feather } from '@expo/vector-icons'
import React, { lazy } from 'react'
import {
   SafeAreaView,
   ScrollView,
   Text,
   TouchableOpacity,
   View,
} from 'react-native'
import BillingDetails from '../../components/BillingDetails'
import { CartSummary } from '../../components/Cart'
import {
   DefaultAddressFloater,
   DefaultPaymentFloater,
} from '../../components/DefaultFloater'
import HeaderBack from '../../components/HeaderBack'

const Summary = lazy(() => import('../../components/Summary'))
import { useCartContext } from '../../context/cart'
import { height, width } from '../../utils/Scalaing'
import { styles } from './styles'
import Header from '../../components/Header'
import { useDrawerContext } from '../../context/drawer'
import { useAppContext } from '../../context/app'
import Fulfillment from '../../components/Fulfillment'

const OrderSummary = ({ navigation, ...restProps }) => {
   const { cart } = useCartContext()
   const { open } = useDrawerContext()
   const { visual } = useAppContext()

   const [editing, setEditing] = React.useState(false)

   let cartItems = cart?.cartInfo?.products
   return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
         <Header title="Home" navigation={navigation} />
         {/* <HeaderBack title='Go Back' navigation={navigation} /> */}
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
                  {!editing ? (
                     <View style={styles.title_container}>
                        {cart?.fulfillmentInfo ? (
                           <>
                              <View style={styles.title_container_left}>
                                 <Text style={styles.deliver_on_text}>
                                    {cart?.fulfillmentInfo?.type?.replace(
                                       '_',
                                       ' '
                                    )}
                                 </Text>
                                 <Text style={styles.time_text}>
                                    {cart?.fulfillmentInfo?.date}
                                 </Text>
                              </View>
                              <View style={styles.title_container_middle}>
                                 <Text
                                    style={[
                                       styles.time_text,
                                       { textAlign: 'center', flex: 1 },
                                    ]}
                                 >
                                    {cart?.fulfillmentInfo?.slot?.time}
                                 </Text>
                              </View>
                           </>
                        ) : (
                           <Text>
                              Oops! We couldn't set default preference for you.
                           </Text>
                        )}
                        <View style={styles.title_container_right}>
                           <TouchableOpacity
                              onPress={() => setEditing(true)}
                              style={styles.edit}
                           >
                              <Text style={styles.edit_text}>edit{'  '}</Text>
                              <Ionicons
                                 style={{ paddingTop: 2 }}
                                 size={16}
                                 name="ios-arrow-forward"
                              />
                           </TouchableOpacity>
                        </View>
                     </View>
                  ) : (
                     <Fulfillment setEditing={setEditing} />
                  )}
                  <DefaultPaymentFloater navigation={navigation} />
                  <DefaultAddressFloater navigation={navigation} />
                  <View style={{ height: height * 0.1 }} />
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
            </View>
         )}

         <CartSummary
            {...restProps}
            navigation={navigation}
            text="CONFIRM AND PAY"
            to="PaymentProcessing"
            pay
         />
      </SafeAreaView>
   )
}

export default OrderSummary
