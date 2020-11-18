import React from 'react'
import { AsyncStorage } from 'react-native'
import styled from 'styled-components/native'
import { loginUser, registerUser } from '../../api'
import { useAppContext } from '../../context/app'
import { useDrawerContext } from '../../context/drawer'
import { useStoreToast } from '../../utils'

const emailRegex = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/

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
         if (!emailRegex.test(email)) {
            throw new Error('Enter a valid email!')
         }
         if (password.trim().length < 6) {
            throw new Error('Password must contain at least 6 characters!')
         }
         if (password.trim() !== confirmPassword.trim()) {
            throw new Error('Password and Confirm password must match!')
         }
         const { data, errors } = await registerUser({ email, password })
         if (data?.registerCustomer?.success) {
            setMessage('Account created! Logging you in...')
            const { data, error } = await loginUser({ email, password })
            if (data?.access_token) {
               await AsyncStorage.setItem('token', data.access_token)
               window.location.href = `${window.location.origin}/store`
            }
         }
         if (errors?.length) {
            throw Error(
               errors[0].message.replace(/username/gi, 'email') ||
                  'Something went wrong!'
            )
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
