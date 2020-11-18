import React from 'react'
import { AsyncStorage } from 'react-native'
import styled from 'styled-components/native'
import { loginUser, registerUser } from '../../api'
import { useAppContext } from '../../context/app'
import { useDrawerContext } from '../../context/drawer'
import { useStoreToast } from '../../utils'

const Register = () => {
   const { visual } = useAppContext()
   const { open } = useDrawerContext()
   const { toastr } = useStoreToast()

   const [email, setEmail] = React.useState('')
   const [password, setPassword] = React.useState('')
   const [confirmPassword, setConfirmPassword] = React.useState('')
   const [error, setError] = React.useState('')
   const [message, setMessage] = React.useState('')
   const [loading, setLoading] = React.useState(false)

   const submit = async () => {
      try {
         setError('')
         setMessage('')
         setLoading(true)
         if (password.trim().length < 6) {
            throw new Error('Password must contain at least 6 characters!')
         }
         if (password.trim() !== confirmPassword.trim()) {
            throw new Error('Password and Confirm password do not match!')
         }
         const { data } = await registerUser({ email, password })
         if (data?.registerCustomer?.success) {
            setMessage('Account created! Logging you in...')
            const { data, error } = await loginUser({ email, password })
            if (data?.access_token) {
               await AsyncStorage.setItem('token', data.access_token)
               window.location.href = `${window.location.origin}/store`
            }
         } else {
            throw new Error('Failed to create account with these credentials!')
         }
      } catch (err) {
         console.log(err)
         setError(err.message)
      } finally {
         setLoading(false)
      }
   }

   return (
      <Wrapper>
         <Heading>Register</Heading>
         <Content>
            <Label>Email</Label>
            <Field value={email} onChangeText={text => setEmail(text)} />
            <Label>Password</Label>
            <Field
               value={password}
               secureTextEntry={true}
               onChangeText={text => setPassword(text)}
            />
            <Label>Confirm Password</Label>
            <Field
               value={confirmPassword}
               secureTextEntry={true}
               onChangeText={text => setConfirmPassword(text)}
            />
            <CTA
               disabled={
                  !email.trim() ||
                  !password.trim() ||
                  !confirmPassword.trim() ||
                  loading
               }
               onPress={submit}
               color={visual.color}
            >
               <CTAText>{loading ? 'Submitting...' : 'Submit'}</CTAText>
            </CTA>
            {Boolean(message) && <MessageText> {message} </MessageText>}
            {Boolean(error) && <ErrorText> {error} </ErrorText>}
         </Content>
      </Wrapper>
   )
}

export default Register

const Wrapper = styled.ScrollView`
   padding: 2rem 1rem;
`

const Heading = styled.Text`
   font-size: 2rem;
   font-weight: 600;
   margin-bottom: 1.5rem;
   text-align: center;
`
const ErrorText = styled.Text`
   color: red;
`

const MessageText = styled.Text`
   color: green;
`

const Content = styled.View``

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
   margin-bottom: 0.5rem;
`

const CTAText = styled.Text`
   color: #fff;
   text-transform: uppercase;
`
