import React from 'react'
import { ScrollView } from 'react-native-gesture-handler'
import { DAILYKEY_URL } from 'react-native-dotenv'

const AddDetails = ({ params }) => {
   const { path } = params

   return (
      <React.Fragment>
         <ScrollView style={{ height: '100%' }}>
            <iframe
               src={`${DAILYKEY_URL}/${path || ''}`}
               title="Add Details"
               height={600}
               frameBorder="0"
            ></iframe>
         </ScrollView>
      </React.Fragment>
   )
}

export default AddDetails
