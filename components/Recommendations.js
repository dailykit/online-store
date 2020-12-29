import React from 'react'
import styled from 'styled-components/native'
import { CategoryBanner } from './CategoryBanner'
import Products from './Products'

const Recommendations = ({ navigation, recommendations }) => {
   const [data, setData] = React.useState([])

   React.useEffect(() => {
      if (recommendations) {
         const temp = recommendations.map(recommendation => {
            const inventoryProducts = []
            const simpleRecipeProducts = []
            recommendation.products.forEach(product => {
               if (product.type === 'inventoryProduct') {
                  inventoryProducts.push(product.id)
               } else {
                  simpleRecipeProducts.push(product.id)
               }
            })
            return {
               name: recommendation.type,
               inventoryProducts,
               simpleRecipeProducts,
            }
         })
         setData([...temp])
      }
   }, [recommendations])

   return (
      <Wrapper>
         <Heading> Recommended Products </Heading>
         {data.map(category => (
            <Category>
               <CategoryBanner
                  navigation={navigation}
                  title={category.name}
                  showLink={false}
                  recommendations={true}
               />
               <Products
                  navigation={navigation}
                  category={category}
                  horizontal={true}
                  recommendations={true}
               />
            </Category>
         ))}
      </Wrapper>
   )
}

export default Recommendations

const Wrapper = styled.View``

const Heading = styled.Text`
   font-size: 20px;
   color: #000;
   font-weight: 600;
   margin-bottom: 24px;
   text-align: center;
`

const Category = styled.View`
   margin-bottom: 32px;
`
