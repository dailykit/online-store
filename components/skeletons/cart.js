import React from 'react'
import { Animated } from 'react-native'
import styled from 'styled-components/native'
import { height, width } from '../../utils/Scalaing'

const CartSkeleton = () => {
   const fadeAnim = React.useRef(new Animated.Value(0)).current // Initial value for opacity: 0

   React.useEffect(() => {
      Animated.loop(
         Animated.sequence([
            Animated.timing(fadeAnim, {
               toValue: 1,
               duration: 1000,
               delay: 500,
            }),
            Animated.timing(fadeAnim, {
               toValue: 0,
               duration: 1000,
               delay: 500,
            }),
         ])
      ).start()
   }, [])

   return (
      <Wrapper>
         <Body>
            <Animated.View
               style={{
                  margin: 20,
                  borderRadius: 4,
                  height: height * 0.3,
                  backgroundColor: '#ccc',
                  opacity: fadeAnim,
               }}
            />
            <Content />
            <Content />
            <Content />
         </Body>
      </Wrapper>
   )
}

export default CartSkeleton

const Wrapper = styled.View`
   flex: 1;
   background: #e9ecee;
`

const Body = styled.View``

const Content = styled.View`
   margin: 10px 20px;
   border-radius: 2px;
   height: ${height * 0.1}px;
   background-color: #e9e9e9;
`
