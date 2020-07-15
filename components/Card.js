import { Feather } from '@expo/vector-icons'
import React, { useState } from 'react'
import { Text, TouchableOpacity, View } from 'react-native'
import EStyleSheet from 'react-native-extended-stylesheet'
import { useAppContext } from '../context/app'
import { useAuth } from '../context/auth'
import { width } from '../utils/Scalaing'
import ComboProduct from './ComboProduct'
import CustomizableProductItem from './CustomizableProductItem'
import { Drawer } from './Drawer'
import InventoryProductItem from './InventoryProductItem'
import SimpleProductItem from './SimpleProductItem'
import { useDrawerContext } from '../context/drawer'
import { useCartContext } from '../context/cart'
import { useMutation } from '@apollo/react-hooks'
import { UPDATE_CART } from '../graphql'

const Card = ({ id, type, navigation, label, product, ...restProps }) => {
   const [busy, setBusy] = useState(false)
   const [price, setPrice] = useState(0)
   const [cardItem, setcardItem] = useState(null) // obj to push to jaguar
   const [cardData, setcardData] = useState(null) // obj to pass to add to cart modal
   const [isModalVisible, setIsModalVisible] = useState(false)
   const { visual } = useAppContext()
   const { cart, customerDetails, customer } = useCartContext()
   const { isAuthenticated, login } = useAuth()
   const { open } = useDrawerContext()
   const [isHovered, setIsHovered] = React.useState(false)

   // Mutation
   const [updateCart] = useMutation(UPDATE_CART, {
      onCompleted: () => {
         console.log('Product added!')
         setBusy(false)
      },
      onError: error => {
         console.log(error)
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
               const products = [
                  ...cart.cartInfo.products,
                  product.defaultCartItem,
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
               const cartInfo = {
                  products: [product.defaultCartItem],
                  total: product.defaultCartItem.totalPrice,
               }
               createCart({
                  variables: {
                     object: {
                        cartInfo: cartInfo,
                        customerId: customer.id,
                        customerInfo: {
                           customerFirstName: customerDetails.firstName,
                           customerLastName: customerDetails.lastName,
                           customerPhone: customerDetails.phoneNumber,
                           customerEmail: customerDetails.email,
                        },
                        fulfillmentInfo: null,
                        paymentMethodId:
                           customerDetails?.defaultPaymentMethodId,
                        address: customerDetails?.defaultCustomerAddress,
                        stripeCustomerId: customerDetails?.stripeCustomerId,
                        tip: 0,
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
               },
            ]}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
         >
            <View style={styles.item_parent_container}>
               {product?.__typename.includes('comboProduct') && (
                  <>
                     <View>
                        <Text style={styles.is_customizable}>Combo</Text>
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
                        <View>
                           <Text style={styles.is_customizable}>
                              Customizable
                           </Text>
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
                     />
                  </>
               )}
            </View>

            <View style={styles.bottom_container}>
               {!['comboProduct', 'customizableProduct'].includes(
                  product?.__typename.split('_')[1]
               ) && (
                  <View style={styles.price}>
                     <Text style={styles.price_text}>$ {price}</Text>
                  </View>
               )}
               <View style={styles.add_to_cart_container}>
                  <TouchableOpacity
                     onPress={() => {
                        !isAuthenticated ? open('Login') : addToCart()
                        // navigation.navigate('AddToCart', { data: cardData, type, id });
                     }}
                     style={[
                        styles.button,
                        { display: isNaN(price) ? 'none' : 'flex' },
                        { backgroundColor: visual.color || '#3fa4ff' },
                     ]}
                  >
                     <Text style={styles.add_to_card_text}>
                        {busy ? '...' : 'ADD'}
                        {product.isPopupAllowed && (
                           <Feather size={width > 768 ? 14 : 10} name="plus" />
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
   is_customizable: {
      fontSize: '$s',
      color: 'gray',
      textAlign: 'right',
   },
   item_parent_container: {
      flex: 5,
   },
   bottom_container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'row',
      paddingTop: width > 768 ? 20 : 16,
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
