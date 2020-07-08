import EStyleSheet from 'react-native-extended-stylesheet'
import { height, width } from '../../utils/Scalaing'

export const styles = EStyleSheet.create({
   conatiner: {
      flex: 1,
      marginVertical: 20,
   },
   header: {
      height: height * 0.07,
      padding: 10,
      flexDirection: 'row',
      alignItems: 'center',
   },
   summary_title_conatiner: {
      flex: 1,
      flexDirection: 'row',
      paddingHorizontal: 30,
      justifyContent: 'center',
   },
   picker_container: {
      flex: 1,
      paddingHorizontal: 20,
   },
   summary_bottom_conatiner: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'center',
   },
   summary_title_conatiner_left: {
      flex: 1,
      justifyContent: 'center',
   },
   summary_title_conatiner_right: {
      flex: 1,
      justifyContent: 'center',
   },
   summary_title_text: {
      fontSize: 16,
      fontWeight: 'bold',
   },
   title_container: {
      height: height * 0.1,
      width,
      flexDirection: 'row',
      backgroundColor: '#fff',
      paddingVertical: 10,
   },
   title_container_left: {
      flex: 1,
      justifyContent: 'space-between',
      padding: 5,
      paddingLeft: 20,
   },
   title_container_middle: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'flex-start',
      alignItems: 'flex-end',
      padding: 5,
      paddingLeft: 20,
   },
   title_container_right: {
      flex: 1,
      padding: 5,
      flexDirection: 'row',
      alignItems: 'flex-start',
      paddingRight: 20,
      justifyContent: 'flex-end',
   },
   deliver_on_text: {
      fontWeight: 'bold',
      fontSize: 16,
      color: 'rgba(0,0,0,0.6)',
   },
   edit: {
      flexDirection: 'row',
      alignItems: 'center',
   },
   time_text: {
      fontSize: 16,
      color: 'rgba(0,0,0,0.6)',
   },
   edit_text: {
      fontSize: 16,
   },
   send_details_container: {
      width: '100%',
      flexDirection: 'row',
      alignItems: 'center',
      overflow: 'hidden',
   },
   send_email_container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      padding: 15,
      borderWidth: 1,
      borderColor: '#3fa4fd',
   },
   download_recpie_card: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      padding: 15,
      backgroundColor: '#3fa4fd',
      overflow: 'hidden',
      borderColor: '#3fa4fd',
      borderWidth: 1,
   },
   download_recpie_card_text: {
      color: 'white',
      fontWeight: 'bold',
      fontSize: '$xxs',
   },
   send_email_container_text: {
      fontWeight: 'bold',
      fontSize: '$xxs',
   },
   image_container: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
   },
   image: {
      height: 50,
      width: 50,
   },
   order_placed_title: {
      color: '#3fa4fd',
      textAlign: 'center',
      fontSize: 27,
      fontWeight: 'bold',
      marginTop: 10,
      marginBottom: 10,
   },
})
