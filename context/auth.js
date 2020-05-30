import React from 'react';
import Keycloak from 'keycloak-js';

import { CLIENTID } from 'react-native-dotenv';

const keycloak = new Keycloak({
  realm: 'consumers',
  url: 'https://secure.dailykit.org/auth',
  clientId: CLIENTID,
  'ssl-required': 'none',
  'public-client': true,
  'bearer-only': false,
  'verify-token-audience': true,
  'use-resource-role-mappings': true,
  'confidential-port': 0,
});

const AuthContext = React.createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);
  const [user, setUser] = React.useState({});
  const [isInitialized, setIsInitialized] = React.useState(false);

  const initialize = async () => {
    const authenticated = await keycloak.init({
      onLoad: 'check-sso',
      promiseType: 'native',
    });
    setIsInitialized(true);
    if (authenticated) {
      setIsAuthenticated(authenticated);
      const profile = await keycloak.loadUserInfo();
      console.log('initialize -> profile', profile);
      setUser(profile);
    }
  };

  React.useEffect(() => {
    initialize();
  }, []);

  const login = () => keycloak.login();
  const logout = () => keycloak.logout();
  const register = () => keycloak.register();

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        register,
        isInitialized,
        isAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => React.useContext(AuthContext);
