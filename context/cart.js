import React, { useState } from 'react'
import {
   PREORDER_PICKUP,
   ONDEMAND_PICKUP,
   PREORDER_DELIVERY,
   ONDEMAND_DELIVERY,
   UPDATE_CART,
} from '../graphql'
import { useSubscription, useMutation } from '@apollo/react-hooks'

import {
   generateDeliverySlots,
   isDeliveryAvailable,
   generatePickUpSlots,
   isPickUpAvailable,
   generateMiniSlots,
   makeDoubleDigit,
   getDistance,
   generateTimeStamp,
} from '../utils/fulfillment'

const CartContext = React.createContext()

export const CartContextProvider = ({ children }) => {
   // From Hasura
   const [customer, setCustomer] = useState(undefined)
   const [cart, setCart] = useState(undefined)
   // From platform
   const [customerDetails, setCustomerDetails] = useState(undefined)

   // local
   const [distance, setDistance] = useState(0)

   // Subscriptions
   const { data: { preOrderPickup = [] } = {} } = useSubscription(
      PREORDER_PICKUP
   )

   const { data: { onDemandPickup = [] } = {} } = useSubscription(
      ONDEMAND_PICKUP
   )

   const { data: { preOrderDelivery = [] } = {} } = useSubscription(
      PREORDER_DELIVERY,
      {
         variables: {
            distance,
         },
      }
   )

   const { data: { onDemandDelivery = [] } = {} } = useSubscription(
      ONDEMAND_DELIVERY,
      {
         variables: {
            distance,
         },
      }
   )

   // Mutation
   const [updateCart] = useMutation(UPDATE_CART, {
      onCompleted: () => {
         console.log('Cart updated!')
      },
      onError: error => {
         console.log(error)
      },
   })

   // Effects
   React.useEffect(() => {
      if (customer?.orderCarts?.length) {
         setCart(customer.orderCarts[0])
      } else {
         setCart(undefined)
      }
   }, [customer])

   React.useEffect(() => {
      if (
         customerDetails?.defaultCustomerAddress?.lat &&
         customerDetails?.defaultCustomerAddress?.lng
      ) {
         const distance = getDistance(
            customerDetails.defaultCustomerAddress.lat,
            customerDetails.defaultCustomerAddress.lng,
            33.8039712,
            -118.1722264
         )
         setDistance(distance)
      }
   }, [customerDetails])

   const generateDefaultFulfillment = () => {
      // set fulfillment
      if (distance) {
         // check for pre-order delivery
         if (preOrderDelivery[0].recurrences.length) {
            const result = generateDeliverySlots(
               preOrderDelivery[0].recurrences
            )
            if (result.status) {
               const miniSlots = generateMiniSlots(result.data, 15)
               if (miniSlots.length) {
                  const fulfillmentInfo = {
                     date: miniSlots[0].date,
                     slot: {
                        ...miniSlots[0].slots[0],
                        timestamp: generateTimeStamp(
                           miniSlots[0].slots[0].time,
                           miniSlots[0].date
                        ),
                     },
                     type: 'PREORDER_DELIVERY',
                  }
                  console.log('Default fulfillment: ', fulfillmentInfo)
                  return updateCart({
                     variables: {
                        id: cart.id,
                        set: {
                           fulfillmentInfo,
                        },
                     },
                  })
               }
            }
         }
         // check for on-demand delivery
         if (onDemandDelivery[0].recurrences.length) {
            const result = isDeliveryAvailable(onDemandDelivery[0].recurrences)
            if (result.status) {
               const date = new Date()
               const time =
                  date.getHours() + ':' + makeDoubleDigit(date.getMinutes())
               const fulfillmentInfo = {
                  date: date.toDateString(),
                  slot: {
                     time,
                     timestamp: generateTimeStamp(time, date.toDateString()),
                     mileRangeId: result.mileRangeId,
                  },
                  type: 'ONDEMAND_DELIVERY',
               }
               console.log('Default fulfillment: ', fulfillmentInfo)
               return updateCart({
                  variables: {
                     id: cart.id,
                     set: {
                        fulfillmentInfo,
                     },
                  },
               })
            }
         }
      }
      // delivery not possible, then look for pickup options
      if (preOrderPickup[0].recurrences.length) {
         const result = generatePickUpSlots(preOrderPickup[0].recurrences)
         if (result.status) {
            const miniSlots = generateMiniSlots(result.data, 15)
            if (miniSlots.length) {
               const fulfillmentInfo = {
                  date: miniSlots[0].date,
                  slot: {
                     ...miniSlots[0].slots[0],
                     timestamp: generateTimeStamp(
                        miniSlots[0].slots[0].time,
                        miniSlots[0].date
                     ),
                  },
                  type: 'PREORDER_PICKUP',
               }
               console.log('Default fulfillment: ', fulfillmentInfo)
               return updateCart({
                  variables: {
                     id: cart.id,
                     set: {
                        fulfillmentInfo,
                     },
                  },
               })
            }
         }
      }
      if (onDemandPickup[0].recurrences.length) {
         const result = isPickUpAvailable(onDemandPickup[0].recurrences)
         if (result.status) {
            const date = new Date()
            const time =
               date.getHours() + ':' + makeDoubleDigit(date.getMinutes())
            const fulfillmentInfo = {
               date: date.toDateString(),
               slot: {
                  time,
                  timestamp: generateTimeStamp(time, date.toDateString()),
               },
               type: 'ONDEMAND_PICKUP',
            }
            console.log('Default fulfillment: ', fulfillmentInfo)
            return updateCart({
               variables: {
                  id: cart.id,
                  set: {
                     fulfillmentInfo,
                  },
               },
            })
         }
      }
   }

   React.useEffect(() => {
      try {
         if (cart && !cart.fulfillmentInfo) {
            generateDefaultFulfillment()
         }
      } catch (e) {
         console.log(e)
      }
   }, [cart])

   React.useEffect(() => {
      try {
         if (cart?.address) {
            generateDefaultFulfillment()
         }
      } catch (e) {
         console.log(e)
      }
   }, [cart?.address?.id])

   return (
      <CartContext.Provider
         value={{
            customer,
            setCustomer,
            cart,
            setCart,
            customerDetails,
            setCustomerDetails,
         }}
      >
         {children}
      </CartContext.Provider>
   )
}

export const useCartContext = () => React.useContext(CartContext)
