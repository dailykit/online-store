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
import { useMutation } from '@apollo/react-hooks'
import { UPDATE_CART } from '../../graphql'

const OrderSummary = ({ navigation, ...restProps }) => {
   const { cart } = useCartContext()
   const { open } = useDrawerContext()
   const { visual } = useAppContext()
   const { isAuthenticated } = useAuth()

   const [editing, setEditing] = React.useState(false)

   String.prototype.SRPType = function () {
      return this === 'readyToEat' ? 'Ready to Eat' : 'Meal Kit'
   }

   return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
         <Header title="Home" navigation={navigation} />
         {cart?.cartInfo?.products?.length ? (
            <>
               {width > 768 ? (
                  <GridLayout>
                     <Checkout cart={cart} navigation={navigation} />
                     <Cart cart={cart} />
                  </GridLayout>
               ) : (
                  <ScrollView>
                     <Cart cart={cart} />
                     <Checkout cart={cart} navigation={navigation} />
                  </ScrollView>
               )}
            </>
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

const Checkout = ({ cart, navigation }) => {
   const { open } = useDrawerContext()
   const { visual } = useAppContext()
   const { isAuthenticated } = useAuth()

   const [editing, setEditing] = React.useState(false)

   return (
      <StyledCheckout>
         {!isAuthenticated && (
            <CheckoutSection>
               <CheckoutSectionHeading>Account</CheckoutSectionHeading>
               <CheckoutSectionContent>
                  <CheckoutSectionText>
                     To place your order now, log in to your existing account or
                     sign up.
                  </CheckoutSectionText>
                  <CTAContainer>
                     <Button onPress={() => open('Login')}>
                        <ButtonText>LOGIN</ButtonText>
                     </Button>
                     <Button onPress={() => open('Register')}>
                        <ButtonText>SIGN UP</ButtonText>
                     </Button>
                  </CTAContainer>
               </CheckoutSectionContent>
            </CheckoutSection>
         )}
         <CheckoutSection>
            <CheckoutSectionHeading disabled={!isAuthenticated}>
               Fulfillment
            </CheckoutSectionHeading>
            {isAuthenticated && (
               <CheckoutSectionWrapper>
                  <CheckoutSectionContent style={{ flex: 1 }}>
                     {editing || !cart?.fulfillmentInfo ? (
                        <Fulfillment
                           navigation={navigation}
                           setEditing={setEditing}
                        />
                     ) : (
                        <SelectedFulfillment>
                           <SelectedFulfillmentType color={visual.color}>
                              {cart.fulfillmentInfo?.type.replace('_', ' ')}
                           </SelectedFulfillmentType>
                           <SelectedFulfillmentTime>
                              {moment
                                 .parseZone(cart?.fulfillmentInfo?.slot?.from)
                                 .format('MMMM Do YYYY, h:mm a')}
                           </SelectedFulfillmentTime>
                           {cart?.fulfillmentInfo?.type.includes(
                              'DELIVERY'
                           ) && (
                              <SelectedFulfillmentAddress>
                                 {`${cart.address.line1}, ${cart.address.line2}, ${cart.address.city}, ${cart.address.state}, ${cart.address.country}`}
                              </SelectedFulfillmentAddress>
                           )}
                        </SelectedFulfillment>
                     )}
                  </CheckoutSectionContent>
                  {!editing && (
                     <TouchableOpacity onPress={() => setEditing(true)}>
                        <Feather
                           name="edit"
                           size={width > 768 ? 24 : 16}
                           color="#93959F"
                        />
                     </TouchableOpacity>
                  )}
               </CheckoutSectionWrapper>
            )}
         </CheckoutSection>
         <CheckoutSection>
            <CheckoutSectionHeading
               disabled={!isAuthenticated || !cart?.fulfillmentInfo}
            >
               Payment
            </CheckoutSectionHeading>
            {isAuthenticated && cart?.fulfillmentInfo && (
               <CheckoutSectionContent>
                  <DefaultPaymentFloater navigation={navigation} />
                  <CTA
                     disabled={!cart.isValid.status}
                     color={visual.color}
                     onPress={() =>
                        cart.isValid.status &&
                        navigation.navigate('PaymentProcessing')
                     }
                  >
                     <CTAText>PAY ${cart.totalPrice}</CTAText>
                  </CTA>
                  {!cart.isValid.status && (
                     <Error>
                        <ErrorText>{cart.isValid.error}</ErrorText>
                     </Error>
                  )}
               </CheckoutSectionContent>
            )}
         </CheckoutSection>
      </StyledCheckout>
   )
}

const Cart = ({ cart }) => {
   const { visual } = useAppContext()

   const [updateCart] = useMutation(UPDATE_CART, {
      onCompleted: () => {
         console.log('Cart updated!')
      },
      onError: error => {
         console.log(error)
      },
   })

   const updateQuantity = (product, quantity) => {
      try {
         if (quantity) {
            let products = cart?.cartInfo?.products
            const index = products.findIndex(
               item => item.cartItemId === product.cartItemId
            )
            products[index].quantity = quantity
            products[index].totalPrice = products[index].unitPrice * quantity
            const total = products.reduce(
               (acc, cartItem) => acc + parseFloat(cartItem.totalPrice),
               0
            )
            const cartInfo = {
               products,
               total,
            }
            updateCart({
               variables: {
                  id: cart.id,
                  set: {
                     cartInfo: cartInfo,
                  },
               },
            })
         } else {
            removeFromCart(product)
         }
      } catch (e) {
         console.log(e)
      }
   }

   const removeFromCart = product => {
      let products = cart?.cartInfo?.products
      let total
      let newCartItems = products?.filter(
         item => item.cartItemId !== product.cartItemId
      )
      if (newCartItems.length) {
         total = newCartItems.reduce(
            (acc, cartItem) => acc + parseFloat(cartItem.totalPrice),
            0
         )
      } else {
         total = 0
      }
      const cartInfo = {
         products: newCartItems,
         total,
      }
      updateCart({
         variables: {
            id: cart.id,
            set: {
               cartInfo: cartInfo,
            },
         },
      })
   }

   return (
      <StyledCart>
         <CartHeader>
            <CartHeaderTextLeft>Total Items</CartHeaderTextLeft>
            <CartHeaderTextRight>
               {cart.cartInfo.products.length}
            </CartHeaderTextRight>
         </CartHeader>
         <CartItems>
            {cart.cartInfo.products.map(product => (
               <CartItem>
                  <CartItemLeft>
                     <CartItemImage source={{ uri: product.image }} />
                     <CartItemInfo>
                        <CartItemName>{product.name}</CartItemName>
                        {product.type === 'comboProduct' &&
                           product.components.map(component => (
                              <CartItemLabel>
                                 {`${component.comboProductComponentLabel}: ${component.name}`}
                              </CartItemLabel>
                           ))}
                        {product.type === 'simpleRecipeProduct' && (
                           <CartItemLabel>
                              {`${product.option.type.SRPType()}`}
                           </CartItemLabel>
                        )}
                     </CartItemInfo>
                  </CartItemLeft>
                  <CartItemRight>
                     <CartItemQuantity>
                        <CartItemQuantityButton
                           onPress={() =>
                              updateQuantity(product, product.quantity - 1)
                           }
                        >
                           <Feather
                              name="minus"
                              size={16}
                              color={visual.color}
                           />
                        </CartItemQuantityButton>
                        <CartItemQuantityValue>
                           {product.quantity}
                        </CartItemQuantityValue>
                        <CartItemQuantityButton
                           onPress={() =>
                              updateQuantity(product, product.quantity + 1)
                           }
                        >
                           <Feather
                              name="plus"
                              size={16}
                              color={visual.color}
                           />
                        </CartItemQuantityButton>
                     </CartItemQuantity>
                     <CartItemPrice>$ {product.totalPrice}</CartItemPrice>
                  </CartItemRight>
               </CartItem>
            ))}
         </CartItems>
         <CartBilling>
            <CartBillingHeading>Bill Details</CartBillingHeading>
            <CartBillingDetail>
               <CartBillingDetailText>Item Total</CartBillingDetailText>
               <CartBillingDetailText>$ {cart.itemTotal}</CartBillingDetailText>
            </CartBillingDetail>
            <CartBillingDetail>
               <CartBillingDetailText>Delivery Fee</CartBillingDetailText>
               <CartBillingDetailText>
                  $ {cart.deliveryPrice}
               </CartBillingDetailText>
            </CartBillingDetail>
            <Divider margin="8px" />
            <CartBillingDetail>
               <CartBillingDetailText>Taxes and Charges</CartBillingDetailText>
               <CartBillingDetailText>$ {cart.tax}</CartBillingDetailText>
            </CartBillingDetail>
         </CartBilling>
         <Divider color="#282c3f" height="2px" />
         <CartFooter>
            <CartFooterText>TO PAY</CartFooterText>
            <CartFooterText>$ {cart.totalPrice}</CartFooterText>
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

const StyledCheckout = styled.View`
   margin-right: ${width > 768 ? '32px' : '0px'};
`

const CheckoutSection = styled.View`
   position: relative;
   margin-left: ${width > 768 ? '25px' : '0px'};
   background: #fff;
   margin-bottom: ${width > 768 ? '20px' : '8px'};
   padding: ${width > 768 ? '35px 40px 39px' : '10px'};
   border-radius: 4px;
`

const CheckoutSectionHeading = styled.Text`
   font-size: ${width > 768 ? '32px' : '18px'};
   font-weight: 600;
   color: ${props => (props.disabled ? '#93959f' : '#282C3F')};
`

const CheckoutSectionWrapper = styled.View`
   flex-direction: row;
   align-items: center;
   justify-content: space-between;
   width: 100%;
`

const CheckoutSectionContent = styled.View`
   padding: ${width > 768 ? '16px 0px' : '8px 0px'};
`

const CheckoutSectionText = styled.Text`
   color: #7e808c;
   font-weight: 400;
   font-size: 16px;
   line-height: ${width > 768 ? '1.12' : 'inherit'};
   margin-bottom: ${width > 768 ? '32px' : '16px'};
`

const CTAContainer = styled.View`
   flex-direction: row;
`

const Button = styled.TouchableOpacity`
   border: 1px solid ${props => props.color || '#60b246'};
   margin-right: ${width > 768 ? '20px' : '16px'};
   padding: ${width > 768 ? '9px 35px' : '9px'};
`

const ButtonText = styled.Text`
   color: ${props => props.color || '#60b246'};
   font-weight: 500;
`

const SelectedFulfillment = styled.View``

const SelectedFulfillmentType = styled.Text`
   margin-bottom: ${width > 768 ? '16px' : '12px'};
   font-size: ${width > 768 ? '17px' : '14px'};
   font-weight: 500;
   color: ${props => props.color || '#7e808c'};
   line-height: 1.18;
   text-transform: capitalize;
`

const SelectedFulfillmentTime = styled.Text`
   font-size: ${width > 768 ? '17px' : '14px'};
   font-weight: ${width > 768 ? '500' : 'normal'};
`

const SelectedFulfillmentAddress = styled.Text`
   color: #7e808c;
   font-weight: 400;
   font-size: 16px;
`

const CTA = styled.TouchableOpacity`
   background-color: ${props => props.color || '#60B246'};
   height: ${width > 768 ? '50px' : '30px'};
   align-items: center;
   justify-content: center;
   margin: ${width > 768 ? '16px 0' : '12px 0'};
   opacity: ${props => (props.disabled ? 0.6 : 1)};
`

const CTAText = styled.Text`
   line-height: ${width > 768 ? '50px' : '30px'};
   font-size: 15px;
   color: #fff;
   font-weight: 500;
`

const Error = styled.View`
   background-color: #ff5a52;
   padding: 10px;
`

const ErrorText = styled.Text`
   color: #fff;
`

const StyledCart = styled.View`
   border-radius: 4px;
   overflow: hidden;
`

const CartHeader = styled.View`
   background: #fff;
   padding: ${width > 768 ? '10px 30px' : '10px'};
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
   height: ${width > 768 ? '320px' : 'auto'};
   background: #fff;
   overflow-y: ${width > 768 ? 'auto' : 'visible'};
`

const CartItem = styled.View`
   padding: ${width > 768 ? '10px 30px' : '10px'};
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
   max-width: ${width > 768 ? '150px' : '100px'};
`

const CartItemName = styled.Text`
   font-size: 14px;
   font-weight: 400;
`

const CartItemLabel = styled.Text`
   color: #9c9ea7;
`

const CartItemQuantity = styled.View`
   border: 1px solid #ccc;
   flex-direction: row;
   align-items: center;
   margin-right: 16px;
`

const CartItemQuantityButton = styled.TouchableOpacity`
   padding: 3px;
`

const CartItemQuantityValue = styled.Text`
   padding: 3px;
   font-weight: 500;
   color: #93808c;
`

const CartItemPrice = styled.Text`
   font-size: 13px;
   color: #535665;
   min-width: 50px;
   text-align: right;
`

const CartBilling = styled.View`
   padding: ${width > 768 ? '10px 30px' : '10px'};
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
   padding: ${width > 768 ? '0px 30px' : '0px 10px'};
   height: 40px;
   align-items: center;
   justify-content: space-between;
   background: #fff;
`

const CartFooterText = styled.Text`
   font-weight: 600;
   color: #282c3f;
`
