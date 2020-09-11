import React from 'react'
import styled from 'styled-components/native'
import { useSubscription } from '@apollo/react-hooks'
import { COUPONS } from '../graphql'
import { useCartContext } from '../context/cart'
import { Spinner, Text } from 'native-base'
import { useAppContext } from '../context/app'
import { Feather } from '@expo/vector-icons'

const CouponList = () => {
   const { cart, customer } = useCartContext()

   const { data, loading, error } = useSubscription(COUPONS, {
      variables: {
         // cartId: cart.id,
         // keycloakId: customer.keycloakId,
      },
   })

   if (error) console.log(error)

   if (loading) return <Spinner />

   return (
      <Wrapper>
         {data.coupons.map(coupon => (
            <Coupon coupon={coupon} />
         ))}
      </Wrapper>
   )
}

export default CouponList

const Coupon = ({ coupon }) => {
   const { visual } = useAppContext()

   const [isDescVisible, setIsDescVisible] = React.useState(false)

   return (
      <CouponContainer>
         <CouponHeader>
            <CouponCode>{coupon.code}</CouponCode>
            <CTA>
               <CTAText color={visual.color}>Apply</CTAText>
            </CTA>
         </CouponHeader>
         <TitleText>{coupon.metaDetails.title}</TitleText>
         {isDescVisible ? (
            <>
               <Description>{coupon.metaDetails.description}</Description>
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
   border-bottom: 1px solid #686b78;
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

const CTA = styled.TouchableOpacity``

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
