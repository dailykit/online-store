import React from 'react'
import styled, { css } from 'styled-components/native'

const Nutrition = () => {
   return (
      <Wrapper>
         <Heading>Nutrition</Heading>
         <Calories>Calories 330</Calories>
         <Table>
            <TableHead>
               <TableHeadText>Amount/Serving</TableHeadText>
               <TableHeadText>% Daily Value</TableHeadText>
            </TableHead>
            <TableBody>
               <TableRow>
                  <TableRowText>
                     Total Fat <NutritionValue>60g</NutritionValue>
                  </TableRowText>
                  <TableRowText>60%</TableRowText>
               </TableRow>
               <TableRow>
                  <TableRowText inset>
                     Saturated Fat <NutritionValue>40g</NutritionValue>
                  </TableRowText>
                  <TableRowText>20%</TableRowText>
               </TableRow>
               <TableRow>
                  <TableRowText inset>
                     Trans Fat <NutritionValue>20g</NutritionValue>
                  </TableRowText>
                  <TableRowText></TableRowText>
               </TableRow>
               <TableRow>
                  <TableRowText>
                     Cholesterol <NutritionValue>2 mg</NutritionValue>
                  </TableRowText>
                  <TableRowText>1%</TableRowText>
               </TableRow>
               <TableRow>
                  <TableRowText>
                     Sodium <NutritionValue>1 mg</NutritionValue>
                  </TableRowText>
                  <TableRowText>0%</TableRowText>
               </TableRow>
               <TableRow>
                  <TableRowText>
                     Total Carbs <NutritionValue>40g</NutritionValue>
                  </TableRowText>
                  <TableRowText>5%</TableRowText>
               </TableRow>
               <TableRow>
                  <TableRowText inset>
                     Dietary Fibre <NutritionValue>20g</NutritionValue>
                  </TableRowText>
                  <TableRowText>71%</TableRowText>
               </TableRow>
               <TableRow>
                  <TableRowText inset>
                     Sugars <NutritionValue>20g</NutritionValue>
                  </TableRowText>
               </TableRow>
               <TableRow>
                  <TableRowText>
                     Protein <NutritionValue>30g</NutritionValue>
                  </TableRowText>
                  <TableRowText>71%</TableRowText>
               </TableRow>
            </TableBody>
            <TableFooter>
               <TableFooterText>Vitamin A 2%</TableFooterText>
               <TableFooterText>Vitamin C 3%</TableFooterText>
               <TableFooterText>Calcium 3%</TableFooterText>
               <TableFooterText>Iron 4%</TableFooterText>
            </TableFooter>
         </Table>
      </Wrapper>
   )
}

export default Nutrition

const Wrapper = styled.View`
   padding: 0.5rem;
   max-width: 450px;
   min-width: 350px;
`

const Heading = styled.Text`
   color: #666;
   font-size: 14px;
   margin-bottom: 0.5rem;
`

const Calories = styled.Text`
   font-weight: bold;
   color: #666;
   margin-bottom: 0.25rem;
`

const Table = styled.View``

const TableHead = styled.View`
   flex-direction: row;
   align-items: center;
   justify-content: space-between;
   border-bottom: 2px solid #666;
`

const TableHeadText = styled.Text`
   font-size: 14px;
   color: #666;
`

const TableBody = styled.View``

const TableRow = styled.View`
   flex-direction: row;
   align-items: center;
   justify-content: space-between;
   height: 1.5rem;
   border-bottom-width: 1px;
   border-bottom-color: #aaa;
`

const TableRowText = styled.Text`
   font-weight: bold;
   color: #666;
   ${props =>
      props.inset &&
      css`
         padding-left: 1rem;
         font-weight: normal;
      `}
`

const NutritionValue = styled.Text`
   font-weight: normal;
`

const TableFooter = styled.View`
   flex-direction: row;
   align-items: center;
   justify-content: space-between;
   height: 1.5rem;
`

const TableFooterText = styled.Text`
   color: #666;
   font-weight: bold;
`
