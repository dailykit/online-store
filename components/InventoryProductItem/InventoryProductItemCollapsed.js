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

const InventoryProductCollapsed = ({
   data: inventoryProduct,
   label,
   tunnelItem,
   setProductOption,
   navigation,
   showInfo,
   isSelected,
   refId,
   onModifiersSelected,
   onValidityChange,
   comboProductComponent,
}) => {
   const { visual } = useAppContext()

   const [servingIndex, setServingIndex] = useState(undefined)
   const [selectedOption, setSelectedOption] = useState(undefined)
   if (!inventoryProduct) {
      return <Text>Bad Data</Text>
   }

   React.useEffect(() => {
      const option =
         inventoryProduct.defaultInventoryProductOption ||
         inventoryProduct.inventoryProductOptions.sort(priceSort)[0]
      const index = inventoryProduct.inventoryProductOptions.findIndex(
         op => op.id === option.id
      )
      setServingIndex(index)
   }, [])

   React.useEffect(() => {
      if (servingIndex !== undefined) {
         const option = inventoryProduct.inventoryProductOptions[servingIndex]
         if (!option?.modifier && onValidityChange) {
            onValidityChange(true)
         }
         setSelectedOption(option)
         if (tunnelItem) {
            setProductOption(option)
         }
      }
   }, [servingIndex])

   if (servingIndex === undefined) return null

   return (
      <>
         {showInfo && (
            <TouchableOpacity
               onPress={() =>
                  refId !== -1 &&
                  navigation.navigate('ProductPage', {
                     id: inventoryProduct.id,
                     type: 'inventoryProduct',
                  })
               }
               style={[
                  styles.item_container,
                  {
                     borderBottomWidth: 1,
                  },
               ]}
            >
               <ImageBackground
                  source={{
                     uri: tunnelItem
                        ? inventoryProduct?.assets?.images[0]
                           ? imageUrl(inventoryProduct?.assets?.images[0], 400)
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
                  <Text style={styles.item_image_title}>{label}</Text>
                  <Image
                     source={{
                        uri: inventoryProduct?.assets?.images[0]
                           ? imageUrl(inventoryProduct?.assets?.images[0], 400)
                           : defaultProductImage,
                     }}
                     style={styles.item_image}
                  />
               </ImageBackground>
               <View
                  style={[
                     styles.item_container_two,
                     // {
                     //   paddingTop: 15,
                     //   paddingLeft: 10,
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
                                 fontSize: width > 768 || tunnelItem ? 18 : 14,
                              },
                           ]}
                           numberOfLines={1}
                           ellipsizeMode="tail"
                        >
                           {selectedOption?.label}
                        </Text>
                     )}
                     <Text
                        style={[
                           styles.item_chef,
                           {
                              fontWeight: 'normal',
                              fontSize: width > 768 ? 18 : 14,
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
         )}
         {tunnelItem && isSelected && (
            <View style={{ paddingHorizontal: 20 }}>
               <Text style={styles.something}>Available Options:</Text>
               {inventoryProduct.inventoryProductOptions.map(
                  (item_data, key) => {
                     return (
                        <ServingSelect
                           key={key}
                           index={key + 1}
                           isSelected={servingIndex == key ? true : false}
                           setServingIndex={index => setServingIndex(index)}
                           size={item_data.label}
                           price={parseFloat(item_data.price[0].value)}
                           discount={parseFloat(item_data.price[0].discount)}
                           setProductOption={() => setProductOption(item_data)}
                           setSelectedOption={() =>
                              setSelectedOption(item_data)
                           }
                           type="inventoryProduct"
                           showPlusIcon={!!comboProductComponent}
                        />
                     )
                  }
               )}
               {Boolean(selectedOption?.modifier) && (
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

export default InventoryProductCollapsed
