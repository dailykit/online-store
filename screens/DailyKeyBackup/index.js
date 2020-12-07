import { useMutation, useQuery } from '@apollo/react-hooks'
import {
   CardElement,
   Elements,
   useElements,
   useStripe,
} from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import axios from 'axios'
import { Spinner, View } from 'native-base'
import React from 'react'
import {
   MAPS_API_KEY,
   PAYMENTS_API_URL,
   CURRENCY,
   DAILYOS_SERVER_URL,
} from 'react-native-dotenv'
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete'
import MapView from 'react-native-maps'
import styled, { css } from 'styled-components/native'
import { useAppContext } from '../../context/app'
import { useAuth } from '../../context/auth'
import { useCartContext } from '../../context/cart'
import { useDrawerContext } from '../../context/drawer'
import {
   CREATE_CUSTOMER_ADDRESS,
   CREATE_STRIPE_PAYMENT_METHOD,
   STRIPE_PK,
   UPDATE_CUSTOMER,
} from '../../graphql'
import { useScript } from '../../utils/useScript'
import { createSetupIntent } from './api'

import MapMarker from '../../assets/imgs/location home @2x.png'

const DailyKeyBackup = ({ params }) => {
   const { path } = params

   const { customerDetails } = useCartContext()
   const [stripePromise, setStripePromise] = React.useState(undefined)

   useQuery(STRIPE_PK, {
      onCompleted: data => {
         if (data.organizations) {
            console.log(
               'DailyKeyBackup -> data.organizations',
               data.organizations
            )
            setStripePromise(
               loadStripe(data.organizations[0].stripePublishableKey)
            )
         }
      },
      onError: error => {
         console.log('Stripe key error: ', error)
      },
   })

   return (
      <Wrapper>
         <Header>
            <HeaderText>
               Your details will be saved securely with DailyKEY!
            </HeaderText>
            {/* <HeaderImage source={require('../../assets/imgs/dailykey.png')} /> */}
         </Header>
         <Body>
            <CustomerInfo>
               {Boolean(!path.includes('address')) && (
                  <CustomerName>{`Hello ${customerDetails?.firstName || ''} ${
                     customerDetails?.lastName || ''
                  }`}</CustomerName>
               )}
            </CustomerInfo>
            {path.includes('profile') && <Profile />}
            {path.includes('address') && <Address />}
            {path.includes('card') && stripePromise && (
               <Elements stripe={stripePromise}>
                  <Card />
               </Elements>
            )}
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
      customerDetails?.firstName || ''
   )
   const [lastName, setLastName] = React.useState(
      customerDetails?.lastName || ''
   )
   const [phone, setPhone] = React.useState(customerDetails?.phoneNumber || '')
   const [email, setEmail] = React.useState(
      customerDetails?.email || customer?.email || 'Already saved!'
   )

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
                  editable={true}
               />
            </FormField>
            <FormField>
               <FormFieldLabel>Last Name</FormFieldLabel>
               <FormFieldInput
                  onChangeText={text => setLastName(text)}
                  value={lastName}
                  editable={true}
               />
            </FormField>
            <FormField>
               <FormFieldLabel>Phone Number</FormFieldLabel>
               <FormFieldInput
                  onChangeText={text => setPhone(text)}
                  value={phone}
                  editable={true}
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
   const { visual, availability } = useAppContext()
   const { setSaved, setIsDrawerOpen } = useDrawerContext()
   const { user } = useAuth()

   const [mode, setMode] = React.useState('UNKNOWN')
   const [tracking, setTracking] = React.useState(false)
   const [isLocationDenied, setIsLocationDenied] = React.useState(false)
   const [populated, setPopulated] = React.useState(undefined)
   const [saving, setSaving] = React.useState(false)
   const [formError, setFormError] = React.useState('')

   const charLimit = 50
   const handleChange = (text, field) => {
      if (text.length <= charLimit) {
         setPopulated({ ...populated, [field]: text })
      } else {
         const updatedText = text.slice(0, 50)
         setPopulated({ ...populated, [field]: updatedText })
      }
   }

   const setNewCoordinates = pos => {
      setFormError('')
      const newLat = pos.latLng.lat().toString()
      const newLng = pos.latLng.lng().toString()
      if (newLat && newLng) {
         setPopulated({
            ...populated,
            lat: newLat,
            lng: newLng,
         })
      } else {
         setFormError('Failed to set location!')
      }
   }

   const resolveAddress = data => {
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

         if (!address.line1 || address.line1.includes('undefined')) {
            address.line1 = ''
         }

         setPopulated({ ...address, landmark: '', label: '', notes: '' })
      }
   }

   const formatAddress = async address => {
      const response = await fetch(
         `https://maps.googleapis.com/maps/api/geocode/json?key=${MAPS_API_KEY}&address=${encodeURIComponent(
            address.description
         )}`
      )
      const data = await response.json()
      resolveAddress(data)
   }

   const validateFields = () => {
      if (
         populated &&
         populated.lat &&
         populated.lng &&
         populated.line1 &&
         populated.city &&
         populated.state &&
         populated.country &&
         populated.zipcode
      ) {
         return true
      } else {
         return false
      }
   }

   const save = async () => {
      try {
         console.log(populated)
         setSaving(true)
         setFormError('')
         if (!validateFields()) {
            setFormError('Please fill in the required fields!')
            return
         }
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
            if (!customerDetails?.defaultCustomerAddress) {
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
         console.log(err)
         setFormError('An error occured, please try again!')
      } finally {
         setSaving(false)
      }
   }

   const cannotFindLocation = () => {
      console.log('Could not find location!')
      setMode('SELF')
      setTracking(false)
   }

   React.useEffect(() => {
      if (mode === 'AUTOMATIC' && window.navigator) {
         setTracking(true)
         const timer = setTimeout(cannotFindLocation, 8000)
         window.navigator.geolocation.getCurrentPosition(
            async data => {
               console.log(data.coords)
               const response = await fetch(
                  `https://maps.googleapis.com/maps/api/geocode/json?key=${MAPS_API_KEY}&latlng=${data.coords.latitude.toString()},${data.coords.longitude.toString()}`
               )
               const res = await response.json()
               resolveAddress(res)
               setTracking(false)
            },
            error => {
               console.log(error)
               setIsLocationDenied(true)
               setTracking(false)
            }
         )
         return () => {
            if (timer) {
               clearTimeout(timer)
            }
         }
      }
   }, [mode])

   if (!loaded || tracking) {
      return (
         <View
            style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
         >
            <Spinner />
         </View>
      )
   }

   if (mode === 'UNKNOWN') {
      return (
         <View
            style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
         >
            <ConfirmText>How do you want to set your location?</ConfirmText>
            <ConfirmCTAContainer>
               <ConfirmCTA
                  onPress={() => setMode('AUTOMATIC')}
                  color={visual.color}
               >
                  <ConfirmCTAText>Automatic</ConfirmCTAText>
               </ConfirmCTA>
               <ConfirmCTA onPress={() => setMode('SELF')} color={visual.color}>
                  <ConfirmCTAText>I'll add myself</ConfirmCTAText>
               </ConfirmCTA>
            </ConfirmCTAContainer>
         </View>
      )
   }

   return (
      <>
         <ContentHeader>
            <ContentHeaderText>Add a new Address</ContentHeaderText>
         </ContentHeader>
         {Boolean(formError) && <Error>{formError}</Error>}
         <Form>
            {loaded && !error && (
               <FormField>
                  <FormFieldLabel>Search Address on Google</FormFieldLabel>
                  <GooglePlacesAutocomplete
                     placeholder="Address..."
                     debounce={300}
                     onPress={data => formatAddress(data)}
                     onFail={error => console.error(error)}
                     fetchDetails={true}
                     query={{
                        key: MAPS_API_KEY,
                        language: 'en',
                        components:
                           CURRENCY === 'INR' ? 'country:in' : 'country:us',
                        location: populated?.lat
                           ? `${populated.lat},${populated.lng}`
                           : `${availability.location.lat},${availability.location.lng}`,
                        radius: 30000,
                        types: 'geocode',
                     }}
                     requestUrl={{
                        url: `${DAILYOS_SERVER_URL}/api`,
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
            {Boolean(populated?.lat && populated?.lng) && (
               <>
                  <MapView
                     provider="google"
                     region={{
                        latitude: +populated.lat,
                        longitude: +populated.lng,
                     }}
                     style={{ height: 200 }}
                  >
                     <MapView.Marker
                        coordinate={{
                           latitude: +populated.lat,
                           longitude: +populated.lng,
                        }}
                        icon={MapMarker}
                        title="You are here"
                        draggable
                        onDragEnd={setNewCoordinates}
                     />
                  </MapView>
                  <Coords>
                     {`Lat: ${populated.lat} Lng:${populated.lng}`}
                  </Coords>
               </>
            )}
            <FormField>
               <FormFieldLabel>Address Line 1*</FormFieldLabel>
               <FormFieldInput
                  onChangeText={text => handleChange(text, 'line1')}
                  value={populated?.line1 || ''}
                  editable={Boolean(populated)}
                  placeholder="Enter House Number/Flat Number"
               />
               {Boolean(populated?.line1) && (
                  <WordLimit>{`${populated.line1.length}/${charLimit}`}</WordLimit>
               )}
            </FormField>
            <FormField>
               <FormFieldLabel>Address Line 2</FormFieldLabel>
               <FormFieldInput
                  onChangeText={text => handleChange(text, 'line2')}
                  value={populated?.line2 || ''}
                  editable={Boolean(populated)}
                  placeholder="Enter Apartment Building/Complex/Locality Name"
               />
               {Boolean(populated?.line2) && (
                  <WordLimit>{`${populated.line2.length}/${charLimit}`}</WordLimit>
               )}
            </FormField>
            <FormField>
               <FormFieldLabel>Landmark</FormFieldLabel>
               <FormFieldInput
                  onChangeText={text =>
                     setPopulated({ ...populated, landmark: text })
                  }
                  value={populated?.landmark || ''}
                  editable={Boolean(populated)}
                  placeholder="Enter Nearby Landmark"
               />
            </FormField>
            <Grid>
               <FormField>
                  <FormFieldLabel>City*</FormFieldLabel>
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
                  <FormFieldLabel>State*</FormFieldLabel>
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
                  <FormFieldLabel>Country*</FormFieldLabel>
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
                  <FormFieldLabel>Zip Code*</FormFieldLabel>
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
               <FormFieldLabel>Save As (Label)</FormFieldLabel>
               <FormFieldInput
                  onChangeText={text =>
                     setPopulated({ ...populated, label: text })
                  }
                  value={populated?.label || ''}
                  editable={Boolean(populated)}
                  placeholder="Home, Office, etc."
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
                  placeholder="Ex: Leave at Door"
               />
            </FormField>
         </Form>
         <CTA
            color={visual.color}
            onPress={save}
            disabled={saving || !populated}
         >
            <CTAText>{saving ? 'Saving...' : 'Save'}</CTAText>
         </CTA>
      </>
   )
}

const CARD_ELEMENT_OPTIONS = {
   style: {
      base: {
         color: '#111',
         fontSize: '16px',
         '::placeholder': {
            color: '#aab7c4',
         },
      },
      invalid: {
         color: '#fa755a',
         iconColor: '#fa755a',
      },
   },
}

const Card = () => {
   const { customerDetails } = useCartContext()
   const { visual } = useAppContext()
   const { setSaved, setIsDrawerOpen } = useDrawerContext()
   const { user } = useAuth()
   const stripe = useStripe()
   const elements = useElements()

   const [intent, setIntent] = React.useState(null)
   const [status, setStatus] = React.useState('LOADING')
   const [error, setError] = React.useState('')
   const [name, setName] = React.useState('')
   const [saving, setSaving] = React.useState(false)
   const [updateCustomer] = useMutation(UPDATE_CUSTOMER)
   const [createPaymentMethod] = useMutation(CREATE_STRIPE_PAYMENT_METHOD)

   React.useEffect(() => {
      console.log('Running intent code: ', customerDetails)
      if (customerDetails?.stripeCustomerId) {
         ;(async () => {
            try {
               const intent = await createSetupIntent(
                  customerDetails?.stripeCustomerId
               )
               console.log('Intent: ', intent)
               if (intent.id) {
                  setIntent(intent)
                  setStatus('SUCCESS')
               } else {
                  setStatus('ERROR')
               }
            } catch (error) {
               setStatus('ERROR')
            }
         })()
      } else {
         console.log('No stripe customer ID!')
      }
   }, [])

   const save = async e => {
      try {
         e.preventDefault()
         console.log('Trying to save...')
         setError('')
         setSaving(true)
         if (!stripe || !elements) {
            console.log('No stripe or elements')
            setError('Unknown error occured! Please try again later.')
            setSaving(false)
            return
         }
         console.log('Name: ', name)
         console.log('Intent: ', intent)
         if (!name) {
            setError('All fields are required!')
            return
         }
         if (!intent) {
            setError('Stripe Error: could not form intent!')
            return
         }
         const result = await stripe.confirmCardSetup(intent.client_secret, {
            payment_method: {
               card: elements.getElement(CardElement),
               billing_details: {
                  name,
               },
            },
         })

         if (result.error) {
            console.log('Error')
            console.log(result.error)

            setError(result.error.message)
         } else {
            console.log('Result: ', result)

            const { setupIntent } = result
            if (setupIntent.status === 'succeeded') {
               const { data: { success, data = {} } = {} } = await axios.get(
                  `${PAYMENTS_API_URL}/api/payment-method/${setupIntent.payment_method}`
               )
               if (success) {
                  const {
                     data: { paymentMethod = {} } = {},
                  } = await createPaymentMethod({
                     variables: {
                        object: {
                           last4: data.card.last4,
                           brand: data.card.brand,
                           country: data.card.country,
                           funding: data.card.funding,
                           expYear: data.card.exp_year,
                           cvcCheck: data.card.cvc_check,
                           expMonth: data.card.exp_month,
                           stripePaymentMethodId: data.id,
                           keycloakId: user.sub || user.id,
                           cardHolderName: data.billing_details.name,
                        },
                     },
                  })
                  if (!customerDetails.defaultPaymentMethodId) {
                     await updateCustomer({
                        variables: {
                           keycloakId: user.sub || user.id,
                           _set: {
                              defaultPaymentMethodId: data.id,
                           },
                        },
                     })
                  }
                  setSaved({
                     success: true,
                     type: 'create_card',
                     data: {
                        paymentMethodId: paymentMethod.stripePaymentMethodId,
                     },
                  })
                  setIsDrawerOpen(false)
               } else {
                  // TODO: delete stripe payment method on failure
                  throw Error("Couldn't complete card setup, please try again")
               }
            } else {
               throw Error("Couldn't complete card setup, please try again")
            }
         }
      } catch (error) {
         console.log(error)
         setError(error.message)
      } finally {
         setSaving(false)
      }
   }

   if (status === 'LOADING') {
      return (
         <View
            style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
         >
            <Spinner />
         </View>
      )
   }

   return (
      <>
         <ContentHeader>
            <ContentHeaderText>Add a new Card</ContentHeaderText>
         </ContentHeader>
         {Boolean(error) && <Error>{error}</Error>}
         <Form>
            <FormField>
               <FormFieldLabel>Card Holder Name</FormFieldLabel>
               <FormFieldInput
                  onChangeText={text => setName(text)}
                  value={name}
                  editable={true}
               />
            </FormField>
            <FormField>
               <CardElement
                  options={CARD_ELEMENT_OPTIONS}
                  onChange={({ error }) => setError(error?.message || '')}
               />
            </FormField>
         </Form>
         <CTA color={visual.color} onPress={save} disabled={saving}>
            <CTAText>{saving ? 'Saving...' : 'Save'}</CTAText>
         </CTA>
      </>
   )
}

const Wrapper = styled.View`
   flex: 1;
`

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
   padding: 1rem;
   flex: 1;
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
   opacity: ${props => (props.disabled ? 0.6 : 1)};
   margin-bottom: 1rem;
`

const CTAText = styled.Text`
   color: #fff;
`

const Grid = styled.View`
   display: grid;
   grid-template-columns: repeat(2, 1fr);
   grid-gap: 16px;
`

const WordLimit = styled.Text`
   font-size: 12px;
   text-align: right;
`

const Coords = styled.Text`
   font-size: 10px;
   color: #aaa;
   margin-bottom: 1rem;
`

const ConfirmText = styled.Text`
   margin-bottom: 1rem;
`

const ConfirmCTAContainer = styled.View`
   flex-direction: row;
   align-items: center;
`

const ConfirmCTA = styled.TouchableOpacity`
   padding: 8px;
   background: ${props => props.color || '#666'};
   margin: 0 8px;
   border-radius: 2px;
`

const ConfirmCTAText = styled.Text`
   text-align: center;
   color: #fff;
`
