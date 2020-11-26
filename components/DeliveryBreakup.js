import React from 'react'
import { useSubscription } from '@apollo/react-hooks'
import { Feather } from '@expo/vector-icons'
import { Picker } from '@react-native-picker/picker'
import { CURRENCY } from 'react-native-dotenv'
import { rrulestr } from 'rrule'
import styled, { css } from 'styled-components/native'
import { useAppContext } from '../context/app'
import { DELIVERY_BREAKUP } from '../graphql'
import { generateMiniSlots, makeDoubleDigit } from '../utils/fulfillment'

const DeliveryBreakup = () => {
   const { brandId, visual } = useAppContext()

   const extractedMileRanges = React.useRef({ now: [], later: [] })
   const [selected, setSelected] = React.useState('')
   const [selectedDate, setSelectedDate] = React.useState(undefined)
   const [selectedTime, setSelectedTime] = React.useState(undefined)
   const [pickerData, setPickerData] = React.useState(undefined)
   const [mileRangeIds, setMileRangeIds] = React.useState(undefined)
   const [viewData, setViewData] = React.useState([])
   const [message, setMessage] = React.useState('')

   const [recurrences, setRecurrences] = React.useState([])

   const storeMileRanges = recurrences => {
      console.log('🚀  recurrences', recurrences)
      recurrences.forEach(recurrence =>
         recurrence.timeSlots.forEach(timeSlot => {
            if (recurrence.type.includes('ONDEMAND')) {
               extractedMileRanges.current = {
                  ...extractedMileRanges.current,
                  now: [
                     ...extractedMileRanges.current.now,
                     ...timeSlot.mileRanges,
                  ],
               }
            }
            if (recurrence.type.includes('PREORDER')) {
               extractedMileRanges.current = {
                  ...extractedMileRanges.current,
                  later: [
                     ...extractedMileRanges.current.later,
                     ...timeSlot.mileRanges,
                  ],
               }
            }
         })
      )
   }

   const { loading } = useSubscription(DELIVERY_BREAKUP, {
      variables: {
         brandId,
      },
      onSubscriptionData: data => {
         const { recurrences: recs } = data.subscriptionData.data
         setRecurrences(recs)
         storeMileRanges(recs)
      },
   })

   React.useEffect(() => {
      if (selected) {
         setMessage('')
         if (selected === 'now') {
            const now = recurrences.filter(rec => rec.type.includes('ONDEMAND'))
            if (now.length) {
               const result = isDeliveryAvailable(now)
               if (result.status) {
                  setMileRangeIds([result.mileRangeId])
               } else {
                  setMessage(result.message)
                  setViewData([])
               }
            }
         } else if (selected === 'later') {
            const later = recurrences.filter(rec =>
               rec.type.includes('PREORDER')
            )
            const { status, data } = generateDeliverySlots(later)
            if (status && data.length) {
               const miniSlots = generateMiniSlots(data, 15)
               if (miniSlots.length) {
                  setPickerData(miniSlots)
                  setSelectedDate(miniSlots[0].date)
               }
               console.log('miniSlots', miniSlots)
            }
         }
      }
   }, [selected])

   React.useEffect(() => {
      if (selectedDate && selectedTime) {
         const dateObject = pickerData.find(({ date }) => date === selectedDate)
         if (dateObject) {
            const timeObject = dateObject.slots.find(
               ({ time }) => time === selectedTime
            )
            console.log({ timeObject })
            if (timeObject) {
               setMileRangeIds([timeObject.mileRangeId])
            }
         }
      }
   }, [selectedDate, selectedTime])

   React.useEffect(() => {
      console.log({ selected, mileRangeIds })
      if (selected && mileRangeIds?.length) {
         const res = extractedMileRanges.current[selected].filter(({ id }) =>
            mileRangeIds.includes(id)
         )
         setViewData(res)
      }
   }, [selected, mileRangeIds])

   const renderDistanceRange = range => {
      if (CURRENCY === 'INR') {
         // convert to kms
         return `${(range.from * 1.6).toFixed(2)} kms - ${(
            range.to * 1.6
         ).toFixed(2)} kms`
      } else {
         return `${range.from} miles - ${range.to} miles`
      }
   }

   if (loading) return <Heading> Loading </Heading>

   return (
      // <ScrollView horizontal style={{ flex: 1 }}>
      <Wrapper>
         <Heading> Delivery Charges </Heading>
         {Boolean(message) && <Message>{message}</Message>}
         <OptionsWrapper>
            <Option
               active={selected === 'now'}
               onPress={() => setSelected('now')}
            >
               <OptionText> Now </OptionText>
               {Boolean(selected === 'now') && (
                  <Feather
                     name="check-circle"
                     style={{ marginLeft: 8 }}
                     size={16}
                     color={visual.color}
                  />
               )}
            </Option>
            <Option
               active={selected === 'later'}
               onPress={() => setSelected('later')}
            >
               <OptionText>Later</OptionText>
               {Boolean(selected === 'later') && (
                  <Feather
                     name="check-circle"
                     style={{ marginLeft: 8 }}
                     size={16}
                     color={visual.color}
                  />
               )}
            </Option>
         </OptionsWrapper>
         {Boolean(pickerData && selected === 'later') && (
            <PickerWrapper>
               <Picker
                  selectedValue={selectedDate}
                  style={{ height: 40, flex: 1 }}
                  onValueChange={itemValue => {
                     setSelectedDate(itemValue)
                  }}
               >
                  {pickerData.map((data, index) => (
                     <Picker.Item
                        key={index}
                        label={data.date}
                        value={data.date}
                     />
                  ))}
               </Picker>
               <Picker
                  selectedValue={selectedTime}
                  style={{ height: 40, flex: 1 }}
                  onValueChange={itemValue => {
                     setSelectedTime(itemValue)
                  }}
               >
                  {pickerData
                     .find(({ date }) => date === selectedDate)
                     .slots.map((slot, index) => (
                        <Picker.Item
                           key={index}
                           label={slot.time}
                           value={slot.time}
                        />
                     ))}
               </Picker>
            </PickerWrapper>
         )}
         <Table>
            {Boolean(viewData?.length) && (
               <>
                  <TableRow>
                     <TableData head>Distance</TableData>
                     <TableData head right>
                        Order Value
                     </TableData>
                     <TableData head right>
                        Charges
                     </TableData>
                  </TableRow>
                  {viewData.map(mileRange => (
                     <TableRow key={mileRange.id}>
                        <TableData>{renderDistanceRange(mileRange)}</TableData>
                        <Col column>
                           {mileRange.charges.map(charge => (
                              <Col key={charge.id}>
                                 <TableData right>
                                    {`${new Intl.NumberFormat('en-US', {
                                       style: 'currency',
                                       currency: CURRENCY,
                                    }).format(
                                       charge.orderValueFrom
                                    )} - ${new Intl.NumberFormat('en-US', {
                                       style: 'currency',
                                       currency: CURRENCY,
                                    }).format(charge.orderValueUpto)}`}
                                 </TableData>
                                 <TableData right>
                                    {new Intl.NumberFormat('en-US', {
                                       style: 'currency',
                                       currency: CURRENCY,
                                    }).format(charge.charge)}
                                 </TableData>
                              </Col>
                           ))}
                        </Col>
                     </TableRow>
                  ))}
               </>
            )}
         </Table>
         {Boolean(viewData?.length) && (
            <Message>
               *In case of any clashes/inconsistencies, lowest value will be
               considered.
            </Message>
         )}
      </Wrapper>
      // </ScrollView>
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
   margin: 20px auto;
`

const PickerWrapper = styled.View`
   flex-direction: row;
   height: 40px;
   align-items: center;
   margin-top: 16px;
`

const OptionsWrapper = styled.View`
   flex-direction: row;
   height: 48px;
   margin: 0 auto;
`

const Option = styled.TouchableOpacity`
   height: inherit;
   min-width: 96px;
   background: ${props => (props.active ? '#fff' : '#eae8e8')};
   flex-direction: row;
   align-items: center;
   border: 1px solid #eae8e8;
   justify-content: center;
   padding: 0 12px;
`

const OptionText = styled.Text`
   color: #000;
`

const Message = styled.Text`
   font-style: italic;
   color: #666;
   font-size: #666;
   text-align: center;
`

const TableRow = styled.View`
   flex-direction: row;
   align-items: flex-start;
`

const TableData = styled.Text`
   min-width: 150px;
   padding: 4px 0;
   ${props =>
      props.head &&
      css`
         font-weight: 600;
         padding: 8px 0px;
         color: #666;
      `}
   ${props =>
      props.right &&
      css`
         text-align: right;
         min-width: 140px;
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

function generateDeliverySlots(recurrences) {
   let data = []
   for (let rec of recurrences) {
      const now = new Date() // now
      const start = new Date(now.getTime() - 1000 * 60 * 60 * 24) // yesterday
      const end = new Date(now.getTime() + 7 * 1000 * 60 * 60 * 24) // 7 days later
      const dates = rrulestr(rec.rrule).between(start, end)
      dates.forEach(date => {
         if (rec.timeSlots.length) {
            rec.timeSlots.forEach(timeslot => {
               if (timeslot.mileRanges.length) {
                  timeslot.mileRanges.forEach(mileRange => {
                     const leadTime = mileRange.leadTime
                     const [fromHr, fromMin, fromSec] = timeslot.from.split(':')
                     const [toHr, toMin, toSec] = timeslot.to.split(':')
                     const fromTimeStamp = new Date(
                        date.setHours(fromHr, fromMin, fromSec)
                     )
                     const toTimeStamp = new Date(
                        date.setHours(toHr, toMin, toSec)
                     )
                     // start + lead time < to
                     const leadMiliSecs = leadTime * 60000
                     if (now.getTime() + leadMiliSecs < toTimeStamp.getTime()) {
                        // if start + lead time > from -> set new from time
                        let slotStart
                        let slotEnd =
                           makeDoubleDigit(toTimeStamp.getHours()) +
                           ':' +
                           makeDoubleDigit(toTimeStamp.getMinutes())
                        if (
                           now.getTime() + leadMiliSecs >
                           fromTimeStamp.getTime()
                        ) {
                           // new start time = lead time + now
                           const newStartTimeStamp = new Date(
                              now.getTime() + leadMiliSecs
                           )
                           slotStart =
                              makeDoubleDigit(newStartTimeStamp.getHours()) +
                              ':' +
                              makeDoubleDigit(newStartTimeStamp.getMinutes())
                        } else {
                           slotStart =
                              makeDoubleDigit(fromTimeStamp.getHours()) +
                              ':' +
                              makeDoubleDigit(fromTimeStamp.getMinutes())
                        }
                        // check if date already in slots
                        const dateWithoutTime = date.toDateString()
                        const index = data.findIndex(
                           slot => slot.date === dateWithoutTime
                        )
                        if (index === -1) {
                           data.push({
                              date: dateWithoutTime,
                              slots: [
                                 {
                                    start: slotStart,
                                    end: slotEnd,
                                    mileRangeId: mileRange.id,
                                 },
                              ],
                           })
                        } else {
                           data[index].slots.push({
                              start: slotStart,
                              end: slotEnd,
                              mileRangeId: mileRange.id,
                           })
                        }
                     }
                  })
               } else {
                  return {
                     status: false,
                     message: 'Sorry, No time slots available.',
                  }
               }
            })
         } else {
            return { status: false, message: 'Sorry! No time slots available.' }
         }
      })
   }
   return { status: true, data }
}

function isDeliveryAvailable(recurrences) {
   for (let rec of recurrences) {
      const now = new Date() // now
      const start = new Date(now.getTime() - 1000 * 60 * 60 * 24) // yesterday
      const end = new Date(now.getTime() + 1000 * 60 * 60 * 24) // tomorrow
      const dates = rrulestr(rec.rrule).between(start, now)
      if (dates.length) {
         if (rec.timeSlots.length) {
            for (let timeslot of rec.timeSlots) {
               if (timeslot.mileRanges.length) {
                  const timeslotFromArr = timeslot.from.split(':')
                  const timeslotToArr = timeslot.to.split(':')
                  const fromTimeStamp = new Date(now.getTime())
                  fromTimeStamp.setHours(
                     timeslotFromArr[0],
                     timeslotFromArr[1],
                     timeslotFromArr[2]
                  )
                  const toTimeStamp = new Date(now.getTime())
                  toTimeStamp.setHours(
                     timeslotToArr[0],
                     timeslotToArr[1],
                     timeslotToArr[2]
                  )
                  // check if current time falls within time slot
                  if (
                     now.getTime() > fromTimeStamp.getTime() &&
                     now.getTime() < toTimeStamp.getTime()
                  ) {
                     return {
                        status: true,
                        mileRangeId: timeslot.mileRanges[0].id,
                     }
                  } else {
                     console.log('isDeliveryAvailable -> time failure')
                     return {
                        status: false,
                        message:
                           'Sorry, We do not offer Delivery at this time.',
                     }
                  }
               } else {
                  console.log('isDeliveryAvailable -> mile range failure')
                  return {
                     status: false,
                     message:
                        'Sorry, you seem to be placed far out of our delivery range.',
                  }
               }
            }
         } else {
            console.log('isDeliveryAvailable -> time slots failure')
            return {
               status: false,
               message: 'Sorry, We do not offer Delivery at this time.',
            }
         }
      } else {
         console.log('isDeliveryAvailable -> dates failure')
         return {
            status: false,
            message: 'Sorry, We do not offer Delivery on this day.',
         }
      }
   }
}
