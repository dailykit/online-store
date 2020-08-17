import React, { useEffect, useState } from 'react'
import { Text } from 'react-native'
import { priceSort } from '../../utils'
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
   setDiscount,
   product,
   refId,
   refType,
   comboProductComponent,
   onModifiersValidityChange,
}) => {
   const [expanded, setExpanded] = useState(false)
   const [numberOfOptions, setnumberOfOptions] = useState(0)
   const [objToAdd, setobjToAdd] = useState({})

   const setProductOption = (
      option,
      slaveProduct,
      type,
      customizableOptionId
   ) => {
      console.log(option, product, type, customizableOptionId)
      let newItem = objToAdd
      newItem.option.id = option.id
      if (type === 'simpleRecipeProduct') {
         newItem.option.type = option.type
         newItem.option.serving = option.simpleRecipeYield.yield.serving
         delete newItem.option.label
      } else {
         newItem.option.label = option.label
         delete newItem.option.type
         delete newItem.option.serving
      }
      newItem.price = parseFloat(option.price[0].value)
      newItem.discount = parseFloat(option.price[0].discount)
      newItem.id = slaveProduct.id
      newItem.customizableProductOptionId = customizableOptionId
      newItem.name = `[${product.name}] ${slaveProduct.name}`
      newItem.type = type
      const cusOption = product.customizableProductOptions.find(
         option => option[type]
      )
      newItem.image = cusOption[type].assets?.images[0]
      setobjToAdd({ ...newItem, modifiers: [] })
      setcartItem({ ...newItem, modifiers: [] })
   }

   const modifiersHandler = modifiers => {
      setobjToAdd({ ...objToAdd, modifiers })
      setcartItem({ ...objToAdd, modifiers })
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
            _default_option =
               default_product.defaultInventoryProductOption ||
               default_product.inventoryProductOptions.sort(priceSort)[0]
            _type = 'inventoryProduct'
         }
         if (
            product.customizableProductOptions[0]?.simpleRecipeProduct !== null
         ) {
            default_product =
               product?.customizableProductOptions[0]?.simpleRecipeProduct
            _default_option =
               default_product.defaultSimpleRecipeProductOption ||
               default_product.simpleRecipeProductOptions.sort(priceSort)[0]
            _type = 'simpleRecipeProduct'
         }
         let objToAddToCart = {
            customizableProductId: product.id,
            customizableProductOptionId: default_product?.id,
            id: default_product.id,
            name: default_product.name,
            price: parseFloat(_default_option?.price[0]?.value),
            discount: parseFloat(_default_option?.price[0].discount),
            image: default_product.assets?.images[0],
            option: {
               id: _default_option?.id, // product option id
               type: _default_option?.type,
            },
            modifiers: [],
            type: _type,
         }
         if (comboProductComponent) {
            objToAddToCart.comboProductComponentId = comboProductComponent.id
            objToAddToCart.comboProductComponentLabel =
               comboProductComponent.label
         }
         setobjToAdd(objToAddToCart)
         if (!tunnelItem && independantItem) {
            setPrice(_default_option?.price[0].value)
            if (_default_option.price[0].discount)
               setDiscount(parseFloat(_default_option.price[0].discount))
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
            setProductOption={setProductOption}
            refId={refId}
            refType={refType}
            onModifiersSelected={modifiersHandler}
            onValidityChange={onModifiersValidityChange}
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
