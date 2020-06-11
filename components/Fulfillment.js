import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { RRule, RRuleSet, rrulestr } from 'rrule';
import { MaterialIcons } from '@expo/vector-icons';
import { useAppContext } from '../context/app';
import { useLazyQuery, useSubscription } from '@apollo/react-hooks';
import { PREORDER_PICKUP, ONDEMAND_PICKUP } from '../graphql';

const Fulfillment = () => {
  const { visual, availability } = useAppContext();
  const [type, setType] = React.useState('');
  const [time, setTime] = React.useState('');
  const [oops, setOops] = React.useState('');

  const { data: { preOrderPickup = [] } = {} } = useSubscription(
    PREORDER_PICKUP
  );

  const { data: { onDemandPickup = [] } = {} } = useSubscription(
    ONDEMAND_PICKUP
  );

  console.log(onDemandPickup);

  React.useEffect(() => {
    if (time && type) {
      setOops('');
      switch (time + '_' + type) {
        case 'PREORDER_PICKUP': {
          if (preOrderPickup[0].recurrences.length) {
            console.log(generateTimeSlots(preOrderPickup[0].recurrences));
          } else {
            setOops('Sorry! No time slots avaiable.');
          }
          break;
        }
        case 'ONDEMAND_PICKUP': {
          if (onDemandPickup[0].recurrences.length) {
            console.log(isPickUpAvailable(onDemandPickup[0].recurrences));
          } else {
            setOops('Sorry! Option not available currently.');
          }
          break;
        }
        case 'PREORDER_DELIVERY': {
          break;
        }
        case 'ONDEMAND_PICKUP': {
          break;
        }
        default: {
          return setOops('Unkown error!');
        }
      }
    }
  }, [type, time]);

  // {
  //   "id": 3,
  //   "type": "PREORDER_PICKUP",
  //   "rrule": "RRULE:FREQ=DAILY",
  //   "timeSlots": [
  //     {
  //       "id": 5,
  //       "to": "17:00:00",
  //       "from": "13:00:00",
  //       "pickUpLeadTime": 120
  //     },
  //     {
  //       "id": 7,
  //       "to": "21:00:00",
  //       "from": "19:00:00",
  //       "pickUpLeadTime": 120
  //     }
  //   ]
  // }

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
          console.log('isPickUpAvailable -> fromTimeStamp', fromTimeStamp);
          console.log('isPickUpAvailable -> now', now);
          console.log('isPickUpAvailable -> toTimeStamp', toTimeStamp);
          // check if current time falls within time slot

          if (
            now.getTime() > fromTimeStamp.getTime() &&
            now.getTime() < toTimeStamp.getTime()
          ) {
            console.log('YESSS');
            return true;
          }
        }
      } else {
        return false;
      }
    }
  };

  const generateTimeSlots = (recurrences) => {
    let data = [];
    recurrences.forEach((rec) => {
      const now = new Date(); // now
      // const start = new Date(now.getTime() - 1000 * 60 * 60 * 24); // yesterday
      const start = now;
      const end = new Date(now.getTime() + 7 * 1000 * 60 * 60 * 24); // 7 days later
      const dates = rrulestr(rec.rrule).between(start, end);
      console.log(dates);
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
          if (start.getTime() + leadMiliSecs < toTimeStamp.getTime()) {
            // if start + lead time > from -> set new from time
            let slotStart;
            let slotEnd =
              toTimeStamp.getHours() + ':' + toTimeStamp.getMinutes();
            if (start.getTime() + leadMiliSecs > fromTimeStamp.getTime()) {
              // new start time = lead time + now
              const newStartTimeStamp = new Date(
                start.getTime() + leadMiliSecs
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
