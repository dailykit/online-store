import React from 'react'
import styled from 'styled-components/native'

import { useAppContext } from '../../context/app'
import { Feather } from '@expo/vector-icons'

const LoginSuccess = () => {
   const sendMessage = () => {
      if (window) {
         window.parent.postMessage({
            loginSuccess: true,
            message: 'Login successful!',
         })
      }
   }

   React.useEffect(() => {
      sendMessage()
   }, [])

   return (
      <Wrapper>
         <Feather name="log-in" size={32} color="#666" />
         <AuthText>You've been logged in successfully!</AuthText>
         <ReloadText>You will be rediected shortly.</ReloadText>
         <ReloadCTA onPress={sendMessage}>
            <ReloadCTAText>Didn't redirect? Click here.</ReloadCTAText>
         </ReloadCTA>
      </Wrapper>
   )
}

export default LoginSuccess

export const Wrapper = styled.View`
   align-items: center;
   justify-content: center;
   flex: 1;
   text-align: center;
   background-color: #fff;
`

export const AuthText = styled.Text`
   margin-top: 1.2rem;
   color: #666;
   font-weight: bold;
   font-size: 1.2reml;
`

export const ReloadText = styled.Text`
   margin-top: 1rem;
   color: #666;
   font-size: 0.9rem;
`

export const ReloadCTA = styled.TouchableOpacity`
   background-color: #fff;
`

export const ReloadCTAText = styled.Text`
   font-size: 0.9rem;
   color: #2965f1;
`
