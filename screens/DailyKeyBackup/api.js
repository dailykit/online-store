import axios from 'axios'
import { PAYMENTS_API_URL } from '@env'

export const createSetupIntent = async customer => {
   try {
      const { data } = await axios.post(
         `${PAYMENTS_API_URL}/api/setup-intent`,
         {
            customer,
            confirm: true,
         }
      )
      return data.data
   } catch (error) {
      return error
   }
}

export const cancelSetupIntent = async id => {
   try {
      const { data } = await axios.delete(
         `${PAYMENTS_API_URL}/api/setup-intent/${id}`
      )
      return data
   } catch (error) {
      return error
   }
}
