import React from 'react'
import { Image, Text, View } from 'react-native'
import Carousel from 'react-native-banner-carousel'
import defaultProductImage from '../../assets/imgs/default-product-image.png'
import { useAppContext } from '../../context/app'
import { width } from '../../utils/Scaling'

const CustomizableProductItemCollapsed = ({ product }) => {
   const { visual } = useAppContext()

   const [optionImages, setOptionImages] = React.useState([])

   React.useEffect(() => {
      const images = product.customizableProductOptions.map(option => {
         if (option.inventoryProduct) {
            return (
               option.inventoryProduct?.assets?.images[0] || defaultProductImage
            )
         } else {
            return (
               option.simpleRecipeProduct?.assets?.images[0] ||
               defaultProductImage
            )
         }
      })
      setOptionImages(images)
   }, [])

   return (
      <>
         <View>
            {product.assets?.images[0] ? (
               <Image
                  style={{
                     flex: 1,
                     maxHeight: width > 768 ? 150 : 120,
                     minHeight: width > 768 ? 150 : 120,
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
                           // paddingTop: 20,
                           width: width > 768 ? 150 : 120,
                        }}
                     >
                        <Image
                           style={{
                              flex: 1,
                              minHeight: width > 768 ? 150 : 120,
                              maxHeight: width > 768 ? 150 : 120,
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
               {product.isPopupAllowed
                  ? `${product.customizableProductOptions.length} options available`
                  : product.defaultCartItem.name.split(']')[1]}
            </Text>
         </View>
      </>
   )
}

export default CustomizableProductItemCollapsed
