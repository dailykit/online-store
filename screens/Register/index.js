import React from 'react'
import styled from 'styled-components/native'
import { registerUser } from '../../api'
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
   const [loading, setLoading] = React.useState(false)

   const submit = async () => {
      try {
         setError('')
         setLoading(true)
         if (password.trim().length < 6) {
            throw new Error('Password must contain at least 6 characters!')
         }
         if (password.trim() !== confirmPassword.trim()) {
            throw new Error('Password and Confirm password do not match!')
         }
         const data = await registerUser({ email, password })
         console.log(data)
         if (data.success) {
            open('LoginSelf')
         } else {
            toastr('error', 'Could not create account!')
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
   margin-bottom: 0.5rem;
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
`

const CTAText = styled.Text`
   color: #fff;
   text-transform: uppercase;
`
