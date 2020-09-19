import React from 'react'
import { View } from 'react-native'
import styled from 'styled-components/native'
import { width } from '../../utils/Scalaing'

const PlatformError = () => {
   return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
         <Wrapper>
            <Heading>Oops! It's not you. It's us.</Heading>
            <CTAContainer>
               <CTA onPress={() => window.location.reload()} highlight>
                  <CTAText highlight>Reload</CTAText>
               </CTA>
               <CTA onPress={() => window.location.href('/')}>
                  <CTAText>Back to Home</CTAText>
               </CTA>
            </CTAContainer>
         </Wrapper>
      </View>
   )
}

export default PlatformError

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
   text-align: center;
`

const CTAContainer = styled.View`
   flex-direction: ${width > 768 ? 'row' : 'column'};
   align-items: center;
   justify-content: center;
`

const CTA = styled.TouchableOpacity`
   padding: 8px;
   background-color: ${props => (props.highlight ? '#EE534F' : '#fff')};
   border: 1px solid ${props => props.color || '#E9ECEE'};
   border-radius: 2px;
   margin: 8px;
`

const CTAText = styled.Text`
   color: ${props => (props.highlight ? '#fff' : '#EE534F')};
`
