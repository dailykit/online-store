import React from 'react'
import styled from 'styled-components/native'
import { Feather } from '@expo/vector-icons'
import { useDrawerContext } from '../../../context/drawer'
import { useAppContext } from '../../../context/app'
import { DELETE_ORDER_CART_REWARDS, ORDER_CART_REWARDS } from '../../../graphql'
import { useMutation, useSubscription } from '@apollo/react-hooks'
import { useCartContext } from '../../../context/cart'
import { useStoreToast } from '../../../utils'

const Coupon = ({ cart }) => {
   const { customer } = useCartContext()
   const { open } = useDrawerContext()
   const { visual } = useAppContext()
   const { toastr } = useStoreToast()

   // Subscription
   const { data, error } = useSubscription(ORDER_CART_REWARDS, {
      variables: {
         cartId: cart.id,
         params: {
            cartId: cart.id,
            keycloakId: customer?.keycloakId,
         },
      },
      onSubscriptionData: ({ subscriptionData: { data = {} } = {} }) => {
         if (data.orderCartRewards.length) {
            const isCouponValid = data.orderCartRewards.every(
               record => record.reward.condition.isValid
            )
            if (isCouponValid) {
               console.log('Coupon is valid!')
            } else {
               console.log('Coupon is not valid anymore!')
               toastr('error', 'Coupon is not valid!')
               deleteOrderCartRewards()
            }
         }
      },
   })

   // Mutation
   const [deleteOrderCartRewards] = useMutation(DELETE_ORDER_CART_REWARDS, {
      variables: {
         cartId: cart.id,
      },
      onCompleted: () => {
         console.log('Coupon removed!')
      },
      onError: err => {
         console.log(err)
      },
   })

   if (error) console.log(error)

   return (
      <>
         {data?.orderCartRewards?.length ? (
            <Wrapper color={visual.color}>
               <TextContainer>
                  <CouponCode>
                     {data.orderCartRewards[0].reward.coupon.code}
                  </CouponCode>
                  <SubText>Coupon Applied</SubText>
               </TextContainer>
               <RemoveButton onPress={() => deleteOrderCartRewards()}>
                  <Feather name="x" size={20} />
               </RemoveButton>
            </Wrapper>
         ) : (
            <CTA onPress={() => open('CouponList')} color={visual.color}>
               <CTAText>Apply Coupon</CTAText>
            </CTA>
         )}
      </>
   )
}

export default Coupon

const Wrapper = styled.View`
   flex-direction: row;
   align-items: center;
   justify-content: space-between;
   margin-bottom: 0.75rem;
   padding: 0.25rem;
   border: 1px dashed ${props => props.color || '#686b78'};
`

const TextContainer = styled.View``

const RemoveButton = styled.TouchableOpacity``

const CouponCode = styled.Text`
   text-transform: uppercase;
   font-weight: bold;
   color: #686b78;
`

const SubText = styled.Text`
   font-size: 10px;
   color: #686b78;
`

const CTA = styled.TouchableOpacity`
   padding: 0.5rem;
   border: 1px dashed ${props => props.color || '#aaa'};
   border-radius: 0.25rem;
   margin-bottom: 0.75rem;
`

const CTAText = styled.Text`
   color: #686b78;
   font-weight: bold;
   text-align: center;
`
