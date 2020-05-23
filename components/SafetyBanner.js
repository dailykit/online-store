import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { Badge } from '../assets/imgs/Badge';
import EStyleSheet from 'react-native-extended-stylesheet';

const { width, height } = Dimensions.get('window');

export const SafetyBanner = ({ navigation }) => {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => navigation.navigate('SafetyScreen')}
    >
      <View style={{ flex: 1 }}>
        <Badge height={52} width={52} />
      </View>
      <View style={{ flex: 3 }}>
        <View style={styles.textConatiner}>
          <Text style={styles.title}>Best Safety Standards</Text>
          <Text style={styles.text}>
            We keeping safety measures to keep your food safe.
          </Text>
          <Text style={[styles.text]}>Check our staff safety report ></Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = EStyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#2e2d4d',
    width: width * 0.9,
    marginLeft: width * 0.05,
    marginBottom: 10,
    alignItems: 'center',
    flexDirection: 'row',
    borderRadius: 20,
    height: height * 0.22,
  },
  textConatiner: {
    paddingHorizontal: 10,
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  text: {
    fontSize: 12,
    color: 'white',
  },
});
