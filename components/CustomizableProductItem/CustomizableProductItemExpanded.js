import { MaterialIcons } from '@expo/vector-icons'
import React, { useState } from 'react'
import {
   Image,
   Text,
   TouchableOpacity,
   View,
   ImageBackground,
} from 'react-native'
import defaultProductImage from '../../assets/imgs/default-product-image.png'
import { useAppContext } from '../../context/app'
import { priceSort } from '../../utils'
import { width } from '../../utils/Scalaing'
import Modifiers from '../Modifiers'
import ServingSelect from '../ServingSelect'
import ServingTypes from '../ServingTypes'
import { stylesExpanded as styles } from './styles'

const Item = ({
   _id,
   navigation,
   data,
   tunnelItem,
   setProductOption,
   refId,
   refType,
   onModifiersSelected,
   onValidityChange,
}) => {
   const { visual } = useAppContext()

   const [types, setTypes] = useState([])
   const [typeSelected, setTypeSelected] = useState('mealKit')
   const [servingIndex, setServingIndex] = useState(undefined)
   const [selectedOption, setSelectedOption] = useState(undefined)
   const [isSelected, setisSelected] = useState(undefined)

   const generateTypes = srp => {
      const _types = new Set(srp.simpleRecipeProductOptions.map(op => op.type))
      setTypes([..._types])
   }

   React.useEffect(() => {
      if (isSelected !== undefined) {
         const component = data.customizableProductOptions[isSelected]
         if (component.simpleRecipeProduct) {
            generateTypes(component.simpleRecipeProduct)
            const option =
               component.simpleRecipeProduct.defaultSimpleRecipeProductOption ||
               component.simpleRecipeProduct.simpleRecipeProductOptions[0]
            setTypeSelected(option.type)
            const index = component.simpleRecipeProduct.simpleRecipeProductOptions
               .filter(op => op.type === option.type)
               .findIndex(op => op.id === option.id)
            setServingIndex(index)
         } else {
            const option =
               component.inventoryProduct.defaultInventoryProductOption ||
               component.inventoryProduct.inventoryProductOptions[0]
            const index = component.inventoryProduct.inventoryProductOptions.findIndex(
               op => op.id === option.id
            )
            setServingIndex(index)
         }
      }
   }, [isSelected])

   React.useEffect(() => {
      if (servingIndex !== undefined) {
         const customizableOption = data.customizableProductOptions[isSelected]
         if (customizableOption) {
            let option
            if (customizableOption.simpleRecipeProduct) {
               option = data.customizableProductOptions[
                  isSelected
               ].simpleRecipeProduct.simpleRecipeProductOptions.filter(
                  option => option.type === typeSelected
               )[servingIndex]
               if (!option) {
                  setServingIndex(0)
               }
               if (option && tunnelItem) {
                  setProductOption(
                     option,
                     customizableOption.simpleRecipeProduct,
                     'simpleRecipeProduct',
                     customizableOption.id
                  )
               }
            } else {
               option =
                  customizableOption.inventoryProduct.inventoryProductOptions[
                     servingIndex
                  ]
               if (option && tunnelItem) {
                  setProductOption(
                     option,
                     customizableOption.inventoryProduct,
                     'inventoryProduct',
                     customizableOption.id
                  )
               }
            }
            if (!option?.modifier && onValidityChange) {
               onValidityChange(true)
            }
            setSelectedOption(option)
         }
      }
   }, [typeSelected, servingIndex])

   return (
      <View key={_id} style={styles.container}>
         {data.customizableProductOptions.map((item, _key) => {
            let simpleRecipeProduct = item?.simpleRecipeProduct
            if (simpleRecipeProduct !== null) {
               return (
                  <>
                     <TouchableOpacity
                        key={_key}
                        onPress={() => {
                           setisSelected(_key)
                           setProductOption(
                              simpleRecipeProduct?.defaultSimpleRecipeProductOption ||
                                 simpleRecipeProduct.simpleRecipeProductOptions.sort(
                                    priceSort
                                 )[0],
                              simpleRecipeProduct,
                              'simpleRecipeProduct',
                              item.id
                           )
                        }}
                        style={[
                           styles.item_container,
                           {
                              flex: isSelected ? 8 : 7,
                              borderWidth: 1,
                              borderColor:
                                 isSelected == _key ? visual.color : '#fff',
                           },
                        ]}
                     >
                        {/* <SimpleProductItemCollapsed
                           navigation={navigation}
                           data={simpleRecipeProduct}
                           tunnelItem={tunnelItem}
                           showInfo={true}
                        /> */}
                        <View style={styles.item_container}>
                           <ImageBackground
                              source={{
                                 uri: tunnelItem
                                    ? simpleRecipeProduct?.assets?.images[0]
                                       ? simpleRecipeProduct?.assets?.images[0]
                                       : defaultProductImage
                                    : '#fff',
                              }}
                              style={[
                                 styles.item_container_one,
                                 {
                                    minHeight:
                                       width > 768 || tunnelItem ? 150 : 120,
                                    maxHeight:
                                       width > 768 || tunnelItem ? 150 : 120,
                                 },
                              ]}
                              blurRadius={10}
                           >
                              <Image
                                 source={{
                                    uri: simpleRecipeProduct?.assets?.images[0]
                                       ? simpleRecipeProduct?.assets?.images[0]
                                       : defaultProductImage,
                                 }}
                                 style={styles.item_image}
                              />
                           </ImageBackground>
                           <View style={[styles.item_container_two]}>
                              <View
                                 style={{
                                    flexDirection: 'row',
                                    minHeight: width > 768 ? 68 : 56,
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                 }}
                              >
                                 <Text
                                    style={[
                                       styles.item_title,
                                       {
                                          color: visual.color,
                                          fontSize: width > 768 ? 20 : 16,
                                       },
                                    ]}
                                    numberOfLines={tunnelItem ? 4 : 2}
                                    ellipsizeMode="tail"
                                 >{`${simpleRecipeProduct.name} `}</Text>
                                 <TouchableOpacity
                                    onPress={() => {
                                       navigation.navigate('recipe', {
                                          recipeId:
                                             simpleRecipeProduct.simpleRecipe
                                                .id,
                                          refId: refId || data.id,
                                          refType:
                                             refType || 'customizableProduct',
                                       })
                                    }}
                                 >
                                    <Text
                                       style={{
                                          color: visual.color,
                                          textDecorationLine: 'underline',
                                          fontSize: 16,
                                       }}
                                    >
                                       See Recipe
                                    </Text>
                                 </TouchableOpacity>
                              </View>
                              <View style={styles.item_three_lower}>
                                 <Text
                                    style={[
                                       styles.item_details,
                                       {
                                          fontWeight: 'normal',
                                          fontSize:
                                             width > 768 || tunnelItem
                                                ? 18
                                                : 14,
                                       },
                                    ]}
                                 >
                                    {simpleRecipeProduct?.simpleRecipe?.cuisine}
                                 </Text>
                                 <Text
                                    style={[
                                       styles.item_chef,
                                       {
                                          fontWeight: 'normal',
                                          fontSize: width > 768 ? 18 : 14,
                                       },
                                    ]}
                                 >
                                    {simpleRecipeProduct?.simpleRecipe?.author}
                                 </Text>
                              </View>
                           </View>
                        </View>
                     </TouchableOpacity>
                     {isSelected === _key && tunnelItem && (
                        <View style={{ paddingHorizontal: 20 }}>
                           <ServingTypes
                              types={types}
                              selected={typeSelected}
                              onSelect={setTypeSelected}
                           />
                           <Text style={styles.options_text}>
                              Available Servings:
                           </Text>
                           {simpleRecipeProduct?.simpleRecipeProductOptions
                              ?.filter(serving => serving.type === typeSelected)
                              .map((item_data, key) => {
                                 return (
                                    <ServingSelect
                                       key={key}
                                       index={key + 1}
                                       isSelected={
                                          servingIndex == key ? true : false
                                       }
                                       setServingIndex={index =>
                                          setServingIndex(index)
                                       }
                                       size={
                                          item_data.simpleRecipeYield.yield
                                             .serving
                                       }
                                       price={parseFloat(
                                          item_data.price[0].value
                                       )}
                                       discount={parseFloat(
                                          item_data.price[0].discount
                                       )}
                                       display={
                                          typeSelected === 'mealKit'
                                             ? 'Meal Kit'
                                             : 'Ready To Eat'
                                       }
                                       typeSelected={typeSelected}
                                       type={item_data?.type}
                                       customizableProduct
                                       name={simpleRecipeProduct?.name}
                                       simpleRecipeProductId={
                                          simpleRecipeProduct?.id
                                       }
                                       setSelectedOption={() =>
                                          setSelectedOption(item_data)
                                       }
                                       setProductOption={() =>
                                          setProductOption(
                                             item_data,
                                             simpleRecipeProduct,
                                             'simpleRecipeProduct',
                                             item.id
                                          )
                                       }
                                       id={item_data?.id}
                                    />
                                 )
                              })}
                           {selectedOption?.modifier && (
                              <Modifiers
                                 data={selectedOption.modifier.data}
                                 onModifiersSelected={onModifiersSelected}
                                 onValidityChange={onValidityChange}
                              />
                           )}
                        </View>
                     )}
                  </>
               )
            }
            if (item.inventoryProduct !== null) {
               let inventoryProduct = item.inventoryProduct
               return (
                  <>
                     <TouchableOpacity
                        key={_key}
                        onPress={() => {
                           setisSelected(_key)
                           setProductOption(
                              inventoryProduct?.defaultInventoryProductOption ||
                                 inventoryProduct.inventoryProductOptions.sort(
                                    priceSort
                                 )[0],
                              inventoryProduct,
                              'inventoryProduct',
                              item.id
                           )
                        }}
                        style={[
                           styles.item_container,
                           {
                              flex: isSelected ? 8 : 7,
                              borderWidth: 1,
                              borderColor:
                                 isSelected == _key ? visual.color : '#fff',
                           },
                        ]}
                     >
                        {/* <InventoryProductCollapsed
                           data={inventoryProduct}
                           tunnelItem={tunnelItem}
                           navigation={navigation}
                           showInfo={true}
                        /> */}
                        <ImageBackground
                           source={{
                              uri: tunnelItem
                                 ? inventoryProduct?.assets?.images[0]
                                    ? inventoryProduct?.assets?.images[0]
                                    : defaultProductImage
                                 : '#fff',
                           }}
                           style={[
                              styles.item_container_one,
                              {
                                 minHeight:
                                    width > 768 || tunnelItem ? 150 : 120,
                                 maxHeight:
                                    width > 768 || tunnelItem ? 150 : 120,
                              },
                           ]}
                           blurRadius={10}
                        >
                           <Image
                              source={{
                                 uri: inventoryProduct?.assets?.images[0]
                                    ? inventoryProduct?.assets?.images[0]
                                    : defaultProductImage,
                              }}
                              style={styles.item_image}
                           />
                        </ImageBackground>
                        <View style={[styles.item_container_two]}>
                           <View
                              style={{
                                 flexDirection: 'row',
                                 minHeight: width > 768 ? 68 : 56,
                                 alignItems: 'center',
                                 justifyContent: 'space-between',
                              }}
                           >
                              <Text
                                 style={[
                                    styles.item_title,
                                    {
                                       color: visual.color,
                                       fontSize: width > 768 ? 20 : 16,
                                    },
                                 ]}
                                 numberOfLines={2}
                                 ellipsizeMode="tail"
                              >{`${inventoryProduct.name} `}</Text>
                           </View>
                           <View style={styles.item_three_lower}>
                              {!tunnelItem && (
                                 <Text
                                    style={[
                                       styles.item_details,
                                       {
                                          fontWeight: 'normal',
                                          fontSize:
                                             width > 768 || tunnelItem
                                                ? 18
                                                : 14,
                                       },
                                    ]}
                                 >
                                    {
                                       inventoryProduct?.inventoryProductOptions.sort(
                                          priceSort
                                       )[0]?.label
                                    }
                                 </Text>
                              )}
                              <Text
                                 style={[
                                    styles.item_chef,
                                    {
                                       fontWeight: 'normal',
                                       fontSize: width > 768 ? 18 : 14,
                                       marginBottom: 16,
                                    },
                                 ]}
                              >
                                 {inventoryProduct?.sachetItem?.unitSize &&
                                    inventoryProduct?.sachetItem?.unitSize +
                                       ' ' +
                                       inventoryProduct?.sachetItem?.unit}
                                 {inventoryProduct?.supplierItem?.unitSize &&
                                    inventoryProduct?.supplierItem?.unitSize +
                                       ' ' +
                                       inventoryProduct?.supplierItem?.unit}
                              </Text>
                           </View>
                        </View>
                     </TouchableOpacity>
                     {isSelected == _key && tunnelItem && (
                        <View style={{ paddingHorizontal: 20 }}>
                           <Text
                              style={[styles.options_text, { marginTop: 16 }]}
                           >
                              Avaliable Options:
                           </Text>
                           {inventoryProduct?.inventoryProductOptions.map(
                              (item_data, key) => {
                                 return (
                                    <ServingSelect
                                       key={key}
                                       index={key + 1}
                                       isSelected={
                                          servingIndex == key ? true : false
                                       }
                                       setServingIndex={index =>
                                          setServingIndex(index)
                                       }
                                       size={item_data.label}
                                       price={parseFloat(
                                          item_data.price[0].value
                                       )}
                                       discount={parseFloat(
                                          item_data.price[0].discount
                                       )}
                                       setSelectedOption={() =>
                                          setSelectedOption(item_data)
                                       }
                                       setProductOption={() =>
                                          setProductOption(
                                             item_data,
                                             inventoryProduct,
                                             'inventoryProduct',
                                             item.id
                                          )
                                       }
                                       id={item_data.id}
                                    />
                                 )
                              }
                           )}
                           {selectedOption?.modifier && (
                              <Modifiers
                                 data={selectedOption.modifier.data}
                                 onModifiersSelected={onModifiersSelected}
                                 onValidityChange={onValidityChange}
                              />
                           )}
                        </View>
                     )}
                  </>
               )
            }
         })}
      </View>
   )
}

export default Item
