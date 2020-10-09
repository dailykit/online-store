import React from 'react'
import { AsyncStorage } from 'react-native'
import { CLIENTID, MAPS_API_KEY } from 'react-native-dotenv'
import { createDrawerNavigator } from '@react-navigation/drawer'
import { createStackNavigator } from '@react-navigation/stack'
import {
   useLazyQuery,
   useMutation,
   useQuery,
   useSubscription,
} from '@apollo/react-hooks'
import { useAppContext } from '../context/app'
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
   WALLETS,
   LOYALTY_POINTS,
   CUSTOMER_REFERRAL,
   BRANDS,
   GET_MENU,
   CREATE_BRAND_CUSTOMER,
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

   const [settingsMapped, setSettingsMapped] = React.useState(false)

   const { user, isInitialized, isAuthenticated, keycloak } = useAuth()
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
      setMenuData,
      setMasterLoading,
      setMenuLoading,
   } = useAppContext()
   const { open } = useDrawerContext()

   const [cartId, setCartId] = React.useState(null) // Pending Cart Id

   // Query for Brand ID
   useQuery(BRANDS, {
      variables: {
         domain: window.location.hostname,
      },
      onCompleted: data => {
         if (data.brands.length) {
            const domain = window.location.hostname
            const brand =
               data.brands.find(brand => brand.domain === domain) ||
               data.brands.find(brand => brand.isDefault)
            setBrandId(brand.id)
         } else {
            console.log('COULD NOT RESOLVE BRAND')
         }
      },
      onError: error => {
         console.log(error)
      },
   })

   // Query for settings
   const { loading: settingsLoading, error: settingsError } = useSubscription(
      STORE_SETTINGS,
      {
         variables: {
            brandId,
         },
         skip: Boolean(!brandId),
         onSubscriptionData: data => {
            let brandState = {}
            let visualState = {}
            let availabilityState = {}
            let rewardsState = {}

            data.subscriptionData.data.storeSettings.forEach(
               ({ identifier, value, brandSettings }) => {
                  switch (identifier) {
                     case 'Brand Logo': {
                        brandState.logo =
                           brandSettings[0]?.value.url || value.url
                        return
                     }
                     case 'Brand Name': {
                        brandState.name =
                           brandSettings[0]?.value.name || value.name
                        return
                     }
                     case 'Primary Color': {
                        visualState.color =
                           brandSettings[0]?.value.color || value.color
                        return
                     }
                     case 'Slides': {
                        visualState.slides = brandSettings[0]?.value || value
                        return
                     }
                     case 'Store Availability': {
                        availabilityState.store =
                           brandSettings[0]?.value || value
                        return
                     }
                     case 'Pickup Availability': {
                        availabilityState.pickup =
                           brandSettings[0]?.value || value
                        return
                     }
                     case 'Delivery Availability': {
                        availabilityState.delivery =
                           brandSettings[0]?.value || value
                        return
                     }
                     case 'Location': {
                        availabilityState.location =
                           brandSettings[0]?.value.address || value.address
                        return
                     }
                     case 'Loyalty Points Availability': {
                        rewardsState.isLoyaltyPointsAvailable =
                           brandSettings[0]?.value.isAvailable ??
                           value.isAvailable
                        return
                     }
                     case 'Wallet Availability': {
                        rewardsState.isWalletAvailable =
                           brandSettings[0]?.value.isAvailable ??
                           value.isAvailable
                        return
                     }
                     case 'Coupons Availability': {
                        rewardsState.isCouponsAvailable =
                           brandSettings[0]?.value.isAvailable ??
                           value.isAvailable
                        return
                     }
                     case 'Loyalty Points Usage': {
                        rewardsState.loyaltyPointsUsage =
                           brandSettings[0]?.value || value
                        return
                     }
                     default: {
                        return
                     }
                  }
               }
            )
            setBrand({ ...brandState })
            setVisual({ ...visualState })
            setAvailability({ ...availabilityState })
            setRewardsSettings({ ...rewardsState })

            setSettingsMapped(true)
         },
      }
   )

   if (settingsError) {
      setSettingsMapped(true)
      console.log(error)
   }

   // Subscription for Cart when logged in
   const { loading: subscribingCart } = useSubscription(CART, {
      variables: {
         customerId: customer?.id,
         brandId,
      },
      skip: !Boolean(customer?.id && brandId),
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
            open('ReferralCode')
         },
         onError: error => {
            console.log(error)
         },
      }
   )

   const [
      createBrandCustomer,
      { loading: creatingBrandCustomer },
   ] = useMutation(CREATE_BRAND_CUSTOMER, {
      onCompleted: data => {
         setCustomer({
            ...customer,
            brandCustomers: [
               ...customer.brandCustomers,
               data.createBrandCustomer,
            ],
         })
         console.log('Created brand customer!')
      },
      onError: error => {
         console.log(error)
         console.error('Could not create brand customer!')
      },
   })

   // Query Customer and Data from platform
   const { error, loading: fetchingCustomer } = useQuery(CUSTOMER, {
      variables: {
         keycloakId: user.sub || user.userid,
         brandId,
      },
      onCompleted: data => {
         console.log('Customer:', data)
         if (data.customer) {
            setCustomer(data.customer)
            setCustomerDetails(data.customer.platform_customer)

            // check if customer exists on brand
            const brandCustomerRecord = data.customer.brandCustomers.find(
               record => record.brandId === brandId
            )
            console.log('brandCustomerRecord', brandCustomerRecord)
            if (!brandCustomerRecord) {
               createBrandCustomer({
                  variables: {
                     object: {
                        brandId,
                        keycloakId: data.customer.keycloakId,
                     },
                  },
               })
            }

            // check if any exisiting carts
            if (data.customer.orderCarts.length) {
               console.log('Found cart with customer...')
               setCart(data.customer.orderCarts[0])
            }

            // update any pending cart (w/o signup)
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
                     sourceBrandId: brandId,
                     brandCustomers: {
                        data: {
                           brandId,
                        },
                     },
                  },
               },
            })
         }
      },
   })

   // if (error) console.log('Customer fetch error: ', error)

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
         fetchingCustomer,
         creatingCustomer,
         creatingBrandCustomer,
         fetchingCart,
         isInitialized,
         user: Object.keys(user).length,
         subscribingCart,
         settingsMapped,
      })
      if (!isInitialized) {
         setMasterLoading(true)
      } else {
         if (isAuthenticated) {
            const status = [
               Boolean(brandId), // 1
               !fetchingCustomer, // true
               !creatingCustomer, // true
               !creatingBrandCustomer, // true
               !fetchingCart, // true
               Object.keys(user).length, // > 0
               !subscribingCart, // true
               settingsMapped, // true
            ].every(notLoading => notLoading)
            if (status) {
               setMasterLoading(false)
            }
         } else {
            const status = [
               Boolean(brandId), // 1
               settingsMapped, // true
               !fetchingCart, // true
            ].every(notLoading => notLoading)
            if (status) {
               setMasterLoading(false)
            }
         }
      }
   }, [
      brandId,
      fetchingCustomer,
      creatingCustomer,
      creatingBrandCustomer,
      fetchingCart,
      isInitialized,
      user,
      subscribingCart,
      isAuthenticated,
      settingsMapped,
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
