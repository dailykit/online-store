import React from 'react'
import styled from 'styled-components/native'

const Modifiers = ({ data }) => {
   return (
      <Wrapper>
         <Heading>Available Modifiers:</Heading>
         {data.categories.map(category => (
            <Category>
               <CategoryName>{category.name}</CategoryName>
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
