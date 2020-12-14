import { Feather } from '@expo/vector-icons'
import React from 'react'
import { CURRENCY } from 'react-native-dotenv'
import styled, { css } from 'styled-components/native'
import { useAppContext } from '../context/app'
import { discountedPrice } from '../utils'
// 12

const ServingSelect = ({
   index,
   isSelected,
   setServingIndex,
   size,
   price,
   discount,
   setProductOption,
   setSelectedOption,
   type,
   showPlusIcon,
}) => {
   const { visual } = useAppContext()

   console.log({ type })

   return (
      <Wrapper
         onPress={() => {
            setServingIndex(index - 1)
            setSelectedOption()
            setProductOption()
         }}
         active={isSelected}
         color={visual.color}
      >
         <Container>
            {Boolean(type === 'simpleRecipeProduct') && (
               <Feather size={14} name="user" />
            )}
            <ContentText serving>{size}</ContentText>
         </Container>
         <Container>
            {Boolean(discount) ? (
               <>
                  <ContentText discount color={visual.color}>
                     {discount}% off
                  </ContentText>
                  <ContentText strike>
                     {new Intl.NumberFormat('en-US', {
                        style: 'currency',
                        currency: CURRENCY,
                     }).format(price.toFixed(2))}
                  </ContentText>
                  <ContentText>
                     {showPlusIcon ? '+' : ''}
                     {new Intl.NumberFormat('en-US', {
                        style: 'currency',
                        currency: CURRENCY,
                     }).format(
                        discountedPrice({ value: price, discount }).toFixed(2)
                     )}
                  </ContentText>
               </>
            ) : (
               <ContentText>
                  {showPlusIcon ? '+' : ''}
                  {new Intl.NumberFormat('en-US', {
                     style: 'currency',
                     currency: CURRENCY,
                  }).format(price.toFixed(2))}
               </ContentText>
            )}
            <Feather
               name="check-circle"
               size={16}
               style={{ marginLeft: 20 }}
               color={isSelected ? visual.color : 'transparent'}
            />
         </Container>
      </Wrapper>
   )
}

export default ServingSelect

const Wrapper = styled.TouchableOpacity`
   height: 48px;
   border: 1px solid ${props => (props.active ? props.color : '#eae8e8')};
   padding: 0 12px;
   align-items: center;
   justify-content: space-between;
   flex-direction: row;
   margin-bottom: 12px;
`

const Container = styled.View`
   height: inherit;
   align-items: center;
   flex-direction: row;
`

const ContentText = styled.Text`
   margin-left: 16px;
   ${props =>
      props.serving &&
      css`
         font-weight: bold;
      `}
   ${props =>
      props.discount &&
      css`
         padding: 2px;
         font-size: 12px;
         font-style: italic;
         color: #fff;
         background: ${props.color};
      `}
   ${props =>
      props.strike &&
      css`
         text-decoration: line-through;
      `}
`
