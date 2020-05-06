import React, { Component } from 'react';
import { Text, StyleSheet, ScrollView } from 'react-native';

export default class index extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: {} };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error,
      errorInfo,
    });
    this.setState({
      hasError: true,
    });
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <ScrollView style={styles.flexContainer}>
          <Text>{JSON.stringify(this.state.error)}</Text>
          <Text>{JSON.stringify(this.state.errorInfo)}</Text>
        </ScrollView>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  flexContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
