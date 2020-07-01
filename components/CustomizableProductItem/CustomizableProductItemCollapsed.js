import { Ionicons } from '@expo/vector-icons'
import React from 'react'
import { Text, TouchableOpacity, View, Image } from 'react-native'
import InventoryProductCollapsed from '../InventoryProductItem/InventoryProductItemCollapsed'
import SimpleProductItemCollapsed from '../SimpleProductItem/SimpleProductItemCollapsed'
import { stylesCollapsed as styles } from './styles'
import Carousel from 'react-native-banner-carousel'
import { useAppContext } from '../../context/app'
import { width } from '../../utils/Scalaing'

const CustomizableProductItemCollapsed = ({
   _id,
   setSelected,
   isLast,
   navigation,
   setExpanded,
   data,
   label,
   independantItem,
   numberOfOptions,
   tunnelItem,
   product,
}) => {
   const { visual } = useAppContext()

   const [optionImages, setOptionImages] = React.useState([])

   React.useEffect(() => {
      const images = product.customizableProductOptions.map(option => {
         if (option.inventoryProduct) {
            return (
               option.inventoryProduct.assets?.images[0] ||
               'https://via.placeholder.com/120'
            )
         } else {
            return (
               option.simpleRecipeProduct.assets?.images[0] ||
               'https://via.placeholder.com/120'
            )
         }
      })
      console.log(images)
      setOptionImages(images)
   }, [])

   return (
      <>
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
                     }}
                  >
                     <Image
                        style={{
                           flex: 1,
                           height: width > 768 ? 150 : 120,
                           width: width > 768 ? 150 : 120,
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
               {product.customizableProductOptions.length} options available
            </Text>
         </View>
      </>
   )
}

export default CustomizableProductItemCollapsed
