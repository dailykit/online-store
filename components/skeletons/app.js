import React from 'react'
import { Animated } from 'react-native'
import styled from 'styled-components/native'
import { height, width } from '../../utils/Scalaing'

const AppSkeleton = () => {
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
         <Header>
            <Logo />
            <NavLinks>
               <NavLink />
               {width > 768 && (
                  <>
                     <NavLink />
                     <NavLink />
                  </>
               )}
            </NavLinks>
         </Header>
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

export default AppSkeleton

const Wrapper = styled.View`
   flex: 1;
   background: #e9ecee;
`

const Header = styled.View`
   height: 60px;
   background: #fff;
   flex-direction: row;
   align-items: center;
   justify-content: space-between;
   padding: 0 20px;
`

const Logo = styled.View`
   height: 50px;
   width: 50px;
   border-radius: 25px;
   background-color: #e9ecee;
`

const NavLinks = styled.View`
   flex-direction: row;
   align-items: center;
`

const NavLink = styled.View`
   margin-right: 16px;
   height: 40px;
   width: 100px;
   border-radius: 4px;
   background-color: #e9ecee;
`

const Body = styled.View``

const Content = styled.View`
   margin: 10px 20px;
   border-radius: 2px;
   height: ${height * 0.1}px;
   background-color: #e9e9e9;
`
