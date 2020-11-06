import React from 'react'
import styled from 'styled-components/native'
import { MaterialIcons } from '@expo/vector-icons'
import { useAppContext } from '../context/app'
import { useLazyQuery } from '@apollo/react-hooks'
import { SET_REFERRAL_CODE } from '../graphql'
import { useCartContext } from '../context/cart'
import { useDrawerContext } from '../context/drawer'

const ReferralCode = () => {
   const { visual, brandId } = useAppContext()
   const { customerReferral } = useCartContext()
   const { setIsDrawerOpen } = useDrawerContext()

   const [input, setInput] = React.useState('')
   const [error, setError] = React.useState('')

   // Mutation
   const [setReferralCode, { loading }] = useLazyQuery(SET_REFERRAL_CODE, {
      onCompleted: data => {
         if (data?.crm_setReferralCode[0]?.success) {
            setError('')
            setIsDrawerOpen(false)
         } else {
            setError(data?.crm_setReferralCode[0]?.message)
         }
      },
      onError: error => {
         console.log(error)
         setError('Something went wrong! Please try again later.')
      },
   })

   // Handlers
   const submit = () => {
      if (input && customerReferral && brandId) {
         setReferralCode({
            variables: {
               params: {
                  input,
                  brandId,
                  referralCode: customerReferral.referralCode,
               },
            },
         })
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
            {Boolean(error) && <ErrorText>{error}</ErrorText>}
            <Input
               placeholder="Enter referral code or email"
               value={input}
               onChangeText={text => setInput(text)}
               autoFocus={true}
            />
            <CTA color={visual.color} disabled={loading} onPress={submit}>
               <CTAText> {loading ? 'Submitting...' : 'Submit'} </CTAText>
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
   padding: 4px;
   width: 360px;
   font-size: 18px;
   border-radius: 2px;
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

const ErrorText = styled.Text`
   color: #ff5a52;
   text-align: center;
   margin-bottom: 0.5rem;
`
