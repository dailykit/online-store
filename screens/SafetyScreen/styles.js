import { StyleSheet } from "react-native";
import { width } from '../../utils/Scalaing';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
     },
     badgeConatiner: {
        width,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 20,
     },
     staffConatiner: {},
     desc: {
        color: 'white',
        marginTop: 10,
        textAlign: 'center',
     },
     StaffSafetyContainer: {
        width: width * 0.9,
        backgroundColor: '#2e2d4d',
        padding: 20,
        borderRadius: 20,
        marginTop: 40,
     },
     title: {
        fontSize: 24,
        textAlign: 'center',
        fontWeight: 'bold',
     },
     measureConatiner: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        height: 120,
     },
     measureText: {
        flex: 5,
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
     },
     icons: {
        height: 50,
        width: 50,
        flex: 1,
        marginRight: 10,
        resizeMode: 'contain',
     },
     packagingSafetyConatiner: {
        width: width * 0.9,
        backgroundColor: '#eddea4',
        padding: 20,
        borderRadius: 20,
        marginTop: 20,
        alignItems: 'center',
     },
     packagingImage: {
        resizeMode: 'contain',
        height: 80,
        width: 80,
        marginTop: 30,
        marginBottom: 30,
     },
 });
 
