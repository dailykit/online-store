import React from 'react';
import axios from 'axios';
import jwt_decode from 'jwt-decode';
import { AsyncStorage } from 'react-native';

const BASE_URL = 'secure.dailykit.org';
const AuthContext = React.createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = React.useState(null);
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);

  const login = async (email, password) => {
    try {
      let params = {
        username: email,
        password: password,
        grant_type: 'password',
        client_id: 'client1',
        scope: 'openid',
      };
      const searchParams = Object.keys(params)
        .map((key) => {
          return (
            encodeURIComponent(key) + '=' + encodeURIComponent(params[key])
          );
        })
        .join('&');
      let url = `https://${BASE_URL}/auth/realms/consumers/protocol/openid-connect/token`;
      const response = await axios({
        url,
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        data: searchParams,
      });
      const data = response.data;
      let user = jwt_decode(data.access_token);
      user = {
        firstName: user.given_name,
        lastName: user.family_name,
        email: user.email,
        password: password,
        username: user.preferred_username,
        name: user.name,
        token: data.access_token,
      };
      await AsyncStorage.setItem('user', JSON.stringify(user));
      return {
        success: true,
        message: 'Logged in',
        data,
      };
    } catch (err) {
      return {
        success: false,
        message: err.message,
        data: null,
      };
    }
  };

  const refreshToken = async (token) => {
    try {
      let url = `https://${BASE_URL}/auth/realms/consumers/protocol/openid-connect/token`;
      const response = await axios({
        url,
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        data: `grant_type=refresh_token&client_id=restaurantmealkit&refresh_token=${token}`,
      });
      return {
        success: true,
        message: 'Token refreshed',
        data: response.data,
      };
    } catch (err) {
      return {
        success: false,
        message: err.message,
        data: null,
      };
    }
  };

  const signup = async (email, password, firstName, lastName, username) => {
    try {
      let url = `https://${BASE_URL}/auth/realms/consumers/protocol/openid-connect/token`;
      const response = await axios({
        url,
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        auth: {
          username: 'user-manager',
          password: '1f92d238-bde1-4fc3-bef9-941bb229ac81',
        },
        data: 'grant_type=client_credentials',
      });
      const token = response.data.access_token;
      url = `https://${BASE_URL}/auth/admin/realms/consumers/users`;
      const res = await axios({
        url,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        data: JSON.stringify({
          username,
          firstName,
          lastName,
          enabled: true,
          email,
          credentials: [
            {
              type: 'password',
              value: password,
            },
          ],
        }),
      });
      console.log(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        isAuthenticated,
        signup,
        setIsAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => React.useContext(AuthContext);
