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
   refId,
   refType,
   comboProductComponent,
}) => {
   const [expanded, setExpanded] = useState(false)
   const [numberOfOptions, setnumberOfOptions] = useState(0)
   const [objToAdd, setobjToAdd] = useState({})

   const setproductOptionId = (
      id,
      price,
      componentProductId,
      name,
      type,
      typeSelected,
      customizableProductOptionId
   ) => {
      console.log(
         'Adding Customizable: ',
         componentProductId,
         name,
         type,
         customizableProductOptionId
      )
      let newItem = objToAdd
      newItem.option.id = id
      if (typeSelected) {
         newItem.option.type = typeSelected
      }
      newItem.price = price
      newItem.id = componentProductId
      if (customizableProductOptionId) {
         newItem.customizableProductOptionId = customizableProductOptionId
      }
      newItem.name = `[${product.name}] ${name}`
      if (type) {
         newItem.type = type
         const option = product.customizableProductOptions.find(
            option => option[type]
         )
         newItem.image = option[type].assets?.images[0]
      }
      if (newItem.type === 'inventoryProduct') {
         delete newItem.option.type
      }
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
            id: default_product.id,
            name: default_product.name,
            price: _default_option?.price[0]?.value,
            image: default_product.assets?.images[0],
            option: {
               id: _default_option?.id, // product option id
               type: _default_option?.type,
            },
            type: _type,
         }
         if (comboProductComponent) {
            objToAddToCart.comboProductComponentId = comboProductComponent.id
            objToAddToCart.comboProductComponentLabel =
               comboProductComponent.label
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
            data={customizableProduct}
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
            refId={refId}
            refType={refType}
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
