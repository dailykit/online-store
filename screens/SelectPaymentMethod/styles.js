import EStyleSheet from 'react-native-extended-stylesheet'
import { height, width } from '../../utils/Scaling'

export const styles = EStyleSheet.create({
   conatiner: {
      flex: 1,
      backgroundColor: '#fff',
   },
   title: {
      fontSize: '$xl',
      padding: 20,
   },
   cardNumberConatiner: {
      flexDirection: 'column',
      flex: 1,
      padding: 8,
   },
   cardNumberOptionConatiner: {
      justifyContent: 'center',
      height: height * 0.12,
      flexDirection: 'row',
      borderBottomWidth: 1,
      borderColor: '#dedede',
      marginBottom: 4,
   },
   cardNumberTextContainer: {
      flex: 3,
      justifyContent: 'center',
   },
   cardNumberText: {
      width: width * 0.7,
      paddingLeft: 20,
   },
   cardNumberSelectedContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'flex-end',
   },
   checkContainer: {
      backgroundColor: '#3fa4ff',
      height: 24,
      width: 24,
      borderRadius: 12,
      justifyContent: 'center',
      alignItems: 'center',
   },
   switch: {
      alignSelf: 'center',
      marginTop: 20,
      marginBottom: 20,
   },

   label: {
      color: 'black',
      fontSize: 12,
      display: 'none',
      height: 0,
      width: 0,
      margin: 0,
      padding: 0,
      borderWidth: 0,
   },
   input: {
      fontSize: 16,
      color: 'black',
      display: 'none',
      height: 0,
      width: 0,
      margin: 0,
      padding: 0,
      borderWidth: 0,
   },
})
