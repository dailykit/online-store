import React from 'react';
import { View } from 'react-native';
import { useAuth } from '../../context/auth';

const Login = () => {
  const { loginUrl } = useAuth();

  return (
    <View style={{ height: '100%' }}>
      <iframe
        src={loginUrl}
        title='Add Details'
        height={600}
        frameBorder='0'
      ></iframe>
    </View>
  );
};

export default Login;
