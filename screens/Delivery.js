import React from 'react';
import {
   Image,
   ScrollView,
   StyleSheet,
   Text,
   TouchableOpacity,
   View,
} from 'react-native';
import MapView from 'react-native-maps';
import orderdelivered from '../assets/imgs/orderdelivered.png';
import orderpickup from '../assets/imgs/orderpickup.png';
import orderpreparing from '../assets/imgs/orderpreparing.png';
import HeaderBack from '../components/HeaderBack';
import { height, width } from '../utils/Scalaing';

export default ({ navigation }) => {
   return (
      <ScrollView style={styles.container}>
         <HeaderBack title="Go Back" navigation={navigation} />
         <View style={styles.orderDetailsContainer}>
            <Text style={styles.orderDetailsText}>Order ID 663785267378</Text>
            <TouchableOpacity>
               <Text style={styles.helpText}>Help</Text>
            </TouchableOpacity>
         </View>
         <View style={styles.mapContainer}>
            <MapView
               initialRegion={{
                  latitude: 37.78825,
                  longitude: -122.4324,
                  latitudeDelta: 0.0922,
                  longitudeDelta: 0.0421,
               }}
               style={styles.mapStyle}
            />
            {/* <Map initialRegion={{ latitude: 48.86, longitude: 2.34 }} /> */}
            <View style={styles.orderTimeContainer}>
               <Text style={styles.orderTimeHeader}>ARRIVING IN</Text>
               <Text style={styles.orderTime}>20</Text>
               <Text style={styles.orderTime}>min</Text>
            </View>
         </View>
         <View style={styles.orderTimeline}>
            <View style={styles.timelineItem}>
               <Image
                  style={styles.timelineItemImage}
                  source={orderpreparing}
               />
            </View>
            <View style={styles.orderTimelineSepratorContainer} />
            <View style={styles.timelineItem}>
               <Image style={styles.timelineItemImage} source={orderpickup} />
            </View>
            <View style={styles.orderTimelineSepratorContainer} />
            <View style={styles.timelineItem}>
               <Image
                  style={styles.timelineItemImage}
                  source={orderdelivered}
               />
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
               Alex Tod from AlexHire is on his way to the restaurant to pickup
               your order
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
   container: {
      flex: 1,
      backgroundColor: '#fff',
   },
   orderDetailsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingHorizontal: 20,
      height: height * 0.1,
      alignItems: 'center',
   },
   orderDetailsText: {
      fontSize: 16,
      fontWeight: 'bold',
   },
   helpText: {
      color: '#3fa4ff',
      fontSize: 16,
      fontWeight: 'bold',
   },
   mapContainer: {
      height: height * 0.4,
      width,
      position: 'relative',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#f9f9f9',
   },
   mapStyle: {
      width: width,
      height: height * 0.4,
   },
   orderTimeContainer: {
      position: 'absolute',
      bottom: width * 0.05,
      right: width * 0.05,
      backgroundColor: '#44496b',
      padding: 20,
      borderRadius: 20,
      alignItems: 'center',
      justifyContent: 'center',
   },
   orderTimeHeader: {
      color: '#fff',
      fontSize: 12,
      fontWeight: 'bold',
   },
   orderTime: {
      color: '#fff',
      fontSize: 20,
      fontWeight: 'bold',
   },
   orderTimeline: {
      alignItems: 'center',
      flexDirection: 'row',
      marginTop: 10,
      marginBottom: 10,
      paddingHorizontal: 10,
   },
   timelineItem: {
      borderRadius: (width * 0.1 + 20) / 2,
      padding: 10,
      backgroundColor: '#ddefff',
   },
   timelineItemImage: {
      height: width * 0.1,
      width: width * 0.1,
      resizeMode: 'contain',
   },
   orderTimelineSepratorContainer: {
      height: 1,
      flex: 1,
      borderTopColor: 'gray',
      borderTopWidth: 2,
      borderStyle: 'dashed',
      borderRadius: 1,
   },
   orderInfoConatiner: {
      height: height * 0.15,
      justifyContent: 'center',
   },
   orderInfoText: {
      fontWeight: 'bold',
      textAlign: 'center',
      fontSize: 22,
   },
   orderInfoTextDescription: {
      fontSize: 16,
      textAlign: 'center',
   },
   riderContainer: {
      height: height * 0.15,
      backgroundColor: '#f3f3f3',
      flexDirection: 'row',
      paddingHorizontal: 20,
      alignItems: 'center',
   },
   avatar: {
      height: 40,
      width: 40,
      borderRadius: 20,
      resizeMode: 'cover',
      marginRight: 10,
   },
   riderText: {
      width: width * 0.8,
   },
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
