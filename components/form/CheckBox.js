import React from 'react'
import styled from 'styled-components/native'
import { Feather } from '@expo/vector-icons'

const CheckBox = ({ color, checked, image, title, price, onPress }) => {
   return (
      <Wrapper onPress={onPress}>
         <Feather
            name={checked ? 'check-square' : 'square'}
            size={20}
            color={checked ? color : '#666'}
            style={{ marginRight: 16 }}
         />
         {Boolean(image) && <Img source={{ uri: image }} />}
         <Title>{title}</Title>
         <Price>{price}</Price>
      </Wrapper>
   )
}

export default CheckBox

const Wrapper = styled.TouchableOpacity`
   flex-direction: row;
   align-items: center;
   padding: 4px 8px;
   margin-bottom: 8px;
`

const Img = styled.Image`
   width: 28px;
   height: 28px;
   object-fit: cover;
   margin-right: 8px;
   border-radius: 2px;
`

const Title = styled.Text`
   margin-right: 8px;
   color: #43484d;
   font-weight: bold;
`

const Price = styled.Text`
   color: #43484d;
   font-size: 14px;
`
