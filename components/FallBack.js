import { View, ActivityIndicator, StyleSheet } from 'react-native';

export default fallBackComponent = () => {
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
