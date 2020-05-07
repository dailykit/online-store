import React, { useState } from 'react';
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

import { useAuth } from '../context/auth';

import { ButtonAuth, BlockAuth, InputAuth, TextAuth } from '../components';
import { theme } from '../constants';

const VALID_EMAIL = '';
const VALID_PASSWORD = '';

const isAndroid = Platform.OS == 'android' ? true : false;

export default LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState([]);

  const { login, setIsAuthenticated } = useAuth();

  const handleLogin = async () => {
    const errors = [];

    Keyboard.dismiss();
    setLoading(true);
    // check with backend API or with some static data
    try {
      let res = await login(email, password);
      console.log(res);
      // await AsyncStorage.setItem('token', 'logged in');
      // //POST
      setIsAuthenticated(true);
      setLoading(false);
    } catch (error) {
      errors.push('username');
      errors.push('password');
      setErrors(error);
      setLoading(false);
      console.log(error);
    }

    if (!errors.length) {
      // navigation.navigate('App');
    }
  };

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
              defaultValue={email}
              onChangeText={(email) => setEmail(email)}
            />
            <InputAuth
              secure
              label='Password'
              error={hasErrors('password')}
              style={[styles.InputAuth, hasErrors('password')]}
              defaultValue={password}
              onChangeText={(password) => setPassword(password)}
            />
            <ButtonAuth gradient onPress={() => handleLogin()}>
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
};

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
