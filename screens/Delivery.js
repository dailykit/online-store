import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import HeaderBack from '../components/HeaderBack';

import orderpreparing from '../assets/imgs/orderpreparing.png';
import orderpickup from '../assets/imgs/orderpickup.png';
import orderdelivered from '../assets/imgs/orderdelivered.png';

export const Delivery = ({ navigation }) => {
  return (
    <ScrollView style={styles.container}>
      <HeaderBack title='Go Back' navigation={navigation} />
      <View style={styles.orderDetailsContainer}>
        <Text style={styles.orderDetailsText}>Order ID </Text>
        <TouchableOpacity>
          <Text style={styles.helpText}>Help</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.mapContainer}>
        <Text>MAP</Text>
        <View style={styles.orderTimeContainer}>
          <Text style={styles.orderTime}>20</Text>
          <Text style={styles.orderTime}>min</Text>
        </View>
      </View>
      <View style={styles.orderTimeline}>
        <View style={styles.timelineItem}>
          <Image source={orderpreparing} />
        </View>
        <View style={styles.orderTimelineSepratorContainer} />
        <View style={styles.timelineItem}>
          <Image source={orderpickup} />
        </View>
        <View style={styles.orderTimelineSepratorContainer} />
        <View style={styles.timelineItem}>
          <Image source={orderdelivered} />
        </View>
      </View>
      <View style={styles.orderInfoConatiner}>
        <Text style={styles.orderInfoText}>Order Recieved</Text>
        <Text style={styles.orderInfoTextDescription}>
          Your order is confirmed and being prepared
        </Text>
      </View>
      <View style={styles.riderContainer}>
        <Image
          style={styles.avatar}
          source={{ uri: 'https://picsum.photos/200' }}
        />
        <Text style={styles.riderText}>
          Alex Tod from AlexHire is on his way to the restaurant to pickup your
          order
        </Text>
      </View>
      <View style={styles.send_details_container}>
        <TouchableOpacity style={styles.send_email_container}>
          <Text style={styles.send_email_container_text}>
            EMAIL RECIPE CARD
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.download_recpie_card}>
          <Text style={styles.download_recpie_card_text}>
            DOWNLOAD RECIPE CARD
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {},
  orderDetailsContainer: {},
  orderDetailsText: {},
  helpText: {},
  mapContainer: {},
  orderTimeContainer: {},
  orderTime: {},
  orderTimeline: {},
  timelineItem: {},
  orderTimelineSepratorContainer: {},
  orderInfoConatiner: {},
  orderInfoText: {},
  orderInfoTextDescription: {},
  riderContainer: {},
  avatar: {},
  riderText: {},
  send_details_container: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
  },
  send_email_container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderWidth: 1,
    borderColor: '#3fa4fd',
  },
  download_recpie_card: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    backgroundColor: '#3fa4fd',
    overflow: 'hidden',
    borderColor: '#3fa4fd',
    borderWidth: 1,
  },
  download_recpie_card_text: {
    color: 'white',
    fontWeight: 'bold',
  },
  send_email_container_text: {
    fontWeight: 'bold',
  },
});
