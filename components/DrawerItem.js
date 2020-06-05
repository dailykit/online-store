import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import argonTheme from '../constants/Theme';
import { useAppContext } from '../context/app';
import { useDrawerContext } from '../context/drawer';
import { useAuth } from '../context/auth';
import Icon from './Icon';

const DrawerItem = ({ focused, title, navigation, screen }) => {
  const { visual } = useAppContext();
  const { open } = useDrawerContext();

  const renderIcon = () => {
    switch (title) {
      case 'Home':
        return (
          <Icon
            name='home'
            size={14}
            color={
              focused ? 'white' : visual.color || argonTheme.COLORS.PRIMARY
            }
          />
        );
      case 'Profile':
        return (
          <Icon
            name='user'
            size={14}
            color={
              focused ? 'white' : visual.color || argonTheme.COLORS.PRIMARY
            }
          />
        );
      case 'Orders':
        return (
          <Icon
            name='package'
            size={14}
            color={
              focused ? 'white' : visual.color || argonTheme.COLORS.PRIMARY
            }
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
    focused
      ? [
          styles.activeStyle,
          styles.shadow,
          { backgroundColor: visual.color || argonTheme.COLORS.ACTIVE },
        ]
      : null,
    { flexDirection: 'row' },
  ];

  const { logout } = useAuth();

  return (
    <TouchableOpacity
      style={{ height: 60 }}
      onPress={async () => {
        if (title == 'Log out') {
          logout();
        } else if (title === 'Home') {
          navigation.navigate(screen);
        } else {
          open(screen);
        }
      }}
    >
      <View style={containerStyles}>
        <View style={{ marginRight: 5, flex: 0.1, justifyContent: 'center' }}>
          {renderIcon()}
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            flex: 0.9,
          }}
        >
          <Text
            style={{
              fontSize: 15,
              fontWeight: focused ? 'bold' : 'normal',
              color: focused ? 'white' : 'rgba(0,0,0,0.5)',
            }}
          >
            {title}
          </Text>
        </View>
      </View>
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
});

export default DrawerItem;
