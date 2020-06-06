import React from 'react';
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import theme from '../constants/Theme';
import { useAppContext } from '../context/app';
import { useAuth } from '../context/auth';
// galio components
import Icon from './Icon';
import { useDrawerContext } from '../context/drawer';

const { height, width } = Dimensions.get('window');

export default function NavBar({
  back,
  hideLeft,
  hideRight,
  left,
  leftIconColor,
  leftHitSlop,
  leftIconName,
  leftIconFamily,
  onLeftPress,
  right,
  rightStyle,
  style,
  transparent,
  title,
  titleStyle,
  navigation,
}) {
  const { isAuthenticated, login, logout } = useAuth();
  const { brand } = useAppContext();
  const { open } = useDrawerContext();

  function renderTitle() {
    if (typeof title === 'string') {
      return (
        <View style={styles.title}>
          {width > 768 && (
            <Image source={{ uri: brand.logo }} style={styles.logo} />
          )}
          <Text style={[styles.titleTextStyle, titleStyle]}>{title}</Text>
        </View>
      );
    }

    if (!title) return null;

    return title;
  }

  function renderLeft() {
    if (!hideLeft) {
      if (leftIconName || back) {
        return (
          <View style={[styles.left]}>
            <TouchableOpacity
              onPress={() => onLeftPress && onLeftPress()}
              hitSlop={leftHitSlop}
            >
              <Icon
                color={leftIconColor || theme.COLORS.ICON}
                size={18}
                name={leftIconName || (back ? 'chevron-left' : 'navicon')}
              />
            </TouchableOpacity>
          </View>
        );
      }
      return <View style={[styles.left]}>{left}</View>;
    }
    return <View style={[styles.left]} />;
  }

  function renderRight(right) {
    const hasIcons = React.Children.count(right) > 1;
    const rightStyles = [styles.right, rightStyle];
    if (!hideRight) {
      return <View style={rightStyles}>{right}</View>;
    }
    return <View style={styles.right} />;
  }

  const navStyles = [styles.navBar, transparent && styles.transparent, style];

  return (
    <View style={navStyles}>
      {width < 768 && renderLeft()}
      {renderTitle()}
      {width > 768 && (
        <View style={styles.rightNav}>
          <Text style={styles.navLinks} onPress={() => navigation.navigate('')}>
            About Us
          </Text>
          {isAuthenticated && (
            <>
              <Text
                style={styles.navLinks}
                onPress={() => open('OrderHistory')}
              >
                Orders
              </Text>
              <Text style={styles.navLinks} onPress={() => open('Profile')}>
                Profile
              </Text>
            </>
          )}
          {right}
          <Text
            style={[
              styles.authButton,
              {
                backgroundColor: isAuthenticated ? '#E74C3C' : '#e3e3e3',
                color: isAuthenticated ? '#fff' : '#1f1f1f',
              },
            ]}
            onPress={() => (isAuthenticated ? logout() : login())}
          >
            {isAuthenticated ? 'Logout' : 'Login'}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  navBar: {
    width: width,
    height: 16 * 4.125,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    backgroundColor: theme.COLORS.WHITE,
    paddingVertical: 16,
  },
  title: {
    flex: 2,
    height: height * 0.07,
    marginLeft: width > 768 ? 16 : 0,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  logo: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 16,
  },
  titleTextStyle: {
    fontWeight: '400',
    fontSize: 16 * 0.875,
    color: theme.COLORS.BLACK,
  },
  left: {
    width: 64,
    height: 64,
    alignContent: 'center',
    justifyContent: 'center',
  },
  right: {
    flex: 0.5,
    height: height * 0.07,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  transparent: {
    backgroundColor: 'transparent',
    borderColor: 'transparent',
    borderWidth: 0,
  },
  rightNav: {
    alignItems: 'center',
    flexDirection: 'row',
    paddingRight: 16,
  },
  navLinks: {
    marginLeft: 16,
    fontSize: 18,
  },
  authButton: {
    fontSize: 18,
    marginLeft: 16,
    color: '#1f1f1f',
    paddingVertical: 8,
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
});
