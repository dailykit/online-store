import React, { useState } from 'react';
import { View, Image, ScrollView, Text, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import styled from 'styled-components/native';
import { useQuery } from '@apollo/react-hooks'
import { useAppContext } from '../context/app'
import { ALL_COUPONS } from '../graphql'

import Header from './Header.js';
import Footer from './Footer.js';
import { useDrawerContext } from '../context/drawer';

const BannerWidth = 250
const BannerHeight = 200

export default function CouponsPage( props ) {

   const [active,setActive] = useState(1);
   const { open } = useDrawerContext()
   const { visual } = useAppContext()

    const { brandId } = useAppContext();
    const [availableCoupons, setAvailableCoupons] = React.useState([]);

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
    
    return (
       <>
         <Header
            navigation={props.navigation}
         />
         <ScrollView>
            <Banner color={visual.color}>
                <BannerText>
                    Offers for you
                </BannerText>
                <BannerText2>
                    Explore top deals and offers exclusively for you!
                </BannerText2>
            </Banner>
            <Tabs>
               <TabsContainer>
                  <TouchableWithoutFeedback onPress={() => setActive(1)} >
                     <View 
                        style={ active == 1 ? [styles.box, styles.activeBox]  : styles.box }
                        onPress
                     > 
                        <Text
                           style={ active == 1 ? [styles.text, styles.activeText]  : styles.text }
                        >
                           Coupons
                        </Text>
                     </View>
                  </TouchableWithoutFeedback>
                  <TouchableWithoutFeedback onPress={() => setActive(2)} >
                     <View 
                        style={ active == 2 ? [styles.box, styles.activeBox]  : styles.box }
                     > 
                        <Text
                           style={ active == 2 ? [styles.text, styles.activeText]  : styles.text }
                        >
                           Campaigns
                        </Text>
                     </View>
                  </TouchableWithoutFeedback>
               </TabsContainer>
            </Tabs>
            {
               active==1? (
                  <MainContainer>
                     <Title>
                        Available Offers
                     </Title>
                     {availableCoupons.length ? (
                           <Wrapperflex>
                              {availableCoupons.map(coupon => (
                                 <>
                                 <Coupon coupon={coupon} />
                                 <Coupon coupon={coupon} />
                                 <Coupon coupon={coupon} />
                                 </>
                              ))}
                           </Wrapperflex>
                     ) : (
                        <EmptyWrapper>
                              <EmptyText>No coupons available right now!</EmptyText>
                        </EmptyWrapper>
                     )}
                  </MainContainer>
               ) : (
                  <Text 
                     style={styles.text}
                  >
                     Sorry no Campaigns are available!
                  </Text>
               )
            }
            
            <Footer/>
        </ScrollView>
        </>
    )
}

const Coupon = ({ coupon }) => {
    const { visual } = useAppContext();
    const { open } = useDrawerContext();
  
    return (
        <CouponContainer>
            <TouchableWithoutFeedback >
               <Image
                  style={{
                     width: 250,
                     height: 187,
                     resizeMode: 'contain',
                     alignSelf: 'center',
                  }}
                  source={{ uri: coupon.metaDetails.image }}
               />
               <CouponHeader>
                  <CouponCode>{coupon.code}</CouponCode>
               </CouponHeader>
               <View style={{
                     flexDirection: 'row',
                  }}
               >
                  <View
                     style={{
                        borderBottomRightRadius: '50%',  
                        borderTopRightRadius: '50%', 
                        borderWidth: 'none',
                        width:40,
                        height:40,
                        marginLeft: -45,
                        marginTop: -20,
                        backgroundColor: '#F2F2F2',
                     }}
                  />
                  <View
                     style={{
                        borderTopWidth:3,
                        flex: 1,
                        borderTopColor: '#000',
                        borderStyle: 'dashed',
                     }}
                  />
                  <View
                     style={{
                        borderBottomLeftRadius: '50%',
                        borderTopLeftRadius: '50%',
                        borderWidth: 0,
                        width:40,
                        height:40,
                        marginRight: -45,
                        marginTop: -20,
                        backgroundColor: '#F2F2F2',
                     }}
                  />
               </View>
            <Background>
               <TitleText>{coupon.metaDetails?.title || ''}</TitleText>
               <Text style={{
                  color: '#686b78',
               }}
               >{coupon.metaDetails?.description || ''}
               </Text>
            </Background>
            </TouchableWithoutFeedback>
         </CouponContainer>
    )
 }

const styles = StyleSheet.create({
   box:{
      height: '10vh',
      flexDirection: 'row',
      alignItems: 'center',
      cursor: 'pointer',
      marginRight:10,
   },
   activeBox: {
      borderBottomWidth: 2,
      borderBottomColor: `${props => props.color}`,      
   },
   text: {
      fontSize: 20,
      fontWeight: 600,
      color: '#8cb2d4',

   },
   activeText:{
      color: `${props => props.color}`,
   }

})

const Tabs = styled.View`
   display: flex;
   width: 100%;
   height: 10vh;
   background: #f1f1f1;
   border-bottom-color: #8cb2d4;
   border-bottom-width: 1px;
`

const TabsContainer = styled.View`
   flex-direction: row;
   margin-left: 100px;
   height: 10vh;
`

const Banner = styled.View`
   backgroundColor: ${props => props.color} ;
    height: 40vh;
    width: 100%;
    justify-content: center;
`

const BannerText = styled.Text`
    font-size: 45px;
    color: white;
    font-weight: 700;
    margin-left: 100px;
`

const BannerText2 = styled.Text`
    font-size: 20px;
    color: #8cb2d4;
    font-weight: 400;
    margin-left: 100px;
`

const Title = styled.Text`
   font-size: 30px;
   font-weight: 700;
   margin-bottom: 20px;
   color: #523434;
`

const MainContainer = styled.View`
   margin: 100px;
   margin-top: 50px;
`

const Background = styled.View`
   backgroundColor: white;
   margin: 5px;
   borderRadius: 10px;
`
 
const Wrapperflex = styled.View`
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
`
 
 const CouponContainer = styled.View`
    padding: 1rem;
    margin-right: 1.5rem;
    margin-bottom: 1.5rem;
    background: white;
    width: 300px;
    justify-content: center;
    borderRadius: 5px;
    overflow: hidden;
 `
 
 const CouponHeader = styled.View`
    margin-bottom: 0.25rem;
    flex-direction: row;
    align-items: center;
    justify-content: center;
 `
 
 const CouponCode = styled.Text`
    color: #686b78;
    font-weight: bold;
    text-transform: uppercase;
    font-size: 1.4rem;
    margin-top: 0.5rem;
 `
 
 const TitleText = styled.Text`
    color: #171833;
    margin-bottom: 0.5rem;
    font-size: 1.2rem;
    alignSelf: center;
    font-weight: bold;
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
 