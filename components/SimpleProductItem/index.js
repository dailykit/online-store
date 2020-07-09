import React, { useState } from 'react'
import SimpleProductItemCollapsed from './SimpleProductItemCollapsed'

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
}) => {
   const [objToAdd, setobjToAdd] = useState({})

   const setProductOptionId = (id, price, typeSelected) => {
      let newItem = objToAdd
      newItem.option.id = id
      newItem.option.type = typeSelected
      newItem.price = price
      setobjToAdd(newItem)
      setcartItem(newItem)
   }

   React.useEffect(() => {
      if (product.defaultSimpleRecipeProductOption.id) {
         let objToPush = {
            id: product.id,
            name: product.name,
            price: product.defaultSimpleRecipeProductOption?.price[0].value,
            image: product.assets.images[0],
            option: {
               id: product.defaultSimpleRecipeProductOption?.id, // product option id
               type: product.defaultSimpleRecipeProductOption?.type,
            },
            type: 'simpleRecipeProduct',
         }
         if (comboProductComponent) {
            objToPush.comboProductComponentId = comboProductComponent.id
            objToPush.comboProductComponentLabel = comboProductComponent.label
         }
         setobjToAdd(objToPush)
         if (!tunnelItem && independantItem) {
            setPrice(product.defaultSimpleRecipeProductOption?.price[0]?.value)
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
         setProductOptionId={setProductOptionId}
         setSelected={setSelected}
         isSelected={isSelected}
         refId={refId}
         refType={refType}
      />
   )
}

export default SimpleProductItem
