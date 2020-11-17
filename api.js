import * as axios from 'axios'
import { CLIENTID } from 'react-native-dotenv'

const LOGIN_URL = `https://secure.dailykit.org/auth/realms/consumers/protocol/openid-connect/token`

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
      url: LOGIN_URL,
      method: 'POST',
      headers: {
         'Content-Type': 'application/x-www-form-urlencoded',
      },
      data: searchParams,
   })
   return response.data
}
