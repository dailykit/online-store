import { useMutation, useLazyQuery } from '@apollo/react-hooks'
import React, { useState } from 'react'
import { StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native'
import { useAppContext } from '../context/app'
import { useCartContext } from '../context/cart'
import { UPDATE_CART } from '../graphql/mutations'
import { height } from '../utils/Scalaing'
import { Feather } from '@expo/vector-icons'
import { INVENTORY_PRODUCT, SIMPLE_PRODUCT } from '../graphql'

import defaultProductImage from '../assets/imgs/default-product-image.png'

const Summary = ({ useQuantity, item }) => {
   const [quantity, setquantity] = useState(1)
   const { cart } = useCartContext()
   const { visual } = useAppContext()

   const [image, setImage] = React.useState('')

   // to be used for SRP
   const [option, setOption] = React.useState(undefined)

   const [fetchInventoryProduct] = useLazyQuery(INVENTORY_PRODUCT, {
      onCompleted: data => {
         if (data.inventoryProduct?.assets?.images[0]) {
            setImage(data.inventoryProduct?.assets?.images[0])
         }
      },
      onError: error => {
         console.log(error)
      },
      fetchPolicy: 'cache-and-network',
   })

   const [fetchSimpleRecipeProduct] = useLazyQuery(SIMPLE_PRODUCT, {
      onCompleted: data => {
         if (data.simpleRecipeProduct) {
            setImage(data.simpleRecipeProduct?.assets?.images[0])
            const option = data.simpleRecipeProduct.simpleRecipeProductOptions.find(
               option => option.id === item.option.id
            )
            setOption(option)
         }
      },
      onError: error => {
         console.log(error)
      },
      fetchPolicy: 'cache-and-network',
   })

   React.useEffect(() => {
      console.log(item)
      switch (item.type) {
         case 'simpleRecipeProduct': {
            return fetchSimpleRecipeProduct({
               variables: {
                  id: item.id,
               },
            })
         }
         case 'customizableProduct': {
            if (item.product.type === 'simpleRecipeProduct') {
               return fetchSimpleRecipeProduct({
                  variables: {
                     id: item.id,
                  },
               })
            } else {
               return fetchInventoryProduct({
                  variables: {
                     id: item.id,
                  },
               })
            }
         }
         case 'comboProduct': {
            console.log('Combo product:', item)
         }
         default: {
            return console.log('NO IMAGE!')
         }
      }
   }, [])

   const [isHovered, setIsHovered] = React.useState(false)

   const [updateCart] = useMutation(UPDATE_CART, {
      onCompleted: () => {
         console.log('Cart updated!')
      },
      onError: error => {
         console.log(error)
      },
   })

   const updateQuantity = quantity => {
      try {
         if (quantity) {
            let products = cart?.cartInfo?.products
            const index = products.findIndex(
               product => product.cartItemId === item.cartItemId
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
            removeFromCart(item)
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
      // if (product.type === 'comboProducts') {
      //    product.products.forEach(
      //       item => (total = total - parseFloat(item.product.price))
      //    )
      // } else {
      //    total = total - parseFloat(product.product.price)
      // }
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

   if (quantity < 0) {
      setquantity(0)
   }
   return (
      <View style={styles.summary_container}>
         <Image
            style={{ width: 100, height: 100, resizeMode: 'contain' }}
            source={{
               uri: item.image || defaultProductImage,
            }}
         />
         <View style={styles.picker_container}>
            <Text style={styles.summary_title_text}>
               {item.name}{' '}
               {Boolean(option) && (
                  <Text style={{ fontSize: 12, color: '#666' }}>
                     {option.type === 'mealKit'
                        ? `(Meal Kit: ${option.simpleRecipeYield.yield.serving})`
                        : `(Ready to Eat: ${option.simpleRecipeYield.yield.serving})`}
                  </Text>
               )}
            </Text>
            {item.type === 'comboProduct' && (
               <View style={{ marginVertical: 10 }}>
                  {item.components.map(product => (
                     <Text
                        key={product.comboProductComponentId}
                        style={{ fontSize: 14, color: '#666' }}
                     >{`${product.comboProductComponentLabel}: ${product.name}`}</Text>
                  ))}
               </View>
            )}
            {item.quantity && (
               <View style={styles.quantity}>
                  <Feather
                     name="minus"
                     color="#aaa"
                     size={24}
                     onPress={() => updateQuantity(item.quantity - 1)}
                  />
                  <Text
                     style={{
                        color: '#333',
                        fontWeight: 'bold',
                        fontSize: 20,
                        marginHorizontal: 8,
                     }}
                  >
                     {item.quantity}
                  </Text>
                  <Feather
                     name="plus"
                     color="#aaa"
                     size={24}
                     onPress={() => updateQuantity(item.quantity + 1)}
                  />
               </View>
            )}
            <View
               style={[
                  styles.button_container,
                  { borderColor: visual.color || '#3fa4ff' },
               ]}
            >
               <TouchableOpacity
                  onPress={() => {
                     removeFromCart(item)
                  }}
                  style={[
                     styles.button_container_left,
                     { backgroundColor: isHovered ? '#ff5a52' : '#fff' },
                  ]}
               >
                  <Feather color="#ff5a52" name="trash-2" size={14} />
               </TouchableOpacity>
            </View>
         </View>
         <View style={styles.summary_bottom_conatiner}>
            <View style={styles.summary_bottom_conatiner_left}>
               <Text style={styles.price_text}>$ {item.totalPrice}</Text>
            </View>
         </View>
      </View>
   )
}

const styles = StyleSheet.create({
   summary_container: {
      paddingVertical: 10,
      borderBottomColor: '#eaeded',
      borderBottomWidth: 1,
      backgroundColor: '#fff',
      width: '100%',
      flexDirection: 'row',
      alignItems: 'center',
   },
   summary_title_conatiner: {
      flex: 1,
      flexDirection: 'row',
      paddingHorizontal: 30,
      justifyContent: 'center',
   },
   picker_container: {
      flex: 1,
      paddingLeft: 30,
      justifyContent: 'center',
      alignItems: 'flex-start',
   },
   summary_bottom_conatiner: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'center',
   },
   summary_title_conatiner_left: {
      flex: 1,
      justifyContent: 'center',
   },
   summary_title_conatiner_right: {
      flex: 1,
      justifyContent: 'center',
   },
   summary_title_text: {
      fontSize: 16,
   },
   summary_bottom_conatiner_left: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'flex-end',
   },
   summary_bottom_conatiner_right: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 30,
   },
   button_container: {
      flexDirection: 'row',
      justifyContent: 'center',
      borderWidth: 0,
      borderColor: '#3fa4ff',
   },
   price_text: {
      fontSize: 16,
   },
   button_container_left: {
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#fff',
      borderRadius: 2,
      marginTop: 10,
   },
   button_container_middle: {
      flex: 2,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#278ce8',
      height: height * 0.04,
   },
   button_container_right: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#3fa4ff',
      height: height * 0.04,
   },
   quantity_text: {
      color: 'white',
      fontSize: 16,
   },
   quantity: {
      flexDirection: 'row',
      alignItems: 'baseline',
      justifyContent: 'space-around',
      marginVertical: 5,
   },
})

export default Summary
