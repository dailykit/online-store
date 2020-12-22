import React from 'react'
import styled from 'styled-components/native'
import { useMutation, useSubscription } from '@apollo/react-hooks'
import { COUPONS, CREATE_ORDER_CART_REWARDS } from '../graphql'
import { useCartContext, useDrawerContext } from '../context/cart'
import { useAppContext } from '../context/app'
import { Feather } from '@expo/vector-icons'
import { useStoreToast } from '../utils'
import CouponsSkeleton from './skeletons/coupons'

const AllCouponList = () => {
   const { cart, customer } = useCartContext()
   const { brandId } = useAppContext()
   const { setIsDrawerOpen } = useDrawerContext()
   const { toastr } = useStoreToast()

   const [applying, setApplying] = React.useState(false)
   const [availableCoupons, setAvailableCoupons] = React.useState([])

   // Subscription
   const { data, loading, error } = useSubscription(COUPONS, {
      variables: {
         params: {
            cartId: cart.id,
            keycloakId: customer.keycloakId,
         },
         brandId,
      },
      onSubscriptionData: data => {
         const coupons = data.subscriptionData.data.coupons
         setAvailableCoupons([coupons])
      },
   })

   console.log(availableCoupons);

   if (error) console.log(error)

   if (loading) return <CouponsSkeleton />

   return (
      <>
         {availableCoupons.length ? (
            <Wrapper>
               {availableCoupons.map(coupon => (
                  <Coupon coupon={coupon} />
               ))}
            </Wrapper>
         ) : (
            <EmptyWrapper>
               <EmptyText>No coupons available right now!</EmptyText>
            </EmptyWrapper>
         )}
      </>
   )
}

export default AllCouponList;

const Coupon = ({ coupon }) => {
   const { visual } = useAppContext()

   const [isDescVisible, setIsDescVisible] = React.useState(false)

   return (
      <CouponContainer>
         <CouponHeader>
            <CouponCode>{coupon.code}</CouponCode>
            
         </CouponHeader>
         <TitleText>{coupon.metaDetails?.title || ''}</TitleText>
         {isDescVisible ? (
            <>
               <Description>
                  {coupon.metaDetails?.description || ''}
               </Description>
               <Button onPress={() => setIsDescVisible(false)}>
                  <Feather name="minus" color="#686b78" />
                  <ButtonText>Show Less</ButtonText>
               </Button>
            </>
         ) : (
            <Button onPress={() => setIsDescVisible(true)}>
               <Feather name="plus" color="#686b78" />
               <ButtonText>Show More</ButtonText>
            </Button>
         )}
      </CouponContainer>
   )
}

const Wrapper = styled.ScrollView`
   padding: 1rem;
`

const CouponContainer = styled.View`
   padding: 1.25rem;
   border: 1px dashed #e1e1e1;
   margin-bottom: 1rem;
   border-radius: 0.25rem;
`

const CouponHeader = styled.View`
   margin-bottom: 0.25rem;
   flex-direction: row;
   align-items: center;
   justify-content: space-between;
`

const CouponCode = styled.Text`
   color: #686b78;
   font-weight: bold;
   text-transform: uppercase;
   font-size: 1.1rem;
`

const CTA = styled.TouchableOpacity`
   opacity: ${props => (props.disabled ? 0.6 : 1)};
`

const CTAText = styled.Text`
   color: ${props => props.color || '#686b78'};
   text-transform: uppercase;
   font-weight: bold;
`

const TitleText = styled.Text`
   color: #686b78;
   margin-bottom: 0.5rem;
`

const Button = styled.TouchableOpacity`
   flex-direction: row;
   align-items: center;
`

const ButtonText = styled.Text`
   font-size: 0.8rem;
   color: #686b78;
   margin-left: 0.25rem;
`

const Description = styled.Text`
   color: #686b78;
`

const EmptyWrapper = styled.View`
   flex: 1;
   align-items: center;
   justify-content: center;
`

const EmptyText = styled.Text`
   color: #686b78;
   font-size: 16px;
   font-weight: 600;
`