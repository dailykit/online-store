import React from "react";
import { StyleSheet, TextInput } from "react-native";

import Icon from "./Icon";
import { argonTheme } from "../constants";

class ArInput extends React.Component {
  render() {
    const { shadowless, success, error } = this.props;

    const inputStyles = [
      styles.input,
      !shadowless && styles.shadow,
      success && styles.success,
      error && styles.error,
      { ...this.props.style },
    ];

    return (
      <TextInput
        placeholder="Search"
        placeholderTextColor={argonTheme.COLORS.MUTED}
        style={inputStyles}
        // iconContent={
        //   <Icon size={14} color={argonTheme.COLORS.ICON} name="link" />
        // }
      />
    );
  }
}

const styles = StyleSheet.create({
  input: {
    borderRadius: 4,
    borderColor: argonTheme.COLORS.BORDER,
    height: 44,
    backgroundColor: "#FFFFFF",
    padding: 16,
    color: argonTheme.COLORS.HEADER,
  },
  success: {
    borderColor: argonTheme.COLORS.INPUT_SUCCESS,
  },
  error: {
    borderColor: argonTheme.COLORS.INPUT_ERROR,
  },
  shadow: {
    shadowColor: argonTheme.COLORS.BLACK,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
    shadowOpacity: 0.05,
    elevation: 2,
  },
});

export default ArInput;
