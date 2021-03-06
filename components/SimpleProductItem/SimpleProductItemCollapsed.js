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
import { imageUrl, priceSort } from '../../utils'
import { width } from '../../utils/Scaling'
import Modifiers from '../Modifiers'
import ServingSelect from '../ServingSelect'
import { styles } from './styles'
import ServingTypes from '../ServingTypes'

const SimpleProductItemCollapsed = ({
   navigation,
   data: simpleRecipeProduct,
   tunnelItem,
   setProductOption,
   isSelected,
   showInfo,
   refId,
   refType,
   onModifiersSelected,
   onValidityChange,
   comboProductComponent,
}) => {
   const { visual } = useAppContext()
   const [types, setTypes] = useState([])
   const [typeSelected, setTypeSelected] = useState('mealKit')
   const [selectedOption, setSelectedOption] = useState(undefined)
   const [servingIndex, setServingIndex] = useState(undefined)

   const generateTypes = srp => {
      const _types = new Set(srp.simpleRecipeProductOptions.map(op => op.type))
      setTypes([..._types])
   }

   React.useEffect(() => {
      generateTypes(simpleRecipeProduct)
      const op =
         simpleRecipeProduct.defaultSimpleRecipeProductOption ||
         simpleRecipeProduct.simpleRecipeProductOptions.sort(priceSort)[0]
      setTypeSelected(op.type)
      const index = simpleRecipeProduct.simpleRecipeProductOptions
         .filter(option => option.type === op.type)
         .findIndex(option => option.id === op.id)
      setServingIndex(index)
   }, [])

   React.useEffect(() => {
      if (servingIndex !== undefined) {
         let option = simpleRecipeProduct.simpleRecipeProductOptions.filter(
            option => option.type === typeSelected
         )[servingIndex]
         if (!option) {
            setServingIndex(0)
         }
         if (!option?.modifier && onValidityChange) {
            onValidityChange(true)
         }
         setSelectedOption(option)
         if (option && tunnelItem) {
            setProductOption(option)
         }
      }
   }, [typeSelected, servingIndex])

   const beautifyType = type => {
      return type === 'mealKit' ? 'Meal Kit' : 'Ready to Eat'
   }

   const renderServing = serving => {
      if (serving) {
         if (serving.label) {
            return `${serving.label} | ${beautifyType(selectedOption?.type)}`
         } else {
            return `Serves ${serving.serving} | ${beautifyType(
               selectedOption?.type
            )}`
         }
      }
   }

   const getServingFontSize = () => {
      if (tunnelItem) {
         return width > 768 ? 18 : 14
      } else {
         return width > 768 ? 16 : 12
      }
   }

   if (servingIndex === undefined) return null

   return (
      <>
         {showInfo && (
            <TouchableOpacity
               onPress={() => {
                  navigation.navigate('recipe', {
                     recipeId: simpleRecipeProduct.simpleRecipe.id,
                     refId: refId || simpleRecipeProduct.id,
                     refType: refType || 'simpleRecipeProduct',
                  })
               }}
               style={[
                  styles.item_container,
                  {
                     borderBottomWidth: 1,
                  },
               ]}
            >
               <View style={styles.item_container}>
                  <ImageBackground
                     source={{
                        uri: tunnelItem
                           ? simpleRecipeProduct?.assets?.images[0]
                              ? imageUrl(
                                   simpleRecipeProduct?.assets?.images[0],
                                   400
                                )
                              : defaultProductImage
                           : '#fff',
                     }}
                     style={[
                        styles.item_container_one,
                        {
                           minHeight: width > 768 || tunnelItem ? 150 : 120,
                           maxHeight: width > 768 || tunnelItem ? 150 : 120,
                        },
                     ]}
                     blurRadius={10}
                  >
                     <Image
                        source={{
                           uri: simpleRecipeProduct?.assets?.images[0]
                              ? imageUrl(
                                   simpleRecipeProduct?.assets?.images[0],
                                   400
                                )
                              : defaultProductImage,
                        }}
                        style={[
                           styles.item_image,
                           { resizeMode: tunnelItem ? 'contain' : 'cover' },
                        ]}
                     />
                  </ImageBackground>
                  <View
                     style={[
                        styles.item_container_two,
                        // {
                        //    paddingTop: 15,
                        //    paddingLeft: 10,
                        // },
                     ]}
                  >
                     <View
                        style={{
                           flexDirection: 'row',
                           alignItems: 'center',
                           minHeight: width > 768 ? 60 : 56,
                           alignItems: 'flex-start',
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
                     </View>
                     {Boolean(simpleRecipeProduct.additionalText) && (
                        <Text
                           style={[
                              styles.item_title,
                              {
                                 fontSize: width > 768 ? 13 : 12,
                                 lineHeight: 24,
                                 color: '#686b78',
                              },
                           ]}
                           numberOfLines={2}
                           ellipsizeMode="tail"
                        >
                           {simpleRecipeProduct.additionalText}
                        </Text>
                     )}
                     <View style={styles.item_three_lower}>
                        {Boolean(tunnelItem) && (
                           <Text
                              style={[
                                 styles.item_details,
                                 {
                                    fontWeight: 'normal',
                                    fontSize:
                                       width > 768 || tunnelItem ? 18 : 14,
                                 },
                              ]}
                              numberOfLines={1}
                              ellipsizeMode="tail"
                           >
                              {simpleRecipeProduct.simpleRecipe.cuisine}
                           </Text>
                        )}
                        <Text
                           style={[
                              styles.item_chef,
                              {
                                 fontWeight: 'normal',
                                 fontSize: getServingFontSize(),
                              },
                           ]}
                        >
                           {tunnelItem
                              ? simpleRecipeProduct.simpleRecipe.author
                              : renderServing(
                                   selectedOption?.simpleRecipeYield?.yield
                                )}
                        </Text>
                     </View>
                  </View>
               </View>
            </TouchableOpacity>
         )}
         {tunnelItem && isSelected && (
            <View style={{ paddingHorizontal: 20 }}>
               <ServingTypes
                  types={types}
                  selected={typeSelected}
                  onSelect={setTypeSelected}
               />
               <Text style={styles.options_text}>Available Servings:</Text>
               {simpleRecipeProduct.simpleRecipeProductOptions
                  .filter(serving => serving.type === typeSelected)
                  .map((item_data, key) => {
                     return (
                        <ServingSelect
                           key={key}
                           index={key + 1}
                           isSelected={servingIndex == key ? true : false}
                           setServingIndex={index => setServingIndex(index)}
                           size={
                              item_data.simpleRecipeYield.yield.label ||
                              item_data.simpleRecipeYield.yield.serving
                           }
                           price={parseFloat(item_data.price[0].value)}
                           discount={parseFloat(item_data.price[0].discount)}
                           setProductOption={() => setProductOption(item_data)}
                           setSelectedOption={() =>
                              setSelectedOption(item_data)
                           }
                           type="simpleRecipeProduct"
                           showPlusIcon={!!comboProductComponent}
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

export default SimpleProductItemCollapsed
