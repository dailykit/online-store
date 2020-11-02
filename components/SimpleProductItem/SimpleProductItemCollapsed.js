import { Feather, MaterialIcons } from '@expo/vector-icons'
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
import { styles } from './styles'
import styled from 'styled-components/native'

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
}) => {
   const { visual } = useAppContext()
   const [types, setTypes] = useState([])
   const [typeSelected, setTypeSelected] = useState('mealKit')
   const [selectedOption, setSelectedOption] = useState(undefined)
   const [servingIndex, setServingIndex] = useState(undefined)

   const generateTypes = () => {
      const _types = new Set(
         simpleRecipeProduct.simpleRecipeProductOptions.map(op => op.type)
      )
      console.log('generateTypes -> _types', _types)
      setTypes([..._types])
   }

   React.useEffect(() => {
      generateTypes()
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

   if (servingIndex === undefined) return null

   return (
      <>
         {showInfo && (
            <TouchableOpacity
               onPress={() => {
                  navigation.navigate('Recipe', {
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
                              ? simpleRecipeProduct?.assets?.images[0]
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
                              ? simpleRecipeProduct?.assets?.images[0]
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
                           minHeight: width > 768 ? 68 : 56,
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
                     <View style={styles.item_three_lower}>
                        <Text
                           style={[
                              styles.item_details,
                              {
                                 fontWeight: 'normal',
                                 fontSize: width > 768 || tunnelItem ? 18 : 14,
                              },
                           ]}
                           numberOfLines={1}
                           ellipsizeMode="tail"
                        >
                           {tunnelItem
                              ? simpleRecipeProduct.simpleRecipe.cuisine
                              : selectedOption?.type === 'mealKit'
                              ? 'Meal Kit'
                              : 'Ready to Eat'}
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
                           {tunnelItem
                              ? simpleRecipeProduct.simpleRecipe.author
                              : 'x' +
                                selectedOption?.simpleRecipeYield?.yield
                                   ?.serving}
                        </Text>
                     </View>
                  </View>
               </View>
            </TouchableOpacity>
         )}
         {tunnelItem && isSelected && (
            <View style={{ paddingHorizontal: 20 }}>
               <TypeWrapper>
                  {types.map(type => (
                     <Type
                        active={typeSelected === type}
                        onPress={() => setTypeSelected(type)}
                     >
                        <TypeText>
                           {type === 'mealKit' ? 'Meal Kit' : 'Ready to Eat'}
                        </TypeText>
                        {Boolean(typeSelected === type) && (
                           <Feather
                              name="check-circle"
                              style={{ marginLeft: 8 }}
                              size={18}
                              color={visual.color}
                           />
                        )}
                     </Type>
                  ))}
               </TypeWrapper>
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
                           size={item_data.simpleRecipeYield.yield.serving}
                           price={parseFloat(item_data.price[0].value)}
                           discount={parseFloat(item_data.price[0].discount)}
                           display={
                              typeSelected === 'mealKit'
                                 ? 'Meal Kit'
                                 : 'Ready To Eat'
                           }
                           type={item_data.type}
                           typeSelected={typeSelected}
                           setProductOption={() => setProductOption(item_data)}
                           id={item_data.id}
                           setSelectedOption={() =>
                              setSelectedOption(item_data)
                           }
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

const TypeWrapper = styled.View`
   flex-direction: row;
   height: 48px;
   margin-bottom: 16px;
`

const Type = styled.TouchableOpacity`
   height: inherit;
   min-width: 96px;
   background: ${props => (props.active ? '#fff' : '#eae8e8')};
   flex-direction: row;
   align-items: center;
   border: 1px solid #eae8e8;
   justify-content: center;
`

const TypeText = styled.Text`
   color: #000;
`
