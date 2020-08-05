import React from 'react'
import styled, { css } from 'styled-components/native'
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete'
import { useCartContext } from '../../context/cart'
import { useAppContext } from '../../context/app'
import { UPDATE_CUSTOMER, CREATE_CUSTOMER_ADDRESS } from '../../graphql'
import { useMutation } from '@apollo/react-hooks'
import { useDrawerContext } from '../../context/drawer'
import { useAuth } from '../../context/auth'

import { MAPS_API_KEY } from 'react-native-dotenv'
import { useScript } from '../../utils/useScript'

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
   const { customerDetails } = useCartContext()
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

   const [updateCustomer] = useMutation(UPDATE_CUSTOMER)

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
   const [loaded, error] = useScript(
      `https://maps.googleapis.com/maps/api/js?key=${MAPS_API_KEY}&libraries=places`
   )

   const [updateCustomer] = useMutation(UPDATE_CUSTOMER)
   const [createCustomerAddress] = useMutation(CREATE_CUSTOMER_ADDRESS)

   const { customerDetails } = useCartContext()
   const { visual } = useAppContext()
   const { setSaved, setIsDrawerOpen } = useDrawerContext()
   const { user } = useAuth()

   const [populated, setPopulated] = React.useState(undefined)
   const [saving, setSaving] = React.useState(false)

   const formatAddress = async address => {
      const response = await fetch(
         `https://maps.googleapis.com/maps/api/geocode/json?key=${MAPS_API_KEY}&address=${encodeURIComponent(
            address.description
         )}`
      )
      const data = await response.json()
      if (data.status === 'OK' && data.results.length > 0) {
         const [result] = data.results

         const address = {
            line2: '',
            lat: result.geometry.location.lat.toString(),
            lng: result.geometry.location.lng.toString(),
         }

         result.address_components.forEach(node => {
            if (node.types.includes('street_number')) {
               address.line1 = `${node.long_name} `
            }
            if (node.types.includes('route')) {
               address.line1 += node.long_name
            }
            if (
               node.types.includes('locality') ||
               node.types.includes('sublocality')
            ) {
               address.city = node.long_name
            }
            if (node.types.includes('administrative_area_level_1')) {
               address.state = node.long_name
            }
            if (node.types.includes('country')) {
               address.country = node.long_name
            }
            if (node.types.includes('postal_code')) {
               address.zipcode = node.long_name
            }
         })

         setPopulated({ ...address, label: '', notes: '' })
      }
   }

   const save = async () => {
      try {
         setSaving(true)
         const {
            data: { platform_createCustomerAddress: address = {} } = {},
         } = await createCustomerAddress({
            variables: {
               object: {
                  ...populated,
                  keycloakId: user.sub || user.id,
               },
            },
         })
         if (address.id) {
            if (!customerDetails.defaultCustomerAddress) {
               updateCustomer({
                  variables: {
                     keycloakId: user.sub || user.id,
                     _set: {
                        defaultCustomerAddressId: address.id,
                     },
                  },
               })
            }
            setSaved({
               success: 'true',
               type: 'create_address',
               data: { address },
            })
            setIsDrawerOpen(false)
         } else {
            throw Error('An error occured, please try again!')
         }
      } catch (err) {
         setError(err.message)
      } finally {
         setSaving(false)
      }
   }

   return (
      <>
         <ContentHeader>
            <ContentHeaderText>Add a new Address</ContentHeaderText>
         </ContentHeader>
         <Form>
            {loaded && !error && (
               <FormField>
                  <FormFieldLabel>Search Address</FormFieldLabel>
                  <GooglePlacesAutocomplete
                     placeholder="Address..."
                     onPress={data => formatAddress(data)}
                     onFail={error => console.error(error)}
                     fetchDetails={true}
                     query={{
                        key: MAPS_API_KEY,
                        language: 'en',
                     }}
                     requestUrl={{
                        url:
                           'https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api',
                        useOnPlatform: 'web',
                     }}
                     styles={{
                        textInputContainer: {
                           backgroundColor: 'rgba(0,0,0,0)',
                           borderTopWidth: 0,
                           borderBottomWidth: 1,
                        },
                        textInput: {
                           marginLeft: 0,
                           marginRight: 0,
                           height: 20,
                           color: '#5d5d5d',
                           fontSize: 16,
                        },
                        predefinedPlacesDescription: {
                           color: '#1faadb',
                        },
                     }}
                  />
               </FormField>
            )}
            <FormField>
               <FormFieldLabel>Address Line 1</FormFieldLabel>
               <FormFieldInput
                  onChangeText={text =>
                     setPopulated({ ...populated, line1: text })
                  }
                  value={populated?.line1 || ''}
                  editable={Boolean(populated)}
               />
            </FormField>
            <Grid>
               <FormField>
                  <FormFieldLabel>City</FormFieldLabel>
                  <FormFieldInput
                     onChangeText={text =>
                        setPopulated({ ...populated, city: text })
                     }
                     value={populated?.city || ''}
                     editable={Boolean(populated)}
                     half
                  />
               </FormField>
               <FormField>
                  <FormFieldLabel>State</FormFieldLabel>
                  <FormFieldInput
                     onChangeText={text =>
                        setPopulated({ ...populated, state: text })
                     }
                     value={populated?.state || ''}
                     editable={Boolean(populated)}
                  />
               </FormField>
            </Grid>
            <Grid>
               <FormField>
                  <FormFieldLabel>Country</FormFieldLabel>
                  <FormFieldInput
                     onChangeText={text =>
                        setPopulated({ ...populated, country: text })
                     }
                     value={populated?.country || ''}
                     editable={Boolean(populated)}
                     half
                  />
               </FormField>
               <FormField>
                  <FormFieldLabel>Zip Code</FormFieldLabel>
                  <FormFieldInput
                     onChangeText={text =>
                        setPopulated({ ...populated, zipcode: text })
                     }
                     value={populated?.zipcode || ''}
                     editable={Boolean(populated)}
                  />
               </FormField>
            </Grid>
            <FormField>
               <FormFieldLabel>Save As</FormFieldLabel>
               <FormFieldInput
                  onChangeText={text =>
                     setPopulated({ ...populated, label: text })
                  }
                  value={populated?.label || ''}
                  editable={Boolean(populated)}
               />
            </FormField>
            <FormField>
               <FormFieldLabel>Drop Off Instructions</FormFieldLabel>
               <FormFieldInput
                  onChangeText={text =>
                     setPopulated({ ...populated, notes: text })
                  }
                  value={populated?.notes || ''}
                  editable={Boolean(populated)}
               />
            </FormField>
         </Form>
         <CTA color={visual.color} onPress={save} disabled={saving}>
            <CTAText>{saving ? 'Saving...' : 'Save'}</CTAText>
         </CTA>
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
   background: ${props => (props.editable ? '#fff' : '#E3E3E3')};
   ${props =>
      props.half &&
      css`
         width: 95%;
      `}
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

const Grid = styled.View`
   display: grid;
   grid-template-columns: repeat(2, 1fr);
   grid-gap: 16px;
`
