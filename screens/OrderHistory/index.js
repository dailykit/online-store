import { useSubscription } from '@apollo/react-hooks'
import { Spinner } from 'native-base'
import React from 'react'
import { ScrollView, Text, TouchableOpacity, View } from 'react-native'
import { Header } from '../../components'
import Auth from '../../components/error/Auth'
import PlatformError from '../../components/error/PlatformError'
import OrderCard from '../../components/OrderCard'
import AppSkeleton from '../../components/skeletons/app'
import { useAppContext } from '../../context/app'
import { useCartContext } from '../../context/cart'
import { ORDERS } from '../../graphql'
import { styles } from './styles'

export default ({ navigation }) => {
   const { customer, customerDetails } = useCartContext()
   const { masterLoading } = useAppContext()

   // Query
   const { data, loading, error } = useSubscription(ORDERS, {
      variables: {
         id: customer?.id,
      },
   })

   if (masterLoading) {
      return <AppSkeleton />
   }

   if (!customer) {
      return <Auth navigation={navigation} />
   }

   if (!customerDetails) {
      return <PlatformError navigation={navigation} />
   }

   if (loading) {
      return (
         <>
            <Header title="Home" navigation={navigation} />
            <View style={styles.center}>
               <Spinner size="large" />
            </View>
         </>
      )
   }

   if (error) {
      return (
         <>
            <Header title="Home" navigation={navigation} />
            <View style={styles.center}>
               <Text>Oops! We could not get orders. Check again later!</Text>
            </View>
         </>
      )
   }

   return (
      <View style={{ backgroundColor: '#E9ECEE', flex: 1 }}>
         <Header title="Home" navigation={navigation} />
         <View style={styles.outerContainer}>
            <Text style={styles.heading}>Order History</Text>
            <ScrollView style={styles.container}>
               {data?.orders
                  .filter(order => order?.orderCart)
                  .map(order => (
                     <>
                        <TouchableOpacity
                           key={order?.id}
                           onPress={() =>
                              navigation.navigate('Order', {
                                 orderId: order.id,
                              })
                           }
                           style={styles.card}
                        >
                           <OrderCard order={order} />
                        </TouchableOpacity>
                     </>
                  ))}
            </ScrollView>
         </View>
      </View>
   )
}
