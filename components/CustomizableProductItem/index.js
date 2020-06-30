import React, { useEffect, useState } from 'react'
import { Text } from 'react-native'
import CustomizableProductItemCollapsed from './CustomizableProductItemCollapsed'
import CustomizableProductItemExpanded from './CustomizableProductItemExpanded'

const CustomizableProductItem = ({
   isSelected,
   _id,
   setSelected,
   isLast,
   openModal,
   navigation,
   independantItem,
   tunnelItem,
   setcardData,
   setcartItem,
   setPrice,
   name,
   product,
}) => {
   const [expanded, setExpanded] = useState(false)
   const [numberOfOptions, setnumberOfOptions] = useState(0)
   const [objToAdd, setobjToAdd] = useState({})

   const setproductOptionId = (id, price, simpleRecipeProductId, name) => {
      let newItem = objToAdd
      newItem.product.option.id = id
      newItem.product.price = price
      newItem.product.id = simpleRecipeProductId
      newItem.product.name = name
      setobjToAdd(newItem)
      setcartItem(newItem)
   }

   useEffect(() => {
      if (tunnelItem && isSelected) {
         setcartItem(objToAdd)
      }
   }, [isSelected])

   useEffect(() => {
      if (product.customizableProductOptions[0]) {
         let default_product
         let _default_option
         let _type
         if (product.customizableProductOptions[0]?.inventoryProduct !== null) {
            default_product =
               product?.customizableProductOptions[0]?.inventoryProduct
            _default_option = default_product.inventoryProductOptions[0]
            _type = 'inventoryProduct'
         }
         if (
            product.customizableProductOptions[0]?.simpleRecipeProduct !== null
         ) {
            default_product =
               product?.customizableProductOptions[0]?.simpleRecipeProduct
            _default_option = default_product.simpleRecipeProductOptions[0]
            _type = 'simpleRecipeProduct'
         }
         let objToAddToCart = {
            customizableProductId: product.id,
            customizableProductOptionId: default_product?.id,
            product: {
               id: default_product.id,
               name: default_product.name,
               price: _default_option?.price[0]?.value,
               option: {
                  id: _default_option?.id, // product option id
                  type: _default_option?.type,
               },
               type: _type,
            },
         }
         if (!independantItem) {
            objToAddToCart['name'] = name
         }
         setobjToAdd(objToAddToCart)
         if (!tunnelItem && independantItem) {
            setPrice(_default_option?.price[0]?.value)
            setcardData(product)
         }
         if (tunnelItem && isSelected) {
            setcartItem(objToAddToCart)
         }
         if (tunnelItem && independantItem) {
            setcartItem(objToAddToCart)
         }
      }
      setnumberOfOptions(product.customizableProductOptions?.length)
   }, [])

   const customizableProduct = product
   let default_first_product =
      customizableProduct !== null
         ? customizableProduct?.customizableProductOptions[0]
         : null
   if (!customizableProduct) {
      return <Text>Bad Data / Empty customizableProduct product id {id}</Text>
   }
   if (
      (isSelected && expanded) ||
      (tunnelItem && isSelected) ||
      (independantItem && expanded)
   ) {
      return (
         <CustomizableProductItemExpanded
            isSelected={isSelected}
            _id={_id}
            data={customizableProduct.customizableProductOptions}
            setSelected={setSelected}
            isLast={isLast}
            openModal={openModal}
            navigation={navigation}
            setExpanded={setExpanded}
            label={independantItem ? '' : customizableProduct.label}
            independantItem={independantItem ? true : false}
            numberOfOptions={numberOfOptions}
            tunnelItem={tunnelItem && isSelected}
            setproductOptionId={setproductOptionId}
         />
      )
   }
   return (
      <CustomizableProductItemCollapsed
         isSelected={isSelected}
         _id={_id}
         data={default_first_product}
         setSelected={setSelected}
         isLast={isLast}
         openModal={openModal}
         navigation={navigation}
         setExpanded={setExpanded}
         label={''}
         independantItem={independantItem ? true : false}
         numberOfOptions={numberOfOptions}
         tunnelItem={tunnelItem}
         product={product}
      />
   )
}

export default CustomizableProductItem
