import { Feather } from '@expo/vector-icons'
import React from 'react'
import { TouchableOpacity, Clipboard } from 'react-native'
import styled from 'styled-components/native'
import { Header } from '../../components'
import Auth from '../../components/error/Auth'
import AppSkeleton from '../../components/skeletons/app'
import { useAppContext } from '../../context/app'
import { useCartContext } from '../../context/cart'
import { useDrawerContext } from '../../context/drawer'
import { width } from '../../utils/Scaling'
import { CURRENCY } from 'react-native-dotenv'
import { Helmet } from 'react-helmet'
// 12

const ProfileScreen = ({ navigation }) => {
   const { visual, masterLoading, availability } = useAppContext()
   const { customer, customerDetails } = useCartContext()

   if (masterLoading) {
      return <AppSkeleton />
   }

   if (!customer) {
      return <Auth navigation={navigation} />
   }

   return (
      <Container>
         <Helmet>
            <title>{visual.appTitle} | Profile</title>
         </Helmet>
         <Header title="Home" navigation={navigation} />
         <Wrapper>
            <Banner color={visual.color}>
               <BannerHello>Hello</BannerHello>
               {Boolean(customerDetails?.firstName) && (
                  <BannerName>{`${customerDetails?.firstName || ''} ${
                     customerDetails?.lastName || ''
                  }`}</BannerName>
               )}
            </Banner>
            {Boolean(availability?.referral?.isAvailable) && <ReferralCode />}
            <PersonalDetails />
            <Addresses />
            {Boolean(CURRENCY !== 'INR') && <Cards />}
         </Wrapper>
      </Container>
   )
}

export default ProfileScreen

const ReferralCode = () => {
   const { customerReferral } = useCartContext()
   const { open } = useDrawerContext()
   const { visual } = useAppContext()

   return (
      <Section>
         <SectionTileLabel>Your Referral Code</SectionTileLabel>
         <ReferralCodeContainer>
            <Code>{customerReferral?.referralCode}</Code>
            <CopyBtn
               onPress={() =>
                  Clipboard.setString(customerReferral?.referralCode)
               }
            >
               <Feather name="copy" color="#666" size={20} />
            </CopyBtn>
         </ReferralCodeContainer>
         {customerReferral.referredByCode ? (
            <>
               <SectionTileLabel>Referred By</SectionTileLabel>
               <ReferralCodeContainer>
                  <Code>{customerReferral?.referredByCode}</Code>
               </ReferralCodeContainer>
            </>
         ) : (
            <ReferrerText
               color={visual.color}
               onPress={() => open('ReferralCode')}
            >
               Someone referred you?
            </ReferrerText>
         )}
      </Section>
   )
}

const PersonalDetails = () => {
   const { visual } = useAppContext()
   const { customer, customerDetails } = useCartContext()
   const { open } = useDrawerContext()

   return (
      <Section>
         <SectionHeader>
            <SectionHeading>Personal Details</SectionHeading>
            <TouchableOpacity
               onPress={() =>
                  open('DailyKeyBackup', { path: 'profile/create' })
               }
            >
               <Feather name="edit" color="#666" size={20} />
            </TouchableOpacity>
         </SectionHeader>
         <SectionBody>
            <SectionTile>
               <Feather name="phone" color={visual.color} size={16} />
               <SectionTileText>
                  {customerDetails?.phoneNumber || '-'}
               </SectionTileText>
            </SectionTile>
            <SectionTile>
               <Feather name="mail" color={visual.color} size={16} />
               <SectionTileText>
                  {customerDetails?.email || customer?.email || '-'}
               </SectionTileText>
            </SectionTile>
         </SectionBody>
      </Section>
   )
}

const Addresses = () => {
   const { visual } = useAppContext()
   const { customerDetails } = useCartContext()
   const { open } = useDrawerContext()

   return (
      <Section>
         <SectionHeader>
            <SectionHeading>
               Addresses ({customerDetails?.customerAddresses?.length || 0})
            </SectionHeading>
            <TouchableOpacity
               onPress={() =>
                  customerDetails?.customerAddresses?.length
                     ? open('EditAddress')
                     : open('DailyKeyBackup', { path: 'address/create' })
               }
            >
               <Feather name="edit" color="#666" size={20} />
            </TouchableOpacity>
         </SectionHeader>
         <SectionBody>
            {customerDetails?.defaultCustomerAddress ? (
               <>
                  <SectionTileLabel>Showing Default</SectionTileLabel>
                  <SectionTile>
                     <Feather name="home" color={visual.color} size={16} />
                     <SectionTileText
                        ellipsizeMode="tail"
                        numberOfLines={1}
                     >{`${customerDetails.defaultCustomerAddress.line1}, ${customerDetails.defaultCustomerAddress.city}, ${customerDetails.defaultCustomerAddress.city}, ${customerDetails.defaultCustomerAddress.state}, ${customerDetails.defaultCustomerAddress.country} - ${customerDetails.defaultCustomerAddress.zipcode}`}</SectionTileText>
                  </SectionTile>
               </>
            ) : (
               <ButtonTile
                  onPress={() =>
                     open('DailyKeyBackup', { path: 'address/create' })
                  }
               >
                  <ButtonTileText>Add an Address</ButtonTileText>
               </ButtonTile>
            )}
         </SectionBody>
      </Section>
   )
}

const Cards = () => {
   const { visual } = useAppContext()
   const { customerDetails } = useCartContext()
   const { open } = useDrawerContext()

   return (
      <Section>
         <SectionHeader>
            <SectionHeading>
               Cards ({customerDetails?.stripePaymentMethods?.length || 0})
            </SectionHeading>
            <TouchableOpacity
               onPress={() =>
                  customerDetails?.stripePaymentMethods?.length
                     ? open('SelectPaymentMethod')
                     : open('DailyKeyBackup', { path: 'card/create' })
               }
            >
               <Feather name="edit" color="#666" size={20} />
            </TouchableOpacity>
         </SectionHeader>
         <SectionBody>
            {customerDetails?.defaultStripePaymentMethod ? (
               <>
                  <SectionTileLabel>Showing Default</SectionTileLabel>
                  <SectionTile>
                     <Feather
                        name="credit-card"
                        color={visual.color}
                        size={16}
                     />
                     <SectionTileText
                        ellipsizeMode="tail"
                        numberOfLines={1}
                     >{`XXXX XXXX XXXX ${customerDetails?.defaultStripePaymentMethod?.last4}`}</SectionTileText>
                  </SectionTile>
               </>
            ) : (
               <ButtonTile
                  onPress={() =>
                     open('DailyKeyBackup', { path: 'card/create' })
                  }
               >
                  <ButtonTileText>Add a card</ButtonTileText>
               </ButtonTile>
            )}
         </SectionBody>
      </Section>
   )
}

const Container = styled.View`
   background: #e9ecee;
   flex: 1;
`

const Wrapper = styled.ScrollView`
   width: ${width > 768 ? '768px' : width};
   margin: ${width > 768 ? '10px auto' : '0px'};
   background: #fff;
   border-radius: 4px;
   flex: 1;
`

const Banner = styled.View`
   height: ${width > 768 ? '160px' : '120px'};
   background: ${props => props.color};
   border-radius: 4px;
   padding: 0.75rem;
   margin-bottom: 0.75rem;
   justify-content: flex-end;
`

const BannerHello = styled.Text`
   font-weight: bold;
   font-size: 1.2rem;
   color: #fff;
`

const BannerName = styled.Text`
   font-weight: bold;
   font-size: 1.6rem;
   color: #fff;
`

const Section = styled.View`
   border: 1px solid #efefef;
   padding: 1.25rem;
   margin: 0.75rem;
   margin-top: 0;
   border-radius: 4px;
`

const SectionHeader = styled.View`
   flex-direction: row;
   justify-content: space-between;
   align-items: center;
`

const SectionHeading = styled.Text`
   font-size: 0.9rem;
   color: #666;
   font-weight: bold;
   margin-bottom: 0.75rem;
`

const SectionBody = styled.View``

const SectionTile = styled.View`
   flex-direction: row;
   align-items: center;
   margin-bottom: 0.5rem;
`

const SectionTileLabel = styled.Text`
   text-transform: uppercase;
   font-size: 0.7rem;
   color: #666;
   margin-bottom: 0.25rem;
`

const SectionTileText = styled.Text`
   margin-left: 1rem;
`

const ButtonTile = styled.TouchableOpacity`
   padding: 0.75rem;
   text-align: center;
   shadow-opacity: 0.75;
   shadow-radius: 5px;
   shadow-color: #aaa;
   shadow-offset: 0px 0px;
   border-radius: 4px;
`

const ButtonTileText = styled.Text`
   font-color: #333;
`

const ReferralCodeContainer = styled.View`
   flex-direction: row;
   align-items: center;
   justify-content: space-between;
`

const Code = styled.Text``

const CopyBtn = styled.TouchableOpacity``

const ReferrerText = styled.Text`
   color: ${props => props.color};
`
