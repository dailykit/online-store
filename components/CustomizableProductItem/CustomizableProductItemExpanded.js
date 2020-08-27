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

   const [typeSelected, setTypeSelected] = useState('mealKit')
   const [servingIndex, setServingIndex] = useState(0)
   const [selectedOption, setSelectedOption] = useState(undefined)
   const [isSelected, setisSelected] = useState(undefined)

   React.useEffect(() => {
      const component = data.customizableProductOptions[isSelected]
      if (component?.simpleRecipeProduct) {
         setTypeSelected(
            component.simpleRecipeProduct.defaultSimpleRecipeProductOption.type
         )
         const index = component.simpleRecipeProduct.simpleRecipeProductOptions
            .filter(
               option =>
                  option.type ===
                  component.simpleRecipeProduct.defaultSimpleRecipeProductOption
                     .type
            )
            .findIndex(
               option =>
                  option.id ===
                  component.simpleRecipeProduct.defaultSimpleRecipeProductOption
                     .id
            )
         setServingIndex(index)
      }
   }, [isSelected])

   React.useEffect(() => {
      const customizableOption = data.customizableProductOptions[isSelected]
      let option
      if (customizableOption) {
         if (customizableOption.simpleRecipeProduct) {
            option = data.customizableProductOptions[
               isSelected
            ].simpleRecipeProduct.simpleRecipeProductOptions.filter(
               option => option.type === typeSelected
            )[servingIndex]
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
   }, [typeSelected, servingIndex])

   return (
      <View key={_id} style={styles.container}>
         {/* <View style={styles.item_three_upper}>
            <TouchableOpacity
               onPress={() => {
                  if (!tunnelItem) {
                     if (!independantItem) {
                        setExpanded(false)
                     } else {
                        setExpanded(false)
                     }
                  }
               }}
            >
               <Text style={styles.options_text}>
                  {numberOfOptions} options <Ionicons name="ios-arrow-up" />
               </Text>
            </TouchableOpacity>
         </View> */}

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
                                       navigation.navigate('Recipe', {
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
                           <View style={styles.type_container}>
                              <View style={styles.type_container_right}>
                                 <TouchableOpacity
                                    style={[
                                       styles.type_button,
                                       typeSelected === 'mealKit'
                                          ? styles.selected_type_conatiner
                                          : {},
                                    ]}
                                    onPress={() => setTypeSelected('mealKit')}
                                 >
                                    <Text style={styles.type_text}>
                                       Meal Kit
                                    </Text>
                                    {typeSelected === 'mealKit' && (
                                       <View
                                          style={[
                                             styles.done_container,
                                             { backgroundColor: visual.color },
                                          ]}
                                       >
                                          <MaterialIcons
                                             name="done"
                                             size={16}
                                             color="#fff"
                                          />
                                       </View>
                                    )}
                                 </TouchableOpacity>
                                 <TouchableOpacity
                                    onPress={() =>
                                       setTypeSelected('readyToEat')
                                    }
                                    style={[
                                       styles.type_button,
                                       typeSelected === 'readyToEat'
                                          ? styles.selected_type_conatiner
                                          : {},
                                    ]}
                                 >
                                    <Text style={styles.type_text}>
                                       Ready To Eat
                                    </Text>
                                    {typeSelected === 'readyToEat' && (
                                       <View
                                          style={[
                                             styles.done_container,
                                             { backgroundColor: visual.color },
                                          ]}
                                       >
                                          <MaterialIcons
                                             name="done"
                                             size={16}
                                             color="#fff"
                                          />
                                       </View>
                                    )}
                                 </TouchableOpacity>
                              </View>
                           </View>
                           <Text style={styles.options_text}>
                              Avaliable Servings:
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
