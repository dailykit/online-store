import EStyleSheet from 'react-native-extended-stylesheet'
import { width } from '../../utils/Scalaing'

export const styles = EStyleSheet.create({
   heading: {
      fontSize: '$l',
      fontWeight: 'bold',
      padding: 12,
      color: '#666',
      paddingHorizontal: width > 768 ? '20%' : 12,
   },
   outerContainer: {
      marginTop: width > 768 ? 20 : 5,
      flex: 1,
   },
   center: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
   },
   container: {
      flex: 1,
      backgroundColor: '#fff',
      paddingHorizontal: width > 768 ? '20%' : 0,
   },
   card: {
      padding: width > 768 ? 8 : 12,
      marginBottom: 20,
      borderRadius: 4,
      shadowColor: '#666',
      shadowOffset: {
         width: 0,
         height: 4,
      },
      shadowOpacity: 0.3,
      shadowRadius: 4.65,
      elevation: 4,
   },
})
