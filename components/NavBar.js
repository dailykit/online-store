import React from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Text,
  Button,
  Image,
} from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';

// galio components
import Icon from './Icon';
import theme from '../constants/Theme';
import { useAuth } from '../context/auth';
import { useAppContext } from '../context/app';

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

  function renderRight() {
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
      {renderRight()}
      {width > 768 && (
        <View style={styles.rightNav}>
          <Text style={styles.navLinks} onPress={() => navigation.navigate('')}>
            About Us
          </Text>
          <Text
            style={styles.navLinks}
            onPress={() => navigation.navigate('OrderHistoryScreen')}
          >
            Orders
          </Text>
          <Text
            style={styles.navLinks}
            onPress={() => navigation.navigate('ProfileScreen')}
          >
            Profile
          </Text>
          <Text
            style={[
              styles.authButton,
              { backgroundColor: isAuthenticated ? '#D93025' : '#BB00BB' },
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
    width: 'auto',
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
    borderRadius: 8,
    color: '#ffffff',
    paddingVertical: 8,
    paddingHorizontal: 12,
    justifyContent: 'center',
  },
});
