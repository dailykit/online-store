import React from 'react'
import { View } from 'react-native'
import styled from 'styled-components/native'
import { width } from '../../utils/Scalaing'
import Header from '../Header'
import { useAppContext } from '../../context/app'
import DrawerLayout from '../DrawerLayout'
import { useDrawerContext } from '../../context/drawer'

const Auth = ({ navigation }) => {
   const { visual } = useAppContext()
   const { open } = useDrawerContext()

   return (
      <>
         <Header navigation={navigation} />
         <View
            style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
         >
            <Wrapper>
               <Heading>The page you're trying to view requires login!</Heading>
               <CTAContainer>
                  <CTA color={visual.color} onPress={() => open('Login')}>
                     <CTAText color={visual.color}>Login</CTAText>
                  </CTA>
                  <CTA color={visual.color} onPress={() => open('Register')}>
                     <CTAText color={visual.color}>Register</CTAText>
                  </CTA>
               </CTAContainer>
            </Wrapper>
         </View>
         <DrawerLayout />
      </>
   )
}

export default Auth

const Wrapper = styled.View`
   padding: ${width > 768 ? '1.2rem' : '0.8rem'};
   background: #fff;
   border-radius: 4px;
   shadow-opacity: 0.75;
   shadow-radius: 5px;
   shadow-color: #ccc;
   shadow-offset: 3px 3px;
`

const Heading = styled.Text`
   font-weight: 500;
   color: #666;
   font-size: 1.2rem;
   margin-bottom: 1rem;
`

const CTAContainer = styled.View`
   flex-direction: ${width > 768 ? 'row' : 'column'};
   align-items: center;
   justify-content: center;
`

const CTA = styled.TouchableOpacity`
   padding: 8px;
   background-color: #fff;
   border: 1px solid ${props => props.color || '#efefef'};
   border-radius: 2px;
   margin: 8px;
`

const CTAText = styled.Text`
   font-weight: bold;
   color: ${props => props.color || '#666'};
`
