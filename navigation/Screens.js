import {
   useLazyQuery,
   useMutation,
   useQuery,
   useSubscription,
} from '@apollo/react-hooks'
import { createDrawerNavigator } from '@react-navigation/drawer'
import { createStackNavigator } from '@react-navigation/stack'
import * as axios from 'axios'
import React from 'react'
import { AsyncStorage } from 'react-native'
import { CLIENTID, DAILYOS_SERVER_URL, MAPS_API_KEY } from 'react-native-dotenv'
import { useAppContext } from '../context/app'
// Auth Context
import { useAuth } from '../context/auth'
import { useCartContext } from '../context/cart'
import {
   CART,
   CREATE_CUSTOMER,
   CUSTOMER,
   DELETE_CARTS,
   FETCH_CART,
   STORE_SETTINGS,
   UPDATE_CART,
   SIGNUP_CAMPAIGNS,
   REFERRAL_CAMPAIGNS,
   UPDATE_CUSTOMER_REFERRAL,
   CREATE_CUSTOMER_WLR,
   WALLETS,
   LOYALTY_POINTS,
} from '../graphql'
import CategoryProductsPage from '../screens/CategoryProductsPage'
// screens
import Home from '../screens/Home'
import LoginSuccess from '../screens/LoginSuccess'
import Order from '../screens/Order'
import OrderHistory from '../screens/OrderHistory'
import OrderSummary from '../screens/OrderSummary'
import ProductPage from '../screens/ProductPage'
import ProfileScreen from '../screens/ProfileScreen'
import Recipe from '../screens/Recipe'
import Search from '../screens/Search'
import { mergeCarts } from '../utils'
import { width } from '../utils/Scalaing'
import { useScript } from '../utils/useScript'
// drawer
import CustomDrawerContent from './Menu'
import { useDrawerContext } from '../context/drawer'

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
      setCustomerReferral,
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
   const { open } = useDrawerContext()

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
                     return
                  }
                  case 'Store Live': {
                     availabilityState.isStoreLive = value.isStoreLive
                     availabilityState.isStripeConfigured =
                        value.isStripeConfigured
                     return
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

   // Subscription for Cart when logged in
   const { loading: subscribingCart } = useSubscription(CART, {
      variables: {
         customerId: customer?.id,
      },
      // skip: !Boolean(customer?.id),
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

   // Mutation for creating customer
   const [createCustomer, { loading: creatingCustomer }] = useMutation(
      CREATE_CUSTOMER,
      {
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
            createCustomerWLR({
               variables: {
                  keycloakId: data.createCustomer.keycloakId,
               },
            })
         },
         onError: error => {
            console.log(error)
         },
      }
   )

   // Mutation for creating wallet, loyalty points, referral
   const [createCustomerWLR] = useMutation(CREATE_CUSTOMER_WLR, {
      onCompleted: data => {
         console.log('WLC created: ', data)
         setCustomerReferral(data.createCustomerReferral)
         open('ReferralCode')
      },
      onError: error => {
         console.log('WLC creation failed: ', error)
      },
   })

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
            if (data.customer.orderCarts.length) {
               console.log('Found cart with customer...')
               setCart(data.customer.orderCarts[0])
            }
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

   // Subscription for Wallet, Loyalty Points
   useSubscription(WALLETS, {
      variables: {
         keycloakId: user.sub || user.id,
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
            setCart(data.cartByPK)
         }
      },
      onError: error => {
         console.log(error)
      },
   })

   const [updateCart, { loading: updatingCart }] = useMutation(UPDATE_CART, {
      onCompleted: () => {
         console.log('Cart updated!')
      },
      onError: error => {
         console.log(error)
      },
   })

   // Mutation for updating customer referral
   const [updateCustomerReferral] = useMutation(UPDATE_CUSTOMER_REFERRAL, {
      onCompleted: data => {
         console.log('Referral record updated!')
      },
      onError: error => {
         console.log(error)
      },
   })

   // Subscription for Signup and Referral Campaigns
   useSubscription(SIGNUP_CAMPAIGNS, {
      skip: Boolean(
         !customer ||
            customer?.customerReferralDetails?.signupStatus === 'COMPLETE'
      ),
      variables: {
         params: {
            keycloakId: customer?.keycloakId,
         },
      },
      onSubscriptionData: data => {
         if (data.subscriptionData.data.campaigns.length) {
            const campaign = data.subscriptionData.data.campaigns[0]
            if (campaign.rewards.length) {
               const rewardValidity = campaign.isRewardMulti
                  ? campaign.rewards.every(reward => reward.condition.isValid)
                  : campaign.rewards[0].condition.isValid
               if (
                  campaign.condition.isValid &&
                  rewardValidity &&
                  customer?.customerReferralDetails?.signupStatus === 'PENDING'
               ) {
                  console.log('Signup reward applicable!')
                  updateCustomerReferral({
                     variables: {
                        id: customer.customerReferralDetails.id,
                        set: {
                           signupCampaignId: campaign.id,
                        },
                     },
                  })
               }
            }
         }
      },
   })

   useSubscription(REFERRAL_CAMPAIGNS, {
      skip: Boolean(
         !customer ||
            customer?.customerReferralDetails?.referralStatus === 'COMPLETE'
      ),
      variables: {
         params: {
            keycloakId: customer?.keycloakId,
         },
      },
      onSubscriptionData: data => {
         if (data.subscriptionData.data.campaigns.length) {
            const campaign = data.subscriptionData.data.campaigns[0]
            if (campaign.rewards.length) {
               const rewardValidity = campaign.isRewardMulti
                  ? campaign.rewards.every(reward => reward.condition.isValid)
                  : campaign.rewards[0].condition.isValid
               if (
                  campaign.condition.isValid &&
                  rewardValidity &&
                  customer?.customerReferralDetails?.referralStatus ===
                     'PENDING'
               ) {
                  console.log('Referral reward applicable!')
                  updateCustomerReferral({
                     variables: {
                        id: customer.customerReferralDetails.id,
                        set: {
                           referralCampaignId: campaign.id,
                        },
                     },
                  })
               }
            }
         }
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
      console.log(
         'settingsLoading',
         settingsLoading,
         'fetchingCustomer',
         fetchingCustomer,
         'creatingCustomer',
         creatingCustomer,
         'fetchingCart',
         fetchingCart,
         'isInitialized',
         isInitialized,
         'user',
         Object.keys(user).length,
         'subscribingCart',
         subscribingCart
      )
      if (isInitialized && isAuthenticated) {
         setMasterLoading(
            [
               settingsLoading,
               fetchingCustomer,
               creatingCustomer,
               fetchingCart,
               !isInitialized,
               !Object.keys(user).length,
               subscribingCart,
            ].some(loading => loading)
         )
      } else {
         setMasterLoading(
            [settingsLoading, fetchingCart, !isInitialized].some(
               loading => loading
            )
         )
      }
   }, [
      settingsLoading,
      fetchingCustomer,
      creatingCustomer,
      fetchingCart,
      isInitialized,
      user,
      subscribingCart,
      isAuthenticated,
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
