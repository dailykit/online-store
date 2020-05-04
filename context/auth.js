import React from 'react';

const AuthContext = React.createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = React.useState(null);
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);

  const login = (email, password) => {
    // make request to keycloak
    // store token
    // is valid user
    // setIsAuthenticated to true
    setIsAuthenticated(true);
  };

  const logout = (email, password) => {
    // clear token
    // setAuthenticated to false
    // redirect to login screen
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => React.useContext(AuthContext);
