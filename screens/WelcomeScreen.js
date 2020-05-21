import React, { Component } from 'react';
import { Animated, StyleSheet, View, Text, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

import { GradientButton } from '../components';
import { theme } from '../constants';

class Welcome extends Component {
  static navigationOptions = {
    headerShown: false,
  };

  scrollX = new Animated.Value(0);

  state = {
    showTerms: false,
  };

  render() {
    const { navigation } = this.props;

    return (
      <View style={{ flex: 1 }}>
        <View
          style={{
            flex: 0.4,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Text
            style={{
              fontSize: 24,
              textAlign: 'center',
              fontWeight: 'bold',
            }}
          >
            Delivering
            <Text> Mealkits</Text>
          </Text>
        </View>

        <View
          style={{
            flex: 0.5,
            paddingHorizontal: theme.sizes.padding * 2,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <GradientButton gradient onPress={() => navigation.navigate('Login')}>
            <Text
              style={{
                textAlign: 'center',
                color: '#fff',
                width: width * 0.8,
              }}
            >
              Login
            </Text>
          </GradientButton>
          <GradientButton shadow onPress={() => navigation.navigate('SignUp')}>
            <Text
              style={{
                textAlign: 'center',
                fontWeight: 'bold',
                width: width * 0.8,
              }}
            >
              Signup
            </Text>
          </GradientButton>
        </View>
      </View>
    );
  }
}

export default Welcome;

const styles = StyleSheet.create({
  stepsContainer: {
    position: 'absolute',
    bottom: theme.sizes.base * 3,
    right: 0,
    left: 0,
  },
  steps: {
    width: 5,
    height: 5,
    borderRadius: 5,
    marginHorizontal: 2.5,
  },
});
