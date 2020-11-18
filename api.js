import * as axios from 'axios'
import { CLIENTID, SECURE_PASSWORD } from 'react-native-dotenv'
import base64 from 'base-64'

// Constants sdfs
const BASE_URL = `https://secure.dailykit.org/auth/realms/consumers/protocol/openid-connect/token`
const SIGNUP_URL = `https://beryl-material-chokeberry.glitch.me/users`

export const loginUser = async ({ email, password }) => {
   const params = {
      username: email,
      password,
      grant_type: 'password',
      client_id: CLIENTID,
      scope: 'openid',
   }
   const searchParams = Object.keys(params)
      .map(key => {
         return encodeURIComponent(key) + '=' + encodeURIComponent(params[key])
      })
      .join('&')

   console.log('searchParams', searchParams)
   const response = await axios({
      url: BASE_URL,
      method: 'POST',
      headers: {
         'Content-Type': 'application/x-www-form-urlencoded',
      },
      data: searchParams,
   })
   return response.data
}

export const registerUser = async ({ email, password }) => {
   const response = await axios({
      url: SIGNUP_URL,
      method: 'POST',
      headers: {
         'Content-Type': 'application/json',
      },
      data: {
         email,
         password,
      },
   })
   return response.data
}
