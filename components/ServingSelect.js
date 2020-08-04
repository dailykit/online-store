import { Feather, MaterialIcons } from '@expo/vector-icons'
import React from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { useAppContext } from '../context/app'
import { discountedPrice } from '../utils'

const ServingSelect = ({
   index,
   isSelected,
   setServingIndex,
   size,
   price,
   discount,
   setProductOption,
   setSelectedOption,
}) => {
   const { visual } = useAppContext()

   return (
      <TouchableOpacity
         onPress={() => {
            setServingIndex(index - 1)
            setSelectedOption()
            setProductOption()
         }}
         style={[
            styles.servingSelectContainer,
            {
               borderColor: isSelected
                  ? visual.color
                     ? visual.color
                     : '#3fa4ff'
                  : '#ececec',
               backgroundColor: '#fff',
               display: 'flex',
            },
         ]}
      >
         {Boolean(discount) && (
            <View
               style={[
                  styles.discountBanner,
                  { backgroundColor: visual.color },
               ]}
            >
               <Text style={styles.discountBannerText}>{discount}% off</Text>
            </View>
         )}
         <View style={styles.servingSelectContainer_one}>
            <Feather size={14} name="user" />
            <Text style={{ fontWeight: 'bold' }}>
               {'    '}
               {size}
            </Text>
         </View>
         <View style={styles.servingSelectContainer_two}>
            {discount ? (
               <>
                  <Text
                     style={[
                        styles.price_text,
                        { textDecorationLine: 'line-through' },
                     ]}
                  >
                     $ {price}
                  </Text>
                  <Text style={[styles.price_text, { marginLeft: 16 }]}>
                     $ {discountedPrice({ price, discount })}
                  </Text>
               </>
            ) : (
               <Text style={styles.price_text}>$ {price}</Text>
            )}
         </View>
         <View style={styles.servingSelectContainer_three}>
            {isSelected && (
               <View
                  style={[
                     styles.done_container,
                     { backgroundColor: visual.color || '#3fa4ff' },
                  ]}
               >
                  <MaterialIcons name="done" size={16} color="#fff" />
               </View>
            )}
         </View>
      </TouchableOpacity>
   )
}

const styles = StyleSheet.create({
   done_container: {
      backgroundColor: '#3fa4ff',
      borderRadius: 50,
      justifyContent: 'center',
      alignItems: 'center',
      marginLeft: 5,
   },

   servingSelectContainer: {
      height: 50,
      flexDirection: 'row',
      borderWidth: 1,
      marginBottom: 5,
      borderColor: '#fff',
      position: 'relative',
   },
   servingSelectContainer_one: {
      flex: 7,
      justifyContent: 'flex-start',
      alignItems: 'center',
      flexDirection: 'row',
      paddingLeft: 20,
   },
   servingSelectContainer_two: {
      flex: 2,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
   },
   servingSelectContainer_three: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
   },
   discountBanner: {
      position: 'absolute',
      paddding: 2,
   },
   discountBannerText: {
      color: '#fff',
      fontSize: '0.7rem',
   },
})

export default ServingSelect
