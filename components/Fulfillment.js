import { useSubscription } from '@apollo/react-hooks';
import { MaterialIcons } from '@expo/vector-icons';
import { Picker } from '@react-native-community/picker';
import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { rrulestr } from 'rrule';
import { useAppContext } from '../context/app';
import {
  ONDEMAND_DELIVERY,
  ONDEMAND_PICKUP,
  PREORDER_DELIVERY,
  PREORDER_PICKUP,
} from '../graphql';

import {
  generateDeliverySlots,
  isDeliveryAvailable,
  generatePickUpSlots,
  isPickUpAvailable,
  generateMiniSlots,
} from '../utils/fulfillment';

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
    if (fulfillment.date && time === 'PREORDER') {
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
    if (fulfillment.time && time === 'PREORDER') {
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
                  const result = isPickUpAvailable(
                    onDemandPickup[0].recurrences
                  );
                  if (result.status) {
                    const date = new Date();
                    setFulfillment({
                      date: date.toDateString(),
                      time:
                        date.getHours() +
                        ':' +
                        makeDoubleDigit(date.getMinutes()),
                    });
                  } else {
                    setOops('Sorry! Option not available currently!');
                  }
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
                  const result = isDeliveryAvailable(
                    onDemandDelivery[0].recurrences
                  );
                  if (result.status) {
                    const date = new Date();
                    setFulfillment({
                      date: date.toDateString(),
                      time:
                        date.getHours() +
                        ':' +
                        makeDoubleDigit(date.getMinutes()),
                      mileRangeId: result.mileRangeId,
                    });
                  } else {
                    setOops('Sorry! Option not available currently!');
                  }
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

  const confirm = () => {
    if (oops || !type || !time) {
      return console.log('Invalid selections!');
    }
    console.log(fulfillment);
  };

  return (
    <View style={styles.container}>
      <View style={styles.headingContainer}>
        <Text style={styles.heading}>Help us know your preference</Text>
      </View>
      {!!oops && (
        <Text
          style={{
            marginBottom: 20,
            backgroundColor: '#ff5a52',
            padding: 10,
            color: '#fff',
          }}
        >
          {oops}
        </Text>
      )}
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
                  <Picker.Item
                    key={data.date}
                    label={data.date}
                    value={data.date}
                  />
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
                  <Picker.Item
                    key={data.time}
                    label={data.time}
                    value={data.time}
                  />
                ))}
              </Picker>
            </View>
          </>
        )}
      </ScrollView>
      <TouchableOpacity
        style={{
          marginTop: 20,
          height: 40,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: visual.color,
        }}
        onPress={confirm}
      >
        <Text style={{ color: '#fff', fontWeight: 'bold' }}>Confirm</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Fulfillment;

const styles = StyleSheet.create({
  container: { padding: 10, height: '100%', position: 'relative' },
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

/*
Case : PREORDER PICKUP (all the logics are in similiar fashion)
assume current time to be 15:00 (3pm) and date to be 11 June

1. get all recurences using subscriptions, so everytime they change any option, they see latest values
2. check if master pickup is on/off, if off then show message
3. check if I got any recurrences or not, if 0 then show message
4. pass recurrences to -> generatePickUpSlots(recurrences)
   - loop over each recurrence
   a- so let's say our first recurrence is 'DAILY'
   --- get all dates that satify this recurrence within next 7 days.
   --- loop over all the dates
   b--- so let's say first date is 11 June (today)
   ---- now in step 4a we have time slots, loop over all the time slots
   c----- let's say first time slot is: 14:00 - 18:00      (2pm - 6pm) 
   ------ check if current time + lead time < timeslot end time(to), if no then skip
   ------ if yes then check, if current time + lead time > timeslot start time(from)
   ------ if no -> then 14:00 - 18:00 is a perfect slot for this date(4b)
   ------ if yes -> then new timeslot start time will be = current time + lead time, i.e. 15:00 - 18:00
   ------ at the end of each step(4c), push data into an array according to dates, so all the time slots for same day will fall under one date
5. now we have data grouped according to our need, pass this data into -> generateMiniSlots(data, 15) [second params is size in minutes]
  - it will again loop over all the dates, slice all the time slots
  - make another array with dates and each date will have these 15 mins timestamps.
*/
