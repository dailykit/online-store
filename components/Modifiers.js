import React from 'react'
import CheckBox from './form/CheckBox'
import styled from 'styled-components/native'
import { useAppContext } from '../context/app'
import { useCartContext } from '../context/cart'

const Modifiers = ({ data, onModifiersSelected, onValidityChange }) => {
   const { visual } = useAppContext()
   const { modifiersAdded } = useCartContext()

   const [selected, setSelected] = React.useState([])
   let isValid = React.useRef(false)

   React.useEffect(() => {
      setSelected([])
   }, [modifiersAdded])

   const checkValidity = async () => {
      const requiredModifiers = data.categories.filter(
         category => category.isRequired && category.isActive
      )
      if (!requiredModifiers.length) {
         // can proceed without modifiers
         isValid.current = true
      } else {
         // needs some modifiers
         for (const category of requiredModifiers) {
            const requiredSelected = selected.filter(
               modifier => modifier.category === category.name
            )
            if (category.type === 'single' && requiredSelected.length === 1) {
               isValid.current = true
            } else if (
               category.type === 'multiple' &&
               requiredSelected.length >= category.limits.min
            ) {
               isValid.current = true
            } else {
               isValid.current = false
            }
         }
      }
   }

   const handleSelection = async (category, option) => {
      const index = selected.findIndex(
         modifier =>
            modifier.category === category.name && modifier.name === option.name
      )
      if (index === -1) {
         if (category.type === 'single') {
            const index = selected.findIndex(
               modifier => modifier.category === category.name
            )
            if (index === -1) {
               setSelected([
                  ...selected,
                  {
                     category: category.name,
                     name: option.name,
                     price: option.price,
                     discount: option.discount,
                     productId: option.productId,
                     productType: option.productType,
                     quantity: option.productQuantity,
                     image: option.image,
                     operationConfigId: option.operationConfig?.id,
                  },
               ])
            } else {
               const updatedModifiers = selected
               updatedModifiers[index] = {
                  category: category.name,
                  name: option.name,
                  price: option.price,
                  discount: option.discount,
                  productId: option.productId,
                  productType: option.productType,
                  quantity: option.productQuantity,
                  image: option.image,
                  operationConfigId: option.operationConfig?.id,
               }
               setSelected([...updatedModifiers])
            }
         } else {
            const selectedMultiple = selected.filter(
               modifier => modifier.category === category.name
            )
            if (
               category.limits.max &&
               selectedMultiple.length > category.limits.max
            ) {
               return
            } else {
               setSelected([
                  ...selected,
                  {
                     category: category.name,
                     name: option.name,
                     price: option.price,
                     discount: option.discount,
                     productId: option.productId,
                     productType: option.productType,
                     quantity: option.productQuantity,
                     image: option.image,
                     operationConfigId: option.operationConfig?.id,
                  },
               ])
            }
         }
      } else {
         const updatedModifiers = selected
         updatedModifiers.splice(index, 1)
         setSelected([...updatedModifiers])
      }
   }

   const renderCategoryCondition = category => {
      if (category.type === 'single') {
         return `Choose one`
      } else {
         if (category.limits.min === 0 && category.limits.max === null) {
            return `Choose as many as you like`
         }
         if (category.limits.min > 0 && category.limits.max === null) {
            return `Choose Min: ${category.limits.min}`
         }
         return `Choose Min: ${category.limits.min} Max: ${category.limits.max}`
      }
   }

   React.useEffect(() => {
      ;(async () => {
         await checkValidity()
         onValidityChange(isValid.current)
         // if (isValid.current) {
         onModifiersSelected(selected)
         // }
      })()
   }, [selected])

   React.useEffect(() => {
      setSelected([])
      console.log('Modifiers changed!')
   }, [data])

   return (
      <Wrapper>
         <Heading>Available Add-Ons:</Heading>
         {data.categories
            .filter(category => category.isActive)
            .map(category => (
               <Category>
                  <CategoryName>
                     {`${category.name}${category.isRequired ? '*' : ''}`}
                     <CategoryCondition>
                        {renderCategoryCondition(category)}
                     </CategoryCondition>
                  </CategoryName>
                  {category.options
                     .filter(option => option.isVisible)
                     .map(option => (
                        <CheckBox
                           type={
                              category.type === 'single' ? 'radio' : 'checkbox'
                           }
                           disabled={!option.isActive}
                           title={`${option.name}`}
                           image={option.image}
                           price={option.price}
                           discount={option.discount}
                           checked={Boolean(
                              selected.find(
                                 modifier =>
                                    modifier.category === category.name &&
                                    modifier.name === option.name
                              )
                           )}
                           color={visual.color}
                           onPress={() => handleSelection(category, option)}
                        />
                     ))}
               </Category>
            ))}
      </Wrapper>
   )
}

export default Modifiers

const Wrapper = styled.View`
   margin: 20px 0;
`

const Heading = styled.Text`
   color: #666;
   margin-bottom: 8px;
`

const Category = styled.View`
   margin-bottom: 12px;
`

const CategoryName = styled.Text`
   font-size: 14px;
   text-transform: uppercase;
   font-weight: 500;
   color: #666;
   margin-bottom: 8px;
`

const CategoryCondition = styled.Text`
   font-size: 12px;
   font-weight: normal;
   text-transform: capitalize;
   margin-left: 12px;
`
