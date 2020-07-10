import React, { useState } from 'react'
import { View, Text, Image } from 'react-native'
import CustomizableProductItem from '../CustomizableProductItem'
import InventoryProductItem from '../InventoryProductItem'
import SimpleProductItem from '../SimpleProductItem'
import { styles } from './styles'
import { width } from '../../utils/Scalaing'
import { useAppContext } from '../../context/app'
import Carousel from 'react-native-banner-carousel'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { Feather } from '@expo/vector-icons'

const ComboProduct = ({
   tunnelItem,
   navigation,
   setcartItem,
   setIsLastComboItem,
   setcardData,
   currentComboProductIndex,
   setCurrentComboProductIndex,
   setPrice,
   product,
}) => {
   const [selected, setSelected] = useState(0)

   const { visual } = useAppContext()

   const [optionImages, setOptionImages] = React.useState([])

   const REF = {
      id: product.id,
      type: 'comboProduct',
   }

   React.useEffect(() => {
      const images = product.comboProductComponents.map(component => {
         if (component.inventoryProduct) {
            return (
               component.inventoryProduct?.assets?.images[0] ||
               'https://via.placeholder.com/120'
            )
         } else if (component.simpleRecipeProduct) {
            return (
               component.simpleRecipeProduct?.assets?.images[0] ||
               'https://via.placeholder.com/120'
            )
         } else {
            if (
               component.customizableProduct.defaultCustomizableProductOption
                  .inventoryProduct
            ) {
               return (
                  component.customizableProduct.defaultCustomizableProductOption
                     .inventoryProduct?.assets?.images[0] ||
                  'https://via.placeholder.com/120'
               )
            } else {
               return (
                  component.customizableProduct.defaultCustomizableProductOption
                     .simpleRecipeProduct?.assets?.images[0] ||
                  'https://via.placeholder.com/120'
               )
            }
         }
      })
      setOptionImages(images)
   }, [])

   React.useEffect(() => {
      let price = 0
      product.comboProductComponents.forEach(product => {
         if (product.inventoryProductId !== null) {
            price =
               price +
               parseFloat(
                  product.inventoryProduct.inventoryProductOptions[0].price[0]
                     .value
               )
         }
         if (product.simpleRecipeProductId !== null) {
            price =
               price +
               parseFloat(
                  product.simpleRecipeProduct.simpleRecipeProductOptions[0]
                     .price[0].value
               )
         }
         if (product.customizableProductId !== null) {
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
      <View style={styles.container}>
         {tunnelItem ? (
            <>
               <View
                  style={{
                     flexDirection: 'row',
                     alignItems: 'center',
                     justifyContent: 'space-between',
                     height: 40,
                     paddingHorizontal: 5,
                  }}
               >
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                     {Boolean(currentComboProductIndex) && (
                        <TouchableOpacity
                           onPress={() =>
                              setCurrentComboProductIndex(
                                 currentComboProductIndex - 1
                              )
                           }
                           style={{ marginRight: 8 }}
                        >
                           <Feather
                              name="chevron-left"
                              size={24}
                              color="#666"
                           />
                        </TouchableOpacity>
                     )}
                     <Text
                        style={{
                           fontSize: 18,
                           color: '#666',
                           fontWeight: 'bold',
                        }}
                     >{`Selecting ${product.comboProductComponents[currentComboProductIndex].label}`}</Text>
                  </View>
                  <Text style={{ fontSize: 18, color: '#666' }}>{`${
                     currentComboProductIndex + 1
                  }/${product.comboProductComponents.length}`}</Text>
               </View>
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
                     if (el.customizableProductId !== null && isSelected) {
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
                              id={el.customizableProductId}
                              setcartItem={setcartItem}
                              name={el.name}
                              refId={product.id}
                              refType="comboProduct"
                              comboProductComponent={{
                                 id: el.id,
                                 label: el.label,
                              }}
                           />
                        )
                     }
                     if (el.simpleRecipeProductId !== null && isSelected) {
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
                              id={el.simpleRecipeProductId}
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
                           />
                        )
                     }
                     if (el.inventoryProductId !== null && isSelected) {
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
                              id={el.inventoryProductId}
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
                           />
                        )
                     }
                  })}
               </View>
            </>
         ) : (
            <View>
               <Carousel
                  autoplay
                  autoplayTimeout={3000}
                  loop
                  index={0}
                  pageSize={120}
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
               <Text
                  style={{
                     marginTop: 8,
                     color: '#666',
                     paddingHorizontal: 20,
                     fontSize: width > 768 ? 18 : 14,
                  }}
                  numberOfLines={1}
                  ellipsizeMode="tail"
               >
                  {product.comboProductComponents.length} items inside
               </Text>
            </View>
         )}
      </View>
   )
}

export default ComboProduct
