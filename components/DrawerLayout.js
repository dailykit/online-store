import { useLazyQuery } from '@apollo/react-hooks'
import { Feather } from '@expo/vector-icons'
import Modal from 'modal-enhanced-react-native-web'
import React from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { useAuth } from '../context/auth'
import { useCartContext } from '../context/cart'
import { useDrawerContext } from '../context/drawer'
import { CUSTOMER } from '../graphql'
import AddDetails from '../screens/AddDetails'
import DailyKeyBackup from '../screens/DailyKeyBackup'
import EditAddress from '../screens/EditAddress'
import Keycloak from '../screens/Keycloak'
import PaymentProcessing from '../screens/PaymentProcessing'
import SafetyScreen from '../screens/SafetyScreen'
import SelectPaymentMethod from '../screens/SelectPaymentMethod'
import { height, width } from '../utils/Scalaing'
import Fulfillment from './Fulfillment'
import CouponList from '../screens/OrderSummary/components/CouponList'
import ReferralCode from './ReferralCode'
import { useAppContext } from '../context/app'

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
         console.log('platform -> data', data)
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
         ['AddDetails', 'Login', 'Register', 'Payment', 'CouponList'].includes(
            drawerView
         )
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
         case 'Register':
            return <Keycloak type="register" />
         case 'Payment':
            return <PaymentProcessing {...params} />
         case 'CouponList':
            return <CouponList />
         case 'ReferralCode':
            return <ReferralCode />
         default:
            return <Text>Oops! No such component.</Text>
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
         {drawerView === 'DailyKeyBackup' && (
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
         )}
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
