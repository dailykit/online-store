import {
   useLazyQuery,
   useMutation,
   useSubscription,
   useQuery,
} from '@apollo/react-hooks'
import { Spinner } from 'native-base'
import { Dimensions } from 'react-native'
import { Datepicker } from '@ui-kitten/components'
import * as axios from 'axios'
import moment from 'moment'
import React, { useRef, useState } from 'react'
import Carousel from 'react-native-banner-carousel'
import {
   Image,
   ScrollView,
   SectionList,
   Text,
   TouchableOpacity,
   View,
   ListView,
} from 'react-native'
// Change number to edit: 3 (shit package)
import { CLIENTID, DAILYOS_SERVER_URL } from 'react-native-dotenv'
import { Header, Icon } from '../../components'
import Cart from '../../components/Cart'
import { CategoryBanner } from '../../components/CategoryBanner'
import DrawerLayout from '../../components/DrawerLayout'
import Products from '../../components/Products'
import { SafetyBanner } from '../../components/SafetyBanner'
import { useAppContext } from '../../context/app'
import { useAuth } from '../../context/auth'
import { useCartContext } from '../../context/cart'
import {
   CREATE_CUSTOMER,
   CUSTOMER,
   CUSTOMER_DETAILS,
   STORE_SETTINGS,
   FETCH_CART,
   UPDATE_CART,
} from '../../graphql'
import { height, width } from '../../utils/Scalaing'
import { styles } from './styles'
import CategoriesButton from '../../components/CategoriesButton'
import Footer from '../../components/Footer'
import { Feather } from '@expo/vector-icons'

import { AsyncStorage } from 'react-native-web'

const BannerWidth = Dimensions.get('window').width
const BannerHeight = width > 768 ? height * 0.6 : height * 0.3

const images = [
   'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
   'https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
   'https://images.pexels.com/photos/1640775/pexels-photo-1640775.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
]

const CalendarIcon = props => <Icon size={24} {...props} name="calendar" />

const Home = props => {
   const [selectedIndex, setSelectedIndex] = useState(0)
   const [calendarDate, setcalendarDate] = useState(new Date())

   const [data, setData] = React.useState([])
   const [loading, setLoading] = React.useState(false)

   const {
      setCustomer,
      setCustomerDetails,
      cart,
      customer,
      setCart,
   } = useCartContext()
   const { user } = useAuth()

   const [cartId, setCartId] = React.useState(null) // Pending Cart Id

   // const sectionListRef = useRef();
   // const scrollViewRef = useRef();

   const {
      brand,
      setBrand,
      visual,
      setVisual,
      availability,
      setAvailability,
   } = useAppContext()

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

   const [fetchCart] = useLazyQuery(FETCH_CART, {
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
         if (data.updateCart.customerInfo?.customerFirstName) {
            // means both the mutations are made
            AsyncStorage.clear()
         }
      },
      onError: error => {
         console.log(error)
      },
   })

   const fetchData = async date => {
      try {
         setLoading(true)
         const response = await axios.post(`${DAILYOS_SERVER_URL}/api/menu`, {
            date,
         })
         setData(response.data)
         setLoading(false)
      } catch (err) {
         setLoading(false)
         console.log(err)
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

   React.useEffect(() => {
      if (cartId && !customer) {
      }
   }, [cartId])

   // Query
   const [customerDetails] = useLazyQuery(CUSTOMER_DETAILS, {
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
            const details = data.platform_customerByClients[0].customer
            if (cartId) {
               updateCart({
                  variables: {
                     id: cartId,
                     set: {
                        customerInfo: {
                           customerFirstName: details?.firstName,
                           customerLastName: details?.lastName,
                           customerPhone: details?.phoneNumber,
                           customerEmail: details?.email,
                        },
                        paymentMethodId:
                           details?.defaultPaymentMethodId || null,
                        address: details?.defaultCustomerAddress || null,
                        stripeCustomerId: details?.stripeCustomerId || null,
                     },
                  },
               })
            }
         } else {
            console.log('No customer data found!')
         }
      },
      fetchPolicy: 'cache-and-network',
   })

   // Mutations
   const [createCustomer] = useMutation(CREATE_CUSTOMER, {
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
   })

   // Subscription
   const { error } = useSubscription(CUSTOMER, {
      variables: {
         keycloakId: user.sub || user.userid,
         email: user.email,
      },
      onSubscriptionData: data => {
         const customers = data.subscriptionData.data.customers
         if (customers.length) {
            setCustomer(customers[0])
            updateCart({
               variables: {
                  id: cartId,
                  set: {
                     customerId: customers[0].id,
                     customerKeycloakId: user.sub || user.id,
                  },
               },
            })
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

   if (error) console.log('Subscription error: ', error)

   if (settingsLoading) {
      return (
         <View
            style={{
               flex: 1,
               justifyContent: 'center',
               alignItems: 'center',
               backgroundColor: '#fff',
            }}
         >
            <Spinner size="large" />
         </View>
      )
   }
   if (availability && !isStoreOpen())
      return (
         <View style={styles.reallyBigContainer}>
            <ScrollView>
               <View>
                  <Header
                     title="Home"
                     search
                     options
                     navigation={props.navigation}
                  />
                  <View
                     style={{
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center',
                     }}
                  >
                     <Text
                        style={{
                           fontWeight: 500,
                           fontSize: 24,
                           marginBottom: 20,
                        }}
                     >
                        Store Closed
                     </Text>
                     <Text style={{ fontSize: 20 }}>
                        {availability.store.shutMessage}
                     </Text>
                  </View>
               </View>
               <View style={styles.flexContainer}>
                  <Spinner size="large" />
               </View>
               <View style={{ height: height * 0.08 }} />
            </ScrollView>
            <Cart to="OrderSummary" {...props} text="Checkout" />
         </View>
      )
   let pickerData = []
   let sectionsData = []

   if (data.length) {
      data.forEach((category, _id) => {
         pickerData.push(category.name)
         let dataItems = []
         Object.keys(category)?.forEach(key => {
            if (
               key != 'name' &&
               key != '__typename' &&
               key != 'title' &&
               key != 'data'
            ) {
               category[key]?.forEach(el =>
                  dataItems.push({
                     type: key,
                     id: el,
                  })
               )
            }
         })
         sectionsData.push({
            title: category.name,
            data: dataItems,
         })
      })
   }
   data.forEach(el => {
      el.title = el.name
      el.data = [{ ...el }]
   })
   return (
      <>
         <Header
            title={brand?.name ? brand?.name : 'Home'}
            search
            options
            navigation={props.navigation}
         />
         <ScrollView
            stickyHeaderIndices={[2]}
            style={[styles.reallyBigContainer]}
            showsVerticalScrollIndicator={false}
         >
            {/* <Tabs /> */}
            {Boolean(visual?.slides?.length) && (
               <View style={styles.img_container}>
                  <Carousel
                     autoplay
                     autoplayTimeout={3000}
                     loop
                     index={0}
                     pageSize={BannerWidth}
                  >
                     {visual.slides.map((slide, index) => (
                        <View key={index}>
                           <Image
                              style={{
                                 width: BannerWidth,
                                 height: BannerHeight,
                                 size: 'cover',
                              }}
                              source={{ uri: slide.url }}
                           />
                        </View>
                     ))}
                  </Carousel>
               </View>
            )}

            {/* <View
          style={{
            flexDirection: 'column',
            width: width,
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: 10,
            marginBottom: 10,
            marginTop: 20,
          }}
        >
          <Text
            style={{
              opacity: 0.6,
              width: width > height ? width * 0.3 : width,
              minWidth: 200,
              textAlign: 'center',
              fontSize: 24,
              fontWeight: 'bold',
              marginBottom: 10,
            }}
          >
            Showing products for
          </Text>
          <Datepicker
            date={calendarDate}
            controlStyle={{
              backgroundColor: 'white',
              color: '#000',
            }}
            placeholder='Wednesday, May 4th'
            accessoryRight={CalendarIcon}
            style={{
              width: width > height ? width * 0.3 : width * 0.9,
            }}
            onSelect={(_date) => {
              setcalendarDate(_date);
              fetchData({
                year: moment(_date).year(),
                month: moment(_date).month(),
                day: moment(_date).date(),
              });
            }}
          /> 
        </View>*/}
            {loading && (
               <View
                  style={{
                     flex: 1,
                     justifyContent: 'center',
                     alignItems: 'center',
                     backgroundColor: '#fff',
                  }}
               >
                  <Spinner size="large" />
               </View>
            )}

            {Boolean(data.length) && (
               <View style={[styles.picker_container, { marginBottom: 4 }]}>
                  <ScrollView
                     horizontal
                     style={{
                        flex: 1,
                     }}
                     contentContainerStyle={{
                        marginHorizontal: 10,
                     }}
                     showsHorizontalScrollIndicator={false}
                  >
                     {data.map((category, key) => (
                        <CategoriesButton
                           title={category.name}
                           key={key}
                           id={key}
                           length={data?.length}
                           onPress={() =>
                              props.navigation.navigate(
                                 'CategoryProductsPage',
                                 {
                                    data,
                                    category,
                                 }
                              )
                           }
                        />
                     ))}
                  </ScrollView>
               </View>
            )}
            {Boolean(data.length) && (
               <View style={styles.sections}>
                  {data.map(category => (
                     <View style={styles.category}>
                        <CategoryBanner
                           navigation={props.navigation}
                           title={category.name}
                           category={category}
                           data={data}
                           showLink={true}
                        />
                        <Products
                           navigation={props.navigation}
                           category={category}
                           horizontal={true}
                        />
                     </View>
                  ))}
               </View>
            )}
            {!loading && Boolean(!data.length) && (
               <View
                  style={{
                     flex: 1,
                     justifyContent: 'center',
                     alignItems: 'center',
                     padding: 20,
                     minHeight: 200,
                  }}
               >
                  <Feather name="frown" size={28} color="#666" />
                  <Text
                     style={{
                        fontSize: '1.2rem',
                        fontWeight: 'bold',
                        color: '#666',
                        marginTop: 10,
                        textAlign: 'center',
                     }}
                  >
                     Sorry! No products available at this moment.
                  </Text>
               </View>
            )}
            {/* <View style={styles.headerContainer}>
          <SafetyBanner {...props} />
        </View> */}
            {width < 768 && (
               <Cart to="OrderSummary" {...props} text="Checkout" />
            )}
            <DrawerLayout />
            <Footer />
         </ScrollView>
      </>
   )
}

export default Home
