import { useSubscription } from '@apollo/react-hooks'
import React from 'react'
import { Text, View } from 'react-native'
import { rrulestr } from 'rrule'
import styled, { css } from 'styled-components/native'
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
         <Table>
            {Boolean(now.length) && (
               <>
                  <SubHeading> On-Demand Delivery </SubHeading>
                  <TableRow>
                     <TableData head></TableData>
                     <TableData head>Time</TableData>
                     <TableData head>Distance</TableData>
                     <TableData head>Order Value</TableData>
                     <TableData head>Charges</TableData>
                  </TableRow>
                  {now.map(rec => (
                     <TableRow>
                        <TableData>{rrulestr(rec.rrule).toText()}</TableData>
                        <TableData>
                           {rec.timeSlots.map(slot => (
                              <Col>
                                 <TableData>
                                    {slot.from
                                       .split(':')
                                       .splice(0, 2)
                                       .join(':')}{' '}
                                    -{' '}
                                    {slot.to.split(':').splice(0, 2).join(':')}
                                 </TableData>
                                 <Col column>
                                    {slot.mileRanges.map(range => (
                                       <Col>
                                          <TableData>
                                             {range.from} - {range.to}
                                          </TableData>
                                          <Col column>
                                             {range.charges.map(charge => (
                                                <Col>
                                                   <TableData>
                                                      {`${charge.orderValueFrom} - ${charge.orderValueUpto}`}
                                                   </TableData>
                                                   <TableData>
                                                      {charge.charge}
                                                   </TableData>
                                                </Col>
                                             ))}
                                          </Col>
                                       </Col>
                                    ))}
                                 </Col>
                              </Col>
                           ))}
                        </TableData>
                     </TableRow>
                  ))}
               </>
            )}
            {Boolean(later.length) && (
               <>
                  <SubHeading> Pre-Order Delivery </SubHeading>
                  <TableRow>
                     <TableData head></TableData>
                     <TableData head>Time</TableData>
                     <TableData head>Distance</TableData>
                     <TableData head>Order Value</TableData>
                     <TableData head>Charges</TableData>
                  </TableRow>
                  {later.map(rec => (
                     <TableRow>
                        <TableData>{`RRULE here`}</TableData>
                        <TableData>
                           {rec.timeSlots.map(slot => (
                              <Col>
                                 <TableData>
                                    {slot.from
                                       .split(':')
                                       .splice(0, 2)
                                       .join(':')}{' '}
                                    -{' '}
                                    {slot.to.split(':').splice(0, 2).join(':')}
                                 </TableData>
                                 <Col column>
                                    {slot.mileRanges.map(range => (
                                       <Col>
                                          <TableData>
                                             {range.from} - {range.to}
                                          </TableData>
                                          <Col column>
                                             {range.charges.map(charge => (
                                                <Col>
                                                   <TableData>
                                                      {`${charge.orderValueFrom} - ${charge.orderValueUpto}`}
                                                   </TableData>
                                                   <TableData>
                                                      {charge.charge}
                                                   </TableData>
                                                </Col>
                                             ))}
                                          </Col>
                                       </Col>
                                    ))}
                                 </Col>
                              </Col>
                           ))}
                        </TableData>
                     </TableRow>
                  ))}
               </>
            )}
         </Table>
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

const Table = styled.View`
   margin: 0 auto;
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
`

const TableData = styled.Text`
   min-width: 110px;
   padding: 4px 0;
   ${props =>
      props.head &&
      css`
         font-weight: 600;
         padding: 8px 0px;
         color: #666;
      `}
`

const Col = styled.View`
   flex-direction: row;
   align-items: start;
   ${props =>
      props.column &&
      css`
         flex-direction: column;
      `}
`
