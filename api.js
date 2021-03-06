import axios from 'axios'
import {
   CLIENTID,
   HASURA_URL,
   HASURA_GRAPHQL_ADMIN_SECRET,
   DAILYOS_SERVER_URL,
   MAPS_API_KEY,
} from '@env'

// Constants
const BASE_URL = `https://secure.dailykit.org/auth/realms/consumers/protocol/openid-connect/token`

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

   const response = await axios({
      url: BASE_URL,
      method: 'POST',
      headers: {
         'Content-Type': 'application/x-www-form-urlencoded',
      },
      data: searchParams,
   })
   return response
}

export const registerUser = async ({ email, password }) => {
   const response = await axios({
      url: HASURA_URL,
      method: 'POST',
      headers: {
         'Content-Type': 'application/json',
         'x-hasura-admin-secret': HASURA_GRAPHQL_ADMIN_SECRET,
      },
      data: {
         query: `
            mutation registerCustomer($email: String!, $password: String!){
               registerCustomer(email: $email, password: $password) {
               success
               message
               }
            }
         `,
         variables: {
            email,
            password,
         },
      },
   })
   return response.data
}

export const getStoreData = async ({ clientId, domain, email, keycloakId }) => {
   const response = await axios.post(`${DAILYOS_SERVER_URL}/api/store/data`, {
      clientId,
      domain,
      email,
      keycloakId,
   })
   return response.data
}

export const getdrivableDistance = async ({ lat1, lon1, lat2, lon2 }) => {
   const response = await axios.post(
      `${DAILYOS_SERVER_URL}/api/distance-matrix`,
      {
         lat1,
         lon1,
         lat2,
         lon2,
         key: MAPS_API_KEY,
      }
   )
   return response.data
}
