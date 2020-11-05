import React from 'react'
import { Text, TouchableOpacity, View } from 'react-native'
import EStyleSheet from 'react-native-extended-stylesheet'
import { useAppContext } from '../context/app'
import { width } from '../utils/Scaling'

export const CategoryBanner = ({ navigation, title, showLink }) => {
   const { visual } = useAppContext()

   return (
      <View style={styles.container}>
         <Text style={styles.title}>{title}</Text>
         {showLink && (
            <TouchableOpacity
               onPress={() =>
                  navigation.navigate('CategoryProductsPage', {
                     category: title,
                  })
               }
            >
               <Text
                  style={{
                     color: visual.color,
                     textDecorationLine: 'underline',
                  }}
               >
                  See {title}
               </Text>
            </TouchableOpacity>
         )}
      </View>
   )
}

const styles = EStyleSheet.create({
   container: {
      height: 60,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderBottomColor: '#eaeded',
      borderBottomWidth: 1,
      marginHorizontal: width > 768 ? 20 : 5,
   },
   title: {
      fontSize: width > 768 ? '1.3rem' : '1.1rem',
      fontWeight: 'bold',
   },
})
