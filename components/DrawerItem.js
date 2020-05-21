import React from 'react';
import { StyleSheet, TouchableOpacity, Text, AsyncStorage } from 'react-native';
import Block from './Block';
import { useAuth } from '../context/auth';
import Icon from './Icon';
import argonTheme from '../constants/Theme';

const DrawerItem = ({ focused, title, navigation, screen }) => {
  const renderIcon = () => {
    switch (title) {
      case 'Home':
        return (
          <Icon
            name='home'
            size={14}
            color={focused ? 'white' : argonTheme.COLORS.PRIMARY}
          />
        );
      case 'Orders':
        return (
          <Icon
            name='package'
            size={14}
            color={focused ? 'white' : argonTheme.COLORS.PRIMARY}
          />
        );

      case 'Log out':
        return (
          <Icon name='log-out' size={14} color={argonTheme.COLORS.WARNING} />
        );
      default:
        return null;
    }
  };

  const containerStyles = [
    styles.defaultStyle,
    focused ? [styles.activeStyle, styles.shadow] : null,
  ];

  const { logout } = useAuth();

  return (
    <TouchableOpacity
      style={{ height: 60 }}
      onPress={async () => {
        if (title == 'Log out') {
          logout();
        } else {
          navigation.navigate(screen);
        }
      }}
    >
      <Block flex row style={containerStyles}>
        <Block middle flex={0.1} style={{ marginRight: 5 }}>
          {renderIcon()}
        </Block>
        <Block row center flex={0.9}>
          <Text
            size={15}
            bold={focused ? true : false}
            style={{
              color: focused ? 'white' : 'rgba(0,0,0,0.5)',
              fontWeight: focused ? 'bold' : 'normal',
            }}
          >
            {title}
          </Text>
        </Block>
      </Block>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  defaultStyle: {
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  activeStyle: {
    backgroundColor: argonTheme.COLORS.ACTIVE,
    borderRadius: 4,
  },
  shadow: {
    shadowColor: argonTheme.COLORS.BLACK,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowRadius: 8,
    shadowOpacity: 0.1,
  },
});

export default DrawerItem;
