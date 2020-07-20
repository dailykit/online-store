import React from 'react'
import { View, Text } from 'react-native'
import Header from '../../components/Header'

const Search = ({ navigation, route }) => {
   const { query } = route.params

   return (
      <View>
         <Header navigation={navigation} />
         <Text>Searching '{query || 'Nothing'}'...</Text>
      </View>
   )
}

export default Search
