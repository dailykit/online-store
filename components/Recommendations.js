import React from 'react'
import styled from 'styled-components/native'
import { CategoryBanner } from './CategoryBanner'
import Products from './Products'

const Recommendations = ({ navigation, recommendations }) => {
   const [data, setData] = React.useState([])

   React.useEffect(() => {
      if (recommendations) {
         const temp = recommendations.map(recommendation => {
            const inventoryProducts = recommendation.products.map(product => {
               if (product.type === 'inventoryProduct') {
                  return product.id
               }
            })
            const simpleRecipeProducts = recommendation.products.map(
               product => {
                  if (product.type === 'simpleRecipeProduct') {
                     return product.id
                  }
               }
            )
            return {
               name: recommendation.type,
               inventoryProducts,
               simpleRecipeProducts,
            }
         })
         setData(temp)
      }
   }, [])

   return (
      <Wrapper>
         <Heading> Recommendations </Heading>
         {data.map(category => (
            <Category>
               <CategoryBanner
                  navigation={navigation}
                  title={category.name}
                  showLink={false}
               />
               <Products
                  navigation={navigation}
                  category={category}
                  horizontal={true}
               />
            </Category>
         ))}
      </Wrapper>
   )
}

export default Recommendations

const Wrapper = styled.View``

const Heading = styled.Text`
   font-size: 1.2rem;
   color: #666;
   font-weight: bold;
`

const Category = styled.View``
