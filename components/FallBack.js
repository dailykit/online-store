import { Spinner } from '@ui-kitten/components';
import { StyleSheet, View } from 'react-native';

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
