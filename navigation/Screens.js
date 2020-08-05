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
   CUSTOMER_DETAILS,
   STORE_SETTINGS,
   FETCH_CART,
   UPDATE_CART,
} from '../graphql'
import { useAppContext } from '../context/app'
import ProductPage from '../screens/ProductPage'
import CategoryProductsPage from '../screens/CategoryProductsPage'
import Recipe from '../screens/Recipe'
import Search from '../screens/Search'
import { useCartContext } from '../context/cart'
import LoginSuccess from '../screens/LoginSuccess'
import { useScript } from '../utils/useScript'

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
   const { setCustomer, setCustomerDetails, setCart } = useCartContext()
   const {
      setBrand,
      setVisual,
      availability,
      setAvailability,
      setMenuData,
      setMasterLoading,
      menuLoading,
      setMenuLoading,
   } = useAppContext()

   const [cartId, setCartId] = React.useState(null) // Pending Cart Id

   // Query
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

   // Mutations
   const [createCustomer, { laoding: creatingCustomer }] = useMutation(
      CREATE_CUSTOMER,
      {
         onCompleted: data => {
            if (cartId) {
               updateCart({
                  variables: {
                     id: cartId,
                     set: {
                        customerId: data.createCustomer.id,
                        customerKeycloakId: user.sub || user.id,
                     },
                  },
               })
            }
            console.log('Customer created')
         },
         onError: error => {
            console.log(error)
         },
      }
   )

   // Subscription
   const { error, loading: fetchingCustomer } = useSubscription(CUSTOMER, {
      variables: {
         keycloakId: user.sub || user.userid,
         email: user.email,
      },
      onSubscriptionData: data => {
         const customers = data.subscriptionData.data.customers
         if (customers.length) {
            setCustomer(customers[0])
            if (cartId) {
               updateCart({
                  variables: {
                     id: cartId,
                     set: {
                        customerId: customers[0].id,
                        customerKeycloakId: user.sub || user.id,
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

   if (error) console.log('Subscription error: ', error)

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
      onCompleted: data => {
         console.log('Cart updated!')
         if (
            cartId &&
            data.updateCart.returning[0].customerId &&
            data.updateCart.returning[0].customerInfo
         ) {
            console.log('Cleared local storage!')
            setCartId(null)
            AsyncStorage.clear()
         }
      },
      onError: error => {
         console.log(error)
      },
   })

   React.useEffect(() => {
      if (user.sub || user.userid) {
         customerDetails()
      }
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

   // Query
   const [customerDetails, { loading: fetchingCustomerDetails }] = useLazyQuery(
      CUSTOMER_DETAILS,
      {
         variables: {
            keycloakId: user.sub || user.userid,
         },
         onCompleted: data => {
            if (data.platform_customerByClients?.length) {
               console.log(
                  'platform -> data',
                  data.platform_customerByClients[0].customer
               )
               setCustomerDetails(data.platform_customerByClients[0].customer)
               if (cartId) {
                  updateCart({
                     variables: {
                        id: cartId,
                        set: {
                           customerInfo: {
                              customerFirstName:
                                 data.platform_customerByClients[0].customer
                                    ?.firstName,
                              customerLastName:
                                 data.platform_customerByClients[0].customer
                                    ?.lastName,
                              customerPhone:
                                 data.platform_customerByClients[0].customer
                                    ?.phoneNumber,
                              customerEmail:
                                 data.platform_customerByClients[0].customer
                                    ?.email,
                           },
                        },
                     },
                  })
               }
            } else {
               console.log('No customer data found!')
            }
         },
         fetchPolicy: 'cache-and-network',
      }
   )

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
            fetchingCustomerDetails,
            !isInitialized,
         ].some(loading => loading)
      )
   }, [
      settingsLoading,
      fetchingCustomer,
      creatingCustomer,
      fetchingCart,
      fetchingCustomerDetails,
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
         <Stack.Screen
            name="PaymentProcessing"
            component={PaymentProcessing}
            options={{
               headerShown: false,
            }}
         />
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
