import React from 'react'
import styled from 'styled-components/native'
import { MaterialIcons } from '@expo/vector-icons'
import { useAppContext } from '../context/app'
import { useMutation } from '@apollo/react-hooks'
import { UPDATE_CUSTOMER_REFERRAL } from '../graphql'
import { useCartContext } from '../context/cart'
import { useDrawerContext } from '../context/drawer'

const ReferralCode = () => {
   const { visual } = useAppContext()
   const { customerReferral } = useCartContext()
   const { setIsDrawerOpen } = useDrawerContext()

   const [code, setCode] = React.useState('')
   const [busy, setBusy] = React.useState(false)

   // Mutation
   const [updateCustomerReferral] = useMutation(UPDATE_CUSTOMER_REFERRAL, {
      variables: {
         id: customerReferral?.id,
         set: {
            referredByCode: code,
         },
      },
      onCompleted: () => {
         setIsDrawerOpen(false)
      },
      onError: error => {
         console.log(error)
      },
   })

   // Handlers
   const submit = () => {
      try {
         if (code && customerReferral) {
            setBusy(true)
            updateCustomerReferral()
         }
      } catch (err) {
         console.log(err)
      } finally {
         setBusy(false)
      }
   }

   return (
      <Wrapper>
         <Header>
            <MaterialIcons
               name="card-giftcard"
               size={48}
               color={visual.color}
            />
            <HeaderText>Add Referral Code to earn rewards!</HeaderText>
         </Header>
         <Body>
            <Input
               placeholder="Enter referral code"
               value={code}
               onChangeText={text => setCode(text)}
            />
            <CTA color={visual.color} disabled={busy} onPress={submit}>
               <CTAText> {busy ? 'Submitting...' : 'Submit'} </CTAText>
            </CTA>
         </Body>
      </Wrapper>
   )
}

export default ReferralCode

const Wrapper = styled.View`
   padding: 0.5rem;
`

const Header = styled.View`
   text-align: center;
   margin-bottom: 1rem;
`

const HeaderText = styled.Text`
   margin-top: 0.75rem;
   color: #686b78;
   font-weight: bold;
   font-size: 1.2rem;
`

const Body = styled.View`
   padding: 0.5rem;
   align-items: center;
   justify-content: center;
`

const Input = styled.TextInput`
   margin-bottom: 1rem;
   border-color: #686b78;
   text-align: center;
`

const CTA = styled.TouchableOpacity`
   max-width: 300px;
   min-width: 200px;
   padding: 0.5rem;
   border-radius: 2px;
   background-color: ${props => props.color};
   opacity: ${props => (props.disabled ? 0.6 : 1)};
`

const CTAText = styled.Text`
   color: #fff;
   text-align: center;
`
