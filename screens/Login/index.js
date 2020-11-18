import React from 'react'
import styled from 'styled-components/native'
import { useAppContext } from '../../context/app'

import { loginUser } from '../../api'
import { AsyncStorage } from 'react-native'

const Login = () => {
   const { visual } = useAppContext()

   const [email, setEmail] = React.useState('')
   const [password, setPassword] = React.useState('')
   const [error, setError] = React.useState('')
   const [loading, setLoading] = React.useState(false)

   const submit = async () => {
      try {
         setError('')
         setLoading(true)
         console.log({ email, password })
         const { data, error } = await loginUser({ email, password })
         if (data?.access_token) {
            await AsyncStorage.setItem('token', data.access_token)
            window.location.href = `${window.location.origin}/store`
         } else {
            throw new Error('Email or Password is incorrect!')
         }
      } catch (err) {
         if (err.response.status === 401) {
            setError('Email or Password is incorrect!')
         } else {
            setError(err.message)
         }
      } finally {
         setLoading(false)
      }
   }

   return (
      <Wrapper>
         <Heading>Login</Heading>
         {Boolean(error) && <ErrorText> {error} </ErrorText>}
         <Content>
            <Label>Email</Label>
            <Field value={email} onChangeText={text => setEmail(text)} />
            <Label>Password</Label>
            <Field
               value={password}
               secureTextEntry={true}
               onChangeText={text => setPassword(text)}
            />
            <CTA
               disabled={!email.trim() || !password.trim() || loading}
               onPress={submit}
               color={visual.color}
            >
               <CTAText>{loading ? 'Submitting...' : 'Submit'}</CTAText>
            </CTA>
         </Content>
      </Wrapper>
   )
}

export default Login

const Wrapper = styled.ScrollView`
   padding: 2rem 1rem;
`

const Heading = styled.Text`
   font-size: 2rem;
   font-weight: 600;
   margin-bottom: 1.5rem;
   text-align: center;
`

const Content = styled.View``

const ErrorText = styled.Text`
   color: red;
   margin-bottom: 0.5rem;
`

const Label = styled.Text`
   margin-bottom: 0.25rem;
`

const Field = styled.TextInput`
   margin-bottom: 1rem;
   padding: 0.25rem;
   border: 1px solid #aaa;
   border-radius: 2px;
`

const CTA = styled.TouchableOpacity`
   background: ${props => props.color || 'green'};
   opacity: ${props => (props.disabled ? 0.7 : 1)};
   text-align: center;
   padding: 0.5rem;
   border-radius: 2px;
`

const CTAText = styled.Text`
   color: #fff;
   text-transform: uppercase;
`
