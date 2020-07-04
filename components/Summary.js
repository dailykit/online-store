import { useMutation, useLazyQuery } from '@apollo/react-hooks'
import React, { useState } from 'react'
import { StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native'
import { useAppContext } from '../context/app'
import { useCartContext } from '../context/cart'
import { UPDATE_CART } from '../graphql/mutations'
import { height } from '../utils/Scalaing'
import { Feather } from '@expo/vector-icons'
import { INVENTORY_PRODUCT, SIMPLE_PRODUCT } from '../graphql'

const Summary = ({ useQuantity, item }) => {
   const [quantity, setquantity] = useState(1)
   const { cart } = useCartContext()
   const { visual } = useAppContext()

   const [image, setImage] = React.useState('')

   // to be used for SRP
   const [option, setOption] = React.useState(undefined)

   const [fetchInventoryProduct] = useLazyQuery(INVENTORY_PRODUCT, {
      variables: {
         id: item.product.id,
      },
      onCompleted: data => {
         if (data.inventoryProduct?.assets?.images[0]) {
            setImage(data.inventoryProduct?.assets?.images[0])
         }
      },
      fetchPolicy: 'cache-and-network',
   })

   const [fetchSimpleRecipeProduct] = useLazyQuery(SIMPLE_PRODUCT, {
      variables: {
         id: item.product.id,
      },
      onCompleted: data => {
         if (data.simpleRecipeProduct) {
            setImage(data.simpleRecipeProduct?.assets?.images[0])
            const option = data.simpleRecipeProduct.simpleRecipeProductOptions.find(
               option => option.id === item.product.option.id
            )
            setOption(option)
         }
      },
      fetchPolicy: 'cache-and-network',
   })

   React.useEffect(() => {
      console.log(item)
      switch (item.type) {
         case 'inventoryProduct': {
            return fetchInventoryProduct()
         }
         case 'simpleRecipeProduct': {
            return fetchSimpleRecipeProduct()
         }
         case 'customizableProduct': {
            if (item.product.type === 'simpleRecipeProduct') {
               return fetchSimpleRecipeProduct()
            } else {
               return fetchInventoryProduct()
            }
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
            products[index].product.quantity = quantity
            products[index].product.price =
               products[index].product.basePrice * quantity
            const total = products.reduce(
               (acc, cartItem) => acc + parseFloat(cartItem.product.price),
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
            (acc, cartItem) => acc + parseFloat(cartItem.product.price),
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
   if (item.type == 'comboProducts') {
      return (
         <View style={styles.summary_container}>
            <Image
               style={{ width: 300, height: 300 }}
               source={{
                  uri:
                     image ||
                     'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAh1BMVEX///+1tbWwsLD8/Pzu7u7h4eG4uLgbGxvQ0NAAAAAYGBjLy8vl5eWvr6+8vLzd3d0iIiL19fVfX1/Dw8PU1NQTExOmpqYlJSVQUFBaWlqFhYXp6elLS0srKytVVVWTk5NtbW0zMzNAQEANDQ2UlJQvLy+dnZ16enppaWlBQUE5OTl8fHxzc3MIIqs+AAANvUlEQVR4nO1diZaqOBBlCYSdIJstIO6ttv//fZMFBRQUup9A9+SeM/MagZBLpZZUJSoIHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBy/BInmqK/gmNbY3fw2gCqJXSCpydhd/R4SuxM/AvtXilHuzI+IUR67u88g13H92O02RAuG7pgMnsNSJVsqYUuOx04EfWQomuOyeALrUdkkRvGvMHQaRpxGz/wRho3mxKen/jJDh576HzDsY0t/JUOtl7eYLMN7Z1hxiY1n2jEyj/8tPPBWeCPTS8xaMPMO2E4wHsvE6WUqvwtJMkfSUK37zOjHGGXy6A8iwALSCBTNIQliimBogtY3CBLDIYqqevuzF4Zm2JudrZpu4l0jAQ8ogd/Ksm5Ni8+CYQn2mryLkmgqTeYQBE4DSSmwaij0QRqWYcOUsBW2/yTH5AUPHB/cH9MIadBMldxdhJJW9hgPTktxXcXCw7VCoOZWJeXxcSY9M2hgDroyLJ21rJhOVcFUP7iZR0ss25MaIhgmRGcgcpVHvubnFCQ817EfbsE0zaubKyeSTW5BoWfVwejdHvmSYDHgEr/VNUhqwITs+U9sps9ODRm7dWF4TSm+iF4lqeDoFkHgY/hyFfDEGBbZNu91cCcVsgbXY1+r4faGpsWwSGB3S9QU4vZe+KBJMWTOy+s8vSpeyHOKU2LI6khJj8CnSEM9pTghhkyx3F7zR8mRX1GcDkNm8BtUkITRPobTOLVQCYNn9bjJMGQD7oGgpGrWLV6RgfvoJClFr73pyTCk0dX95EMyH2IV2b03RPTO9nhpKgxpYHlX3a6G31VYd1V+Ws9pzR5MhCG1+/WhJvnt+cC6rJkGtzU9EYZ0pNUs4vPqdd1n2mQst3mZaTC0ibjqVuZVQrdeviGfmFNmSOyoV1VC53W/qiOVhrMt9nQSDKmZqY7RTtPWKkU6CLTpMiQSqJn7br2qDmtiT5uFOAWGVITq3XEX+JV7iLFp1MQpMCTvv2IJm7JKzZDvGmlMBE2AIZ0zVcThd2+xEiLcD4RJMRRqKtR5jBJUxiVx+01T5wkwNGtd65eHrxoXodnWjM+QDtJyeNn9elQKkdqahvYnwFCuvfueOWpQF36DNR2fIfHupfPuXfFzag01PGJ8hkRo5avvnaKuaLDcqIijM6RziFIQWt9GQU38DemM8Rkm1aLUN4phbe9qOgy96tjq5QwZylghqB1Nh6FcDdm+UbItZxSm0DS/GJ9h7cQ3qn2lHSbh3mNUMzpD8aGTPWHVXs/jUoHfz7AyKxH+JkPwGxj+SA8nL0NiaUpV+kbVvX7zBC0NYfgjb+HWBsDjOv/xGf7U49f94ePkYnyGoBa19V8vWcZpgTDNqK02Ae6/0q7ydkgG6/EB4zOsR5O9jWlFh8E0Z0/UBbrfV8RKGkNoLM+Mz5B4sbtcRA9UVgM2h6UTYEjzFvWUWQ9UpN88PZwCw3oGqXvGm6JM0pHx3bS+c3yG1LhU9KdXWKPUB2nTEybA8C4f32frciUtQ2X/OMOfBkMyTCsRcw9zWo1ghJby2pAMW1eECHUN6uwTKw1KbWWLQRm2rSWgYU2ld103TdaKaYRIU+ODrhFuXbhEhFbNdHZzil71DqK8jZsdvjGn/gGayns3IdbK8h2sjVdrgnzS2PSwW0qalxKIxVCqemvpZe4bVO+nU5JGEdrDbkP02lZW0jddG8SS/9xC1Ozyk8Umww7SJ7u0qYe4E8KTqaJcX8VGh0CTL/zOjPqHaNNE5iHq/W5f2OY20Gifmg0Lr6EbrC/UttwFzpLZwFF2xToZuni6cYyOslffE9ucIpliyPcylhy3RlK2zPsltHbTu2FnRvoygtaFoITKA0WRLIEOXCtJEiUwG7blMeE3NCqJo33BEvDtpgXbEg1L5MZF6bVdk3U50cnW/fZpcm0w6pctJG6gPYKZhV57oVluDpj3LSljf+fAUwSd9yNIL1ehThSgzRrdj9Dpfq3JS3TZ1P5rv42OAbzSRkmc8LeYdcOTDZaE37iW8h/BC8RGkpLt9MvHTRl06311xTrx/+4vNaBtkBNX8x0sOFF1zMD6Y+w4ODg4ODg4ODg4ODg4ODg4ODi6w8wpdtGr1RXyIurYpJsfftqrf4kIZSEBhMvnmUBP/2g/Cb7s8sAMl/+oc/8EUfyZKIrlipvs+PRCz5i1n1T0z/LARE/exfCI0IL9ATL4tFj0lKFlfJUHU2UorJAvWAlZK0KOXN+/VY9cVQ0Yw8RiFReL1eCB6ZPCsGyZ6AJuZXnK0FM8ATi0AqWQ2ylkzfe1ombjmb4p0wcKZF2g/baFJyXDC/Ll8CjMQh0/Md1ipJQjmIXbrT5XEGa41OludU9fk/+vwq2+PTuCpcPzXkc1hqquHXQ9xLL90rdbY0Z4RTG+Psx89lzc6Npdb/DfyRI/LEzf9NXXJcMNdOX958VY5YK2RbsgyJGBX6y8QStT8dPzGjOcGYxhlpIT8GK64jp05OiQreybraEMnfhj7yj+eT9fO5Y2j3eCIIZz33IPGcQm7WBsRNf/2J/mpDV0cN0crd9T9LgyBJ/ZSZDP5zUZbBtE37OK8Bs+oBW9IL1nuGN3usYZSyHclU0yhllGF/lnMfnHJQMg3dKbLzAQAMwoneUaM/w06NNEI38Pw2yTnk7p3kCxixnG5GEaLMzqB+7MCSlFv+8YxjF754eFJyhhpXeMIaSfuJAaWc/ADsRhy/Q+caMRZC7Tj+eChwoTtsnexpDgeCBbuM4x1RdYjLgD/sNYs7+ppakwTOC8bKWBoUHbcJlgZIO5SBCIlywOMEu2isHDjWhoJtkY0gd6S+W/1EPSkTXtdQ6LpdwijABMi5NhnaELV+WNnRjKu7Oux8cjCoQZZIZaNuaCn+11Cqi/pfbfxPAAi50xEYxkY1OcM+4ZVvxjJ4Zz+EXqwztsv1aIyZAMhAB+sZ9E8by3FP+bGPqw8N8XPJjOMbPiAVGXI2NooRSP2j27aDEHmOGDpXlgqBlMu3PM8IBYkOsQPbxqffCe3/RoYujFGXXfCsI+LkdMPKv9jFkJQmqPh+4ypitjQXwSOjF0IH2SfMajlBpggRho/MAZa1Tert9BsJGhEBkbPIr8syFRb5UDHFoj4i0kNLcEkK/PmKFm7LG6WssQD2krXAY3JWph6IZrU/bMNCYu/wvOFDlYbog/dLdr1ZPdj/A9OxMOeiWilNGp+BThOCZkJtXaGFtdN5wtMYdLiOMYqKyJCFRo4IuYBi6hrl8dtqnPSUxDx6GrM8Hp+JUsDNLQpwjJqQVuR18rZ9KomYUkqHnTnEtxKgGh7F9XlgMpz8VrGOXvchsIDjUOTr6IgMCuA/ZicShEF/i3te0JudJii2o81rxMbw4OeYQvj3JyyhIjH8t2Ra9S89z+1YvEHpAUPzNrGpOaLP9DuDpVeDkN/87yqTt8haeDE52rJvivQZ3HMPsY9NctBof8nhCGg4Nj2vjnmj+tX+jUPs/ZPs27hE7BR5dARFmc9utuDQ6CzzBcfn5uDNihOGHqi9cXHWiDZwiH3kPZgiP6oIGin8HXUxhl8foa00hpg3b8nuRLX4jwWksx4/0/UZ5jkaYQFmgSsfUG3QLguU6HlWIfig3bfiB4Uh5hSSRRHhHBABOfMTXy8aGoyXnqAc+L3HJX6ekqOq1IWAXR4bavFuCrix8xxxMoZ3d4+0gOYFlK8chP2corOiWdkQ7rMy3UtxAGko7/MdRCD7epArdbA17ITX5MEv95rt9qF8vsKjpqUJOUzKgNpr87SA5O5KUudbDW8VT73aWcCN2F+HN0dIF7QSSRaJyg6Hn5/gQlz7OzrSyYJOGSpdlCAdqGWBJzu1YBiOAmvjFUYXwp99CCDC0sYM4RSQ8vYGoCawdJqWu2Tlf4SUvUtfr6TeSo/j1sEmLZrxV5MIzpBCDOaIZxCd2C4Z5mL3yS2k5ZKsnOSob4rSGYzXOmjV/sFconfKFinD12wQoz3NMnWfB57fLHWKD6Nwd9IJbZUEja5poVQ7RfC+PKENEch2J84f+KQRZXGAqy+oV9Bcoikv6B7DMRLW6JROEMPWGGmD4ab64a53eDJC46JGQGfjjLeac0319haNCPXayIRYkCSwTdbe1N1GOMckG56pmF5sIRFomhFSS5b2Z93s1QQmWNWl2JcnwtkZwg6MDQLsosuM+Pm5edLATBNcMM4rPwcb1oAc3BGLrwfPv7Ejr9ZVjEOKebDB14s10rZFqjyxB3/1re9DLDq+hh2oWhUhRvALzpYWDcClOkzNSuh0MxNGFchCDHeEFCHFZ0obb0NUPsXKi5/dyXlmYTFzzAHhP5ilnme4PFZoXMltLK62AMhRyiRQASZ45SQmSJZgEIVswfvmbobuNI0VbGsbQ0Woi+Ak9OnBPJiBJ/qAAzpfq4gCcfKDmi/nAwhoK4NowwNIwLi0ovNKZZkQOd6ehZp2e+9KCIaXTGUCeeLEi3ur7X8sp6lSA1SBvbjMqSrkXYFjb3gMjBnMU07J3oqfB2yP5ukZdfuZ44tsMOFPaPy1TTCjzBC/BHATv2AhbRumTZyQxVo/YgWix2t0hVUW3/WiXwfFsMilbZHcG090XLEkt7esYAkhgHm5BGJhfDfnXlb4WLwuMu34SrsTvyPoDd/LxZ/e0UPQcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHB8efxX8vMN6DWtSb1gAAAABJRU5ErkJggg==',
               }}
            />
            <View style={styles.picker_container}>
               <Text style={styles.summary_title_text}>
                  {item.products[0].name}
               </Text>
            </View>
            {item.products.map(el => (
               <View style={styles.picker_container}>
                  <Text
                     style={{
                        paddingLeft: 10,
                     }}
                  >
                     {el.product.name}
                  </Text>
               </View>
            ))}
            <View style={styles.summary_bottom_conatiner}>
               <View style={styles.summary_bottom_conatiner_left}>
                  <Text style={styles.price_text}>$ {item.price}</Text>
               </View>
               <View style={styles.summary_bottom_conatiner_right}>
                  {/* {!useQuantity && (
            <View style={styles.button_container}>
              <TouchableOpacity
                onPress={() => setquantity(quantity - 1)}
                style={styles.button_container_left}
              >
                <Feather color='#fff' size={16} name='minus' />
              </TouchableOpacity>
              <View style={styles.button_container_middle}>
                <Text style={styles.quantity_text}>{quantity}</Text>
              </View>
              <TouchableOpacity
                onPress={() => setquantity(quantity + 1)}
                style={styles.button_container_right}
              >
                <Feather color='#fff' size={16} name='plus' />
              </TouchableOpacity>
            </View>
          )} */}
                  {!useQuantity && (
                     <View style={styles.button_container}>
                        <TouchableOpacity
                           onPress={() => {
                              removeFromCart(item)
                           }}
                           onMouseEnter={() => setIsHovered(true)}
                           onMouseLeave={() => setIsHovered(false)}
                           style={[
                              styles.button_container_left,
                              {
                                 backgroundColor: isHovered
                                    ? '#ff5a52'
                                    : '#fff',
                              },
                           ]}
                        >
                           <Text style={{ color: 'white' }}>Remove Item</Text>
                        </TouchableOpacity>
                     </View>
                  )}
                  {useQuantity && (
                     <Text style={{ fontSize: 18 }}>
                        Qty: <Text style={{ fontWeight: 'bold' }}>1</Text>
                     </Text>
                  )}
               </View>
            </View>
         </View>
      )
   }
   return (
      <View style={styles.summary_container}>
         <Image
            style={{ width: 100, height: 100, resizeMode: 'contain' }}
            source={{
               uri:
                  image ||
                  'data:image/png;base64,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',
            }}
         />
         <View style={styles.picker_container}>
            <Text style={styles.summary_title_text}>
               {item.product.name}{' '}
               {Boolean(option) && (
                  <Text style={{ fontSize: 12, color: '#666' }}>
                     {option.type === 'mealKit'
                        ? `(Meal Kit: ${option.simpleRecipeYield.yield.serving})`
                        : `(Ready to Eat: ${option.simpleRecipeYield.yield.serving})`}
                  </Text>
               )}
            </Text>
            {item.product.quantity && (
               <View style={styles.quantity}>
                  <Feather
                     name="minus"
                     color="#aaa"
                     size={24}
                     onPress={() => updateQuantity(item.product.quantity - 1)}
                  />
                  <Text
                     style={{
                        color: '#333',
                        fontWeight: 'bold',
                        fontSize: 20,
                        marginHorizontal: 8,
                     }}
                  >
                     {item.product.quantity}
                  </Text>
                  <Feather
                     name="plus"
                     color="#aaa"
                     size={24}
                     onPress={() => updateQuantity(item.product.quantity + 1)}
                  />
               </View>
            )}
            {!useQuantity && (
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
            )}
         </View>
         <View style={styles.summary_bottom_conatiner}>
            {/* <View style={styles.summary_bottom_conatiner_right}>
           {!useQuantity && (
            <View style={styles.button_container}>
              <TouchableOpacity
                onPress={() => setquantity(quantity - 1)}
                style={styles.button_container_left}
              >
                <Feather color='#fff' size={16} name='minus' />
              </TouchableOpacity>
              <View style={styles.button_container_middle}>
                <Text style={styles.quantity_text}>{quantity}</Text>
              </View>
              <TouchableOpacity
                onPress={() => setquantity(quantity + 1)}
                style={styles.button_container_right}
              >
                <Feather color='#fff' size={16} name='plus' />
              </TouchableOpacity>
            </View>
          )}

          {useQuantity && (
            <Text style={{ fontSize: 18 }}>
              Qty: <Text style={{ fontWeight: 'bold' }}>1</Text>
            </Text>
          )}
        </View> */}
            <View style={styles.summary_bottom_conatiner_left}>
               <Text style={styles.price_text}>$ {item.product.price}</Text>
            </View>
         </View>
      </View>
   )
}

const styles = StyleSheet.create({
   summary_container: {
      height: height * 0.22,
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
