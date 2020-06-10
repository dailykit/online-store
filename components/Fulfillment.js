import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useAppContext } from '../context/app';
import { useLazyQuery } from '@apollo/react-hooks';
import { TIME_SLOTS } from '../graphql';

const Fulfillment = () => {
  const { visual } = useAppContext();
  const [type, setType] = React.useState('DELIVERY');
  const [time, setTime] = React.useState('ONDEMAND');

  const [fetchTimeSlots, { data, error, loading }] = useLazyQuery(TIME_SLOTS);

  console.log(data);

  React.useEffect(() => {
    if (time === 'PREORDER') {
      console.log(time, type);
      fetchTimeSlots({
        variables: {
          distance: 2,
          type: time + '_' + type,
        },
      });
    }
  }, [type, time]);

  return (
    <View style={styles.container}>
      <View style={styles.headingContainer}>
        <Text style={styles.heading}>Help us know your preference</Text>
      </View>
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
