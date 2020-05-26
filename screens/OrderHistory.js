import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import HeaderBack from '../components/HeaderBack';
import { Accordion } from 'native-base';
import { Divider } from '@ui-kitten/components';
import EStyleSheet from 'react-native-extended-stylesheet';
import { ScrollView } from 'react-native';
const dataArray = [
  { title: '3 items', content: 'Lorem ipsum dolor sit amet' },
  { title: 'Bill Details', content: 'Lorem ipsum dolor sit amet' },
];
export const OrderHistory = ({ navigation }) => {
  return (
    <ScrollView style={styles.container}>
      <HeaderBack title='Order History' navigation={navigation} />
      {[1, 2, 3].map((order, _key) => (
        <>
          <TouchableOpacity
            key={_key}
            onPress={() => navigation.navigate('DeliveryScreen')}
            style={styles.card}
          >
            <Text style={styles.title}>Order ID: VEGADA342615</Text>
            <Text style={[styles.muted, styles.bold]}>
              Ordered on: <Text style={styles.lite}>Tuesday May 22</Text>
            </Text>
            <Text style={[styles.muted, styles.bold]}>
              Deliver on: <Text style={styles.lite}>Webnesday May 23</Text>
            </Text>
            <Text style={styles.muted}>
              123, apartment name, street rd, city -0000
            </Text>
            <Accordion
              headerStyle={styles.header}
              dataArray={dataArray}
              expanded={0}
            />
            <View style={styles.flexContainer}>
              <Text style={styles.total}>Total</Text>
              <Text style={styles.total}>$ 6.5</Text>
            </View>
          </TouchableOpacity>
          <Divider />
        </>
      ))}
    </ScrollView>
  );
};

const styles = EStyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  card: {
    padding: 15,
    borderBottomColor: '#dedede',
    borderBottomWidth: 1,
    marginBottom: 10,
  },
  title: {
    fontWeight: 'bold',
    fontSize: '$l',
    marginBottom: 10,
  },
  muted: {
    color: 'gray',
    fontSize: '$s',
    marginBottom: 10,
  },
  bold: {
    fontWeight: 'bold',
  },
  lite: {
    fontWeight: 'normal',
  },
  flexContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  total: {
    fontWeight: 'bold',
    fontSize: '$l',
    marginTop: 10,
  },
  header: {
    backgroundColor: '#fff',
  },
});
