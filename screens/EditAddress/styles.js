import EStyleSheet from 'react-native-extended-stylesheet'

export const styles = EStyleSheet.create({
   conatiner: {
      flex: 1,
      backgroundColor: '#fff',
      width: '100%',
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
      flexDirection: 'row',
      borderBottomWidth: 1,
      borderColor: '#dedede',
      marginBottom: 4,
      padding: 8,
      minHeight: 100,
   },
   addressTextContainer: {
      flex: 3,
      justifyContent: 'center',
   },
   addressText: {
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
})
