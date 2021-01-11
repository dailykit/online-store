import React from 'react'
import { DAILYKEY_URL } from '@env'
import { ScrollView } from 'react-native-gesture-handler'
import { useDrawerContext } from '../../context/drawer'

const AddDetails = ({ params }) => {
   const { path } = params

   const { setIsDrawerOpen, setSaved } = useDrawerContext()

   React.useEffect(() => {
      let eventMethod = window.addEventListener
         ? 'addEventListener'
         : 'attachEvent'
      let eventer = window[eventMethod]
      let messageEvent = eventMethod === 'attachEvent' ? 'onmessage' : 'message'

      eventer(messageEvent, e => {
         if (e.origin !== DAILYKEY_URL) return
         let message = JSON.parse(e.data)
         if (message.success) {
            setSaved(message)
            setIsDrawerOpen(false)
         }
      })
   }, [])

   return (
      <React.Fragment>
         <ScrollView style={{ height: '100%' }}>
            <iframe
               src={`${DAILYKEY_URL}/${path || ''}`}
               title="Add Details"
               height={600}
               frameBorder="0"
               rel="preload"
               id="dailykey"
            ></iframe>
         </ScrollView>
      </React.Fragment>
   )
}

export default AddDetails
