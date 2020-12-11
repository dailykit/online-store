const capitalizeString = str => {
   return str[0].toUpperCase() + str.slice(1)
}

const containsOptionId = (id, listedOptions) => {
   const index = listedOptions.findIndex(op => op.optionId === id)
   if (index === -1) {
      return false
   } else {
      return true
   }
}

export const resolvePrices = products => {
   let updatedProducts = []
   for (const product of products) {
      product.customizableProductOptions.map(customizableProductOption => {
         if (customizableProductOption.options?.length) {
            console.log('🧑 Product: ', product)
            let type = customizableProductOption.inventoryProduct
               ? 'inventoryProduct'
               : 'simpleRecipeProduct'
            const updatedProductOptions = customizableProductOption[type][
               `${type}Options`
            ]
               .filter(({ id }) =>
                  containsOptionId(id, customizableProductOption.options)
               )
               .map(op => {
                  const listedOption = customizableProductOption.options.find(
                     ({ optionId }) => optionId === op.id
                  )
                  if (product.price) {
                     return {
                        ...op,
                        price: [
                           {
                              rrule: '',
                              value: product.price.value,
                              discount: product.price.discount,
                           },
                        ],
                     }
                  } else {
                     if (
                        'price' in listedOption &&
                        'discount' in listedOption
                     ) {
                        const updatedOption = {
                           ...op,
                           price: [
                              {
                                 rrule: '',
                                 value: listedOption.price,
                                 discount: listedOption.discount,
                              },
                           ],
                        }
                        return updatedOption
                     } else {
                        return op
                     }
                  }
               })
            // overwriting(only if listed options are provided) default to be first element from available options because it may be the case that default option was not provided in listed options
            customizableProductOption[type][
               `default${capitalizeString(type)}Option`
            ] = updatedProductOptions[0]
            customizableProductOption[type][
               `${type}Options`
            ] = updatedProductOptions
            console.log('🐔 Product: ', product)
         }
      })
      updatedProducts = [...updatedProducts, product]
   }
   return updatedProducts
}
