import React, { useEffect, useState } from 'react'
import { Text } from 'react-native'
import { priceSort, discountedPrice } from '../../utils'
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
   clickHandler,
}) => {
   const [expanded, setExpanded] = useState(false)
   const [numberOfOptions, setnumberOfOptions] = useState(0)
   const [objToAdd, setobjToAdd] = useState({})

   console.log('Product:', product)

   const getDiscount = (productPrice, optionPrice) => {
      const productDiscount =
         productPrice.value -
         discountedPrice({
            value: productPrice.value,
            discount: productPrice.discount,
         })
      const optionDiscount =
         optionPrice.value -
         discountedPrice({
            value: optionPrice.value,
            discount: optionPrice.discount,
         })
      const totalDiscount = productDiscount + optionDiscount
      const totalPrice = productPrice.value + optionPrice.value
      return {
         absolute: totalDiscount,
         percentage: (totalDiscount / totalPrice) * 100,
      }
   }

   const setProductOption = (
      option,
      slaveProduct,
      type,
      customizableOptionId
   ) => {
      let newItem = objToAdd
      newItem.option.id = option.id
      if (type === 'simpleRecipeProduct') {
         newItem.option.type = option.type
         newItem.option.serving = option.simpleRecipeYield.yield.serving
         if (option.simpleRecipeYield.yield.label) {
            newItem.option.serving = option.simpleRecipeYield.yield.label
         } else {
            delete newItem.option.label
         }
      } else {
         newItem.option.label = option.label
         delete newItem.option.type
         delete newItem.option.serving
      }
      newItem.price =
         (!!comboProductComponent ? 0 : product.price.value) +
         parseFloat(option.price[0].value)
      newItem.discount = !!comboProductComponent
         ? option.price[0].discount
         : getDiscount(product.price, option.price[0]).percentage
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
         if (product.customizableProductOptions[0]?.inventoryProduct) {
            default_product =
               product?.customizableProductOptions[0]?.inventoryProduct
            _default_option =
               default_product.defaultInventoryProductOption ||
               default_product.inventoryProductOptions.sort(priceSort)[0]
            _type = 'inventoryProduct'
         }
         if (product.customizableProductOptions[0]?.simpleRecipeProduct) {
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
            price:
               (!!comboProductComponent ? 0 : product.price.value) +
               parseFloat(_default_option?.price[0]?.value),
            discount: !!comboProductComponent
               ? _default_option?.price[0].discount
               : getDiscount(product.price, _default_option?.price[0])
                    .percentage,
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
            const discount = getDiscount(
               product.price,
               _default_option?.price[0]
            )
            setDiscount(discount.percentage)
            const value =
               product.price.value +
               parseFloat(_default_option?.price[0]?.value)
            const p = discountedPrice({ value, discount: discount.percentage })
            setPrice(p)
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
      return <Text>Bad Data / Empty customizableProduct product id</Text>
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
         product={product}
         clickHandler={clickHandler}
      />
   )
}

export default CustomizableProductItem
