import { View, StyleSheet } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import { Spinner } from '@ui-kitten/components';

const fallBackComponent = () => {
   return (
      <View style={styles.containerFlex}>
         <Spinner size="large" />
      </View>
   );
};

const styles = StyleSheet.create({
   containerFlex: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
   },
});

export default fallBackComponent;
