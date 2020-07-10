import EStyleSheet from 'react-native-extended-stylesheet'
import { height, width } from '../../utils/Scalaing'

export const styles = EStyleSheet.create({
   container: {
      marginVertical: 20,
      width: width > 768 ? 768 : width,
      marginHorizontal: 'auto',
      padding: width > 768 ? 20 : 10,
   },
   orderHeading: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 10,
   },
   map: {
      height: height * 0.4,
      width: '100%',
      marginBottom: 10,
   },
   orderStatus: {
      paddingVertical: 10,
      marginBottom: 10,
      justifyContent: 'space-around',
      alignItems: 'center',
   },
   orderStatusIllustration: {
      width: '100%',
      flexDirection: 'row',
      justifyContent: 'space-around',
      marginBottom: 10,
   },
   orderStatusImageContainer: {
      height: 60,
      width: 60,
      padding: 10,
      borderRadius: '50%',
      justifyContent: 'center',
      alignItems: 'center',
   },
   orderStatusText: {
      fontSize: '1.2rem',
      fontWeight: 'bold',
      color: '#333',
   },
   trackingCode: {
      padding: 5,
      backgroundColor: '#ccc',
   },
   deliveryGuy: {
      backgroundColor: '#f3f3f3',
      padding: 5,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
   },
   address: {
      marginBottom: 20,
   },
})
