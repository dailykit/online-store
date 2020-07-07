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
}) => {
   const [objToAdd, setobjToAdd] = useState({})

   const setProductOptionId = (id, price, typeSelected) => {
      let newItem = objToAdd
      newItem.product.option.id = id
      newItem.product.option.type = typeSelected
      newItem.product.price = price
      setobjToAdd(newItem)
      setcartItem(newItem)
   }

   React.useEffect(() => {
      if (product.defaultSimpleRecipeProductOption.id) {
         let objToPush = {
            product: {
               id: product.id,
               name: product.name,
               price: product.defaultSimpleRecipeProductOption?.price[0].value,
               image: product.assets.images[0],
               option: {
                  id: product.defaultSimpleRecipeProductOption?.id, // product option id
                  type: product.defaultSimpleRecipeProductOption?.type,
               },
               type: 'simpleRecipeProduct',
            },
         }
         if (!independantItem) {
            objToPush['name'] = name
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
