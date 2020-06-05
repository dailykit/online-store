import EStyleSheet from "react-native-extended-stylesheet";
import { height, width } from '../../utils/Scalaing';

export const styles = EStyleSheet.create({
    conatiner: {
        flex: 1,
        backgroundColor: '#fff',
     },
     title: {
        fontSize: '$xl',
        padding: 20,
     },
     addressConatiner: {
        flexDirection: 'column',
        flex: 1,
     },
     addressOptionConatiner: {
        justifyContent: 'center',
        height: height * 0.12,
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderColor: '#dedede',
        marginBottom: 4,
        padding: 8,
     },
     addressTextContainer: {
        flex: 3,
        justifyContent: 'center',
     },
     addressText: {
        width: width * 0.7,
        paddingLeft: 20,
     },
     addressSelectedContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
     },
     checkContainer: {
        backgroundColor: '#3fa4ff',
        height: 24,
        width: 24,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
     },
 });
 
