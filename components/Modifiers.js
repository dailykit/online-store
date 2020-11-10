import React from 'react'
import CheckBox from './form/CheckBox'
import styled from 'styled-components/native'
import { useAppContext } from '../context/app'

const Modifiers = ({ data, onModifiersSelected, onValidityChange }) => {
   const { visual } = useAppContext()

   const [selected, setSelected] = React.useState([])
   let isValid = React.useRef(false)

   const checkValidity = async () => {
      const requiredModifers = data.categories.filter(
         category => category.isRequired && category.isActive
      )
      if (!requiredModifers.length) {
         // can proceed without modifers
         isValid.current = true
      } else {
         // needs some modifers
         for (const category of requiredModifers) {
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
                  },
               ])
            } else {
               const updatedModifers = selected
               updatedModifers[index] = {
                  category: category.name,
                  name: option.name,
                  price: option.price,
                  discount: option.discount,
                  productId: option.productId,
                  productType: option.productType,
                  quantity: option.productQuantity,
                  image: option.image,
               }
               setSelected([...updatedModifers])
            }
         } else {
            const selectedMutiple = selected.filter(
               modifier => modifier.category === category.name
            )
            if (selectedMutiple.length < category.limits.max) {
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
                  },
               ])
            } else {
               return
            }
         }
      } else {
         const updatedModifers = selected
         updatedModifers.splice(index, 1)
         setSelected([...updatedModifers])
      }
   }

   React.useEffect(() => {
      ;(async () => {
         await checkValidity()
         console.log('isValid', isValid.current)
         onValidityChange(isValid.current)
         if (isValid.current) {
            console.log('Selected: ', selected)
            onModifiersSelected(selected)
         }
      })()
   }, [selected])

   React.useEffect(() => {
      setSelected([])
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
                        {category.type === 'single'
                           ? `Choose one`
                           : `Choose Min: ${category.limits.min} Max: ${category.limits.max}`}
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
