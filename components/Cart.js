import React, { useState } from 'react'
import {
   Text,
   View,
   StyleSheet,
   Dimensions,
   TouchableOpacity,
   ToastAndroid,
   Platform,
} from 'react-native'
import { Ionicons, Feather } from '@expo/vector-icons'
import { useCartContext } from '../context/cart'
import { uuid } from '../utils'
import { useMutation } from '@apollo/react-hooks'
import EStyleSheet, { child } from 'react-native-extended-stylesheet'
import { CREATE_CART, UPDATE_CART } from '../graphql/mutations'

import { height, width } from '../utils/Scalaing'
import { useAppContext } from '../context/app'
import { useDrawerContext } from '../context/drawer'
import { useAuth } from '../context/auth'

const Cart = ({
   navigation,
   text,
   cartItem,
   to,
   tunnelItem,
   type,
   comboProductItems,
   setIsModalVisible,
   product,
}) => {
   const { cart, customerDetails, customer } = useCartContext()
   const { visual } = useAppContext()
   const { open } = useDrawerContext()
   const { isAuthenticated, login } = useAuth()

   const [quantity, setQuantity] = useState(1)

   const [updateCart] = useMutation(UPDATE_CART, {
      onCompleted: () => {
         console.log('Product added!')
      },
      onError: error => {
         console.log(error)
      },
   })
   const [createCart] = useMutation(CREATE_CART, {
      onCompleted: () => {
         console.log('Cart created!')
      },
      onError: error => {
         console.log(error)
      },
   })

   const handleAddToCart = () => {
      try {
         if (!isAuthenticated) {
            console.log('Not logged in!')
            open('Login')
         }
         if (
            customerDetails?.firstName &&
            customerDetails?.lastName &&
            customerDetails?.email &&
            customerDetails?.phoneNumber
         ) {
            let products = cart?.cartInfo?.products || []
            let total = parseFloat(cart?.cartInfo?.total) || 0
            if (tunnelItem) {
               if (type === 'comboProduct') {
                  console.log(comboProductItems)
                  const unitPrice = comboProductItems.reduce(
                     (acc, product) => acc + parseFloat(product.price),
                     0
                  )
                  const totalPrice = parseFloat(
                     (unitPrice * quantity).toFixed(2)
                  )
                  total = total + totalPrice
                  products.push({
                     cartItemId: uuid(),
                     name: product.name,
                     id: product.id,
                     components: comboProductItems,
                     discount: 0,
                     totalPrice,
                     unitPrice,
                     quantity,
                     type,
                     specialInstructions: '',
                  })
               } else {
                  const item = {
                     cartItemId: uuid(),
                     type,
                     ...cartItem,
                     quantity,
                     unitPrice: parseFloat(
                        parseFloat(cartItem.price).toFixed(2)
                     ),
                     totalPrice: parseFloat(
                        (parseFloat(cartItem.price) * quantity).toFixed(2)
                     ),
                     discount: 0,
                     specialInstructions: '',
                  }
                  delete item.price
                  console.log('Item adding: ', item)
                  products.push(item)
                  total = total + parseFloat(item.totalPrice)
               }
               total = parseFloat(total.toFixed(2))
               // products and total ready
               if (!customer) throw Error('Customer subscription failed!')
               if (cart) {
                  // Update
                  // cartInfo are your products
                  const cartInfo = {
                     products,
                     total,
                  } // you'll have to generate this every time
                  updateCart({
                     variables: {
                        id: cart.id,
                        set: {
                           cartInfo: cartInfo,
                        },
                     },
                  })
               } else {
                  // Create
                  // cartInfo are your products
                  const cartInfo = {
                     products,
                     total,
                  } // you'll have to generate this every time
                  createCart({
                     variables: {
                        object: {
                           cartInfo: cartInfo,
                           customerId: customer.id,
                           customerInfo: {
                              customerFirstName: customerDetails.firstName,
                              customerLastName: customerDetails.lastName,
                              customerPhone: customerDetails.phoneNumber,
                              customerEmail: customerDetails.email,
                           },
                           fulfillmentInfo: null,
                           paymentMethodId:
                              customerDetails?.defaultPaymentMethodId,
                           address: customerDetails?.defaultCustomerAddress,
                           stripeCustomerId: customerDetails?.stripeCustomerId,
                           tip: 0,
                        },
                     },
                  })
               }
            }
            if (text === 'Checkout') navigation.navigate('OrderSummary')
         } else {
            open('AddDetails', { path: 'profile/create' })
         }
         setIsModalVisible(false)
      } catch (error) {
         console.log(error)
      }
   }

   // cart.cartInfo = products
   let numberOfProducts = cart?.cartInfo?.products?.length
   let totalPrice = cart?.cartInfo?.total
   if (!tunnelItem && !numberOfProducts) return <></>

   return (
      <View style={[styles.outerContainer, { width: '100%' }]}>
         <View
            style={[
               styles.container,
               { backgroundColor: visual.color || '#3fa4ff' },
            ]}
         >
            <View style={styles.container_left}>
               {!tunnelItem && (
                  <Text style={styles.text}>
                     $ {cart.itemTotal} | {numberOfProducts} Products
                  </Text>
               )}
               {tunnelItem && (
                  <View
                     style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                     }}
                  >
                     <View style={styles.quantity}>
                        <Feather
                           name="minus"
                           color="#fff"
                           size={24}
                           onPress={e => {
                              e.stopPropagation()
                              if (quantity - 1 === 0) setQuantity(1)
                              else setQuantity(quantity - 1)
                           }}
                        />
                        <Text
                           style={{
                              color: '#fff',
                              fontSize: 20,
                              marginHorizontal: 8,
                           }}
                        >
                           {quantity}
                        </Text>
                        <Feather
                           name="plus"
                           color="#fff"
                           size={24}
                           onPress={e => {
                              e.stopPropagation()
                              setQuantity(quantity + 1)
                           }}
                        />
                     </View>
                     <View style={{ marginHorizontal: 16 }}>
                        <Text
                           style={{
                              color: '#fff',
                              fontSize: 16,
                           }}
                        >
                           $
                           {type === 'comboProduct'
                              ? (
                                   comboProductItems.reduce(
                                      (acc, product) =>
                                         acc + parseFloat(product.price),
                                      0
                                   ) * quantity
                                ).toFixed(2)
                              : (cartItem?.price * quantity).toFixed(2)}
                        </Text>
                     </View>
                  </View>
               )}
            </View>
            <TouchableOpacity
               style={styles.container_right}
               onPress={handleAddToCart}
            >
               <Text style={styles.text}>
                  {text}
                  {'    '}
               </Text>
               <Ionicons
                  name="ios-arrow-forward"
                  color="#fff"
                  size={20}
                  style={{ marginTop: 2 }}
               />
            </TouchableOpacity>
         </View>
      </View>
   )
}

export const CartSummary = ({ navigation, text }) => {
   const { cart } = useCartContext()
   const { visual } = useAppContext()

   const pay = () => {
      if (cart.isValid.status) {
         navigation.navigate('PaymentProcessing')
      } else {
         if (Platform.OS == 'android')
            ToastAndroid.show(cart.isValid.error, ToastAndroid.SHORT)
      }
   }
   if (!cart?.cartInfo?.products?.length) return <></>

   return (
      <View
         style={[
            styles.outerContainer,
            { paddingHorizontal: width > 768 ? 120 : 0 },
         ]}
      >
         <TouchableOpacity
            onPress={pay}
            style={[
               styles.container,
               { backgroundColor: visual.color || '#3fa4ff' },
            ]}
         >
            <View style={[styles.container_left, { flex: 3 }]}>
               <Text style={[styles.text, { fontSize: 18 }]}>
                  {cart?.cartInfo?.products?.length} items | $ {cart.totalPrice}
               </Text>
               <Text style={[styles.text, { fontSize: 10 }]}>
                  *extra charges may apply
               </Text>
            </View>
            <View style={styles.container_right}>
               <Text style={styles.text}>
                  {text}
                  {'    '}
               </Text>
               <Ionicons
                  name="ios-arrow-forward"
                  color="#fff"
                  size={20}
                  style={{ marginTop: 2 }}
               />
            </View>
         </TouchableOpacity>
      </View>
   )
}

export const ComboProductItemProceed = ({
   navigation,
   text,
   setCurrentComboProductIndex,
   currentComboProductIndex,
}) => {
   const { visual } = useAppContext()
   return (
      <View style={[styles.outerContainer, { width: '100%' }]}>
         <TouchableOpacity
            onPress={() => {
               setCurrentComboProductIndex(currentComboProductIndex + 1)
            }}
            style={[
               styles.container,
               { backgroundColor: visual.color || '#3fa4ff' },
            ]}
         >
            <View style={[styles.container_left, { flex: 4 }]}>
               <Text style={[styles.text, { fontSize: 14 }]}>
                  Click to select next item
               </Text>
            </View>
            <View style={styles.container_right}>
               <Text style={styles.text}>
                  {text}
                  {'    '}
               </Text>
               <Ionicons
                  name="ios-arrow-forward"
                  color="#fff"
                  size={20}
                  style={{ marginTop: 2 }}
               />
            </View>
         </TouchableOpacity>
      </View>
   )
}

const styles = StyleSheet.create({
   outerContainer: {
      height: 100,
      width: width > 1280 ? 1280 : width,
      padding: 20,
      marginHorizontal: 'auto',
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      justifyContent: 'center',
      alignItems: 'center',
   },
   container: {
      // height: height * 0.08,
      // width: width > 1280 ? 1280 : width,
      height: '80%',
      width: '100%',
      flexDirection: 'row',
      marginHorizontal: 'auto',
      borderRadius: 4,
   },
   text: {
      color: 'white',
      fontSize: 16,
   },
   container_left: {
      flex: 3,
      paddingHorizontal: 20,
      alignItems: 'flex-start',
      justifyContent: 'center',
   },
   container_right: {
      flex: 3,
      paddingHorizontal: 20,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-end',
   },
   quantity: {
      flexDirection: 'row',
      alignItems: 'baseline',
      justifyContent: 'space-around',
   },
})

export default Cart
