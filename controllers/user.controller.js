import axios from 'axios';
const BASE_URL = 'secure.dailykit.org';

const login = async (email, password) => {
  try {
    let url = `https://${BASE_URL}/auth/realms/consumers/protocol/openid-connect/token`;
    const response = await axios({
      url,
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      data: `grant_type=password&client_id=client1&username=${email}&password=${password}&scope=openid`,
    });
    const data = response.data;

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

const signup = async (email, keycloak_id, firstname, lastname) => {
  try {
  } catch (err) {}
};

module.exports = {
  login,
  signup,
  refreshToken,
};
