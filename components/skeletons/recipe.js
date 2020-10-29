import React from 'react'
import { Animated } from 'react-native'
import styled from 'styled-components/native'
import { useAppContext } from '../../context/app'
import { height, width } from '../../utils/Scalaing'

const RecipeSkeleton = () => {
   const { visual } = useAppContext()
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
               marginVertical: 16,
               marginHorizontal: 'auto',
               borderRadius: 4,
               height: 400,
               width: 500,
               backgroundColor: '#ccc',
               opacity: fadeAnim,
            }}
         />
         <Content />
         <Content />
         <Content />
         <Heading />
      </Wrapper>
   )
}

export default RecipeSkeleton

const Wrapper = styled.View`
   flex: 1;
   background: #e9ecee;
`

const Content = styled.View`
   margin: 10px 20px;
   border-radius: 2px;
   height: 32px;
   background-color: #e1e1e1;
`

const Heading = styled.View`
   margin: 32px 20px;
   max-width: 400px;
   height: 48px;
   background-color: #e1e1e1;
`
