import React from 'react'
import { useLazyQuery } from '@apollo/react-hooks'
import { Feather } from '@expo/vector-icons'
import Modal from 'modal-enhanced-react-native-web'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { useAuth } from '../context/auth'
import { useCartContext } from '../context/cart'
import { useDrawerContext } from '../context/drawer'
import { CUSTOMER } from '../graphql'
import { height, width } from '../utils/Scaling'
import { useAppContext } from '../context/app'

// components
const AddDetails = React.lazy(() => import('../screens/AddDetails'))
const DailyKeyBackup = React.lazy(() => import('../screens/DailyKeyBackup'))
const EditAddress = React.lazy(() => import('../screens/EditAddress'))
const Keycloak = React.lazy(() => import('../screens/Keycloak'))
const Login = React.lazy(() => import('../screens/Login'))
const CouponList = React.lazy(() =>
   import('../screens/OrderSummary/components/CouponList')
)
const PaymentProcessing = React.lazy(() =>
   import('../screens/PaymentProcessing')
)
const Register = React.lazy(() => import('../screens/Register'))
const SafetyScreen = React.lazy(() => import('../screens/SafetyScreen'))
const SelectPaymentMethod = React.lazy(() =>
   import('../screens/SelectPaymentMethod')
)
const AllCouponList = React.lazy(() => import('./AllCouponList'))
const DeliveryBreakup = React.lazy(() => import('./DeliveryBreakup'))
const Fulfillment = React.lazy(() => import('./Fulfillment'))
const PrivacyPolicy = React.lazy(() => import('./PrivacyPolicy'))
const ReferralCode = React.lazy(() => import('./ReferralCode'))
const RefundPolicy = React.lazy(() => import('./RefundPolicy'))
const TermsAndConditions = React.lazy(() => import('./TermsAndConditions'))

const DrawerLayout = () => {
   const {
      drawerView,
      isDrawerOpen,
      setIsDrawerOpen,
      setDrawerView,
      params,
   } = useDrawerContext()
   const { setCustomerDetails } = useCartContext()
   const { brandId } = useAppContext()
   const { user } = useAuth()

   // Query
   const [fetchDetails] = useLazyQuery(CUSTOMER, {
      variables: {
         keycloakId: user.sub || user.userid,
         brandId,
      },
      onCompleted: data => {
         if (data.customer.platform_customer) {
            setCustomerDetails(data.customer.platform_customer)
         } else {
            console.log('No customer data found!')
         }
      },
      onError: error => {
         console.log(error)
      },
      fetchPolicy: 'cache-and-network',
   })

   //Effects
   React.useEffect(() => {
      if (
         !isDrawerOpen &&
         ['AddDetails', 'DailyKeyBackup'].includes(drawerView)
      ) {
         fetchDetails()
      }
   }, [isDrawerOpen])

   React.useEffect(() => {
      if (
         !isDrawerOpen &&
         [
            'AddDetails',
            'Login',
            'Register',
            'Payment',
            'CouponList',
            'LoginSelf',
            'RegisterSelf',
            'DailyKeyBackup',
            'AllCouponList',
         ].includes(drawerView)
      ) {
         setDrawerView(undefined)
      }
   }, [isDrawerOpen])

   // Handlers
   const renderScreen = () => {
      switch (drawerView) {
         case 'EditAddress':
            return <EditAddress />
         case 'SelectPaymentMethod':
            return <SelectPaymentMethod />
         case 'AddDetails':
            return <AddDetails params={params} />
         case 'DailyKeyBackup':
            return <DailyKeyBackup params={params} />
         case 'Safety':
            return <SafetyScreen />
         case 'Fulfillment':
            return <Fulfillment />
         case 'Login':
            return <Keycloak type="login" />
         case 'LoginSelf':
            return <Login />
         case 'Register':
            return <Keycloak type="register" />
         case 'RegisterSelf':
            return <Register />
         case 'Payment':
            return <PaymentProcessing {...params} />
         case 'CouponList':
            return <CouponList />
         case 'ReferralCode':
            return <ReferralCode />
         case 'DeliveryBreakup':
            return <DeliveryBreakup />
         case 'TermsAndConditions':
            return <TermsAndConditions />
         case 'PrivacyPolicy':
            return <PrivacyPolicy />
         case 'RefundPolicy':
            return <RefundPolicy />
         case 'AllCouponList':
            return <AllCouponList />
         default:
            return <Text>.</Text>
      }
   }

   return (
      <Modal
         style={width > 1280 ? styles.modal : styles.phoneModal}
         isVisible={isDrawerOpen}
         onBackdropPress={() => {
            setIsDrawerOpen(false)
         }}
      >
         <TouchableOpacity
            style={{
               width: width > 1280 ? 640 : width,
               position: 'relative',
               marginHorizontal: 'auto',
            }}
            onPress={() => setIsDrawerOpen(false)}
         >
            <Feather
               name="x"
               size={28}
               color="#fff"
               style={{ position: 'absolute', right: 8, top: -40 }}
            />
         </TouchableOpacity>
         {/* {drawerView === 'DailyKeyBackup' && (
            <TouchableOpacity
               style={{
                  width: width > 1280 ? 640 : width,
                  position: 'relative',
                  marginHorizontal: 'auto',
               }}
               onPress={() => setDrawerView('AddDetails')}
            >
               <Text
                  style={{
                     position: 'absolute',
                     left: 8,
                     top: -30,
                     color: '#fff',
                  }}
               >
                  Trouble with adding details? Click here!
               </Text>
            </TouchableOpacity>
         )} */}
         <View style={width > 1280 ? styles.container : styles.phoneContainer}>
            <View
               style={width > 1280 ? styles.component : styles.phoneComponent}
            >
               {renderScreen()}
            </View>
         </View>
      </Modal>
   )
}

export default DrawerLayout

const styles = StyleSheet.create({
   modal: {
      position: 'absolute',
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
   },
   phoneModal: {
      height: height * 0.8,
      width,
      position: 'absolute',
      bottom: 0,
      left: 0,
      margin: 0,
      borderTopLeftRadius: 10,
      borderTopRightRadius: 10,
   },
   container: {
      height: height * 0.8,
      width: width > 1280 ? 640 : width,
      backgroundColor: '#fff',
      alignItems: 'center',
      borderRadius: 5,
      overflow: 'hidden',
      marginHorizontal: 'auto',
   },
   phoneContainer: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
   },
   component: {
      width: '100%',
      height: '100%',
      position: 'relative',
   },
   phoneComponent: {
      width: '100%',
      height: '100%',
      position: 'relative',
   },
})
