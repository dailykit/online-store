import { useSubscription } from '@apollo/react-hooks'
import { Spinner } from 'react-native'
import React from 'react'
import { Image, ScrollView, Text, View } from 'react-native'
import Badge from '../../assets/svgs/Badge'
import flat from '../../assets/imgs/flat.png'
import liquidSoap from '../../assets/imgs/liquid-soap.png'
import patient from '../../assets/imgs/patient.png'
import thermometer from '../../assets/imgs/thermometer.png'
import { StaffSafetyContainer } from '../../components/StaffSafetyContainer'
import { SAFETY_CHECK } from '../../graphql'
import { styles } from './styles'

export default ({ navigation }) => {
   const [check, setCheck] = React.useState(undefined)

   const { loading, error } = useSubscription(SAFETY_CHECK, {
      onSubscriptionData: data => {
         if (data.subscriptionData.data.safety_safetyCheck.length)
            setCheck(data.subscriptionData.data.safety_safetyCheck[0])
      },
   })

   if (error) console.log(error)
   if (loading)
      return (
         <View
            style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}
         >
            <Spinner size="large" />
         </View>
      )

   return (
      <>
         <ScrollView style={styles.container}>
            <View
               style={{
                  flex: 1,
                  alignItems: 'center',
                  backgroundColor: '#fff',
                  width: '100%',
                  padding: 10,
               }}
            >
               <View style={styles.badgeConatiner}>
                  <Badge style={{ width: 80, height: 80 }} />
               </View>
               <Text style={styles.title}>Our Staff Safety Report</Text>

               <View style={styles.staffConatiner}>
                  {Boolean(check?.SafetyCheckPerUsers?.length) &&
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
   )
}
