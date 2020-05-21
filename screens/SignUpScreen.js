import React, { useState } from 'react';
import {
  Alert,
  ActivityIndicator,
  Keyboard,
  StyleSheet,
  ScrollView,
  View,
  Text,
} from 'react-native';
import Constants from 'expo-constants';

import { GradientButton } from '../components/GradientButton';
import { theme } from '../constants';
import { Input } from '@ui-kitten/components';

import { useAuth } from '../context/auth';

const SignUp = ({ navigation }) => {
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
    <ScrollView style={styles.constainer}>
      <View style={styles.content}>
        <Text style={styles.heading}>Sign Up</Text>
        <View>
          <Input
            label='First Name'
            error={hasErrors('number')}
            onChangeText={(firstName) => setfirstName(firstName)}
          />
          <Input
            label='Last Name'
            error={hasErrors('number')}
            onChangeText={(lastName) => setLastName(lastName)}
          />
          <Input
            email
            label='Email'
            error={hasErrors('email')}
            value={email}
            onChangeText={(email) => setEmail(email)}
          />
          <Input
            label='Username'
            error={hasErrors('username')}
            value={username}
            onChangeText={(username) => setusername(username)}
          />
          <Input
            secureTextEntry
            label='Password'
            error={hasErrors('password')}
            value={password}
            onChangeText={(password) => setPassword(password)}
          />

          <GradientButton gradient onPress={() => handleSignUp()}>
            {loading ? (
              <ActivityIndicator size='small' color='white' />
            ) : (
              <Text style={styles.text}>Sign Up</Text>
            )}
          </GradientButton>

          <GradientButton onPress={() => navigation.navigate('Login')}>
            <Text style={styles.backtext}>Back to Login</Text>
          </GradientButton>
        </View>
      </View>
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
  constainer: { marginTop: 50 },
  content: { paddingHorizontal: theme.sizes.base * 2 },
  heading: { marginBottom: 20, fontSize: 24, fontWeight: 'bold' },
  text: {
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  backtext: {
    color: 'gray',
    textAlign: 'center',
  },
});

export default SignUp;
