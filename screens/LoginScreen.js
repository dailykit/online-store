import React, { useState } from 'react';
import {
  ActivityIndicator,
  Keyboard,
  StyleSheet,
  Platform,
  AsyncStorage,
  View,
  ScrollView,
  Alert,
} from 'react-native';

import { useAuth } from '../context/auth';
import { Input } from '@ui-kitten/components';

import { ButtonAuth, BlockAuth, InputAuth, TextAuth } from '../components';
import { theme } from '../constants';

const VALID_EMAIL = '';
const VALID_PASSWORD = '';

const isAndroid = Platform.OS == 'android' ? true : false;

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState(false);

  const { login, setIsAuthenticated } = useAuth();

  const handleLogin = async () => {
    const errors = [];

    Keyboard.dismiss();
    setLoading(true);
    // check with backend API or with some static data
    try {
      await login(email, password);
      let user = await AsyncStorage.getItem('user');
      user = JSON.parse(user);
      if (user && user.token && user.token !== undefined) {
        setIsAuthenticated(true);
      } else {
        console.log('error');
        setErrors(true);
      }

      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  return (
    <ScrollView style={{ flex: 1 }}>
      <View style={styles.login}>
        <BlockAuth padding={[0, theme.sizes.base * 2]}>
          <TextAuth h1 bold>
            Login
          </TextAuth>
          <BlockAuth style={{ marginTop: 40 }} middle>
            <Input
              label='Email'
              defaultValue={email}
              onChangeText={(email) => setEmail(email)}
              status={errors ? 'Danger' : 'Basic'}
            />
            <Input
              secureTextEntry
              label='Password'
              value={password}
              status={errors ? 'Danger' : 'Basic'}
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
  },
  hasErrors: {
    borderBottomColor: theme.colors.accent,
  },
});

export default LoginScreen;
