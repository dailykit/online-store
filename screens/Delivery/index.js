import React from 'react';
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import MapView from 'react-native-maps';
import orderdelivered from '../../assets/imgs/orderdelivered.png';
import orderpickup from '../../assets/imgs/orderpickup.png';
import orderpreparing from '../../assets/imgs/orderpreparing.png';
import HeaderBack from '../../components/HeaderBack';
import { styles } from './styles';

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

