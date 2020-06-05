import EStyleSheet from "react-native-extended-stylesheet";

export const styles = EStyleSheet.create({
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
     },
     container: {
        flex: 1,
        backgroundColor: '#fff',
     },
     card: {
        padding: 15,
        borderBottomColor: '#dedede',
        borderBottomWidth: 1,
        marginBottom: 10,
     },
     title: {
        fontWeight: 'bold',
        fontSize: '$l',
        marginBottom: 10,
     },
     muted: {
        color: 'gray',
        fontSize: '$s',
        marginBottom: 10,
     },
     bold: {
        fontWeight: 'bold',
     },
     lite: {
        fontWeight: 'normal',
     },
     flexContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
     },
     total: {
        fontWeight: 'bold',
        fontSize: '$l',
        marginTop: 10,
     },
     header: {
        backgroundColor: '#fff',
     },
 });
 
