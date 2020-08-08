import React, { useState, useEffect } from 'react'
import { View, Dimensions, AsyncStorage, ActivityIndicator } from 'react-native'
import {
   useLazyQuery,
   useMutation,
   useSubscription,
   useQuery,
} from '@apollo/react-hooks'
import * as axios from 'axios'
import { CLIENTID, DAILYOS_SERVER_URL, MAPS_API_KEY } from 'react-native-dotenv'

import { createStackNavigator } from '@react-navigation/stack'
import { createDrawerNavigator } from '@react-navigation/drawer'

// screens
import Home from '../screens/Home'
import AddToCart from '../screens/AddToCart'
import OrderSummary from '../screens/OrderSummary'
import Order from '../screens/Order'
import { SafetyScreen } from '../screens/SafetyScreen'
import ProfileScreen from '../screens/ProfileScreen'
import OrderHistory from '../screens/OrderHistory'
// drawer
import CustomDrawerContent from './Menu'

// Auth Context
import { useAuth } from '../context/auth'

// header for screens
import { Header } from '../components'
import Delivery from '../screens/Delivery'
import { EditAddress } from '../screens/EditAddress'
import { SelectPaymentMethod } from '../screens/SelectPaymentMethod'
import { Text } from 'native-base'

import { height, width } from '../utils/Scalaing'
import PaymentProcessing from '../screens/PaymentProcessing'
import AddDetails from '../screens/AddDetails'
import { Spinner } from 'native-base'
import {
   CREATE_CUSTOMER,
   CUSTOMER,
   STORE_SETTINGS,
   FETCH_CART,
   UPDATE_CART,
   CART,
   DELETE_CARTS,
} from '../graphql'
import { useAppContext } from '../context/app'
import ProductPage from '../screens/ProductPage'
import CategoryProductsPage from '../screens/CategoryProductsPage'
import Recipe from '../screens/Recipe'
import Search from '../screens/Search'
import { useCartContext } from '../context/cart'
import LoginSuccess from '../screens/LoginSuccess'
import { useScript } from '../utils/useScript'
import { mergeCarts } from '../utils'

const Stack = createStackNavigator()
const Drawer = createDrawerNavigator()

const Loader = () => (
   <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Spinner size="large" />
   </View>
)

export default function OnboardingStack(props) {
   const [mapsLoaded, mapsError] = useScript(
      `https://maps.googleapis.com/maps/api/js?key=${MAPS_API_KEY}`
   )

   if (mapsError) console.log('Error loading Maps:', mapsError)

   const { user, isInitialized } = useAuth()
   const {
      customer,
      cart,
      setCustomer,
      setCustomerDetails,
      setCart,
   } = useCartContext()
   const {
      setBrand,
      setVisual,
      availability,
      setAvailability,
      setMenuData,
      setMasterLoading,
      setMenuLoading,
   } = useAppContext()

   const [cartId, setCartId] = React.useState(null) // Pending Cart Id

   // Query for settings
   const { loading: settingsLoading, error: settingsError } = useSubscription(
      STORE_SETTINGS,
      {
         onSubscriptionData: data => {
            const brandSettings = data.subscriptionData.data.storeSettings.filter(
               setting => setting.type === 'brand'
            )
            const visualSettings = data.subscriptionData.data.storeSettings.filter(
               setting => setting.type === 'visual'
            )
            const availabilitySettings = data.subscriptionData.data.storeSettings.filter(
               setting => setting.type === 'availability'
            )

            let brandState = {}
            brandSettings.forEach(({ identifier, value }) => {
               switch (identifier) {
                  case 'Brand Logo': {
                     brandState.logo = value.url
                     return
                  }
                  case 'Brand Name': {
                     brandState.name = value.name
                     return
                  }
                  default: {
                     return
                  }
               }
            })
            setBrand({ ...brandState })

            let visualState = {}
            visualSettings.forEach(({ identifier, value }) => {
               switch (identifier) {
                  case 'Primary Color': {
                     visualState.color = value.color
                     return
                  }
                  case 'Slides': {
                     visualState.slides = value
                     return
                  }
                  default: {
                     return
                  }
               }
            })
            setVisual({ ...visualState })

            let availabilityState = {}
            availabilitySettings.forEach(({ identifier, value }) => {
               switch (identifier) {
                  case 'Store Availability': {
                     availabilityState.store = value
                     return
                  }
                  case 'Pickup Availability': {
                     availabilityState.pickup = value
                     return
                  }
                  case 'Delivery Availability': {
                     availabilityState.delivery = value
                     return
                  }
                  case 'Location': {
                     availabilityState.location = value.address
                  }
                  default: {
                     return
                  }
               }
            })
            setAvailability({ ...availabilityState })
         },
      }
   )

   // Mutation for creating customer
   const [createCustomer, { loading: creatingCustomer }] = useMutation(
      CREATE_CUSTOMER,
      {
         refetchQueries: ['customer'],
         onCompleted: data => {
            setCustomer(data.createCustomer)
            setCustomerDetails(data.createCustomer.platform_customer)
            // Check for any pending cart
            if (cartId) {
               updateCart({
                  variables: {
                     id: cartId,
                     set: {
                        customerId: data.createCustomer.id,
                        customerKeycloakId: data.createCustomer.keycloakId,
                        stripeCustomerId: null,
                        customerInfo: null,
                     },
                  },
               })
            }
            console.log('Customer created: ', data.createCustomer)
         },
         onError: error => {
            console.log(error)
         },
      }
   )

   // Query Customer and Data from platform
   const { error, loading: fetchingCustomer } = useQuery(CUSTOMER, {
      variables: {
         keycloakId: user.sub || user.userid,
      },
      onCompleted: data => {
         console.log('Customer:', data)
         if (data.customer) {
            setCustomer(data.customer)
            setCustomerDetails(data.customer.platform_customer)
            // Update any pending cart
            if (cartId) {
               updateCart({
                  variables: {
                     id: cartId,
                     set: {
                        customerId: data.customer.id,
                        customerKeycloakId: data.customer.keycloakId,
                        stripeCustomerId:
                           data.customer.platform_customer?.stripeCustomerId ||
                           null,
                        paymentMethodId:
                           data.customer.platform_customer
                              ?.defaultPaymentMethodId || null,
                        customerInfo: {
                           customerFirstName:
                              data.customer.platform_customer?.firstName,
                           customerLastName:
                              data.customer.platform_customer?.lastName,
                           customerPhone:
                              data.customer.platform_customer?.phoneNumber,
                           customerEmail:
                              data.customer.platform_customer?.email,
                        },
                     },
                  },
               })
            }
         } else {
            createCustomer({
               variables: {
                  object: {
                     keycloakId: user.sub || user.userid,
                     email: user.email,
                     source: 'online store',
                     clientId: CLIENTID,
                  },
               },
            })
         }
      },
   })

   // Mutation for deleting carts
   const [deleteCarts] = useMutation(DELETE_CARTS, {
      onCompleted: data => {
         console.log('Carts deleted: ', data.deleteCarts.returning)
      },
      onError: error => {
         console.log('Deleteing carts error: ', error)
      },
   })

   // Subscription for Cart when logged in
   const { loading: subscribingCart } = useSubscription(CART, {
      variables: {
         customerId: customer?.id,
      },
      onSubscriptionData: data => {
         if (data.subscriptionData.data.cart.length > 1) {
            const [mergedCart, mergedCartIds] = mergeCarts(
               data.subscriptionData.data.cart
            )
            console.log('mergedCart', mergedCart)
            updateCart({
               variables: {
                  id: mergedCart.id,
                  set: {
                     cartInfo: mergedCart.cartInfo,
                  },
               },
            })
            deleteCarts({
               variables: {
                  ids: mergedCartIds,
               },
            })
         } else {
            setCart(data.subscriptionData.data.cart[0])
         }
      },
   })

   const [fetchCart, { loading: fetchingCart }] = useLazyQuery(FETCH_CART, {
      onCompleted: data => {
         if (data?.cartByPK?.id) {
            setCart(data.cartByPK)
         }
      },
      onError: error => {
         console.log(error)
      },
   })

   const [updateCart] = useMutation(UPDATE_CART, {
      onCompleted: () => {
         console.log('Cart updated!')
      },
      onError: error => {
         console.log(error)
      },
   })

   React.useEffect(() => {
      ;(async () => {
         const cartId = await AsyncStorage.getItem('PENDING_CART_ID')
         console.log('Pending Cart ID: ', cartId)
         setCartId(cartId)
         if ((!user.sub || !user.id) && cartId) {
            fetchCart({
               variables: {
                  id: cartId,
               },
            })
         }
      })()
   }, [user])

   React.useEffect(() => {
      if (cartId && cart?.customerId) {
         console.log('Cleared local storage!')
         setCartId(null)
         AsyncStorage.clear()
      }
   }, [cart])

   const fetchData = async date => {
      try {
         setMenuLoading(true)
         const response = await axios.post(`${DAILYOS_SERVER_URL}/api/menu`, {
            date,
         })
         setMenuData(response.data)
      } catch (err) {
         console.log(err)
      } finally {
         setMenuLoading(false)
      }
   }

   const isStoreOpen = () => {
      const current = new Date()
      if (availability.store.isOpen) {
         const minutes = current.getMinutes() + current.getHours() * 60
         const from = availability.store.from.split(':')
         const to = availability.store.to.split(':')
         const fromMinutes = parseInt(from[1]) + parseInt(from[0]) * 60
         const toMinutes = parseInt(to[1]) + parseInt(to[0]) * 60

         if (minutes >= fromMinutes && minutes <= toMinutes) {
            return true
         } else {
            return false
         }
      } else {
         return false
      }
   }

   // Effects
   React.useEffect(() => {
      if (availability && isStoreOpen()) {
         const date = new Date(Date.now()).toISOString()
         fetchData(date)
      }
   }, [availability])

   React.useEffect(() => {
      setMasterLoading(
         [
            settingsLoading,
            fetchingCustomer,
            creatingCustomer,
            fetchingCart,
            subscribingCart,
            !isInitialized,
         ].some(loading => loading)
      )
   }, [
      settingsLoading,
      fetchingCustomer,
      creatingCustomer,
      fetchingCart,
      subscribingCart,
      isInitialized,
   ])

   return (
      <>
         <Stack.Navigator mode="card" headerMode="none">
            <Stack.Screen name="App" component={AppStack} />
         </Stack.Navigator>
      </>
   )
}

function AppStack(props) {
   return (
      <Drawer.Navigator
         style={{ flex: 1 }}
         drawerContent={props => <CustomDrawerContent {...props} />}
         drawerStyle={{
            backgroundColor: 'white',
            width: width * 0.8,
         }}
         gestureHandlerProps={{ enabled: false }}
         drawerContentOptions={{
            activeTintcolor: 'white',
            inactiveTintColor: '#000',
            activeBackgroundColor: 'transparent',
            itemStyle: {
               width: width * 0.75,
               backgroundColor: 'transparent',
               paddingVertical: 16,
               paddingHorizonal: 12,
               justifyContent: 'center',
               alignContent: 'center',
               alignItems: 'center',
               overflow: 'hidden',
            },
            labelStyle: {
               fontSize: 18,
               marginLeft: 12,
               fontWeight: 'normal',
            },
         }}
         initialRouteName="Home"
         lazy={true}
         removeClippedSubviews={true}
      >
         <Stack.Screen
            name="Home"
            component={Home}
            options={{
               headerShown: false,
            }}
         />
         <Stack.Screen
            name="login-success"
            component={LoginSuccess}
            options={{
               headerShown: false,
            }}
         />
         <Stack.Screen
            name="CategoryProductsPage"
            component={CategoryProductsPage}
            options={{
               headerShown: false,
            }}
         />
         <Stack.Screen
            name="ProductPage"
            component={ProductPage}
            options={{
               headerShown: false,
            }}
         />
         <Stack.Screen
            name="Recipe"
            component={Recipe}
            options={{
               headerShown: true,
            }}
         />
         <Stack.Screen
            name="AddToCart"
            component={AddToCart}
            options={{
               headerShown: false,
            }}
         />
         <Stack.Screen
            name="OrderSummary"
            component={OrderSummary}
            options={{
               headerShown: false,
            }}
         />
         <Stack.Screen
            name="Order"
            component={Order}
            options={{
               headerShown: false,
            }}
         />
         <Stack.Screen
            name="Search"
            component={Search}
            options={{
               headerShown: false,
            }}
         />
         {/* <Stack.Screen
            name="SafetyScreen"
            component={SafetyScreen}
            options={{
               headerShown: false,
            }}
         /> */}
         <Stack.Screen
            name="DeliveryScreen"
            component={Delivery}
            options={{
               headerShown: false,
            }}
         />
         {/* <Stack.Screen
            name="EditAddressScreen"
            component={EditAddress}
            options={{
               headerShown: false,
            }}
         />
         <Stack.Screen
            name="SelectPaymentMethodScreen"
            component={SelectPaymentMethod}
            options={{
               headerShown: false,
            }}
         /> */}
         <Stack.Screen
            name="ProfileScreen"
            component={ProfileScreen}
            options={{
               headerShown: false,
            }}
         />
         <Stack.Screen
            name="OrderHistory"
            component={OrderHistory}
            options={{
               headerShown: false,
            }}
         />
         {/* <Stack.Screen
            name="PaymentProcessing"
            component={PaymentProcessing}
            options={{
               headerShown: false,
            }}
         /> */}
         {/* <Stack.Screen
            name="Add Details"
            component={AddDetails}
            options={{
               headerShown: false,
            }}
         /> */}
      </Drawer.Navigator>
   )
}
