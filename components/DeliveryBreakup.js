import { useSubscription } from '@apollo/react-hooks'
import React from 'react'
import { rrulestr } from 'rrule'
import styled from 'styled-components/native'
import { useAppContext } from '../context/app'
import { DELIVERY_BREAKUP } from '../graphql'

const DeliveryBreakup = () => {
   const { brandId } = useAppContext()

   const [now, setNow] = React.useState([])
   const [later, setLater] = React.useState([])

   const { loading, data: { recurrences = [] } = {} } = useSubscription(
      DELIVERY_BREAKUP,
      {
         variables: {
            brandId,
         },
         onSubscriptionData: data => {
            const { recurrences } = data.subscriptionData.data
            if (recurrences.length) {
               setLater(
                  recurrences.filter(rec => rec.type.includes('PREORDER'))
               )
               setNow(recurrences.filter(rec => rec.type.includes('ONDEMAND')))
            }
         },
      }
   )

   if (loading) return <Heading> Loading </Heading>

   if (recurrences.length) console.log(recurrences)

   return (
      <Wrapper>
         <Heading> Delivery Charges </Heading>
         {Boolean(now.length) && (
            <>
               <SubHeading> On-Demand Delivery </SubHeading>
               <TableRow>
                  <TableData></TableData>
                  <TableData>Time</TableData>
                  <TableData>Distance</TableData>
                  <TableData>Charges</TableData>
               </TableRow>
               {now.map(rec => (
                  <TableRow>
                     <TableData>{rrulestr(rec.rrule).toText()}</TableData>
                     <TableData>
                        {rec.timeSlots.map(slot => (
                           <TableData>
                              {slot.from} - {slot.to}
                              {slot.mileRanges.map(range => (
                                 <TableData>
                                    {range.from} - {range.to}
                                 </TableData>
                              ))}
                           </TableData>
                        ))}
                     </TableData>
                     <TableData>Charges</TableData>
                  </TableRow>
               ))}
            </>
         )}
         {Boolean(later.length) && (
            <>
               <SubHeading> Pre-Order Delivery </SubHeading>
            </>
         )}
      </Wrapper>
   )
}

export default DeliveryBreakup

const Wrapper = styled.ScrollView`
   padding: 1rem;
`

const Heading = styled.Text`
   font-size: 1.2rem;
   text-align: center;
   font-weight: 600;
   margin-bottom: 1.5rem;
`

const SubHeading = styled.Text`
   font-size: 1rem;
   text-align: center;
   font-weight: 600;
   margin-bottom: 0.5rem;
`

const TableRow = styled.View`
   flex-direction: row;
   align-items: center;
   justify-content: space-between;
`

const TableData = styled.Text`
   min-width: 200px;
`
