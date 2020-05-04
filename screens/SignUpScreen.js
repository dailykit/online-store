import React, { Component } from 'react';
import {
  Alert,
  ActivityIndicator,
  Keyboard,
  KeyboardAvoidingView,
  StyleSheet,
  ScrollView,
  View,
} from 'react-native';
import Constants from 'expo-constants';

import {
  ButtonAuth,
  BlockAuth,
  Text,
  InputAuth,
  TextAuth,
} from '../components';
import { theme } from '../constants';

export default class SignUp extends Component {
  state = {
    email: null,
    username: null,
    password: null,
    errors: [],
    loading: false,
    number: '9958470889',
    expoPushToken: '',
    notification: {},
    coords: {},
    address: {},
  };

  handleSignUp = async () => {
    const { navigation } = this.props;
    const { email, username, password, number } = this.state;
    const errors = [];

    Keyboard.dismiss();
    this.setState({ loading: true });

    // check with backend API or with some static data

    try {
      // catch((error) => {
      //   this.setState({ errors, loading: false });
      //   errors.push("password");
      //   alert(JSON.stringify(error));
      // });

      Alert.alert(
        'Success!',
        'Your account has been created',
        [
          {
            text: 'Continue',
            onPress: () => {
              navigation.navigate('Login');
            },
          },
        ],
        { cancelable: false }
      );
    } catch (error) {
      this.setState({ errors, loading: false });
      errors.push('email');
      console.log(error);
    }
  };

  render() {
    const { navigation } = this.props;
    const { loading, errors } = this.state;
    const hasErrors = (key) => (errors.includes(key) ? styles.hasErrors : null);

    return (
      <ScrollView style={{ marginTop: 50 }}>
        <BlockAuth padding={[0, theme.sizes.base * 2]}>
          <TextAuth h1 bold style={{ marginBottom: 20 }}>
            Sign Up
          </TextAuth>
          <BlockAuth middle>
            <InputAuth
              email
              label='Email'
              error={hasErrors('email')}
              style={[styles.input, hasErrors('email')]}
              defaultValue={this.state.email}
              onChangeText={(text) => this.setState({ email: text })}
            />
            <InputAuth
              label='Username'
              error={hasErrors('username')}
              style={[styles.input, hasErrors('username')]}
              defaultValue={this.state.username}
              onChangeText={(text) => this.setState({ username: text })}
            />
            <InputAuth
              secure
              label='Password'
              error={hasErrors('password')}
              style={[styles.input, hasErrors('password')]}
              defaultValue={this.state.password}
              onChangeText={(text) => this.setState({ password: text })}
            />
            <InputAuth
              label='Phone Number'
              error={hasErrors('number')}
              style={[styles.input, hasErrors('number')]}
              onChangeText={(text) => this.setState({ number: text })}
            />
            <ButtonAuth gradient onPress={() => this.handleSignUp()}>
              {loading ? (
                <ActivityIndicator size='small' color='white' />
              ) : (
                <TextAuth bold white center>
                  Sign Up
                </TextAuth>
              )}
            </ButtonAuth>

            <ButtonAuth onPress={() => navigation.navigate('Login')}>
              <TextAuth
                gray
                caption
                center
                style={{ textDecorationLine: 'underline' }}
              >
                Back to Login
              </TextAuth>
            </ButtonAuth>
          </BlockAuth>
        </BlockAuth>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  signup: {
    flex: 1,
    marginTop: Constants.statusBarHeight + 40,
    justifyContent: 'center',
  },
  input: {
    borderRadius: 0,
    borderWidth: 0,
    borderBottomColor: theme.colors.gray2,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  hasErrors: {
    borderBottomColor: theme.colors.accent,
  },
});
