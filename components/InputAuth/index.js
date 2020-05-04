import React, { Component } from 'react';
import { StyleSheet, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import TextAuth from '../TextAuth';
import BlockAuth from '../BlockAuth';
import ButtonAuth from '../ButtonAuth';
import { theme } from '../../constants';

export default class Input extends Component {
  state = {
    toggleSecure: false,
  };

  renderLabel() {
    const { label, error } = this.props;

    return (
      <BlockAuth flex={false}>
        {label ? (
          <TextAuth gray2={!error} accent={error}>
            {label}
          </TextAuth>
        ) : null}
      </BlockAuth>
    );
  }

  renderToggle() {
    const { secure, rightLabel } = this.props;
    const { toggleSecure } = this.state;

    if (!secure) return null;

    return (
      <ButtonAuth
        style={styles.toggle}
        onPress={() => this.setState({ toggleSecure: !toggleSecure })}
      >
        {rightLabel ? (
          rightLabel
        ) : (
          <Ionicons
            color={theme.colors.gray}
            size={theme.sizes.font * 1.35}
            name={!toggleSecure ? 'md-eye' : 'md-eye-off'}
          />
        )}
      </ButtonAuth>
    );
  }

  renderRight() {
    const { rightLabel, rightStyle, onRightPress } = this.props;

    if (!rightLabel) return null;

    return (
      <ButtonAuth
        style={[styles.toggle, rightStyle]}
        onPress={() => onRightPress && onRightPress()}
      >
        {rightLabel}
      </ButtonAuth>
    );
  }

  render() {
    const { email, phone, number, secure, error, style, ...props } = this.props;

    const { toggleSecure } = this.state;
    const isSecure = toggleSecure ? false : secure;

    const inputStyles = [
      styles.input,
      error && { borderColor: theme.colors.accent },
      style,
    ];

    const inputType = email
      ? 'email-address'
      : number
      ? 'numeric'
      : phone
      ? 'phone-pad'
      : 'default';

    return (
      <BlockAuth flex={false} margin={[theme.sizes.base, 0]}>
        {this.renderLabel()}
        <TextInput
          style={inputStyles}
          secureTextEntry={isSecure}
          autoComplete='off'
          autoCapitalize='none'
          autoCorrect={false}
          keyboardType={inputType}
          {...props}
        />
        {this.renderToggle()}
        {this.renderRight()}
      </BlockAuth>
    );
  }
}

const styles = StyleSheet.create({
  input: {
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: theme.colors.black,
    borderRadius: theme.sizes.radius,
    fontSize: theme.sizes.font,
    fontWeight: '500',
    color: theme.colors.black,
    height: theme.sizes.base * 3,
  },
  toggle: {
    position: 'absolute',
    alignItems: 'center',
    width: theme.sizes.base * 2,
    height: theme.sizes.base * 2,
    top: theme.sizes.base,
    right: 0,
  },
});
