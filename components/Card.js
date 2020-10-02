import { useMutation } from '@apollo/react-hooks'
import { Feather } from '@expo/vector-icons'
import React, { useState } from 'react'
import { Text, TouchableOpacity, View } from 'react-native'
import EStyleSheet from 'react-native-extended-stylesheet'
import { AsyncStorage } from 'react-native-web'
import { useAppContext } from '../context/app'
import { useAuth } from '../context/auth'
import { useCartContext } from '../context/cart'
import { useDrawerContext } from '../context/drawer'
import { CREATE_CART, UPDATE_CART } from '../graphql'
import { discountedPrice, useStoreToast } from '../utils'
import { width } from '../utils/Scalaing'
import ComboProduct from './ComboProduct'
import CustomizableProductItem from './CustomizableProductItem'
import { Drawer } from './Drawer'
import InventoryProductItem from './InventoryProductItem'
import SimpleProductItem from './SimpleProductItem'

const Card = ({ id, type, navigation, label, product, ...restProps }) => {
   const [busy, setBusy] = useState(false)
   const [price, setPrice] = useState(0)
   const [discount, setDiscount] = useState(0)
   const [cardItem, setcardItem] = useState(null) // obj to push to jaguar
   const [cardData, setcardData] = useState(null) // obj to pass to add to cart modal
   const [isModalVisible, setIsModalVisible] = useState(false)
   const { visual, brandId } = useAppContext()
   const { cart, customerDetails, customer, setCart } = useCartContext()
   const { isAuthenticated, login, user } = useAuth()
   const { open } = useDrawerContext()
   const [isHovered, setIsHovered] = React.useState(false)

   const { toastr } = useStoreToast()

   // Mutation
   const [updateCart] = useMutation(UPDATE_CART, {
      onCompleted: data => {
         console.log('Product added!')
         setBusy(false)
         toastr('success', 'Item added!')
         if (!customer) {
            setCart(data.updateCart.returning[0])
         }
      },
      onError: error => {
         console.log(error)
         toastr('error', error.message)
         setBusy(false)
      },
   })
   const [createCart] = useMutation(CREATE_CART, {
      onCompleted: data => {
         console.log('Cart created!')
         setBusy(false)
         toastr('success', 'Item added!')
         if (!customer) {
            AsyncStorage.setItem('PENDING_CART_ID', data.createCart.id)
            setCart(data.createCart)
         }
      },
      onError: error => {
         console.log(error)
         toastr('error', error.message)
         setBusy(false)
      },
   })

   const addToCart = () => {
      try {
         if (product.isPopupAllowed) {
            setIsModalVisible(true)
         } else {
            if (busy) return
            setBusy(true)
            if (cart) {
               const priceWithoutDiscount = product.defaultCartItem.unitPrice
               const products = [
                  ...cart.cartInfo.products,
                  {
                     ...product.defaultCartItem,
                     unitPrice: price,
                     totalPrice: price,
                     discount: parseFloat(
                        (priceWithoutDiscount - price).toFixed(2)
                     ),
                  },
               ]
               const total = products.reduce(
                  (acc, product) => acc + parseFloat(product.totalPrice),
                  0
               )
               const cartInfo = {
                  products,
                  total: parseFloat(total.toFixed(2)),
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
               const priceWithoutDiscount = product.defaultCartItem.unitPrice
               const products = [
                  {
                     ...product.defaultCartItem,
                     unitPrice: price,
                     totalPrice: price,
                     discount: parseFloat(
                        (priceWithoutDiscount - price).toFixed(2)
                     ),
                  },
               ]
               const cartInfo = {
                  products,
                  total: parseFloat(price.toFixed(2)),
               }
               createCart({
                  variables: {
                     object: {
                        cartInfo: cartInfo,
                        customerId: customer?.id || null,
                        customerInfo: {
                           customerFirstName: customerDetails?.firstName,
                           customerLastName: customerDetails?.lastName,
                           customerPhone: customerDetails?.phoneNumber,
                           customerEmail: customerDetails?.email,
                        },
                        fulfillmentInfo: null,
                        paymentMethodId:
                           customerDetails?.defaultPaymentMethodId || null,
                        address:
                           customerDetails?.defaultCustomerAddress || null,
                        stripeCustomerId:
                           customerDetails?.stripeCustomerId || null,
                        tip: 0,
                        customerKeycloakId: user.sub || user.id || null,
                        cartSource: 'a-la-carte',
                        brandId: brandId,
                     },
                  },
               })
            }
         }
      } catch (error) {
         console.log(error)
         setBusy(false)
      }
   }

   const originalPrice = (discountPrice, discount) => {
      return parseFloat(discountPrice / (1 - parseFloat(discount / 100)))
   }

   React.useEffect(() => {
      if (!product.isPopupAllowed) {
         setDiscount(parseFloat(product.defaultCartItem.discount))
         setPrice(
            discountedPrice({
               value: product.defaultCartItem.unitPrice,
               discount: product.defaultCartItem.discount,
            })
         )
      }
   }, [])

   return (
      <>
         {cardData && (
            <Drawer
               isVisible={isModalVisible}
               navigation={navigation}
               data={cardData}
               type={cardData?.__typename.split('_')[1]}
               id={cardData?.id}
               setIsModalVisible={setIsModalVisible}
               showInfo={true}
            />
         )}
         <View
            style={[
               styles.card_container,
               {
                  shadowColor: '#666',
                  shadowOffset: {
                     width: 0,
                     height: 4,
                  },
                  shadowOpacity: isHovered ? 0.3 : 0.1,
                  shadowRadius: 4.65,
                  elevation: isHovered ? 24 : 4,
                  position: 'relative',
               },
            ]}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
         >
            {Boolean(discount) && (
               <View
                  style={{
                     position: 'absolute',
                     top: 4,
                     right: 4,
                     backgroundColor: visual.color,
                     zIndex: 100,
                     padding: 2,
                     borderRadius: 2,
                  }}
               >
                  <Text
                     style={{
                        fontSize: '0.8rem',
                        color: '#fff',
                     }}
                  >
                     {discount}% off
                  </Text>
               </View>
            )}
            <View style={styles.item_parent_container}>
               {product?.__typename.includes('comboProduct') && (
                  <>
                     <View style={styles.tagContainer}>
                        <Text style={styles.tag}>Combo</Text>
                     </View>
                     <ComboProduct
                        label={label}
                        setcardItem={setcardItem}
                        setcardData={item => setcardData(item)}
                        product={product}
                        navigation={navigation}
                        setPrice={setPrice}
                        {...restProps}
                     />
                  </>
               )}
               {product?.__typename.includes('customizableProduct') && (
                  <>
                     {cardData && (
                        <View style={styles.tagContainer}>
                           <Text style={styles.tag}>Customizable</Text>
                        </View>
                     )}
                     <CustomizableProductItem
                        label={label}
                        setcardItem={setcardItem}
                        navigation={navigation}
                        setcardData={item => setcardData(item)}
                        independantItem
                        product={product}
                        {...restProps}
                        setPrice={price => setPrice(price)}
                        setDiscount={setDiscount}
                     />
                  </>
               )}
               {product?.__typename.includes('simpleRecipeProduct') && (
                  <>
                     {/* {cardData && (
                        <View style={styles.card_title}>
                           <Text style={styles.card_title_text}>
                              {product.name}
                           </Text>
                        </View>
                     )} */}
                     <SimpleProductItem
                        label={label}
                        setcardItem={setcardItem}
                        showInfo={true}
                        setcardData={item => setcardData(item)}
                        navigation={navigation}
                        independantItem
                        product={product}
                        {...restProps}
                        setPrice={price => setPrice(price)}
                        setDiscount={setDiscount}
                     />
                  </>
               )}
               {product?.__typename.includes('inventoryProduct') && (
                  <>
                     {/* {cardData && (
                        <View style={styles.card_title}>
                           <Text style={styles.card_title_text}>
                              {product.name}
                           </Text>
                        </View>
                     )} */}
                     <InventoryProductItem
                        label={label}
                        showInfo={true}
                        setcardItem={setcardItem}
                        setcardData={item => setcardData(item)}
                        navigation={navigation}
                        independantItem
                        product={product}
                        {...restProps}
                        setPrice={price => setPrice(price)}
                        setDiscount={setDiscount}
                     />
                  </>
               )}
            </View>

            <View style={styles.bottom_container}>
               {!['comboProduct', 'customizableProduct'].includes(
                  product?.__typename.split('_')[1]
               ) && (
                  <View style={styles.price}>
                     {discount ? (
                        <>
                           <Text
                              style={[
                                 styles.price_text,
                                 {
                                    textDecoration: 'line-through',
                                    marginRight: '0.5rem',
                                    fontSize: '0.9rem',
                                    fontWeight: 'normal',
                                 },
                              ]}
                           >
                              $ {originalPrice(price, discount)?.toFixed(2)}
                           </Text>
                           <Text style={styles.price_text}>
                              ${price?.toFixed(2)}
                           </Text>
                        </>
                     ) : (
                        <Text style={styles.price_text}>
                           $ {price?.toFixed(2)}
                        </Text>
                     )}
                  </View>
               )}
               {['comboProduct', 'customizableProduct'].includes(
                  product?.__typename.split('_')[1]
               ) &&
                  !product.isPopupAllowed && (
                     <View style={styles.price}>
                        {discount ? (
                           <>
                              <Text
                                 style={[
                                    styles.price_text,
                                    {
                                       textDecoration: 'line-through',
                                       marginRight: '0.5rem',
                                       fontSize: '0.9rem',
                                       fontWeight: 'normal',
                                    },
                                 ]}
                              >
                                 $ {originalPrice(price, discount)?.toFixed(2)}
                              </Text>
                              <Text style={styles.price_text}>
                                 ${price?.toFixed(2)}
                              </Text>
                           </>
                        ) : (
                           <Text style={styles.price_text}>
                              $ {price?.toFixed(2)}
                           </Text>
                        )}
                     </View>
                  )}
               <View style={styles.add_to_cart_container}>
                  <TouchableOpacity
                     onPress={addToCart}
                     style={[
                        styles.button,
                        { display: isNaN(price) ? 'none' : 'flex' },
                        { backgroundColor: visual.color || '#3fa4ff' },
                     ]}
                  >
                     <Text style={styles.add_to_card_text}>
                        {busy ? '...' : 'ADD'}
                        {product.isPopupAllowed && (
                           <Feather
                              size={10}
                              name="plus"
                              style={{ position: 'absolute' }}
                           />
                        )}
                     </Text>
                  </TouchableOpacity>
               </View>
            </View>
         </View>
      </>
   )
}

const styles = EStyleSheet.create({
   card_container: {
      width: width >= 768 ? width * 0.2 : width * 0.45,
      padding: width >= 768 ? 0 : 2,
      elevation: 2,
      shadowColor: '#000',
      shadowOffset: {},
      backgroundColor: '#fff',
      marginBottom: 10,
      marginHorizontal: width > 768 ? 10 : 4,
      marginTop: width > 768 ? 20 : 0,
      borderRadius: 4,
   },
   card_title: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
   },
   card_title_text: {
      fontSize: '$l',
      fontWeight: 'bold',
   },
   item_parent_container: {
      position: 'relative',
   },
   tagContainer: {
      padding: 2,
      backgroundColor: '#fff',
      position: 'absolute',
      top: 4,
      left: 4,
      zIndex: 10,
      borderRadius: 2,
   },
   tag: {
      fontSize: '$xs',
      color: 'gray',
      textAlign: 'left',
      textTransform: 'uppercase',
   },
   bottom_container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'row',
      paddingVertical: 5,
      paddingHorizontal: width > 768 ? '1rem' : '0.5rem',
   },
   item_details: {
      textAlign: 'right',
   },
   price: {
      flex: 1,
      justifyContent: 'flex-start',
      alignItems: 'center',
      flexDirection: 'row',
   },
   add_to_cart_container: {
      flex: 1,
      justifyContent: 'flex-end',
      alignItems: 'center',
      flexDirection: 'row',
   },
   button: {
      backgroundColor: '#3fa4ff',
      paddingVertical: 5,
      paddingHorizontal: width > 768 ? 15 : 8,
      minWidth: 60,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 4,
   },
   add_to_card_text: {
      color: 'white',
      fontSize: width > 768 ? '$s' : '$xs',
   },
   price_text: {
      fontSize: width > 768 ? '$l' : '$m',
      fontWeight: 'bold',
   },
})

export default Card
