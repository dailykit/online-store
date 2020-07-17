import { Ionicons, Feather } from '@expo/vector-icons'
import React, { lazy } from 'react'
import moment from 'moment'
import {
   SafeAreaView,
   ScrollView,
   Text,
   TouchableOpacity,
   View,
} from 'react-native'
import BillingDetails from '../../components/BillingDetails'
import { CartSummary } from '../../components/Cart'
import { DefaultPaymentFloater } from '../../components/DefaultFloater'

const Summary = lazy(() => import('../../components/Summary'))
import { useCartContext } from '../../context/cart'
import { height, width } from '../../utils/Scalaing'
import { styles } from './styles'
import Header from '../../components/Header'
import { useDrawerContext } from '../../context/drawer'
import { useAppContext } from '../../context/app'
import Fulfillment from '../../components/Fulfillment'
import { useAuth } from '../../context/auth'
import styled from 'styled-components/native'

const OrderSummary = ({ navigation, ...restProps }) => {
   const { cart } = useCartContext()
   const { open } = useDrawerContext()
   const { visual } = useAppContext()
   const { isAuthenticated } = useAuth()

   const [editing, setEditing] = React.useState(false)

   let cartItems = cart?.cartInfo?.products
   return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
         <Header title="Home" navigation={navigation} />
         {!cartItems?.length ? (
            <GridLayout>
               <Checkout>
                  <CheckoutSection>
                     <CheckoutSectionHeading>Account</CheckoutSectionHeading>
                     <CheckoutSectionContent>
                        <CheckoutSectionText>
                           To place your order now, log in to your existing
                           account or sign up.
                        </CheckoutSectionText>
                     </CheckoutSectionContent>
                  </CheckoutSection>
                  <CheckoutSection>
                     <CheckoutSectionHeading disabled>
                        Fulfillment
                     </CheckoutSectionHeading>
                  </CheckoutSection>
                  <CheckoutSection>
                     <CheckoutSectionHeading disabled>
                        Payment
                     </CheckoutSectionHeading>
                  </CheckoutSection>
               </Checkout>
               <Cart />
            </GridLayout>
         ) : (
            <View
               style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                  padding: 20,
               }}
            >
               <Text
                  style={{
                     marginBottom: 10,
                     fontWeight: 'bold',
                     fontSize: width > 768 ? 24 : 16,
                     color: '#666',
                     textAlign: 'center',
                  }}
               >
                  Awww... This feels so light. Oh wait! It's empty.
               </Text>
               <Feather name="shopping-cart" size={64} color={visual.color} />
               <TouchableOpacity
                  style={{
                     backgroundColor: visual.color,
                     padding: 10,
                     borderRadius: 2,
                     marginTop: 30,
                  }}
                  onPress={() => navigation.navigate('Home')}
               >
                  <Text style={{ color: '#fff', fontSize: '1.1rem' }}>
                     Browse Products
                  </Text>
               </TouchableOpacity>
            </View>
         )}
      </SafeAreaView>
   )
}

export default OrderSummary

const Cart = () => {
   return (
      <StyledCart>
         <CartHeader>
            <CartHeaderTextLeft>Total Items</CartHeaderTextLeft>
            <CartHeaderTextRight>2</CartHeaderTextRight>
         </CartHeader>
         <CartItems>
            <CartItem>
               <CartItemLeft>
                  <CartItemImage
                     source={{ uri: 'https://via.placeholder.com/50' }}
                  />
                  <CartItemInfo>
                     <CartItemName>Corona Beer</CartItemName>
                     <CartItemLabel>1 bottle - 300ml</CartItemLabel>
                  </CartItemInfo>
               </CartItemLeft>
               <CartItemRight>
                  <CartItemQuantity></CartItemQuantity>
                  <CartItemPrice>$ 1.99</CartItemPrice>
               </CartItemRight>
            </CartItem>
            <CartItem>
               <CartItemLeft>
                  <CartItemImage
                     source={{ uri: 'https://via.placeholder.com/50' }}
                  />
                  <CartItemInfo>
                     <CartItemName>Chicken Biryani</CartItemName>
                  </CartItemInfo>
               </CartItemLeft>
               <CartItemRight>
                  <CartItemQuantity></CartItemQuantity>
                  <CartItemPrice>$ 5</CartItemPrice>
               </CartItemRight>
            </CartItem>
            <CartItem>
               <CartItemLeft>
                  <CartItemImage
                     source={{ uri: 'https://via.placeholder.com/50' }}
                  />
                  <CartItemInfo>
                     <CartItemName>Veg Biryani</CartItemName>
                  </CartItemInfo>
               </CartItemLeft>
               <CartItemRight>
                  <CartItemQuantity></CartItemQuantity>
                  <CartItemPrice>$ 2</CartItemPrice>
               </CartItemRight>
            </CartItem>
         </CartItems>
         <CartBilling>
            <CartBillingHeading>Bill Details</CartBillingHeading>
            <CartBillingDetail>
               <CartBillingDetailText>Item Total</CartBillingDetailText>
               <CartBillingDetailText>$ 9.99</CartBillingDetailText>
            </CartBillingDetail>
            <CartBillingDetail>
               <CartBillingDetailText>Delivery Fee</CartBillingDetailText>
               <CartBillingDetailText>$ 1</CartBillingDetailText>
            </CartBillingDetail>
            <Divider margin="8px" />
            <CartBillingDetail>
               <CartBillingDetailText>Taxes and Charges</CartBillingDetailText>
               <CartBillingDetailText>$ 1.09</CartBillingDetailText>
            </CartBillingDetail>
         </CartBilling>
         <Divider color="#282c3f" height="2px" />
         <CartFooter>
            <CartFooterText>TO PAY</CartFooterText>
            <CartFooterText>$15.99</CartFooterText>
         </CartFooter>
      </StyledCart>
   )
}

const GridLayout = styled.View`
   padding: 2rem;
   display: grid;
   background: #e9ecee;
   grid-template-columns: 1fr 400px;
   height: calc(100% - 66px);
`

const Checkout = styled.View`
   margin-right: 32px;
`

const CheckoutSection = styled.View`
   position: relative;
   margin-left: 25px;
   background: #fff;
   margin-bottom: 20px;
   padding: 35px 40px 39px;
   border-radius: 4px;
`

const CheckoutSectionHeading = styled.Text`
   font-size: 32px;
   font-weight: 600;
   color: ${props => (props.disabled ? '#93959f' : '#282C3F')};
`

const CheckoutSectionContent = styled.View`
   padding: 16px 0px;
`

const CheckoutSectionText = styled.Text`
   color: #7e808c;
   font-weight: 400;
   font-size: 16px;
   line-height: 1.12;
`

const StyledCart = styled.View`
   border-radius: 4px;
   overflow: hidden;
`

const CartHeader = styled.View`
   background: #fff;
   padding: 10px 30px;
   display: flex;
   flex-direction: row;
   align-items: center;
   justify-content: space-between;
   shadow-opacity: 0.75;
   shadow-radius: 5px;
   shadow-color: #ccc;
   shadow-offset: 5px 0px;
`
const CartHeaderTextLeft = styled.Text`
   font-weight: bold;
   color: #93808c;
`

const CartHeaderTextRight = styled.Text`
   font-weight: bold;
   color: #282c3f;
`

const CartItems = styled.View`
   max-height: 300px;
   overflow-y: scroll;
   background: #fff;
`

const CartItem = styled.View`
   padding: 10px 30px;
   flex-direction: row;
   align-items: center;
   justify-content: space-between;
`

const CartItemLeft = styled.View`
   flex-direction: row;
   align-items: center;
`

const CartItemRight = styled.View`
   flex-direction: row;
   align-items: center;
`

const CartItemImage = styled.Image`
   width: 50px;
   height: 50px;
   object-fit: cover;
`

const CartItemInfo = styled.View`
   margin-left: 10px;
   margin-right: 5px;
`

const CartItemName = styled.Text`
   font-size: 14px;
   font-weight: 400;
`

const CartItemLabel = styled.Text`
   color: #9c9ea7;
`

const CartItemQuantity = styled.View``

const CartItemPrice = styled.Text`
   font-size: 13px;
   color: #535665;
`

const CartBilling = styled.View`
   padding: 10px 30px;
   background: #fff;
`

const CartBillingHeading = styled.Text`
   font-weight: 500;
   font-size: 13px;
   margin-bottom: 10px;
   color: #282c3f;
`

const CartBillingDetail = styled.View`
   flex-direction: row;
   justify-content: space-between;
   align-items: center;
   margin-bottom: 8px;
`

const CartBillingDetailText = styled.Text`
   font-size: 13px;
   color: #686b78;
`

const Divider = styled.View`
   background-color: ${props => props.color || '#e9e9eb'};
   height: ${props => props.height || '1px'};
   margin-bottom: ${props => props.margin || '0px'};
`

const CartFooter = styled.View`
   flex-direction: row;
   padding: 0px 30px;
   height: 40px;
   align-items: center;
   justify-content: space-between;
   background: #fff;
`

const CartFooterText = styled.Text`
   font-weight: 600;
   color: #282c3f;
`
