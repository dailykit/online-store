import { useMutation } from '@apollo/react-hooks'
import { Feather } from '@expo/vector-icons'
import moment from 'moment'
import { Accordion } from 'native-base'
import React from 'react'
import {
   AsyncStorage,
   SafeAreaView,
   ScrollView,
   Text,
   TouchableOpacity,
   View,
} from 'react-native'
import styled, { css } from 'styled-components/native'
import defaultProductImage from '../../assets/imgs/default-product-image.png'
import { DefaultPaymentFloater } from '../../components/DefaultFloater'
import Fulfillment from '../../components/Fulfillment'
import Header from '../../components/Header'
import AppSkeleton from '../../components/skeletons/app'
import { useAppContext } from '../../context/app'
import { useAuth } from '../../context/auth'
import { useCartContext } from '../../context/cart'
import { useDrawerContext } from '../../context/drawer'
import { DELETE_CARTS, UPDATE_CART } from '../../graphql'
import { imageUrl, useStoreToast } from '../../utils'
import { width } from '../../utils/Scaling'
import Coupon from './components/Coupon'
import Tip from './components/Tip'
import Footer from '../../components/Footer'
import PayWithLoyaltyPoints from './components/PayWithLoyaltyPoints'
import PayWithWallet from './components/PayWithWallet'
import {
   HASURA_GRAPHQL_ADMIN_SECRET,
   HASURA_URL,
   CURRENCY,
} from 'react-native-dotenv'
import CartSkeleton from '../../components/skeletons/cart'
import { isKeycloakSupported } from '../../utils'
import { useScript } from '../../utils/useScript'

const OrderSummary = ({ navigation, ...restProps }) => {
   const [razorpayLoaded, razorpayError] = useScript(
      `https://checkout.razorpay.com/v1/checkout.js`
   )
   const [paymentJsLoaded, paymentJsError] = useScript(
      `https://s3.us-east-2.amazonaws.com/dailykit.org/payments.js`
   )

   const { isAuthenticated } = useAuth()
   const { cart } = useCartContext()
   const {
      visual,
      brand,
      masterLoading,
      paymentPartnerShipIds,
   } = useAppContext()

   String.prototype.SRPType = function () {
      return this === 'readyToEat' ? 'Ready to Eat' : 'Meal Kit'
   }

   React.useEffect(() => {
      ;(async () => {
         if (
            cart &&
            paymentPartnerShipIds?.length &&
            isAuthenticated &&
            razorpayLoaded &&
            paymentJsLoaded
         ) {
            await window.payments.provider({
               cart,
               currency: CURRENCY,
               partnershipIds: paymentPartnerShipIds,
               admin_secret: HASURA_GRAPHQL_ADMIN_SECRET,
               datahub_url: HASURA_URL,
            })
         }
      })()
   }, [
      cart,
      paymentPartnerShipIds,
      isAuthenticated,
      paymentJsLoaded,
      razorpayLoaded,
   ])

   React.useEffect(() => {
      if (isAuthenticated && razorpayLoaded && paymentJsLoaded) {
         const brandObject = {
            name: brand.name,
            logo: brand.logo,
            color: visual.color,
            description: '',
         }
         window.payments.checkout({
            cart: { ...cart, brand: brandObject },
            datahub_url: HASURA_URL,
            admin_secret: HASURA_GRAPHQL_ADMIN_SECRET,
            currency: CURRENCY,
         })
      }
   }, [cart, isAuthenticated, brand, paymentJsLoaded, razorpayLoaded])

   console.log('Cart:', cart)

   if (masterLoading || !razorpayLoaded || !paymentJsLoaded) {
      return <AppSkeleton />
   }

   return (
      <ScrollView style={{ flex: 1, backgroundColor: '#fff' }}>
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
                  minHeight: '100vh',
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
         <Footer />
      </ScrollView>
   )
}

export default OrderSummary

const Checkout = ({ cart, navigation }) => {
   const { open } = useDrawerContext()
   const { visual } = useAppContext()
   const { isAuthenticated } = useAuth()

   const [editing, setEditing] = React.useState(false)

   React.useEffect(() => {
      if (!cart.fulfillmentInfo) {
         setEditing(true)
      }
   }, [cart.fulfillmentInfo])

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
                           onPress={() =>
                              isKeycloakSupported()
                                 ? open('Login')
                                 : open('LoginSelf')
                           }
                        >
                           <ButtonText color={visual.color}>LOGIN</ButtonText>
                        </Button>
                        <Button
                           color={visual.color}
                           onPress={() =>
                              isKeycloakSupported()
                                 ? open('Register')
                                 : open('RegisterSelf')
                           }
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
                                 open('DailyKeyBackup', {
                                    path: 'profile/create',
                                 })
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
                              open('DailyKeyBackup', { path: 'profile/create' })
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
                     {editing ? (
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
                              <>
                                 {Boolean(cart.address) ? (
                                    <>
                                       {Boolean(cart?.address?.label) && (
                                          <SelectedFulfillmentAddress label>
                                             {cart?.address?.label}
                                          </SelectedFulfillmentAddress>
                                       )}
                                       <SelectedFulfillmentAddress>
                                          {`${cart?.address?.line1}, ${cart?.address?.line2}, ${cart?.address?.city}, ${cart?.address?.state}, ${cart?.address?.country}`}
                                       </SelectedFulfillmentAddress>
                                       {Boolean(cart?.address?.notes) && (
                                          <SelectedFulfillmentAddress notes>
                                             {cart?.address?.notes}
                                          </SelectedFulfillmentAddress>
                                       )}
                                    </>
                                 ) : (
                                    <HelpText>
                                       We could not resolve your address. Please
                                       select your address again!
                                    </HelpText>
                                 )}
                              </>
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
                  {CURRENCY === 'INR' ? (
                     <GenericPayment nativeID="payment" />
                  ) : (
                     <>
                        <DefaultPaymentFloater navigation={navigation} />
                        <CTA
                           disabled={!cart.isValid.status}
                           color={visual.color}
                           onPress={() =>
                              cart.isValid.status &&
                              open('Payment', { navigation })
                           }
                        >
                           <CTAText>
                              {cart.totalPrice
                                 ? `PAY ${new Intl.NumberFormat('en-US', {
                                      style: 'currency',
                                      currency: CURRENCY,
                                   }).format(cart.totalPrice)}`
                                 : 'PLACE ORDER'}
                           </CTAText>
                        </CTA>
                     </>
                  )}
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
   const { visual, rewardsSettings } = useAppContext()
   const { setCart } = useCartContext()
   const { isAuthenticated } = useAuth()

   const { toastr } = useStoreToast()

   const [deleteCarts] = useMutation(DELETE_CARTS, {
      onCompleted: data => {
         console.log('Carts deleted: ', data.deleteCarts.returning)
         if (data.deleteCarts.returning.length) {
            AsyncStorage.removeItem('PENDING_CART_ID')
            setCart(undefined)
         }
      },
      onError: error => {
         console.log('Deleteing carts error: ', error)
      },
   })

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
            products[index].discount = parseFloat(
               (
                  (products[index].discount / products[index].quantity) *
                  quantity
               ).toFixed(2)
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
      // Check if cart empty
      if (cartInfo.products.length) {
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
      } else {
         const { data } = await deleteCarts({
            variables: {
               ids: [cart.id],
            },
         })
         if (data) {
            toastr('success', 'Item removed!')
         }
      }
   }

   return (
      <StyledCart>
         <CartHeader>
            <CartHeaderTextLeft>Total</CartHeaderTextLeft>
            <CartHeaderRight>
               <CartClearBtn
                  onPress={() =>
                     deleteCarts({
                        variables: {
                           ids: [cart.id],
                        },
                     })
                  }
               >
                  <Feather name="trash-2" size={16} color="#FF5A52" />
               </CartClearBtn>
               <CartHeaderTextRight>
                  {`${cart.cartInfo.products.length} Item${
                     cart.cartInfo.products.length > 1 ? 's' : ''
                  }`}
               </CartHeaderTextRight>
            </CartHeaderRight>
         </CartHeader>
         <CartItems>
            {cart.cartInfo.products.map(product => (
               <CartItem>
                  <CartItemImage
                     source={{
                        uri: imageUrl(product.image, 60) || defaultProductImage,
                     }}
                  />
                  <CartItemInfo>
                     <CartItemName numberOfLines={2} ellipsizeMode="tail">
                        {product.name}
                     </CartItemName>
                     {product.type === 'comboProduct' &&
                        product.components.map(component => (
                           <>
                              <CartItemLabel
                                 ellipsizeMode="tail"
                                 numberOfLines={2}
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
                        <CartItemLabel ellipsizeMode="tail" numberOfLines={2}>
                           {`${product.option.type?.SRPType()} | ${
                              product.option.label || product.option.serving
                           }`}
                        </CartItemLabel>
                     )}
                     {product.type === 'inventoryProduct' && (
                        <CartItemLabel ellipsizeMode="tail" numberOfLines={2}>
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
                                          {product.modifiers.map(modifier => (
                                             <StyledAccordianContentText
                                                ellipsizeMode="tail"
                                                numberOfLines={1}
                                             >
                                                {`${modifier.category} - ${modifier.name}`}
                                             </StyledAccordianContentText>
                                          ))}
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

                  <CartItemQuantity>
                     <CartItemQuantityButton
                        onPress={() =>
                           updateQuantity(product, product.quantity - 1)
                        }
                     >
                        <Feather name="minus" size={16} color={visual.color} />
                     </CartItemQuantityButton>
                     <CartItemQuantityValue>
                        {product.quantity}
                     </CartItemQuantityValue>
                     <CartItemQuantityButton
                        onPress={() =>
                           updateQuantity(product, product.quantity + 1)
                        }
                     >
                        <Feather name="plus" size={16} color={visual.color} />
                     </CartItemQuantityButton>
                  </CartItemQuantity>
                  <CartItemPriceContainer>
                     {Boolean(product.discount) && (
                        <CartItemDiscount>
                           {new Intl.NumberFormat('en-US', {
                              style: 'currency',
                              currency: CURRENCY,
                           }).format(
                              (product.discount + product.totalPrice).toFixed(2)
                           )}
                        </CartItemDiscount>
                     )}
                     <CartItemPrice>
                        {new Intl.NumberFormat('en-US', {
                           style: 'currency',
                           currency: CURRENCY,
                        }).format(product.totalPrice.toFixed(2))}
                     </CartItemPrice>
                  </CartItemPriceContainer>
               </CartItem>
            ))}
         </CartItems>
         <CartBilling>
            {Boolean(rewardsSettings.isCouponsAvailable) && (
               <>
                  {isAuthenticated ? (
                     <Coupon cart={cart} />
                  ) : (
                     <HelpText>
                        Discount coupons are only available when logged in!
                     </HelpText>
                  )}
               </>
            )}
            <CartBillingHeading>Bill Details</CartBillingHeading>
            <CartBillingDetail>
               <CartBillingDetailText>Item Total</CartBillingDetailText>
               <CartBillingDetailText>
                  {new Intl.NumberFormat('en-US', {
                     style: 'currency',
                     currency: CURRENCY,
                  }).format(cart.itemTotal.toFixed(2))}
               </CartBillingDetailText>
            </CartBillingDetail>
            <CartBillingDetail>
               <CartBillingDetailText>Delivery Fee</CartBillingDetailText>
               <CartBillingDetailText>
                  {new Intl.NumberFormat('en-US', {
                     style: 'currency',
                     currency: CURRENCY,
                  }).format(cart.deliveryPrice)}
               </CartBillingDetailText>
            </CartBillingDetail>
            {Boolean(cart.discount) && (
               <CartBillingDetail>
                  <CartBillingDetailText>Discount</CartBillingDetailText>
                  <CartBillingDetailText>
                     -{' '}
                     {new Intl.NumberFormat('en-US', {
                        style: 'currency',
                        currency: CURRENCY,
                     }).format(cart.discount)}
                  </CartBillingDetailText>
               </CartBillingDetail>
            )}
            <Divider margin="8px" />
            <CartBillingDetail>
               <CartBillingDetailText>Taxes and Charges</CartBillingDetailText>
               <CartBillingDetailText>
                  {new Intl.NumberFormat('en-US', {
                     style: 'currency',
                     currency: CURRENCY,
                  }).format(cart.tax)}
               </CartBillingDetailText>
            </CartBillingDetail>
            <Tip cart={cart} />
         </CartBilling>
         <Divider color="#282c3f" height="2px" />
         {Boolean(
            cart.cartInfo.products.reduce((acc, item) => acc + item.discount, 0)
         ) && (
            <CartFooter>
               <CartDiscountText>YOU SAVED</CartDiscountText>
               <CartDiscountText>
                  {new Intl.NumberFormat('en-US', {
                     style: 'currency',
                     currency: CURRENCY,
                  }).format(
                     (
                        cart.cartInfo.products.reduce(
                           (acc, item) => acc + item.discount,
                           0
                        ) + cart.discount
                     ).toFixed(2)
                  )}
               </CartDiscountText>
            </CartFooter>
         )}
         {Boolean(
            isAuthenticated && rewardsSettings.isLoyaltyPointsAvailable
         ) && (
            <FooterContentWrapper>
               <PayWithLoyaltyPoints />
            </FooterContentWrapper>
         )}
         {Boolean(isAuthenticated && rewardsSettings.isWalletAvailable) && (
            <FooterContentWrapper>
               <PayWithWallet />
            </FooterContentWrapper>
         )}
         <CartFooter>
            <CartFooterText>TO PAY</CartFooterText>
            <CartFooterText>
               {new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: CURRENCY,
               }).format(cart.totalPrice.toFixed(2))}
            </CartFooterText>
         </CartFooter>
      </StyledCart>
   )
}

const GridLayout = styled.View`
   padding: 2rem;
   display: grid;
   background: #e9ecee;
   grid-template-columns: auto 500px;
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
   ${props =>
      props.label &&
      css`
         font-weight: 600;
      `}
   ${props =>
      props.notes &&
      css`
         font-size: 14px;
         margin-top: 0.5rem;
      `}
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
   overflow: auto;
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

const CartHeaderRight = styled.View`
   flex-direction: row;
   align-items: center;
`

const CartClearBtn = styled.TouchableOpacity`
   margin-right: 0.5rem;
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
   display: grid;
   grid-template-columns: 50px auto 60px 50px;
   column-gap: 8px;
   grid-column-gap: 8px;
   gap: 0px 8px;
   align-items: start;
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

const CartItemInfo = styled.View``

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

const FooterContentWrapper = styled.View`
   padding: ${width > 768 ? '0px 30px' : '0px 10px'};
   background: #fff;
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

const HelpText = styled(CartBillingDetailText)`
   margin-bottom: 0.5rem;
   font-style: italic;
`

const GenericPayment = styled.View``
