import React from 'react'
import styled from 'styled-components/native'
import { useCartContext } from '../../context/cart'
import { useAppContext } from '../../context/app'
import { UPDATE_CUSTOMER } from '../../graphql'
import { useMutation } from '@apollo/react-hooks'
import { useDrawerContext } from '../../context/drawer'
import { useAuth } from '../../context/auth'

const DailyKeyBackup = ({ params }) => {
   const { path } = params

   const { customerDetails } = useCartContext()

   return (
      <Wrapper>
         <Header>
            <HeaderText> Secured and Powered By </HeaderText>
            {/* <HeaderImage source={require('../../assets/imgs/dailykey.png')} /> */}
         </Header>
         <Body>
            <CustomerInfo>
               <CustomerName>{`Hello ${customerDetails?.firstName || ''} ${
                  customerDetails?.lastName || ''
               }`}</CustomerName>
            </CustomerInfo>
            {path.includes('profile') && <Profile />}
            {path.includes('address') && <Address />}
            {path.includes('card') && <Card />}
         </Body>
      </Wrapper>
   )
}

export default DailyKeyBackup

const Profile = () => {
   const { customer, customerDetails } = useCartContext()
   const { visual } = useAppContext()
   const { setSaved, setIsDrawerOpen } = useDrawerContext()
   const { user } = useAuth()

   const [firstName, setFirstName] = React.useState(
      customerDetails.firstName || ''
   )
   const [lastName, setLastName] = React.useState(
      customerDetails.lastName || ''
   )
   const [phone, setPhone] = React.useState(customerDetails.phoneNumber || '')
   const [email, setEmail] = React.useState(customerDetails.email || '')

   const [saving, setSaving] = React.useState(false)
   const [error, setError] = React.useState('')

   const [updateCustomer] = useMutation(UPDATE_CUSTOMER, {
      refetchQueries: ['platform_customerByClients'],
   })

   const validateFields = () => {
      if (firstName && lastName && phone) {
         return true
      } else {
         return false
      }
   }

   const save = async () => {
      try {
         setError('')
         if (validateFields()) {
            const {
               data: { platform_updateCustomer = {} } = {},
            } = await updateCustomer({
               variables: {
                  keycloakId: user.sub || user.id,
                  _set: {
                     firstName,
                     lastName,
                     phoneNumber: phone,
                  },
               },
            })
            setSaved({
               success: 'true',
               type: 'update_profile',
               data: {
                  customerInfo: platform_updateCustomer,
               },
            })
            setIsDrawerOpen(false)
         } else {
            setError('All fields are required and must be in correct format!')
         }
      } catch (err) {
         setError(err.message)
      } finally {
         setSaving(false)
      }
   }

   return (
      <>
         <Form>
            {Boolean(error) && <Error>{error}</Error>}
            <FormField>
               <FormFieldLabel>First Name</FormFieldLabel>
               <FormFieldInput
                  onChangeText={text => setFirstName(text)}
                  value={firstName}
               />
            </FormField>
            <FormField>
               <FormFieldLabel>Last Name</FormFieldLabel>
               <FormFieldInput
                  onChangeText={text => setLastName(text)}
                  value={lastName}
               />
            </FormField>
            <FormField>
               <FormFieldLabel>Phone Number</FormFieldLabel>
               <FormFieldInput
                  onChangeText={text => setPhone(text)}
                  value={phone}
               />
            </FormField>
            <FormField>
               <FormFieldLabel>Email</FormFieldLabel>
               <FormFieldInput value={email} editable={false} />
            </FormField>
         </Form>
         <CTA color={visual.color} onPress={save} disabled={saving}>
            <CTAText>{saving ? 'Saving...' : 'Save'}</CTAText>
         </CTA>
      </>
   )
}

const Address = () => {
   return (
      <>
         <ContentHeader>
            <ContentHeaderText>Add a new Address</ContentHeaderText>
         </ContentHeader>
      </>
   )
}

const Card = () => {
   return (
      <>
         <ContentHeader>
            <ContentHeaderText>Add a new Card</ContentHeaderText>
         </ContentHeader>
      </>
   )
}

const Wrapper = styled.View``

const Header = styled.View`
   text-align: center;
   padding: 10px;
   border-bottom: 1px solid #e2e8f0;
`

const HeaderText = styled.Text`
   font-size: 12px;
   color: #666;
`

const HeaderImage = styled.Image``

const Body = styled.ScrollView`
   padding: 0.75rem;
`

const CustomerInfo = styled.View`
   margin-bottom: 10px;
`

const CustomerName = styled.Text`
   font-size: 1.2rem;
`

const ContentHeader = styled.View`
   text-align: center;
   margin-bottom: 0.75rem;
`

const ContentHeaderText = styled.Text`
   text-transform: uppercase;
   font-size: 1.25rem;
`

const Form = styled.View`
   margin-top: 1rem;
   margin-bottom: 0.5rem;
`

const Error = styled.Text`
   color: red;
   margin-bottom: 0.5rem;
`

const FormField = styled.View`
   margin-bottom: 0.75rem;
`

const FormFieldLabel = styled.Text`
   letter-spacing: 0.05em;
   text-transform: uppercase;
   margin-bottom: 0.25rem;
   font-weight: 500;
   font-size: 0.75rem;
   color: #a0aec8;
`

const FormFieldInput = styled.TextInput`
   border-bottom-width: 1px;
   height: 2rem;
   width: 100%;
   border-color: #a0aec8;
`

const CTA = styled.TouchableOpacity`
   width: 100%;
   height: 2.5rem;
   background-color: ${props => props.color};
   font-size: 0.875rem;
   padding-top: 0.25rem;
   padding-bottom: 0.25rem;
   text-transform: uppercase;
   font-weight: 500;
   letter-spacing: 0.05em;
   border-radius: 0.25rem;
   align-items: center;
   justify-content: center;
`

const CTAText = styled.Text`
   color: #fff;
`
