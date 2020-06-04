import React from 'react';
import {
   View,
   Text,
   StyleSheet,
   ScrollView,
   Image,
   Dimensions,
} from 'react-native';
import HeaderBack from '../components/HeaderBack';
import { Badge } from '../assets/imgs/Badge';
import { StaffSafetyContainer } from '../components/StaffSafetyContainer';
import Cart from '../components/Cart';
import { Spinner } from '@ui-kitten/components';

import thermometer from '../assets/imgs/thermometer.png';
import patient from '../assets/imgs/patient.png';
import flat from '../assets/imgs/flat.png';
import liquidSoap from '../assets/imgs/liquid-soap.png';
import { useSubscription } from '@apollo/react-hooks';
import { SAFETY_CHECK } from '../graphql';

import { height, width } from '../utils/Scalaing';

const SafetyScreen = () => {
   const [check, setCheck] = React.useState(undefined);

   const { loading, error } = useSubscription(SAFETY_CHECK, {
      onSubscriptionData: data => {
         if (data.subscriptionData.data.safety_safetyCheck.length)
            setCheck(data.subscriptionData.data.safety_safetyCheck[0]);
      },
   });

   if (error) console.log(error);
   if (loading)
      return (
         <View
            style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}
         >
            <Spinner status="info" />
         </View>
      );

   return (
      <>
         <ScrollView style={styles.container}>
            <View
               style={{
                  flex: 1,
                  alignItems: 'center',
                  backgroundColor: '#fff',
               }}
            >
               <View style={styles.badgeConatiner}>
                  <Badge style={{ width: 80, height: 80 }} />
               </View>
               <Text style={styles.title}>Our Staff Safety Report</Text>

               <View style={styles.staffConatiner}>
                  {check?.SafetyCheckPerUsers?.length &&
                     check.SafetyCheckPerUsers.map(checkup => (
                        <StaffSafetyContainer
                           key={checkup.id}
                           checkup={checkup}
                        />
                     ))}
               </View>

               <View style={styles.StaffSafetyContainer}>
                  <Text style={[styles.title, { color: 'white' }]}>
                     Our Staff Safety
                  </Text>
                  <Text style={styles.desc}>
                     Any staff member who feels ill or exhibit symptoms with
                     COVID-19 has been told to stay home untile cleared from a
                     doctor.
                  </Text>
                  <View style={styles.measureConatiner}>
                     <Image style={styles.icons} source={thermometer} />
                     <Text style={styles.measureText}>
                        Temperature checks after every 2 day
                     </Text>
                  </View>
                  <View style={styles.measureConatiner}>
                     <Image style={styles.icons} source={liquidSoap} />
                     <Text style={styles.measureText}>
                        Sanitization every 4 hours
                     </Text>
                  </View>
                  <View style={styles.measureConatiner}>
                     <Image style={styles.icons} source={patient} />
                     <Text style={styles.measureText}>
                        Use of masks all the time
                     </Text>
                  </View>
               </View>

               <View style={styles.packagingSafetyConatiner}>
                  <Text style={[styles.title]}>Our Packaging Safety</Text>
                  <Image source={flat} style={styles.packagingImage} />
                  <Text style={[styles.desc, { color: 'black' }]}>
                     Any staff member who feels ill or exhibit symptoms with
                     COVID-19 has been told to stay home untile cleared from a
                     doctor.
                  </Text>
               </View>
            </View>
            <View style={{ padding: 40 }} />
         </ScrollView>
      </>
   );
};

export default SafetyScreen;

const styles = StyleSheet.create({
   container: {
      flex: 1,
   },
   badgeConatiner: {
      width: '100%',
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 20,
      marginBottom: 20,
   },
   staffConatiner: {
      width: '100%',
   },
   desc: {
      color: 'white',
      marginTop: 10,
      textAlign: 'center',
   },
   StaffSafetyContainer: {
      // width: width * 0.9,
      backgroundColor: '#2e2d4d',
      padding: 20,
      borderRadius: 20,
      marginTop: 40,
   },
   title: {
      fontSize: 24,
      textAlign: 'center',
      fontWeight: 'bold',
   },
   measureConatiner: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-around',
      height: 120,
   },
   measureText: {
      flex: 5,
      color: 'white',
      fontSize: 16,
      fontWeight: 'bold',
      textAlign: 'center',
   },
   icons: {
      height: 50,
      width: 50,
      flex: 1,
      marginRight: 10,
      resizeMode: 'contain',
   },
   packagingSafetyConatiner: {
      // width: width * 0.9,
      backgroundColor: '#eddea4',
      padding: 20,
      borderRadius: 20,
      marginTop: 20,
      alignItems: 'center',
   },
   packagingImage: {
      resizeMode: 'contain',
      height: 80,
      width: 80,
      marginTop: 30,
      marginBottom: 30,
   },
});
