import React from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Text,
} from 'react-native';

// galio components
import Icon from './Icon';
import theme from '../constants/Theme';

const { height } = Dimensions.get('screen');

export default function NavBar({
  back,
  hideLeft,
  hideRight,
  left,
  leftStyle,
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
}) {
  function renderTitle() {
    if (typeof title === 'string') {
      return (
        <View style={styles.title}>
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
          <View style={[styles.left, leftStyle]}>
            <TouchableOpacity
              onPress={() => onLeftPress && onLeftPress()}
              hitSlop={leftHitSlop}
            >
              <Icon
                color={leftIconColor || theme.COLORS.ICON}
                size={16 * 1.0625}
                name={leftIconName || (back ? 'chevron-left' : 'navicon')}
              />
            </TouchableOpacity>
          </View>
        );
      }
      return <View style={[styles.left, leftStyle]}>{left}</View>;
    }
    return <View style={[styles.left]} />;
  }

  function renderRight() {
    const hasIcons = React.Children.count(right) > 1;
    const rightStyles = [styles.right, rightStyle];
    if (!hideRight) {
      return (
        <View right row={hasIcons} style={rightStyles}>
          {right}
        </View>
      );
    }
    return <View style={styles.right} />;
  }

  const navStyles = [styles.navBar, transparent && styles.transparent, style];

  return (
    <View style={navStyles}>
      {renderLeft()}
      {renderTitle()}
      {renderRight()}
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
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleTextStyle: {
    fontWeight: '400',
    fontSize: 16 * 0.875,
    color: theme.COLORS.BLACK,
  },
  left: {
    flex: 0.5,
    height: height * 0.07,
    justifyContent: 'center',
    marginLeft: 16,
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
});
