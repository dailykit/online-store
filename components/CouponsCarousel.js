import styled from 'styled-components/native'
import React from 'react';
import { useQuery } from '@apollo/react-hooks'
import { useAppContext } from '../context/app'
import { ALL_COUPONS } from '../graphql'
import { View, ImageBackground, Text, StyleSheet } from 'react-native'

const BannerWidth = 250
const BannerHeight = 250

export default function CouponsCarousel({ navigation }) {

    const { brandId, visual } = useAppContext()

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
               {/* <CouponContainer>
                  <View style={{
                           width: BannerWidth,
                           height: BannerHeight,
                           resizeMode: 'cover',
                           justifyContent: 'center',
                           backgroundColor: visual.color,
                           borderRadius: 2,
                        }}
                  >
                     <ShowMore onPress={() => navigation.navigate('CouponsPage')}>
                        More Offers
                     </ShowMore>
                  </View>
               </CouponContainer> */}
               <CouponContainer >
                  <ImageBackground source={require("../assets/imgs/Frame3.png")} 
                     imageStyle={{ borderRadius: 2}}
                     style={{
                        height: '250px',
                        width: '700px',
                        resizeMode: 'contain',
                        borderRadius: 2,
                        padding: '10px',
                  }}>
                     <View style={{
                        alignItems: 'flex-end',
                        marginRight: '20px',
                        marginTop: '20px',
                     }}>
                        <Text
                           onPress={() => navigation.navigate('CouponsPage')}
                           style={styles.text1}
                        >Speacial <br/>Offers </Text>
                        <Text
                           onPress={() => navigation.navigate('CouponsPage')}
                           style={styles.text2}
                        >Get the Coupons</Text>
                     </View>
                  </ImageBackground>
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
 
    return (
       <CouponContainer >
         <ImageBackground source={{ uri: coupon.metaDetails.image }} 
            imageStyle={{ borderRadius: 2}}
            style={{
               width: BannerWidth,
               height: BannerHeight,
               resizeMode: 'contain',
               justifyContent: 'flex-end',
               borderRadius: 2,
         }}>
            <Background1>
               <CouponHeader>
                  <CouponCode>{coupon.code}</CouponCode>
               </CouponHeader>
               <TitleText>{coupon.metaDetails?.title || ''}</TitleText>
            </Background1>
         </ImageBackground>
       </CouponContainer>
    )
 }

const styles = StyleSheet.create({
   text1: {
      fontSize: 36,
      fontWeight: 'bold',   
      color: '#1A0C1A',
      cursor: 'pointer',
   },
   text2: {
      fontSize: 20,
      fontWeight: 'bold',
      textDecorationColor: 'black',
      textDecorationStyle: 'solid',
      textDecorationLine: 'underline',   
      marginTop: "55px", 
      color: '#1A0C1A',
      cursor: 'pointer',
   },
})

const carouselTitle = styled.Text`
   font-size: 4rem;
   font-weight: bold;
`

const ShowMore = styled.Text`
   font-size: 2.5rem;
   text-transform: uppercase;
   font-weight: bold;
   text-align: center;
   color: white;
`

const Background1 = styled.View`
   backgroundColor: white;
   margin: 10px;
   alignItems: center;
   borderRadius: 2px;
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
    overflow: scroll;
 `
 
 const CouponContainer = styled.View`
    padding: 1rem;
    box-sizing: border-box;
    margin: 0.5rem;
    cursor: pointer;
    borderRadius: 2px ;
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
 
 const TitleText = styled.Text`
    color: #686b78;
    margin-bottom: 0.5rem;
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
 