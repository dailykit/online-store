import React from 'react'
import { Animated } from 'react-native'
import styled from 'styled-components/native'

const Coupons = () => {
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
         <Animated.View
            style={{
               marginBottom: 16,
               borderRadius: 4,
               height: 100,
               backgroundColor: '#ccc',
               opacity: fadeAnim,
            }}
         />
         <Animated.View
            style={{
               marginBottom: 16,
               borderRadius: 4,
               height: 100,
               backgroundColor: '#ccc',
               opacity: fadeAnim,
            }}
         />
         <Animated.View
            style={{
               marginBottom: 16,
               borderRadius: 4,
               height: 100,
               backgroundColor: '#ccc',
               opacity: fadeAnim,
            }}
         />
      </Wrapper>
   )
}

export default Coupons

const Wrapper = styled.View`
   flex: 1;
   background: #fff;
   padding: 1rem;
`
