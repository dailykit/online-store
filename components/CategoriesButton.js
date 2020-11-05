import React from 'react'
import { Text, TouchableOpacity } from 'react-native'
import EStyleSheet from 'react-native-extended-stylesheet'
import { useAppContext } from '../context/app'
import { width } from '../utils/Scaling'

const CategoriesButton = ({ title, id, onPress }) => {
   const { visual } = useAppContext()

   const [isHovered, setIsHovered] = React.useState(false)
   return (
      <TouchableOpacity
         onMouseEnter={() => setIsHovered(true)}
         onMouseLeave={() => setIsHovered(false)}
         onPress={() => onPress(id)}
         style={{
            paddingHorizontal: 10,
            justifyContent: 'center',
            alignItems: 'center',
            height: width > 768 ? 50 : 40,
            flexDirection: 'row',
            backgroundColor: isHovered ? visual.color : '#fff',
            paddingVertical: width > 768 ? 30 : 10,
            marginHorizontal: 10,
            width: 'auto',
            minWidth: width > 768 ? 200 : 100,
            borderStyle: 'solid',
            borderWidth: 1,
            borderColor: isHovered ? visual.color : '#333',
            // opacity: isHovered ? 0.6 : 1,
            shadowColor: isHovered ? '#111' : '#fff',
            shadowOffset: {
               width: 0,
               height: 4,
            },
            shadowOpacity: isHovered ? 0.3 : 0.1,
            shadowRadius: 4.65,
            elevation: isHovered ? 24 : 4,
         }}
      >
         <Text
            style={[
               {
                  textAlign: 'center',
                  color: isHovered ? '#fff' : '#333',
                  fontWeight: isHovered ? 'bold' : 'normal',
               },
               styles.button,
            ]}
         >
            {title.toUpperCase()}
         </Text>
      </TouchableOpacity>
   )
}

export default CategoriesButton

const styles = EStyleSheet.create({
   button: {
      fontSize: '$s',
   },
})
