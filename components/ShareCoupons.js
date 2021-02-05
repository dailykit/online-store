import React from 'react'
import { useQuery } from '@apollo/react-hooks'
import styled from 'styled-components/native'
import { useAppContext } from '../context/app'
import { ALL_COUPONS } from '../graphql'
import CouponsSkeleton from './skeletons/coupons'
import SocialMediaShareButtons from './SocialMediaShareButtons'
import { Text } from 'react-native'

export default function ShareCoupons({ params }) {

   const {code, navigation} = params;
   const { brandId } = useAppContext()

   React.useEffect(() =>{
      navigation.navigate('CouponsPage', {
         code: code,
      })
   },[code])

   const [availableCoupons, setAvailableCoupons] = React.useState([])

   const { loading } = useQuery(ALL_COUPONS, {
      variables: {
         brandId,
      },
      onCompleted: data => {
         const coupons = data.coupons
         setAvailableCoupons([...coupons])
      },
      onError: error => {
         console.log(error)
      },
   })

   if (loading) return <CouponsSkeleton />

   return (
        <Wrapper>
            {availableCoupons.filter(coupon => coupon.code==code).map(filteredcoupon => (
                  <Coupon coupon={filteredcoupon} />                  
               )
            )}
            <Container>
               <label>
                  Share on social media
               </label>
            </Container>  
               <SocialMediaShareButtons />
        </Wrapper>
   )
}

const Coupon = ({ coupon }) => {
   const { visual } = useAppContext()

   return (
      <CouponContainer>
         <CouponHeader>
            <CouponCode>{coupon.code}</CouponCode>
         </CouponHeader>
         <TitleText>{coupon.metaDetails?.title || ''}</TitleText>
            <>
               <Description>
                  {coupon.metaDetails?.description || ''}
               </Description>
            </>
      </CouponContainer>
   )
}

const Wrapper = styled.ScrollView`
   padding: 1.25rem;
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
   font-size: 1.5rem;
`
const TitleText = styled.Text`
   margin-bottom: 0.5rem;
   font-size: 1.2rem;
   font-weight: 700;
`
const Description = styled.Text`
   color: #686b78;
   font-size: 1rem;
`

const label = styled.Text`
   font-size: 1rem;
   margin-bottom: 1rem;
   font-weight: 600;
`

const Container = styled.View`
   margin-bottom: 1rem;
`