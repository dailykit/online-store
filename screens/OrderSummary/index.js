import { Ionicons, Feather } from '@expo/vector-icons'
import React, { lazy } from 'react'
import moment from 'moment'
import {
   SafeAreaView,
   ScrollView,
   Text,
   TouchableOpacity,
   View,
   AsyncStorage,
} from 'react-native'
import { DefaultPaymentFloater } from '../../components/DefaultFloater'

const Summary = lazy(() => import('../../components/Summary'))
import { useCartContext } from '../../context/cart'
import { height, width } from '../../utils/Scalaing'
import Header from '../../components/Header'
import { useDrawerContext } from '../../context/drawer'
import { useAppContext } from '../../context/app'
import Fulfillment from '../../components/Fulfillment'
import { useAuth } from '../../context/auth'
import styled from 'styled-components/native'
import { useMutation } from '@apollo/react-hooks'
import { UPDATE_CART } from '../../graphql'
import AppSkeleton from '../../components/skeletons/app'
import DrawerLayout from '../../components/DrawerLayout'
import { Accordion } from 'native-base'
import { useStoreToast } from '../../utils'

const OrderSummary = ({ navigation, ...restProps }) => {
   const { cart } = useCartContext()
   const { open } = useDrawerContext()
   const { visual, masterLoading } = useAppContext()
   const { isAuthenticated } = useAuth()

   const [editing, setEditing] = React.useState(false)

   String.prototype.SRPType = function () {
      return this === 'readyToEat' ? 'Ready to Eat' : 'Meal Kit'
   }

   if (masterLoading) {
      return <AppSkeleton />
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
         <CheckoutSection>
            <CheckoutSectionHeading>Account</CheckoutSectionHeading>
            <CheckoutSectionContent>
               {!isAuthenticated ? (
                  <>
                     <CheckoutSectionText>
                        To place your order now, log in to your existing account
                        or sign up.
                     </CheckoutSectionText>
                     <CTAContainer>
                        <Button
                           color={visual.color}
                           onPress={() => open('Login')}
                        >
                           <ButtonText color={visual.color}>LOGIN</ButtonText>
                        </Button>
                        <Button
                           color={visual.color}
                           onPress={() => open('Register')}
                        >
                           <ButtonText color={visual.color}>SIGN UP</ButtonText>
                        </Button>
                     </CTAContainer>
                  </>
               ) : (
                  <>
                     {cart.customerInfo?.customerFirstName ? (
                        <CustomerDetails>
                           <View>
                              <CustomerName>{`${
                                 cart.customerInfo?.customerFirstName || ''
                              } ${
                                 cart.customerInfo?.customerLastName || ''
                              }`}</CustomerName>
                              <CustomerPhone>{`Phone: ${
                                 cart.customerInfo?.customerPhone || '-'
                              }`}</CustomerPhone>
                              <CustomerEmail>{`Email: ${
                                 cart.customerInfo?.customerEmail || '-'
                              }`}</CustomerEmail>
                           </View>
                           <TouchableOpacity
                              onPress={() =>
                                 open('AddDetails', { path: 'profile/create' })
                              }
                           >
                              <Feather
                                 name="edit"
                                 size={width > 768 ? 24 : 16}
                                 color="#93959F"
                              />
                           </TouchableOpacity>
                        </CustomerDetails>
                     ) : (
                        <BasicDetailsCTA
                           onPress={() =>
                              open('AddDetails', { path: 'profile/create' })
                           }
                        >
                           <BasicDetailsCTAText>
                              Add your Info
                           </BasicDetailsCTAText>
                        </BasicDetailsCTA>
                     )}
                  </>
               )}
            </CheckoutSectionContent>
         </CheckoutSection>
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
   const { setCart } = useCartContext()
   const { isAuthenticated } = useAuth()

   const { toastr } = useStoreToast()

   const [updateCart] = useMutation(UPDATE_CART, {
      onCompleted: data => {
         console.log('Cart updated!')
         if (!isAuthenticated) {
            setCart(data.updateCart.returning[0])
         }
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

   const removeFromCart = async product => {
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
      const { data } = await updateCart({
         variables: {
            id: cart.id,
            set: {
               cartInfo: cartInfo,
            },
         },
      })
      if (data) {
         toastr('success', 'Item removed!')
      }
   }

   return (
      <StyledCart>
         <CartHeader>
            <CartHeaderTextLeft>Total</CartHeaderTextLeft>
            <CartHeaderTextRight>
               {`${cart.cartInfo.products.length} Item${
                  cart.cartInfo.products.length > 1 ? 's' : ''
               }`}
            </CartHeaderTextRight>
         </CartHeader>
         <CartItems>
            {cart.cartInfo.products.map(product => (
               <CartItem>
                  <CartItemLeft>
                     <CartItemImage
                        source={{
                           uri:
                              product.image ||
                              'data:image/png;base64,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',
                        }}
                     />
                     <CartItemInfo>
                        <CartItemName numberOfLines={1} ellipsizeMode="tail">
                           {product.name}
                        </CartItemName>
                        {product.type === 'comboProduct' &&
                           product.components.map(component => (
                              <>
                                 <CartItemLabel
                                    ellipsizeMode="tail"
                                    numberOfLines={1}
                                 >
                                    {`${component.comboProductComponentLabel}: ${component.name}`}
                                 </CartItemLabel>
                                 {Boolean(component.modifiers?.length) && (
                                    <AccordianContainer>
                                       <Accordion
                                          dataArray={[
                                             {
                                                title: `Add-Ons (${component.modifiers.length})`,
                                                content: (
                                                   <>
                                                      {component.modifiers.map(
                                                         modifier => (
                                                            <StyledAccordianContentText
                                                               ellipsizeMode="tail"
                                                               numberOfLines={1}
                                                            >
                                                               {`${modifier.category} - ${modifier.name}`}
                                                            </StyledAccordianContentText>
                                                         )
                                                      )}
                                                   </>
                                                ),
                                             },
                                          ]}
                                          renderHeader={(item, expanded) => (
                                             <StyledAccordianHeader>
                                                <StyledAccordianHeaderText>
                                                   {item.title}
                                                </StyledAccordianHeaderText>
                                                <Feather
                                                   name={
                                                      expanded
                                                         ? 'chevron-up'
                                                         : 'chevron-down'
                                                   }
                                                   color="#666"
                                                   size={14}
                                                />
                                             </StyledAccordianHeader>
                                          )}
                                          renderContent={item => (
                                             <StyledAccordianContent>
                                                {item.content}
                                             </StyledAccordianContent>
                                          )}
                                       />
                                    </AccordianContainer>
                                 )}
                              </>
                           ))}
                        {product.type === 'simpleRecipeProduct' && (
                           <CartItemLabel
                              ellipsizeMode="tail"
                              numberOfLines={1}
                           >
                              {`${product.option.type.SRPType()} x${
                                 product.option.serving
                              }`}
                           </CartItemLabel>
                        )}
                        {product.type === 'inventoryProduct' && (
                           <CartItemLabel
                              ellipsizeMode="tail"
                              numberOfLines={1}
                           >
                              {`${product.option.label}`}
                           </CartItemLabel>
                        )}
                        {Boolean(product.modifiers?.length) && (
                           <AccordianContainer>
                              <Accordion
                                 dataArray={[
                                    {
                                       title: `Add-Ons (${product.modifiers.length})`,
                                       content: (
                                          <>
                                             {product.modifiers.map(
                                                modifier => (
                                                   <StyledAccordianContentText
                                                      ellipsizeMode="tail"
                                                      numberOfLines={1}
                                                   >
                                                      {`${modifier.category} - ${modifier.name}`}
                                                   </StyledAccordianContentText>
                                                )
                                             )}
                                          </>
                                       ),
                                    },
                                 ]}
                                 renderHeader={(item, expanded) => (
                                    <StyledAccordianHeader>
                                       <StyledAccordianHeaderText>
                                          {item.title}
                                       </StyledAccordianHeaderText>
                                       <Feather
                                          name={
                                             expanded
                                                ? 'chevron-up'
                                                : 'chevron-down'
                                          }
                                          color="#666"
                                          size={14}
                                       />
                                    </StyledAccordianHeader>
                                 )}
                                 renderContent={item => (
                                    <StyledAccordianContent>
                                       {item.content}
                                    </StyledAccordianContent>
                                 )}
                              />
                           </AccordianContainer>
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
                     <CartItemPriceContainer>
                        {Boolean(product.discount) && (
                           <CartItemDiscount>
                              ${' '}
                              {(
                                 product.discount * product.quantity +
                                 product.totalPrice
                              ).toFixed(2)}
                           </CartItemDiscount>
                        )}
                        <CartItemPrice>
                           $ {product.totalPrice.toFixed(2)}
                        </CartItemPrice>
                     </CartItemPriceContainer>
                  </CartItemRight>
               </CartItem>
            ))}
         </CartItems>
         <CartBilling>
            <CartBillingHeading>Bill Details</CartBillingHeading>
            <CartBillingDetail>
               <CartBillingDetailText>Item Total</CartBillingDetailText>
               <CartBillingDetailText>
                  $ {cart.itemTotal.toFixed(2)}
               </CartBillingDetailText>
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
            <CartDiscountText>YOU SAVED</CartDiscountText>
            <CartDiscountText>
               ${' '}
               {cart.cartInfo.products
                  .reduce((acc, item) => acc + item.discount, 0)
                  .toFixed(2)}
            </CartDiscountText>
         </CartFooter>
         <CartFooter>
            <CartFooterText>TO PAY</CartFooterText>
            <CartFooterText>$ {cart.totalPrice.toFixed(2)}</CartFooterText>
         </CartFooter>
      </StyledCart>
   )
}

const GridLayout = styled.View`
   padding: 2rem;
   display: grid;
   background: #e9ecee;
   grid-template-columns: 1fr 400px;
   height: calc(100vh - 66px);
   overflow-y: auto;
`

const StyledCheckout = styled.View`
   margin-right: ${width > 768 ? '32px' : '0px'};
`

const CheckoutSection = styled.View`
   position: relative;
   margin-left: ${width > 768 ? '16px' : '0px'};
   background: #fff;
   margin-bottom: ${width > 768 ? '20px' : '8px'};
   padding: ${width > 768 ? '16px 28px' : '10px'};
   border-radius: 4px;
`

const CheckoutSectionHeading = styled.Text`
   font-size: ${width > 768 ? '28px' : '18px'};
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

const BasicDetailsCTA = styled.TouchableOpacity`
   width: 100%:
   background-color: #fff;
   align-items: center;
   justify-content: center;
   shadow-opacity: 0.75;
   shadow-radius: 5px;
   shadow-color: #ccc;
   shadow-offset: 1px 1px;
   border-radius: 2px;
`

const BasicDetailsCTAText = styled.Text`
   color: #666;
   margin: 12px auto;
`

const CustomerDetails = styled.View`
   flex-direction: row;
   align-items: center;
   justify-content: space-between;
`

const CustomerName = styled.Text`
   font-size: ${width > 768 ? '20px' : '16px'};
   font-weight: 500;
   margin-bottom: 8px;
`

const CustomerPhone = styled.Text`
   color: #93808c;
   font-weight: 500;
`

const CustomerEmail = styled.Text`
   color: #93808c;
`

const SelectedFulfillment = styled.View`
   margin-top: 8px;
`

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
   height: 50px;
   align-items: center;
   justify-content: center;
   margin: ${width > 768 ? '16px 0' : '12px 0'};
   opacity: ${props => (props.disabled ? 0.6 : 1)};
`

const CTAText = styled.Text`
   line-height: 50px;
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
   width: ${width > 768 ? '120px' : '100px'};
`

const CartItemName = styled.Text`
   font-size: 14px;
   font-weight: 400;
`

const CartItemLabel = styled.Text`
   color: #9c9ea7;
`

const AccordianContainer = styled.View`
   margin-top: 4px;
`

const StyledAccordianHeader = styled.View`
   flex-direction: row;
   align-items: center;
   justify-content: space-between;
   padding: 4px;
`

const StyledAccordianHeaderText = styled.Text`
   font-size: 12px;
   color: #666;
`

const StyledAccordianContent = styled.View`
   padding: 4px;
`

const StyledAccordianContentText = styled.Text`
   font-size: 12px;
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

const CartItemPriceContainer = styled.View`
   min-width: 50px;
   text-align: right;
`

const CartItemDiscount = styled.Text`
   text-decoration: line-through;
   font-size: 13px;
   color: #535665;
`

const CartItemPrice = styled.Text`
   font-size: 13px;
   color: #535665;
`

const CartBilling = styled.View`
   padding: ${width > 768 ? '10px 30px' : '10px'};
   background: #fff;
   shadow-opacity: 0.75;
   shadow-radius: 5px;
   shadow-color: #ccc;
   shadow-offset: -5px 0px;
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

const CartDiscountText = styled(CartFooterText)`
   color: #60b246;
`
