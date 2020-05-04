import React, { Component } from 'react';
import {
  ActivityIndicator,
  Keyboard,
  KeyboardAvoidingView,
  StyleSheet,
  SafeAreaView,
  Platform,
  AsyncStorage,
  View,
  ScrollView,
} from 'react-native';

import { ButtonAuth, BlockAuth, InputAuth, TextAuth } from '../components';
import { theme } from '../constants';

const VALID_EMAIL = '';
const VALID_PASSWORD = '';

const isAndroid = Platform.OS == 'android' ? true : false;

export default class LoginScreen extends Component {
  state = {
    email: VALID_EMAIL,
    password: VALID_PASSWORD,
    errors: [],
    loading: false,
  };

  async handleLogin() {
    const { navigation } = this.props;
    const { email, password } = this.state;
    const errors = [];

    Keyboard.dismiss();
    this.setState({ loading: true });

    // check with backend API or with some static data
    try {
      await AsyncStorage.setItem('token', 'logged in');
      this.setState({
        loading: false,
      });
    } catch (error) {
      errors.push('username');
      errors.push('password');
      this.setState({
        errors,
        loading: false,
      });
      console.log(error);
    }

    if (!errors.length) {
      navigation.navigate('App');
    }
  }

  render() {
    const { navigation } = this.props;
    const { loading, errors } = this.state;
    const hasErrors = (key) => (errors.includes(key) ? styles.hasErrors : null);

    return (
      <ScrollView style={{ flex: 1 }}>
        <View style={styles.login}>
          <BlockAuth padding={[0, theme.sizes.base * 2]}>
            <TextAuth h1 bold>
              Login
            </TextAuth>
            <BlockAuth middle>
              <InputAuth
                label='Email'
                error={hasErrors('email')}
                style={[styles.InputAuth, hasErrors('email')]}
                defaultValue={this.state.email}
                onChangeTextAuth={(TextAuth) =>
                  this.setState({ email: TextAuth })
                }
              />
              <InputAuth
                secure
                label='Password'
                error={hasErrors('password')}
                style={[styles.InputAuth, hasErrors('password')]}
                defaultValue={this.state.password}
                onChangeTextAuth={(TextAuth) =>
                  this.setState({ password: TextAuth })
                }
              />
              <ButtonAuth gradient onPress={() => this.handleLogin()}>
                {loading ? (
                  <ActivityIndicator size='small' color='white' />
                ) : (
                  <TextAuth bold white center>
                    Login
                  </TextAuth>
                )}
              </ButtonAuth>

              <ButtonAuth onPress={() => navigation.navigate('Forgot')}>
                <TextAuth gray caption center>
                  Forgot your password?
                </TextAuth>
              </ButtonAuth>
            </BlockAuth>
          </BlockAuth>
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  login: {
    flex: 1,
    justifyContent: 'center',
    marginTop: isAndroid ? 50 : 30,
  },
  InputAuth: {
    borderRadius: 0,
    borderWidth: 0,
    borderBottomColor: theme.colors.gray2,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  hasErrors: {
    borderBottomColor: theme.colors.accent,
  },
});
