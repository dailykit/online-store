import { StyleSheet } from "react-native";
import { height, width } from '../../utils/Scalaing';

export const styles = StyleSheet.create({
    wrapper: {
        marginLeft: 'auto',
        marginRight: 'auto',
        width: width > 980 ? 980 : width,
     },
  
     summary_title_conatiner: {
        flex: 1,
        flexDirection: 'row',
        paddingHorizontal: 30,
        justifyContent: 'center',
        marginBottom: 10,
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
        fontSize: '$m',
        fontWeight: 'bold',
     },
     title_container: {
        height: height * 0.1,
        width: '100%',
        flexDirection: 'row',
        backgroundColor: '#ededed',
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
        fontSize: '$xs',
        color: 'rgba(0,0,0,0.6)',
     },
     edit: {
        flexDirection: 'row',
        alignItems: 'center',
     },
     time_text: {
        fontSize: '$xs',
        color: 'rgba(0,0,0,0.6)',
     },
     edit_text: {
        fontSize: '$xs',
     },
 });
 
