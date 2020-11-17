import React from 'react'
import styled from 'styled-components/native'
import { useAppContext } from '../../context/app'

const Register = () => {
   const { visual } = useAppContext()

   const [lastname, setLastname] = React.useState('')
   const [firstname, setFirstname] = React.useState('')
   const [email, setEmail] = React.useState('')
   const [password, setPassword] = React.useState('')
   const [confirmPassword, setConfirmPassword] = React.useState('')

   const submit = () => {
      console.log({ email, password, firstname, lastname, confirmPassword })
   }

   return (
      <Wrapper>
         <Heading>Register</Heading>
         <Content>
            <Label>First Name</Label>
            <Field
               value={firstname}
               onChangeText={text => setFirstname(text)}
            />
            <Label>Last Name</Label>
            <Field value={lastname} onChangeText={text => setLastname(text)} />
            <Label>Email</Label>
            <Field value={email} onChangeText={text => setEmail(text)} />
            <Label>Password</Label>
            <Field value={password} onChangeText={text => setPassword(text)} />
            <Label>Confirm Password</Label>
            <Field
               value={confirmPassword}
               onChangeText={text => setConfirmPassword(text)}
            />
            <CTA
               disabled={
                  !email.trim() ||
                  !password.trim() ||
                  !firstname.trim() ||
                  !lastname.trim() ||
                  !confirmPassword.trim()
               }
               onPress={submit}
               color={visual.color}
            >
               <CTAText>Submit</CTAText>
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
