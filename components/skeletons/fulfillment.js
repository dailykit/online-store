import React from 'react'
import { Animated } from 'react-native'
import styled from 'styled-components/native'
import { useAppContext } from '../../context/app'

const Fulfillment = () => {
   const fadeAnim = React.useRef(new Animated.Value(0)).current
   const { visual } = useAppContext()

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
         <ButtonsContainer>
            <Button />
            <Button />
         </ButtonsContainer>
         <Animated.View
            style={{
               height: '40px',
               width: '100%',
               backgroundColor: visual.color || '#aaa',
               opacity: fadeAnim,
            }}
         />
      </Wrapper>
   )
}

export default Fulfillment

const Wrapper = styled.View`
   padding: 0.5rem;
`

const ButtonsContainer = styled.View`
   flex-direction: row;
   height: 100px;
   align-items: center;
`

const Button = styled.View`
   flex: 1;
   margin: 0 0.5rem;
   height: 40px;
   background-color: rgb(221, 221, 221);
`
