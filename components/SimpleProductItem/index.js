import React, { useState } from 'react'
import SimpleProductItemCollapsed from './SimpleProductItemCollapsed'
import { priceSort, discountedPrice } from '../../utils'

const SimpleProductItem = ({
   _id,
   openModal,
   navigation,
   setPrice,
   independantItem,
   setcartItem,
   setcardData,
   tunnelItem,
   setSelected,
   isSelected,
   name,
   label,
   product,
   showInfo,
   refId,
   refType,
   comboProductComponent,
   onModifiersValidityChange,
}) => {
   const [objToAdd, setobjToAdd] = useState({})

   const setProductOption = option => {
      setobjToAdd({
         ...objToAdd,
         option: {
            id: option.id,
            type: option.type,
            serving: option.simpleRecipeYield.yield.serving,
         },
         price: parseFloat(option.price[0].value),
         discount: option.price[0].discount,
         modifiers: [],
      })
      setcartItem({
         ...objToAdd,
         option: {
            id: option.id,
            type: option.type,
            serving: option.simpleRecipeYield.yield.serving,
         },
         price: parseFloat(option.price[0].value),
         discount: option.price[0].discount,
         modifiers: [],
      })
   }

   const modifiersHandler = modifiers => {
      setobjToAdd({ ...objToAdd, modifiers })
      setcartItem({ ...objToAdd, modifiers })
   }

   React.useEffect(() => {
      if (product) {
         const option =
            product.defaultSimpleRecipeProductOption ||
            product.simpleRecipeProductOptions.sort(priceSort)[0]
         let objToPush = {
            id: product.id,
            name: product.name,
            price: option?.price[0].value,
            discount: option.price[0].discount,
            image: product.assets?.images[0],
            option: {
               id: option?.id, // product option id
               type: option?.type,
               serving: option?.simpleRecipeYield.yield.serving,
            },
            modifiers: [],
            type: 'simpleRecipeProduct',
         }
         if (comboProductComponent) {
            objToPush.comboProductComponentId = comboProductComponent.id
            objToPush.comboProductComponentLabel = comboProductComponent.label
         }
         setobjToAdd(objToPush)
         if (!tunnelItem && independantItem) {
            setPrice(discountedPrice(option?.price[0]))
            setcardData(product)
         }
         if (tunnelItem && isSelected) {
            setcartItem(objToPush)
         }
         if (tunnelItem && independantItem) {
            setcartItem(objToPush)
         }
      }
   }, [])

   return (
      <SimpleProductItemCollapsed
         showInfo={showInfo}
         _id={_id}
         data={product}
         openModal={openModal}
         navigation={navigation}
         label={label}
         tunnelItem={tunnelItem}
         setProductOption={setProductOption}
         setSelected={setSelected}
         isSelected={isSelected}
         refId={refId}
         refType={refType}
         onModifersSelected={modifiersHandler}
         onValidityChange={onModifiersValidityChange}
      />
   )
}

export default SimpleProductItem
