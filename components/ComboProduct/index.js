import { Feather } from '@expo/vector-icons'
import React, { useState } from 'react'
import { Image, Text, View } from 'react-native'
import Carousel from 'react-native-banner-carousel'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { useAppContext } from '../../context/app'
import { discountedPrice, priceSort } from '../../utils'
import { width } from '../../utils/Scaling'
import CustomizableProductItem from '../CustomizableProductItem'
import InventoryProductItem from '../InventoryProductItem'
import SimpleProductItem from '../SimpleProductItem'
import { styles } from './styles'

const ComboProduct = ({
   tunnelItem,
   navigation,
   setcartItem,
   setIsLastComboItem,
   setcardData,
   currentComboProductIndex,
   setCurrentComboProductIndex,
   setPrice,
   setDiscount,
   product,
   onModifiersValidityChange,
   clickHandler,
}) => {
   const [selected, setSelected] = useState(0)

   const { visual } = useAppContext()

   const [optionImages, setOptionImages] = React.useState([])

   React.useEffect(() => {
      console.log('Product: ', product)
      const images = product.comboProductComponents.map(component => {
         console.log(component)
         if (component.inventoryProduct) {
            return (
               component.inventoryProduct?.assets?.images[0] ||
               require('../../assets/imgs/default-product-image.png')
            )
         } else if (component.simpleRecipeProduct) {
            return (
               component.simpleRecipeProduct?.assets?.images[0] ||
               require('../../assets/imgs/default-product-image.png')
            )
         } else {
            console.log('CUSP:', component.customizableProduct)
            if (
               component.customizableProduct.defaultCustomizableProductOption
                  .inventoryProduct
            ) {
               return (
                  component.customizableProduct.defaultCustomizableProductOption
                     .inventoryProduct?.assets?.images[0] ||
                  require('../../assets/imgs/default-product-image.png')
               )
            } else {
               return (
                  component.customizableProduct.defaultCustomizableProductOption
                     .simpleRecipeProduct?.assets?.images[0] ||
                  require('../../assets/imgs/default-product-image.png')
               )
            }
         }
      })
      setOptionImages(images)
      setPrice?.(discountedPrice(product.price))
      setDiscount?.(product.price.discount)
   }, [])

   React.useEffect(() => {
      let price = 0
      product.comboProductComponents.forEach(product => {
         if (product.inventoryProduct) {
            price =
               price +
               parseFloat(
                  product.inventoryProduct.inventoryProductOptions.sort(
                     priceSort
                  )[0].price[0].value
               )
         }
         if (product.simpleRecipeProduct) {
            price =
               price +
               parseFloat(
                  product.simpleRecipeProduct.simpleRecipeProductOptions.sort(
                     priceSort
                  )[0].price[0].value
               )
         }
         if (product.customizableProduct) {
            price =
               price +
               parseFloat(
                  product.customizableProduct?.customizableProductOptions[0]
                     ?.simpleRecipeProduct?.simpleRecipeProductOptions[0]
                     ?.price[0]?.value
               )
         }
      })
      // setPrice(price)
      if (setcardData) setcardData(product)
   }, [])

   // let comboProductComponents = product.comboProductComponents;
   let selectedArr = product.comboProductComponents?.map((el, _id) => false)
   // if (comboProductComponents == undefined) return <Text>Bad Data</Text>;
   return (
      <TouchableOpacity onPress={clickHandler} style={styles.container}>
         {tunnelItem ? (
            <>
               <View style={styles.item_parent_container}>
                  {product.comboProductComponents.map((el, _id) => {
                     let last = false
                     let isSelected = false
                     if (!tunnelItem) {
                        isSelected = selected == _id
                        if (_id == product.comboProductComponents.length - 1) {
                           last = true
                        }
                     } else {
                        last = false
                        isSelected = currentComboProductIndex == _id
                        if (_id == product.comboProductComponents.length - 1) {
                           last = true
                        }
                     }
                     if (el.customizableProduct && isSelected) {
                        return (
                           <CustomizableProductItem
                              isSelected={isSelected}
                              _id={_id}
                              product={el.customizableProduct}
                              setSelected={index => {
                                 selectedArr[index] = true
                                 setSelected(index)
                                 if (selectedArr.every(item => item == true)) {
                                    setIsLastComboItem(true)
                                 }
                              }}
                              isLast={last}
                              key={_id}
                              navigation={navigation}
                              tunnelItem={tunnelItem}
                              id={el.customizableProduct.id}
                              setcartItem={setcartItem}
                              name={el.name}
                              refId={product.id}
                              refType="comboProduct"
                              comboProductComponent={{
                                 id: el.id,
                                 label: el.label,
                              }}
                              onModifiersValidityChange={
                                 onModifiersValidityChange
                              }
                           />
                        )
                     }
                     if (el.simpleRecipeProduct && isSelected) {
                        return (
                           <SimpleProductItem
                              isSelected={isSelected}
                              _id={_id}
                              product={el.simpleRecipeProduct}
                              setSelected={index => {
                                 selectedArr[index] = true
                                 setSelected(index)
                                 if (selectedArr.every(item => item == true)) {
                                    setIsLastComboItem(true)
                                 }
                              }}
                              isLast={last}
                              key={_id}
                              navigation={navigation}
                              id={el.simpleRecipeProduct.id}
                              tunnelItem={tunnelItem}
                              setcartItem={setcartItem}
                              name={el.name}
                              showInfo={true}
                              refId={product.id}
                              refType="comboProduct"
                              comboProductComponent={{
                                 id: el.id,
                                 label: el.label,
                              }}
                              onModifiersValidityChange={
                                 onModifiersValidityChange
                              }
                           />
                        )
                     }
                     if (el.inventoryProduct && isSelected) {
                        return (
                           <InventoryProductItem
                              isSelected={isSelected}
                              _id={_id}
                              product={el.inventoryProduct}
                              setSelected={index => {
                                 selectedArr[index] = true
                                 setSelected(index)
                                 if (selectedArr.every(item => item == true)) {
                                    setIsLastComboItem(true)
                                 }
                              }}
                              isLast={last}
                              key={_id}
                              navigation={navigation}
                              id={el.inventoryProduct.id}
                              tunnelItem={tunnelItem}
                              setcartItem={setcartItem}
                              name={el.name}
                              showInfo={true}
                              // -1 means no navigation
                              refId={-1}
                              comboProductComponent={{
                                 id: el.id,
                                 label: el.label,
                              }}
                              onModifiersValidityChange={
                                 onModifiersValidityChange
                              }
                           />
                        )
                     }
                  })}
               </View>
            </>
         ) : (
            <View>
               {product.assets?.images[0] ? (
                  <Image
                     style={{
                        flex: 1,
                        height: width > 768 ? 150 : 120,
                        width: '100%',
                        resizeMode: 'cover',
                     }}
                     source={{ uri: product.assets.images[0] }}
                  />
               ) : (
                  <Carousel
                     autoplay
                     autoplayTimeout={3000}
                     loop
                     index={0}
                     pageSize="100%"
                  >
                     {optionImages.map((slide, index) => (
                        <View
                           key={index}
                           style={{
                              flex: 1,
                              position: 'relative',
                              paddingTop: 20,
                              width: width > 768 ? 150 : 120,
                           }}
                        >
                           <Image
                              style={{
                                 flex: 1,
                                 height: width > 768 ? 150 : 120,
                                 width: '100%',
                                 resizeMode: 'contain',
                                 marginHorizontal: 'auto',
                              }}
                              source={{ uri: slide }}
                           />
                        </View>
                     ))}
                  </Carousel>
               )}
               <View
                  style={{
                     flexDirection: 'row',
                     alignItems: 'center',
                     minHeight: width > 768 ? 60 : 56,
                     alignItems: 'flex-start',
                  }}
               >
                  <Text
                     style={{
                        marginTop: 8,
                        color: visual.color,
                        fontSize: width > 768 ? 20 : 16,
                        paddingHorizontal: 20,
                     }}
                     numberOfLines={1}
                     ellipsizeMode="tail"
                  >
                     {product.name}
                  </Text>
               </View>
               {Boolean(product.additionalText) && (
                  <Text
                     style={{
                        fontSize: width > 768 ? 13 : 12,
                        lineHeight: 24,
                        color: '#686b78',
                        paddingHorizontal: 20,
                     }}
                     numberOfLines={2}
                     ellipsizeMode="tail"
                  >
                     {product.additionalText}
                  </Text>
               )}
               <Text
                  style={{
                     marginTop: 8,
                     color: '#666',
                     paddingHorizontal: 20,
                     fontSize: width > 768 ? 18 : 14,
                  }}
                  numberOfLines={2}
                  ellipsizeMode="tail"
               >
                  {product.isPopupAllowed
                     ? `${product.comboProductComponents.length} items inside`
                     : product.defaultCartItem.components
                          .reduce((names, product) => {
                             names.push(product.name)
                             return names
                          }, [])
                          .join(' + ')}
               </Text>
            </View>
         )}
      </TouchableOpacity>
   )
}

export default ComboProduct
