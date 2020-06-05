import React from 'react';
import { StyleSheet, Text, View, Dimensions, Image } from 'react-native';
import thermometer from '../assets/imgs/thermometer.png';
import patient from '../assets/imgs/patient.png';
import flat from '../assets/imgs/flat.png';
import liquidSoap from '../assets/imgs/liquid-soap.png';
import EStyleSheet from 'react-native-extended-stylesheet';

import { height, width } from '../utils/Scalaing';

export const StaffSafetyContainer = ({ checkup }) => {
   return (
      <View style={styles.conatiner}>
         <View style={styles.row}>
            <Image
               source={{ uri: 'https://picsum.photos/200' }}
               style={styles.avatar}
            />
            <Text style={styles.name}>
               {checkup.user.firstName + ' ' + checkup.user.lastName}
            </Text>
         </View>
         <View style={[styles.row, { justifyContent: 'space-between' }]}>
            <View style={styles.col1}>
               <Text style={styles.post}></Text>
            </View>
            <View style={styles.col2}>
               <View style={styles.iconsContainer}>
                  {checkup.usesSanitizer && (
                     <Image style={styles.image} source={liquidSoap} />
                  )}
               </View>
               <View style={styles.iconsContainer}>
                  {checkup.usesMask && (
                     <Image style={styles.image} source={patient} />
                  )}
               </View>
               <View style={styles.iconsContainer}>
                  <Image style={styles.image} source={thermometer} />
                  <Text style={styles.temp}>{checkup.temperature} F</Text>
               </View>
            </View>
         </View>
      </View>
   );
};

const styles = StyleSheet.create({
   conatiner: {
      width: '100%',
      backgroundColor: '#f3f3f3',
      padding: 20,
      marginTop: 10,
   },
   row: {
      flexDirection: 'row',
      alignItems: 'center',
   },
   avatar: {
      height: 40,
      width: 40,
      borderRadius: 20,
      marginRight: 10,
   },
   name: {
      fontSize: 14,
      fontWeight: 'bold',
   },
   col1: {},
   post: {},
   col2: {
      flexDirection: 'row',
   },
   iconsContainer: {
      backgroundColor: '#2e2d4d',
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'row',
      marginLeft: 10,
      padding: 10,
      borderRadius: 20,
   },
   image: {
      height: 20,
      width: 20,
   },
   temp: {
      color: 'white',
      marginLeft: 6,
   },
});
