import React from 'react'
import { Text, TouchableOpacity, View } from 'react-native'
import EStyleSheet from 'react-native-extended-stylesheet'
import { Badge } from '../assets/imgs/Badge'
import { useDrawerContext } from '../context/drawer'
import { height, width } from '../utils/Scalaing'

export const SafetyBanner = ({ navigation }) => {
   const { open } = useDrawerContext()

   if (width > 768)
      return (
         <View style={styles.desktopContainer}>
            <View style={styles.desktopBadge}>
               <Badge height={52} width={52} />
            </View>
            <View style={{ flex: 3 }}>
               <View style={styles.desktopTextContainer}>
                  <View>
                     <Text style={styles.desktopTitle}>
                        Best Safety Standards
                     </Text>
                     <Text style={styles.desktopText}>
                        We keeping safety measures to keep your food safe.
                     </Text>
                  </View>
                  <TouchableOpacity
                     style={styles.viewSafetyButton}
                     onPress={() => open('Safety')}
                  >
                     <Text style={styles.viewSafetyButtonText}>
                        Check Safety Report >
                     </Text>
                  </TouchableOpacity>
               </View>
            </View>
         </View>
      )
   return (
      <TouchableOpacity style={styles.container} onPress={() => open('Safety')}>
         <View
            style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
         >
            <Badge height={52} width={52} />
         </View>
         <View style={{ flex: 3 }}>
            <View style={styles.textConatiner}>
               <Text style={styles.title}>Best Safety Standards</Text>
               <Text style={styles.text}>
                  We keeping safety measures to keep your food safe.
               </Text>
               <Text style={[styles.text]}>
                  Check our staff safety report >
               </Text>
            </View>
         </View>
      </TouchableOpacity>
   )
}

const styles = EStyleSheet.create({
   desktopContainer: {
      backgroundColor: '#2e2d4d',
      width: '100%',
      alignItems: 'center',
      flexDirection: 'row',
      height: 120,
      marginHorizontal: width > 768 ? 20 : 0,
   },
   desktopTextContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
   },
   desktopBadge: {
      width: 120,
      justifyContent: 'center',
      alignItems: 'center',
   },
   desktopTitle: {
      fontSize: '$xl',
      color: 'white',
   },
   desktopText: {
      fontSize: '$m',
      color: 'white',
   },
   viewSafetyButton: {
      fontSize: '$m',
      marginRight: 16,
      fontWeight: 500,
      borderRadius: 8,
      color: '#000',
      backgroundColor: '#fff',
      paddingVertical: 8,
      paddingHorizontal: 12,
      justifyContent: 'center',
   },
   viewSafetyButtonText: {
      fontWeight: 500,
   },
   container: {
      backgroundColor: '#2e2d4d',
      width,
      marginBottom: 10,
      alignItems: 'center',
      flexDirection: 'row',
      height: height * 0.18,
   },
   textConatiner: {
      paddingHorizontal: 10,
      justifyContent: 'space-between',
   },
   title: {
      fontSize: '$m',
      fontWeight: 'bold',
      color: 'white',
   },
   text: {
      fontSize: '$s',
      color: 'white',
   },
})
