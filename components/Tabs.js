import React from 'react'
import { Animated, Dimensions, FlatList, StyleSheet, View } from 'react-native'
import argonTheme from '../constants/Theme'
import { uuid } from '../utils'
const { width } = Dimensions.get('screen')

const defaultMenu = [
   { id: 'popular', title: 'Popular' },
   { id: 'new', title: 'New' },
   { id: 'more', title: 'More' },
   { id: 'lorem', title: 'Lorem' },
]

export default class Tabs extends React.Component {
   static defaultProps = {
      data: [],
      initialIndex: null,
   }

   state = {
      active: null,
   }

   componentDidMount() {
      const { initialIndex } = this.props
      initialIndex && this.selectMenu(initialIndex)
   }

   animatedValue = new Animated.Value(1)

   animate() {
      this.animatedValue.setValue(0)

      Animated.timing(this.animatedValue, {
         toValue: 1,
         duration: 300,
         // useNativeDriver: true, // color not supported
      }).start()
   }

   menuRef = React.createRef()

   onScrollToIndexFailed = () => {
      this.menuRef.current.scrollToIndex({
         index: 0,
         viewPosition: 0.5,
      })
   }

   selectMenu = id => {
      this.setState({ active: id })

      this.menuRef.current.scrollToIndex({
         index: this.props.data.findIndex(item => item.id === id),
         viewPosition: 0.5,
      })

      this.animate()
      this.props.onChange && this.props.onChange(id)
   }

   renderItem = item => {
      const isActive = this.state.active === item.id

      const textColor = this.animatedValue.interpolate({
         inputRange: [0, 1],
         outputRange: [
            argonTheme.COLORS.BLACK,
            isActive ? argonTheme.COLORS.WHITE : argonTheme.COLORS.BLACK,
         ],
         extrapolate: 'clamp',
      })

      const containerStyles = [
         styles.titleContainer,
         !isActive && { backgroundColor: argonTheme.COLORS.SECONDARY },
      ]

      return (
         <View style={containerStyles}>
            <Animated.Text
               style={[styles.menuTitle, { color: textColor }]}
               onPress={() => this.selectMenu(item.id)}
            >
               {item}
            </Animated.Text>
         </View>
      )
   }

   renderMenu = () => {
      const { data, ...props } = this.props

      return (
         <FlatList
            {...props}
            data={data}
            horizontal={true}
            ref={this.menuRef}
            extraData={this.state}
            keyExtractor={item => uuid()}
            showsHorizontalScrollIndicator={false}
            onScrollToIndexFailed={this.onScrollToIndexFailed}
            renderItem={({ item }) => this.renderItem(item)}
            contentContainerStyle={styles.menu}
         />
      )
   }

   render() {
      return <View style={styles.container}>{this.renderMenu()}</View>
   }
}

const styles = StyleSheet.create({
   container: {
      width: width > 1280 ? 1280 : width,
      backgroundColor: argonTheme.COLORS.WHITE,
      zIndex: 2,
   },

   menu: {
      paddingHorizontal: 16 * 2.5,
      paddingTop: 30,
      paddingBottom: 16,
   },
   titleContainer: {
      alignItems: 'center',
      backgroundColor: argonTheme.COLORS.ACTIVE,
      borderRadius: 4,
      marginRight: 9,
   },

   menuTitle: {
      fontWeight: '600',
      fontSize: 14,
      // lineHeight: 28,
      paddingVertical: 10,
      paddingHorizontal: 16,
      color: argonTheme.COLORS.MUTED,
   },
})
