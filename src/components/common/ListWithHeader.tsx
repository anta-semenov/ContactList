import * as React from 'react'
import { View, FlatList, ViewStyle, StyleProp, ListRenderItem, NativeSyntheticEvent, NativeScrollEvent, StyleSheet, TouchableOpacity, Animated, Platform } from 'react-native'
import { Size } from 'types'
import { useAnimation, useLayout } from 'utils'

interface ListWithHeaderProps<ItemT = any> {
  items: ItemT[]
  renderHeaderItem: ListRenderItem<ItemT>
  renderDetailsItem: ListRenderItem<ItemT>
  headerItemSize: Size
  style?: StyleProp<ViewStyle>
  headerContainerStyle?: StyleProp<ViewStyle>
  onActiveItemChange?: (activeIndex: number) => void
}

enum ActiveScroll {
  'None' = 0,
  'Header' = 1,
  'Details' = 2,
}
const shadowAnimationSpeed = 20

export const ListWithHeader: React.FunctionComponent<ListWithHeaderProps> = (props): React.ReactElement => {
  const headerListRef = React.useRef()
  const detailsListRef = React.useRef()
  const activeIndexRef = React.useRef(0)
  const activeScroll = React.useRef(ActiveScroll.None)
  const headerLayout = useLayout()
  const componentLayout = useLayout()
  const [detailsHeight, setDetailsHeight] = React.useState(componentLayout.layout.height - props.headerItemSize.height)
  const [headerDetailsScrollRatio, setHeaderDetailsScrollRatio] = React.useState(detailsHeight != 0 ? props.headerItemSize.width / detailsHeight : 1)
  const shadowAnimation = useAnimation(0)

  React.useEffect(() => {
    setDetailsHeight(componentLayout.layout.height - props.headerItemSize.height)
  }, [props.headerItemSize.height, componentLayout.layout.height])

  React.useEffect(() => {
    setHeaderDetailsScrollRatio(detailsHeight != 0 ? props.headerItemSize.width / detailsHeight : 1)
  }, [props.headerItemSize.width, detailsHeight])

  const updateActiveIndexIfNeeded = (activeIndex: number) => {
    if (activeIndex !== activeIndexRef.current) {
      activeIndexRef.current = activeIndex
      props.onActiveItemChange != null && props.onActiveItemChange(activeIndex)
    }
  }

  return (
    <View style={ [styles.container, props.style] } onLayout={ componentLayout.onLayout }>
      <FlatList
        ref={ headerListRef }
        onLayout={ headerLayout.onLayout }
        horizontal={ true }
        renderItem={ (info) => (
          <TouchableOpacity activeOpacity={ 1 } style={ { width: props.headerItemSize.width, height: props.headerItemSize.height } }  onPress={ () => {
            if (info.index === activeIndexRef.current) {
              return
            }
            if (detailsListRef.current != null && headerListRef.current != null) {
              (detailsListRef.current as any).scrollToIndex({ animated: true, index: info.index });
              (headerListRef.current as any).scrollToIndex({ animated: true, index: info.index })
              updateActiveIndexIfNeeded(info.index)
            }
          } }>
            { props.renderHeaderItem(info) }
          </TouchableOpacity>
        ) }
        data={ props.items }
        getItemLayout={ (_, index) => ({ index, length: props.headerItemSize.width, offset: index * props.headerItemSize.width }) }
        snapToAlignment='start'
        decelerationRate='fast'
        snapToInterval={ props.headerItemSize.width }
        onScroll={ (event: NativeSyntheticEvent<NativeScrollEvent>) => {
          if (activeScroll.current !== ActiveScroll.Header) {
            return
          }
          if (detailsListRef.current != null) {
            (detailsListRef.current as any).scrollToOffset({ animated: false, offset: event.nativeEvent.contentOffset.x / headerDetailsScrollRatio })
          }
          updateActiveIndexIfNeeded(Math.round(event.nativeEvent.contentOffset.x / props.headerItemSize.width))
        } }
        onScrollBeginDrag={ () => {
          activeScroll.current = ActiveScroll.Header
          shadowAnimation.startSpring({ toValue: 1, speed: shadowAnimationSpeed })
        } }
        style={ [{ height: props.headerItemSize.height, zIndex: 2, backgroundColor: '#ffffff' }, props.headerContainerStyle] }
        showsHorizontalScrollIndicator={ false }
        onMomentumScrollEnd={ () => {
          if (activeScroll.current === ActiveScroll.Header) {
            activeScroll.current = ActiveScroll.None
          }
          shadowAnimation.startSpring({ toValue: 0, speed: shadowAnimationSpeed })
        } }
        contentContainerStyle={ { paddingHorizontal: (headerLayout.layout.width - props.headerItemSize.width) / 2 } }
        testID='HeaderScroll'
      />
      <Animated.View style={ [styles.shadow, { opacity: shadowAnimation.value }] }/>
      <FlatList
        ref={ detailsListRef }
        data={ props.items }
        renderItem={ (info) => (
          <View style={ { width: '100%', height: detailsHeight } }>
            { props.renderDetailsItem(info) }
          </View>
        ) }
        extraData={ detailsHeight }
        getItemLayout={ (_, index) => ({ index, length: detailsHeight, offset: index * detailsHeight }) }
        snapToAlignment='start'
        decelerationRate='fast'
        snapToInterval={ detailsHeight }
        onScroll={ (event: NativeSyntheticEvent<NativeScrollEvent>) => {
          if (activeScroll.current !== ActiveScroll.Details) {
            return
          }
          if (headerListRef.current != null) {
            (headerListRef.current as any).scrollToOffset({ animated: false, offset: event.nativeEvent.contentOffset.y * headerDetailsScrollRatio })
          }
          updateActiveIndexIfNeeded(Math.round(event.nativeEvent.contentOffset.y / detailsHeight))
        } }
        onScrollBeginDrag={ () => {
          activeScroll.current = ActiveScroll.Details
          shadowAnimation.startSpring({ toValue: 1, speed: shadowAnimationSpeed })
        } }
        onMomentumScrollEnd={ () => {
          if (activeScroll.current === ActiveScroll.Details) {
            activeScroll.current = ActiveScroll.None
          }
          shadowAnimation.startSpring({ toValue: 0, speed: shadowAnimationSpeed })
        } }
        style={ { height: detailsHeight } }
        testID='DetailsScroll'
      />
    </View>
  )
}

const isIos = Platform.OS === 'ios'

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
  },
  shadow: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    marginTop: isIos ? -10 : 0,
    height: isIos ? 10 : 0.5,
    backgroundColor: isIos ? '#ffffff' : '#00000002',
    zIndex: 1,
    elevation: 1,
  },
})
