import * as React from 'react'
import { ImageRequireSource, Animated, StyleSheet, View, Image } from 'react-native'
import { avatarSize } from 'constants/'
import { useAnimation, useIsFirstMount } from 'utils'
import { AppContext } from 'appContext'

interface AvatarProps {
  image: ImageRequireSource
  index: number
}

export const Avatar: React.FunctionComponent<AvatarProps> = (props): React.ReactElement => {
  const { activeContactIndex } = React.useContext(AppContext)

  const activeAnimation = useAnimation(props.index === activeContactIndex ? 1 : 0)

  const activeStyle = {
    opacity: activeAnimation.value,
  }

  const isFirstMount = useIsFirstMount()

  React.useEffect(() => {
    if (!isFirstMount) {
      activeAnimation.startSpring({ toValue: activeContactIndex === props.index ? 1 : 0 })
    }
  }, [activeContactIndex === props.index])

  return React.useMemo(() => {
    return (
      <View style={ styles.container }>
        <Animated.View style={ [styles.ring, activeStyle] }/>
        <Image source={ props.image } style={ styles.image } testID='AvatarImage'/>
      </View>
    )
  }, [props.image, activeContactIndex !== props.index])
}

const styles = StyleSheet.create({
  image: {
    width: avatarSize - 20,
    height: avatarSize - 20,
    resizeMode: 'contain',
  },
  container: {
    width: avatarSize,
    height: avatarSize,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ring: {
    position: 'absolute',
    width: avatarSize - 10,
    height: avatarSize - 10,
    borderRadius: (avatarSize - 10) / 2,
    borderWidth: 4,
    borderColor: '#83b8e9',
  },
})
