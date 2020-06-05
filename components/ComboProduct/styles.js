import EStyleSheet from "react-native-extended-stylesheet";

export const styles = EStyleSheet.create({
    container: { backgroundColor: '#fff' },
    card_title: {
       flex: 1,
       flexDirection: 'row',
       justifyContent: 'space-between',
       alignItems: 'center',
    },
    card_title_text: {
       fontSize: '$m',
       fontWeight: 'bold',
    },
    is_customizable: {
       fontSize: '$xs',
       color: 'gray',
    },
    item_parent_container: {
       backgroundColor: '#fff',
    },
    flexContainer: {
       flex: 1,
       justifyContent: 'center',
       alignItems: 'center',
    },
 });
 