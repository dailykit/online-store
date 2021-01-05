import React from 'react'
import { useLazyQuery, useMutation, useSubscription } from '@apollo/react-hooks'
import { createDrawerNavigator } from '@react-navigation/drawer'
import { createStackNavigator } from '@react-navigation/stack'
import { AsyncStorage } from 'react-native'
import { CURRENCY, MAPS_API_KEY, CLIENTID } from 'react-native-dotenv'
import { useAppContext } from '../context/app'
import { useAuth } from '../context/auth'
import { useCartContext } from '../context/cart'
import { useDrawerContext } from '../context/drawer'
import {
   CART,
   CUSTOMER,
   CUSTOMER_REFERRAL,
   DELETE_CARTS,
   FETCH_CART,
   GET_MENU,
   LOYALTY_POINTS,
   PAYMENT_PARTNERSHIP,
   UPDATE_CART,
   WALLETS,
} from '../graphql'
import { mergeCarts } from '../utils'
import { width } from '../utils/Scaling'
import { useScript } from '../utils/useScript'
import { getStoreData } from '../api'

// drawer
import CustomDrawerContent from './Menu'
// screens
const Home = React.lazy(() => import('../screens/Home'))
const LoginSuccess = React.lazy(() => import('../screens/LoginSuccess'))
const Order = React.lazy(() => import('../screens/Order'))
const OrderHistory = React.lazy(() => import('../screens/OrderHistory'))
const OrderSummary = React.lazy(() => import('../screens/OrderSummary'))
const ProductPage = React.lazy(() => import('../screens/ProductPage'))
const CategoryProductsPage = React.lazy(() =>
   import('../screens/CategoryProductsPage')
)
const ProfileScreen = React.lazy(() => import('../screens/ProfileScreen'))
const Recipe = React.lazy(() => import('../screens/Recipe'))
const Search = React.lazy(() => import('../screens/Search'))

const Stack = createStackNavigator()
const Drawer = createDrawerNavigator()

export default function OnboardingStack(props) {
   const [mapsLoaded, mapsError] = useScript(
      `https://maps.googleapis.com/maps/api/js?key=${MAPS_API_KEY}`
   )

   if (mapsError) console.log('Error loading Maps:', mapsError)

   const { user, isInitialized, isAuthenticated } = useAuth()
   const {
      customer,
      cart,
      setCustomer,
      setCustomerDetails,
      setCart,
      setWallet,
      setLoyaltyPoints,
      customerReferral,
      setCustomerReferral,
   } = useCartContext()
   const {
      brandId,
      setBrandId,
      setBrand,
      setVisual,
      availability,
      setAvailability,
      setRewardsSettings,
      setAppSettings,
      setMenuData,
      setMasterLoading,
      setMenuLoading,
      setPaymentPartnershipIds,
   } = useAppContext()
   const { open } = useDrawerContext()

   const [cartId, setCartId] = React.useState(null) // Pending Cart Id
   const [settingCart, setSettingCart] = React.useState(true)
   const [settingUser, setSettingUser] = React.useState(true)
   const [dataLoading, setDataLoading] = React.useState(true)

   React.useEffect(() => {
      ;(async () => {
         if (isInitialized) {
            try {
               const data = await getStoreData({
                  clientId: CLIENTID,
                  domain: window.location.hostname,
                  email: user.email,
                  keycloakId: user.sub || user.id,
               })
               console.log(data)
               if (data.success) {
                  const { settings, brandId, customer } = data.data
                  setBrandId(brandId)
                  setBrand(settings.brand)
                  setVisual(settings.visual)
                  setAppSettings(settings.appSettings)
                  setAvailability(settings.availability)
                  setRewardsSettings(settings.rewardsSettings)
                  setCustomer(customer)
               }
            } catch (err) {
               console.log(err)
            } finally {
               setDataLoading(false)
            }
         }
      })()
   }, [isInitialized, user])

   const [fetchCustomer, { loading: fetchingCustomer }] = useLazyQuery(
      CUSTOMER,
      {
         onCompleted: data => {
            console.log('Customer:', data)

            if (data.customer) {
               setCustomer(data.customer)
               setCustomerDetails(data.customer.platform_customer)

               // check if any existing carts
               if (data.customer.orderCarts.length) {
                  console.log('Found cart with customer...')
                  setCart(data.customer.orderCarts[0])
               }

               setSettingUser(false)

               // update any pending cart (w/o signup)
               if (cartId) {
                  updateCart({
                     variables: {
                        id: cartId,
                        set: {
                           customerId: data.customer.id,
                           customerKeycloakId: data.customer.keycloakId,
                           stripeCustomerId:
                              data.customer.platform_customer
                                 ?.stripeCustomerId || null,
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
            }
         },
         onError: error => {
            console.log(error)
         },
      }
   )

   React.useEffect(() => {
      if (customer && customer.id && brandId) {
         console.log('Fetching customer again for platform details....')
         fetchCustomer({
            variables: {
               keycloakId: customer.keycloakId,
               brandId,
            },
         })
      }
   }, [customer, brandId])

   // Payment Partnership
   const [fetchPaymentPartnerships] = useLazyQuery(PAYMENT_PARTNERSHIP, {
      onCompleted: data => {
         if (data.brands_brand_paymentPartnership.length) {
            console.log(
               'Fetched payment partnerships: ',
               data.brands_brand_paymentPartnership
            )
            setPaymentPartnershipIds(data.brands_brand_paymentPartnership)
         }
      },
      onError: error => {
         console.log(error)
      },
   })

   React.useEffect(() => {
      if (brandId && CURRENCY === 'INR') {
         console.log('Fetching payment partnership...')
         fetchPaymentPartnerships({
            variables: {
               brandId,
            },
         })
      }
   }, [brandId])

   React.useEffect(() => {
      console.log('Screens -> cart.paymentStatus ', cart?.paymentStatus)
      if (cart?.paymentStatus === 'SUCCEEDED' && CURRENCY === 'INR') {
         open('Payment', { cartId: cart.id })
      }
   }, [cart?.paymentStatus])

   // Subscription for Cart when logged in
   const { loading: subscribingCart } = useSubscription(CART, {
      variables: {
         customerId: customer?.id,
         brandId,
      },
      skip: !Boolean(customer?.id && brandId),
      onSubscriptionData: data => {
         console.log('Found carts:', data.subscriptionData.data.cart)
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
            const cart = data.subscriptionData.data.cart[0]
            setCart(cart)
         }
         setSettingCart(false)
      },
   })

   // Subscription for Wallet, Loyalty Points
   useSubscription(CUSTOMER_REFERRAL, {
      variables: {
         keycloakId: user.sub || user.id,
         brandId,
      },
      onSubscriptionData: data => {
         if (data.subscriptionData.data.customerReferrals.length) {
            console.log(
               'Customer Referral: ',
               data.subscriptionData.data.customerReferrals[0]
            )

            setCustomerReferral(data.subscriptionData.data.customerReferrals[0])
         }
      },
   })

   useSubscription(WALLETS, {
      variables: {
         keycloakId: user.sub || user.id,
         brandId,
      },
      onSubscriptionData: data => {
         if (data.subscriptionData.data.wallets.length) {
            console.log('Wallet: ', data.subscriptionData.data.wallets[0])

            setWallet(data.subscriptionData.data.wallets[0])
         }
      },
   })
   useSubscription(LOYALTY_POINTS, {
      variables: {
         keycloakId: user.sub || user.id,
         brandId,
      },
      onSubscriptionData: data => {
         if (data.subscriptionData.data.loyaltyPoints.length) {
            console.log(
               'Loyalty Points: ',
               data.subscriptionData.data.loyaltyPoints[0]
            )

            setLoyaltyPoints(data.subscriptionData.data.loyaltyPoints[0])
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

   const [fetchCart, { loading: fetchingCart }] = useLazyQuery(FETCH_CART, {
      onCompleted: data => {
         if (data?.cartByPK?.id) {
            console.log('Setting cart......', data.cartByPK)
            setCart(data.cartByPK)
            setSettingCart(false)
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
         if (brandId) {
            const cartId = await AsyncStorage.getItem('PENDING_CART_ID')
            console.log('Pending Cart ID: ', cartId)
            setCartId(cartId)
            if (!isAuthenticated && cartId) {
               fetchCart({
                  variables: {
                     id: cartId,
                  },
               })
            } else {
               setSettingCart(false)
            }
         }
      })()
   }, [isAuthenticated, brandId])

   React.useEffect(() => {
      if (cartId && cart?.customerId) {
         console.log('Removed pending cart id!')
         setCartId(null)
         AsyncStorage.removeItem('PENDING_CART_ID')
      }
   }, [cart])

   const [fetchMenu, { loading: queryMenuLoading }] = useLazyQuery(GET_MENU, {
      onCompleted: data => {
         console.log('MENU:', data.onDemand_getMenu[0].data.menu)
         if (data.onDemand_getMenu[0].data.menu.length) {
            setMenuData([...data.onDemand_getMenu[0].data.menu])
         }
      },
      onError: error => {
         console.log(error)
      },
   })

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
      setMenuLoading(queryMenuLoading)
   }, [queryMenuLoading])

   React.useEffect(() => {
      if (availability && isStoreOpen() && brandId) {
         const date = new Date(Date.now()).toISOString()
         fetchMenu({
            variables: {
               params: {
                  date,
                  brandId,
               },
            },
         })
      }
   }, [availability, brandId])

   React.useEffect(() => {
      console.table({
         brandId,
         fetchingCart,
         fetchingCustomer,
         isInitialized,
         subscribingCart,
         isAuthenticated,
         settingCart,
         settingUser,
         dataLoading,
      })
      if (!isInitialized) {
         setMasterLoading(true)
      } else {
         if (isAuthenticated) {
            const status = [
               Boolean(brandId), // 1
               !fetchingCart, // true
               !fetchingCustomer, //true
               !subscribingCart, // true
               !dataLoading, // true
               !settingUser, // true
               !settingCart, // true
            ].every(notLoading => notLoading)
            if (status) {
               setMasterLoading(false)
            }
         } else {
            const status = [
               Boolean(brandId), // 1
               !fetchingCart, // true
               !settingCart,
               !dataLoading,
            ].every(notLoading => notLoading)
            if (status) {
               setMasterLoading(false)
            }
         }
      }
   }, [
      brandId,
      fetchingCart,
      fetchingCustomer,
      isInitialized,
      subscribingCart,
      isAuthenticated,
      settingCart,
      settingUser,
      dataLoading,
   ])

   return (
      <Stack.Navigator mode="card" headerMode="none">
         <Stack.Screen name="App" component={AppStack} />
      </Stack.Navigator>
   )
}

function AppStack(props) {
   const { setNavigation } = useDrawerContext()
   const [initRender, setInitRender] = React.useState(true)

   React.useEffect(() => {
      if (props.navigation) {
         console.log('Setting up navigation...')
         setNavigation(props.navigation)
      }
      console.log(initRender, width)
      console.log('Setting initRender...')
      setTimeout(() => setInitRender(false), 1)
   }, [])

   return (
      <Drawer.Navigator
         style={{ flex: 1 }}
         drawerContent={props => <CustomDrawerContent {...props} />}
         // drawerType={initRender ? 'permanent' : 'front'}
         openByDefault={false}
         drawerStyle={{
            width: 299,
            display: initRender ? 'none' : 'flex',
            backgroundColor: initRender ? 'transparent' : 'white',
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
            name="LoginSuccess"
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
            name="recipe"
            component={Recipe}
            options={{
               headerShown: true,
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
      </Drawer.Navigator>
   )
}
