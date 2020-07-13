import EStyleSheet from 'react-native-extended-stylesheet'
import { height, width } from '../../utils/Scalaing'

export const styles = EStyleSheet.create({
   wrapper: {
      marginLeft: 'auto',
      marginRight: 'auto',
      width: width > 980 ? 980 : width,
      marginVertical: width > 768 ? 20 : 5,
      backgroundColor: '#fff',
      paddingBottom: 40,
      zIndex: 1,
   },
   picker_container: {
      flex: 1,
      paddingHorizontal: 10,
   },
   summary_bottom_conatiner: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'center',
   },
   title_container: {
      height: height * 0.1,
      width: '100%',
      flexDirection: 'row',
      backgroundColor: '#fff',
      paddingVertical: 10,
      marginBottom: 20,
   },
   title_container_left: {
      flex: 1,
      justifyContent: 'space-between',
   },
   title_container_middle: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'flex-start',
      alignItems: 'flex-end',
   },
   title_container_right: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'flex-start',
      justifyContent: 'flex-end',
   },
   deliver_on_text: {
      fontWeight: 'bold',
      fontSize: '$s',
      color: 'rgba(0,0,0,0.6)',
   },
   edit: {
      flexDirection: 'row',
      alignItems: 'center',
   },
   time_text: {
      fontSize: '$s',
   },
   edit_text: {
      fontSize: '$s',
   },
   topBar: {
      height: 48,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: 12,
      paddingHorizontal: width > 768 ? '20%' : 12,
   },
   heading: {
      fontSize: '$l',
      fontWeight: 'bold',
      color: '#666',
   },
   count: {
      fontSize: '$m',
      color: '#666',
   },
   scrollView: {
      paddingHorizontal: width > 768 ? '20%' : 10,
   },
})
