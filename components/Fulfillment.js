import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { Picker } from '@react-native-community/picker';
import { rrulestr } from 'rrule';
import { MaterialIcons } from '@expo/vector-icons';
import { useAppContext } from '../context/app';
import { useSubscription } from '@apollo/react-hooks';
import {
  PREORDER_PICKUP,
  ONDEMAND_PICKUP,
  PREORDER_DELIVERY,
  ONDEMAND_DELIVERY,
} from '../graphql';

const Fulfillment = () => {
  const { visual, availability } = useAppContext();
  const [type, setType] = React.useState('');
  const [time, setTime] = React.useState('');
  const [oops, setOops] = React.useState('');
  const [pickerDates, setPickerDates] = React.useState([]);
  const [pickerSlots, setPickerSlots] = React.useState([]);
  const [fulfillment, setFulfillment] = React.useState({});

  const { data: { preOrderPickup = [] } = {} } = useSubscription(
    PREORDER_PICKUP
  );

  const { data: { onDemandPickup = [] } = {} } = useSubscription(
    ONDEMAND_PICKUP
  );

  const { data: { preOrderDelivery = [] } = {} } = useSubscription(
    PREORDER_DELIVERY,
    {
      variables: {
        distance: 2,
      },
    }
  );

  const { data: { onDemandDelivery = [] } = {} } = useSubscription(
    ONDEMAND_DELIVERY,
    {
      variables: {
        distance: 2,
      },
    }
  );

  React.useEffect(() => {
    if (fulfillment.date) {
      const index = pickerDates.findIndex(
        (data) => data.date === fulfillment.date
      );
      setPickerSlots([...pickerDates[index].slots]);
      setFulfillment({
        ...fulfillment,
        time: pickerDates[index].slots[0].time,
        data: { mileRangeId: pickerDates[index].slots[0]?.mileRangeId },
      });
    }
  }, [fulfillment.date]);

  React.useEffect(() => {
    if (fulfillment.time) {
      const index = pickerSlots.findIndex(
        (slot) => slot.time === fulfillment.time
      );
      setFulfillment({
        ...fulfillment,
        data: { mileRangeId: pickerSlots[index]?.mileRangeId },
      });
    }
  }, [fulfillment.time]);

  React.useEffect(() => {
    if (time && type) {
      setOops('');
      switch (type) {
        case 'PICKUP': {
          if (availability.pickup.isAvailable) {
            switch (time) {
              case 'PREORDER': {
                if (preOrderPickup[0].recurrences.length) {
                  const slots = generatePickUpSlots(
                    preOrderPickup[0].recurrences
                  );
                  const miniSlots = generateMiniSlots(slots, 15);
                  console.log(miniSlots);
                  setPickerDates([...miniSlots]);
                  setFulfillment({
                    date: miniSlots[0].date,
                    time: miniSlots[0].slots[0].time,
                  });
                } else {
                  setOops('Sorry! No time slots available.');
                }
                break;
              }
              case 'ONDEMAND': {
                if (onDemandPickup[0].recurrences.length) {
                  console.log(isPickUpAvailable(onDemandPickup[0].recurrences));
                } else {
                  setOops('Sorry! Option not available currently.');
                }
                break;
              }
              default: {
                return setOops('Unkown error!');
              }
            }
          } else {
            setOops('Sorry! Pickup not available currently.');
          }
          break;
        }
        case 'DELIVERY': {
          if (availability.delivery.isAvailable) {
            switch (time) {
              case 'PREORDER': {
                if (preOrderDelivery[0].recurrences.length) {
                  const slots = generateDeliverySlots(
                    preOrderDelivery[0].recurrences
                  );
                  const miniSlots = generateMiniSlots(slots, 15);
                  console.log(miniSlots);
                  setPickerDates([...miniSlots]);
                  setFulfillment({
                    date: miniSlots[0].date,
                    time: miniSlots[0].slots[0].time,
                    data: { mileRangeId: miniSlots[0].slots[0]?.mileRangeId },
                  });
                } else {
                  setOops('Sorry! No time slots available.');
                }
                break;
              }
              case 'ONDEMAND': {
                if (onDemandDelivery[0].recurrences.length) {
                  console.log(
                    isDeliveryAvailable(onDemandDelivery[0].recurrences)
                  );
                } else {
                  setOops('Sorry! Option not available currently.');
                }
                break;
              }
              default: {
                return setOops('Unkown error!');
              }
            }
          } else {
            setOops('Sorry! Delivery not available currently.');
          }
          break;
        }
        default: {
          return setOops('Unkown error!');
        }
      }
    }
  }, [type, time]);

  const getMinutes = (time) => {
    return parseInt(time.split(':')[0]) * 60 + parseInt(time.split(':')[1]);
  };

  const makeDoubleDigit = (num) => {
    if (num.toString().length === 1) {
      return '0' + num;
    } else {
      return num;
    }
  };

  const getTimeFromMinutes = (num) => {
    const hours = num / 60;
    const rhours = Math.floor(hours);
    const minutes = (hours - rhours) * 60;
    const rminutes = Math.round(minutes);
    return rhours + ':' + makeDoubleDigit(rminutes);
  };

  const generateMiniSlots = (data, size) => {
    let newData = [];
    data.forEach((el) => {
      el.slots.forEach((slot) => {
        const startMinutes = getMinutes(slot.start);
        const endMinutes = getMinutes(slot.end);
        let startPoint = startMinutes;
        while (startPoint < endMinutes) {
          const index = newData.findIndex((datum) => datum.date === el.date);
          if (index === -1) {
            newData.push({
              date: el.date,
              slots: [{ time: getTimeFromMinutes(startPoint), ...slot }],
            });
          } else {
            newData[index].slots.push({
              time: getTimeFromMinutes(startPoint),
              ...slot,
            });
          }
          startPoint = startPoint + size;
        }
      });
    });
    return newData;
  };

  const isPickUpAvailable = (recurrences) => {
    for (let rec of recurrences) {
      const now = new Date(); // now
      const start = new Date(now.getTime() - 1000 * 60 * 60 * 24); // yesterday
      const end = new Date(now.getTime() + 1000 * 60 * 60 * 24); // tomorrow
      const dates = rrulestr(rec.rrule).between(start, now);
      if (dates.length) {
        for (let timeslot of rec.timeSlots) {
          const timeslotFromArr = timeslot.from.split(':');
          const timeslotToArr = timeslot.to.split(':');
          const fromTimeStamp = new Date(now.getTime());
          fromTimeStamp.setHours(
            timeslotFromArr[0],
            timeslotFromArr[1],
            timeslotFromArr[2]
          );
          const toTimeStamp = new Date(now.getTime());
          toTimeStamp.setHours(
            timeslotToArr[0],
            timeslotToArr[1],
            timeslotToArr[2]
          );
          // check if current time falls within time slot
          if (
            now.getTime() > fromTimeStamp.getTime() &&
            now.getTime() < toTimeStamp.getTime()
          ) {
            return { status: true };
          } else {
            return { status: false };
          }
        }
      } else {
        return { status: false };
      }
    }
  };

  const generatePickUpSlots = (recurrences) => {
    let data = [];
    recurrences.forEach((rec) => {
      const now = new Date(); // now
      const start = new Date(now.getTime() - 1000 * 60 * 60 * 24); // yesterday
      // const start = now;
      const end = new Date(now.getTime() + 7 * 1000 * 60 * 60 * 24); // 7 days later
      const dates = rrulestr(rec.rrule).between(start, end);
      dates.forEach((date) => {
        rec.timeSlots.forEach((timeslot) => {
          const timeslotFromArr = timeslot.from.split(':');
          const timeslotToArr = timeslot.to.split(':');
          const fromTimeStamp = new Date(
            date.setHours(
              timeslotFromArr[0],
              timeslotFromArr[1],
              timeslotFromArr[2]
            )
          );
          const toTimeStamp = new Date(
            date.setHours(timeslotToArr[0], timeslotToArr[1], timeslotToArr[2])
          );
          // start + lead time < to
          const leadMiliSecs = timeslot.pickUpLeadTime * 60000;
          if (now.getTime() + leadMiliSecs < toTimeStamp.getTime()) {
            // if start + lead time > from -> set new from time
            let slotStart;
            let slotEnd =
              toTimeStamp.getHours() + ':' + toTimeStamp.getMinutes();
            if (now.getTime() + leadMiliSecs > fromTimeStamp.getTime()) {
              // new start time = lead time + now
              const newStartTimeStamp = new Date(now.getTime() + leadMiliSecs);
              slotStart =
                newStartTimeStamp.getHours() +
                ':' +
                newStartTimeStamp.getMinutes();
            } else {
              slotStart =
                fromTimeStamp.getHours() + ':' + fromTimeStamp.getMinutes();
            }
            // check if date already in slots
            const dateWithoutTime = date.toDateString();
            const index = data.findIndex(
              (slot) => slot.date === dateWithoutTime
            );
            if (index === -1) {
              data.push({
                date: dateWithoutTime,
                slots: [
                  {
                    start: slotStart,
                    end: slotEnd,
                  },
                ],
              });
            } else {
              data[index].slots.push({
                start: slotStart,
                end: slotEnd,
              });
            }
          }
        });
      });
    });
    return data;
  };

  const isDeliveryAvailable = (recurrences) => {
    for (let rec of recurrences) {
      const now = new Date(); // now
      const start = new Date(now.getTime() - 1000 * 60 * 60 * 24); // yesterday
      const end = new Date(now.getTime() + 1000 * 60 * 60 * 24); // tomorrow
      const dates = rrulestr(rec.rrule).between(start, now);
      if (dates.length) {
        for (let timeslot of rec.timeSlots) {
          if (timeslot.mileRanges.length) {
            const timeslotFromArr = timeslot.from.split(':');
            const timeslotToArr = timeslot.to.split(':');
            const fromTimeStamp = new Date(now.getTime());
            fromTimeStamp.setHours(
              timeslotFromArr[0],
              timeslotFromArr[1],
              timeslotFromArr[2]
            );
            const toTimeStamp = new Date(now.getTime());
            toTimeStamp.setHours(
              timeslotToArr[0],
              timeslotToArr[1],
              timeslotToArr[2]
            );
            // check if current time falls within time slot
            if (
              now.getTime() > fromTimeStamp.getTime() &&
              now.getTime() < toTimeStamp.getTime()
            ) {
              return { status: true, mileRangeId: timeslot.mileRanges[0].id };
            } else {
              return { status: false };
            }
          }
        }
      } else {
        return { status: false };
      }
    }
  };

  const generateDeliverySlots = (recurrences) => {
    let data = [];
    recurrences.forEach((rec) => {
      const now = new Date(); // now
      const start = new Date(now.getTime() - 1000 * 60 * 60 * 24); // yesterday
      // const start = now;
      const end = new Date(now.getTime() + 7 * 1000 * 60 * 60 * 24); // 7 days later
      const dates = rrulestr(rec.rrule).between(start, end);
      dates.forEach((date) => {
        rec.timeSlots.forEach((timeslot) => {
          // if multiple mile ranges, only first one will be taken
          if (timeslot.mileRanges.length) {
            const leadTime = timeslot.mileRanges[0].leadTime;
            const timeslotFromArr = timeslot.from.split(':');
            const timeslotToArr = timeslot.to.split(':');
            const fromTimeStamp = new Date(
              date.setHours(
                timeslotFromArr[0],
                timeslotFromArr[1],
                timeslotFromArr[2]
              )
            );
            const toTimeStamp = new Date(
              date.setHours(
                timeslotToArr[0],
                timeslotToArr[1],
                timeslotToArr[2]
              )
            );
            // start + lead time < to
            const leadMiliSecs = leadTime * 60000;
            if (now.getTime() + leadMiliSecs < toTimeStamp.getTime()) {
              // if start + lead time > from -> set new from time
              let slotStart;
              let slotEnd =
                toTimeStamp.getHours() + ':' + toTimeStamp.getMinutes();
              if (now.getTime() + leadMiliSecs > fromTimeStamp.getTime()) {
                // new start time = lead time + now
                const newStartTimeStamp = new Date(
                  now.getTime() + leadMiliSecs
                );
                slotStart =
                  newStartTimeStamp.getHours() +
                  ':' +
                  newStartTimeStamp.getMinutes();
              } else {
                slotStart =
                  fromTimeStamp.getHours() + ':' + fromTimeStamp.getMinutes();
              }
              // check if date already in slots
              const dateWithoutTime = date.toDateString();
              const index = data.findIndex(
                (slot) => slot.date === dateWithoutTime
              );
              if (index === -1) {
                data.push({
                  date: dateWithoutTime,
                  slots: [
                    {
                      start: slotStart,
                      end: slotEnd,
                      mileRangeId: timeslot.mileRanges[0].id,
                    },
                  ],
                });
              } else {
                data[index].slots.push({
                  start: slotStart,
                  end: slotEnd,
                  mileRangeId: timeslot.mileRanges[0].id,
                });
              }
            }
          }
        });
      });
    });
    return data;
  };

  return (
    <View style={styles.container}>
      <View style={styles.headingContainer}>
        <Text style={styles.heading}>Help us know your preference</Text>
      </View>
      {!!oops && <Text style={{ marginBottom: 20 }}>{oops}</Text>}
      <ScrollView>
        <Text style={[styles.text, { opacity: 0.6 }]}>Order for:</Text>
        <View style={{ flexDirection: 'row', marginBottom: 20 }}>
          <TouchableOpacity
            onPress={() => setType('DELIVERY')}
            style={styles.radioButton}
          >
            <Text style={styles.text}>Delivery</Text>
            {type === 'DELIVERY' && (
              <View style={[styles.check, { backgroundColor: visual.color }]}>
                <MaterialIcons name='done' size={16} color='#fff' />
              </View>
            )}
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setType('PICKUP')}
            style={styles.radioButton}
          >
            <Text style={styles.text}>Pick up</Text>
            {type === 'PICKUP' && (
              <View style={[styles.check, { backgroundColor: visual.color }]}>
                <MaterialIcons name='done' size={16} color='#fff' />
              </View>
            )}
          </TouchableOpacity>
        </View>
        <Text style={[styles.text, { opacity: 0.6 }]}>
          When would you like your order:
        </Text>
        <TouchableOpacity
          onPress={() => setTime('ONDEMAND')}
          style={[
            styles.radioButton,
            { justifyContent: 'space-between', marginBottom: 5 },
          ]}
        >
          <Text style={styles.text}>Now</Text>
          {time === 'ONDEMAND' && (
            <View style={[styles.check, { backgroundColor: visual.color }]}>
              <MaterialIcons name='done' size={16} color='#fff' />
            </View>
          )}
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setTime('PREORDER')}
          style={[
            styles.radioButton,
            { justifyContent: 'space-between', marginBottom: 5 },
          ]}
        >
          <Text style={styles.text}>Schedule for later</Text>
          {time === 'PREORDER' && (
            <View style={[styles.check, { backgroundColor: visual.color }]}>
              <MaterialIcons name='done' size={16} color='#fff' />
            </View>
          )}
        </TouchableOpacity>
        {time === 'PREORDER' && (
          <>
            <Text style={[styles.text, { opacity: 0.6, marginTop: 20 }]}>
              Select time slots:
            </Text>
            <View style={{ flexDirection: 'row' }}>
              <Picker
                selectedValue={fulfillment.date}
                style={{ height: 40, flex: 1 }}
                onValueChange={(itemValue) => {
                  setFulfillment({
                    date: itemValue,
                  });
                }}
              >
                {pickerDates.map((data) => (
                  <Picker.Item label={data.date} value={data.date} />
                ))}
              </Picker>
              <Picker
                selectedValue={fulfillment.time}
                style={{ height: 40, flex: 1 }}
                onValueChange={(itemValue) =>
                  setFulfillment({
                    ...fulfillment,
                    time: itemValue,
                  })
                }
              >
                {pickerSlots.map((data) => (
                  <Picker.Item label={data.time} value={data.time} />
                ))}
              </Picker>
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
};

export default Fulfillment;

const styles = StyleSheet.create({
  container: { padding: 10 },
  headingContainer: { justifyContent: 'center', marginBottom: 20 },
  heading: { lineHeight: 24, fontSize: 16, fontWeight: 'bold' },
  text: {
    fontSize: 16,
    marginBottom: 10,
    fontWeight: 'bold',
  },
  check: {
    borderRadius: 50,
    marginLeft: 8,
  },
  radioButton: {
    backgroundColor: '#ddd',
    height: 40,
    padding: 10,
    alignItems: 'baseline',
    justifyContent: 'center',
    flex: 1,
    flexDirection: 'row',
  },
});
