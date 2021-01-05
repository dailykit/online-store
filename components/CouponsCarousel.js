import styled from 'styled-components/native'
import React from 'react';
import { useQuery } from '@apollo/react-hooks'
import { useAppContext } from '../context/app'
import { ALL_COUPONS } from '../graphql'
import { Feather } from '@expo/vector-icons'
import { Dimensions, Image, Text, View, ScrollView } from 'react-native'
import { useDrawerContext } from '../context/drawer';
import { flex } from 'styled-system';

const BannerWidth = 250
const BannerHeight = 250

export default function CouponsCarousel() {
    const { brandId } = useAppContext()
    const { open } = useDrawerContext()

    const [availableCoupons, setAvailableCoupons] = React.useState([])

    const { loading } = useQuery(ALL_COUPONS, {
      variables: {
         brandId,
      },
      onCompleted: data => {
         const coupons = data.coupons
         console.log({ coupons })
         setAvailableCoupons([...coupons])
      },
      onError: error => {
         console.log(error)
      },
   })

   return (
    <>
       {availableCoupons.length ? (
            <Wrapper>
              <Wrapperflex>
             {availableCoupons.map(coupon => (
                <Coupon coupon={coupon} />
             ))}
               <CouponContainer>
                  <View style={{
                           width: BannerWidth,
                           height: BannerHeight,
                           resizeMode: 'cover',
                           justifyContent: 'center',
                           backgroundColor: '#440',
                        }}
                  >
                     <ShowMore>
                        More Offers
                     </ShowMore>
                  </View>
               </CouponContainer>
             </Wrapperflex>
          </Wrapper>
       ) : (
          <EmptyWrapper>
             <EmptyText>No coupons available right now!</EmptyText>
          </EmptyWrapper>
       )}
    </>
 )

}

const Coupon = ({ coupon }) => {
    const { visual } = useAppContext()
 
    const [isDescVisible, setIsDescVisible] = React.useState(false)
 
    return (
       <CouponContainer>
            <View>
               <Image 
                  style={{
                     width: BannerWidth,
                     height: BannerHeight,
                     resizeMode: 'cover',
                  }}
                  source={{ uri: coupon.metaDetails.image }}
               />
            </View>
          <CouponHeader>
             <CouponCode>{coupon.code}</CouponCode>
          </CouponHeader>
          <TitleText>{coupon.metaDetails?.title || ''}</TitleText>
       </CouponContainer>
    )
 }

const ShowMore = styled.Text`
   font-size: 2.5rem;
   text-transform: uppercase;
   font-weight: bold;
   text-align: center;
`
 
const Wrapperflex = styled.View`
    display: flex;
    flex-direction: row;
    overflow: scroll;
`

 const Wrapper = styled.ScrollView`
    padding: 1rem;
    background: #fff;
    margin: 1.25rem;
 `
 
 const CouponContainer = styled.View`
    padding: 1rem;
    background: #fcfcfc;
    border: 0px solid black;
    box-sizing: border-box;
    margin: 0.5rem;
    border-radius: 0.25rem;
    cursor: pointer;
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
 