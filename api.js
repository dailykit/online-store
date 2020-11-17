import * as axios from 'axios'
import { CLIENTID, SECURE_PASSWORD } from 'react-native-dotenv'
// Constants sdfs
const BASE_URL = `https://secure.dailykit.org/auth/realms/consumers/protocol/openid-connect/token`
const SIGNUP_URL = `https://secure.dailykit.org/auth/admin/realms/consumers/users`

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
      url: BASE_URL,
      method: 'POST',
      headers: {
         'Content-Type': 'application/x-www-form-urlencoded',
         Accept: 'application/json',
      },
      auth: {
         username: 'user-manager',
         password: SECURE_PASSWORD,
      },
      data: 'grant_type=client_credentials',
   })
   console.log('response.data', response.data)
   const token = response.data.access_token
   console.log('Signup token got!')
   const res = await axios({
      url: SIGNUP_URL,
      method: 'POST',
      headers: {
         'Content-Type': 'application/json',
         Authorization: `Bearer ${token}`,
      },
      data: JSON.stringify({
         username: email,
         enabled: true,
         email,
         credentials: [
            {
               type: 'password',
               value: password,
            },
         ],
      }),
   })
   return res.data
}
