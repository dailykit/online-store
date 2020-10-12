import React from 'react'
import styled, { css } from 'styled-components/native'

const Nutrition = ({ values }) => {
   const getDailyValue = (type, value) => {
      switch (type) {
         case 'Total Fat':
            return Math.round((parseInt(value, 10) / 78) * 100) + '%'
         case 'Saturated Fat':
            return Math.round((parseInt(value, 10) / 20) * 100) + '%'
         case 'Cholesterol':
            return Math.round((parseInt(value, 10) / 300) * 100) + '%'
         case 'Sodium':
            return Math.round((parseInt(value, 10) / 2300) * 100) + '%'
         case 'Total Carbs':
            return Math.round((parseInt(value, 10) / 275) * 100) + '%'
         case 'Dietary Fibre':
            return Math.round((parseInt(value, 10) / 28) * 100) + '%'
         default:
            return 'NA'
      }
   }

   return (
      <Wrapper>
         <Heading>Nutrition</Heading>
         <Calories>Calories {values.calories}</Calories>
         <Table>
            <TableHead>
               <TableHeadText>Amount/Serving</TableHeadText>
               <TableHeadText>% Daily Value</TableHeadText>
            </TableHead>
            <TableBody>
               <TableRow>
                  <TableRowText>
                     Total Fat{' '}
                     <NutritionValue>{values.totalFat} g</NutritionValue>
                  </TableRowText>
                  <TableRowText>
                     {getDailyValue('Total Fat', values.totalFat)}
                  </TableRowText>
               </TableRow>
               <TableRow>
                  <TableRowText inset>
                     Saturated Fat{' '}
                     <NutritionValue>{values.saturatedFat} g</NutritionValue>
                  </TableRowText>
                  <TableRowText>
                     {getDailyValue('Saturated Fat', values.saturatedFat)}
                  </TableRowText>
               </TableRow>
               <TableRow>
                  <TableRowText inset>
                     Trans Fat{' '}
                     <NutritionValue>{values.transFat} g</NutritionValue>
                  </TableRowText>
               </TableRow>
               <TableRow>
                  <TableRowText>
                     Cholesterol{' '}
                     <NutritionValue>{values.cholesterol} mg</NutritionValue>
                  </TableRowText>
                  <TableRowText>
                     {getDailyValue('Cholesterol', values.cholesterol)}
                  </TableRowText>
               </TableRow>
               <TableRow>
                  <TableRowText>
                     Sodium <NutritionValue>{values.sodium} mg</NutritionValue>
                  </TableRowText>
                  <TableRowText>
                     {getDailyValue('Sodium', values.sodium)}
                  </TableRowText>
               </TableRow>
               <TableRow>
                  <TableRowText>
                     Total Carbs{' '}
                     <NutritionValue>
                        {values.totalCarbohydrates} g
                     </NutritionValue>
                  </TableRowText>
                  <TableRowText>
                     {getDailyValue('Total Carbs', values.totalCarbohydrates)}
                  </TableRowText>
               </TableRow>
               <TableRow>
                  <TableRowText inset>
                     Dietary Fibre{' '}
                     <NutritionValue>{values.dietaryFibre} g</NutritionValue>
                  </TableRowText>
                  <TableRowText>
                     {getDailyValue('Dietary Fibre', values.dietaryFibre)}
                  </TableRowText>
               </TableRow>
               <TableRow>
                  <TableRowText inset>
                     Sugars <NutritionValue>{values.sugars} g</NutritionValue>
                  </TableRowText>
               </TableRow>
               <TableRow>
                  <TableRowText>
                     Protein <NutritionValue>{values.protein} g</NutritionValue>
                  </TableRowText>
               </TableRow>
            </TableBody>
            <TableFooter>
               <TableFooterText>Vitamin A {values.vitaminA}%</TableFooterText>
               <TableFooterText>Vitamin C {values.vitaminC}%</TableFooterText>
               <TableFooterText>Calcium {values.calcium}%</TableFooterText>
               <TableFooterText>Iron {values.iron}%</TableFooterText>
            </TableFooter>
         </Table>
      </Wrapper>
   )
}

export default Nutrition

const Wrapper = styled.View`
   max-width: 450px;
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
   min-height: 1.5rem;
`

const TableFooterText = styled.Text`
   color: #666;
   font-weight: bold;
`
