import { View } from 'react-native'
import React from 'react'
import { StyleSheet } from 'react-native'
import { height, width } from '../utils/Scaling'

const Container = ({ children }) => {
   return (
      <View style={styles.container}>
         <View style={styles.content}>{children}</View>
      </View>
   )
}

export default Container

const styles = StyleSheet.create({
   container: {
      maxWidth: width > 1280 ? 1280 : width,
      minHeight: height,
      backgroundColor: '#fff',
      alignItems: 'center',
   },
   content: {
      maxWidth: 768,
      height: '100%',
   },
})
