import React, { useState } from 'react';
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

import { useAuth } from '../context/auth';

export default SignUp = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setusername] = useState('');
  const [firstName, setfirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState([]);
  const { signup } = useAuth();

  const handleSignUp = async () => {
    const errors = [];
    Keyboard.dismiss();
    setLoading(true);

    // check with backend API or with some static data

    try {
      await signup(email, password, firstName, lastName, username);
      Alert.alert(
        'Success!',
        'Please Login to continue',
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
      setErrors(error);
      setLoading(false);
      errors.push('email');
      console.log(error);
    }
  };

  const hasErrors = (key) => (errors.includes(key) ? styles.hasErrors : null);

  return (
    <ScrollView style={{ marginTop: 50 }}>
      <BlockAuth padding={[0, theme.sizes.base * 2]}>
        <TextAuth h1 bold style={{ marginBottom: 20 }}>
          Sign Up
        </TextAuth>
        <BlockAuth middle>
          <InputAuth
            label='First Name'
            error={hasErrors('number')}
            style={[styles.input, hasErrors('number')]}
            onChangeText={(firstName) => setfirstName(firstName)}
          />
          <InputAuth
            label='Last Name'
            error={hasErrors('number')}
            style={[styles.input, hasErrors('number')]}
            onChangeText={(lastName) => setLastName(lastName)}
          />
          <InputAuth
            email
            label='Email'
            error={hasErrors('email')}
            style={[styles.input, hasErrors('email')]}
            defaultValue={email}
            onChangeText={(email) => setEmail(email)}
          />
          <InputAuth
            label='Username'
            error={hasErrors('username')}
            style={[styles.input, hasErrors('username')]}
            defaultValue={username}
            onChangeText={(username) => setusername(username)}
          />
          <InputAuth
            secure
            label='Password'
            error={hasErrors('password')}
            style={[styles.input, hasErrors('password')]}
            defaultValue={password}
            onChangeText={(password) => setPassword(password)}
          />

          <ButtonAuth gradient onPress={() => handleSignUp()}>
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
};

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
