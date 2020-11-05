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
         {/* <Heading>Nutrition</Heading> */}
         <Calories>
            <CaloriesText> Calories</CaloriesText>
            <CaloriesText>{values.calories}</CaloriesText>
         </Calories>
         <Table>
            <TableHead>
               <TableHeadText></TableHeadText>
               <TableHeadText>Amount</TableHeadText>
               <TableHeadText>% Daily Value</TableHeadText>
            </TableHead>
            <TableBody>
               <TableRow>
                  <TableRowText title>Total Fat </TableRowText>
                  <TableRowText>{values.totalFat} g</TableRowText>
                  <TableRowText>
                     {getDailyValue('Total Fat', values.totalFat)}
                  </TableRowText>
               </TableRow>
               <TableRow>
                  <TableRowText inset small title>
                     Saturated Fat
                  </TableRowText>
                  <TableRowText small>{values.saturatedFat} g</TableRowText>
                  <TableRowText small>
                     {getDailyValue('Saturated Fat', values.saturatedFat)}
                  </TableRowText>
               </TableRow>
               <TableRow>
                  <TableRowText inset small title>
                     Trans Fat
                  </TableRowText>
                  <TableRowText small>{values.transFat} g</TableRowText>
                  <TableRowText small></TableRowText>
               </TableRow>
               <TableRow>
                  <TableRowText title>Cholesterol</TableRowText>
                  <TableRowText>{values.cholesterol} mg</TableRowText>
                  <TableRowText>
                     {getDailyValue('Cholesterol', values.cholesterol)}
                  </TableRowText>
               </TableRow>
               <TableRow>
                  <TableRowText title>Sodium</TableRowText>
                  <TableRowText>{values.sodium} mg</TableRowText>
                  <TableRowText>
                     {getDailyValue('Sodium', values.sodium)}
                  </TableRowText>
               </TableRow>
               <TableRow>
                  <TableRowText title>Total Carbs</TableRowText>
                  <TableRowText>{values.totalCarbohydrates} g</TableRowText>
                  <TableRowText>
                     {getDailyValue('Total Carbs', values.totalCarbohydrates)}
                  </TableRowText>
               </TableRow>
               <TableRow>
                  <TableRowText inset small title>
                     Dietary Fibre
                  </TableRowText>
                  <TableRowText small>{values.dietaryFibre} g</TableRowText>
                  <TableRowText small>
                     {getDailyValue('Dietary Fibre', values.dietaryFibre)}
                  </TableRowText>
               </TableRow>
               <TableRow>
                  <TableRowText inset small title>
                     Sugars
                  </TableRowText>
                  <TableRowText small>{values.sugars} g</TableRowText>
                  <TableRowText small></TableRowText>
               </TableRow>
               <TableRow>
                  <TableRowText title>Protein</TableRowText>
                  <TableRowText>{values.protein} g</TableRowText>
                  <TableRowText></TableRowText>
               </TableRow>
            </TableBody>
            <TableFooter>
               <TableFooterText>Vitamin A {values.vitaminA}%</TableFooterText>
               <TableFooterText right>
                  Vitamin C {values.vitaminC}%
               </TableFooterText>
               <TableFooterText>Calcium {values.calcium}%</TableFooterText>
               <TableFooterText right>Iron {values.iron}%</TableFooterText>
            </TableFooter>
         </Table>
      </Wrapper>
   )
}

export default Nutrition

const Wrapper = styled.View`
   min-width: 300px;
`

const Heading = styled.Text`
   color: #555b6e;
   font-size: 14px;
   margin-bottom: 0.5rem;
`

const Text = styled.Text`
   color: #000;
   font-size: 14px;
   font-weight: normal;
`

const Calories = styled.View`
   flex-direction: row;
   align-items: center;
   justify-content: space-between;
   padding: 8px 0px;
   border-color: #000;
   border-bottom-width: 1px;
`

const CaloriesText = styled(Text)`
   font-weight: 600;
   font-size: 20px;
`

const Table = styled.View``

const TableHead = styled.View`
   display: grid;
   grid-template-columns: 1fr 1fr 1fr;
`

const TableHeadText = styled(Text)`
   font-size: 14px;
   font-weight: 600;
   text-align: right;
   line-height: 2.2rem;
`

const TableBody = styled.View``

const TableRow = styled.View`
   display: grid;
   grid-template-columns: 1fr 1fr 1fr;
   height: 2rem;
`

const TableRowText = styled(Text)`
   font-weight: 600;
   font-size: 16px;
   min-width: 60px;
   text-align: ${props => (props.title ? 'left' : 'right')};
   ${props =>
      props.inset &&
      css`
         padding-left: 1rem;
      `}
   ${props =>
      props.small &&
      css`
         font-size: 14px;
      `}
`

const TableFooter = styled.View`
   display: grid;
   grid-template-columns: 1fr 1fr;
   border-color: #000;
   border-top-width: 1px;
   border-bottom-width: 1px;
`

const TableFooterText = styled(Text)`
   font-size: 16px;
   font-weight: 600;
   line-height: 2rem;
   text-align: ${props => (props.right ? 'right' : 'left')};
`
