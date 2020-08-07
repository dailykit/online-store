import React, { Component } from 'react'
import { ScrollView, StyleSheet, Text, View } from 'react-native'
import PlatformError from './error/PlatformError'

export default class index extends Component {
   constructor(props) {
      super(props)
      this.state = { hasError: false, error: {} }
   }

   static getDerivedStateFromError(error) {
      // Update state so the next render will show the fallback UI.
      return { hasError: true, error }
   }

   componentDidCatch(error, errorInfo) {
      this.setState({
         error,
         errorInfo,
      })
      console.log(error)
      console.log(errorInfo)
      this.setState({
         hasError: true,
      })
   }

   render() {
      if (this.state.hasError) {
         // You can render any custom fallback UI
         return <PlatformError />
      }

      return this.props.children
   }
}

const styles = StyleSheet.create({
   flexContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
   },
   flex: {
      flex: 1,
      padding: 20,
      paddingTop: 80,
   },
})
