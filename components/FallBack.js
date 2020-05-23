import { View, ActivityIndicator, StyleSheet } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';

const fallBackComponent = () => {
  return (
    <View style={styles.containerFlex}>
      <ActivityIndicator size='large' />
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
