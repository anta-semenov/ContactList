import * as React from 'react'
import { Animated, LayoutChangeEvent } from 'react-native'
import { LayoutState, Point } from 'types'

export const useLayout = () => {
  const [layout, setLayout] = React.useState<LayoutState>({ topX: 0, topY: 0, width: 0, height: 0 })
  const center = React.useMemo(() => ({ x: layout.topX + layout.width * 0.5, y: layout.topY + layout.height * 0.5 }), [layout])
  return React.useMemo(() => ({
    layout,
    onLayout: (event: LayoutChangeEvent) => setLayout({
      topX: event.nativeEvent.layout.x,
      topY: event.nativeEvent.layout.y,
      width: event.nativeEvent.layout.width,
      height: event.nativeEvent.layout.height,
    }),
    getCenter: (): Point => center,
  }), [layout])
}

export interface TimingAnimationConfig extends Omit<Animated.TimingAnimationConfig, 'useNativeDriver'> {
  readonly useNativeDriver?: boolean
}

export interface SpringAnimationConfig extends Omit<Animated.SpringAnimationConfig, 'useNativeDriver'> {
  readonly useNativeDriver?: boolean
}

export interface UseAnimationHook {
  readonly value: Animated.Value
  readonly startTiming: (config: TimingAnimationConfig) => Promise<boolean>
  readonly startSpring: (config: SpringAnimationConfig) => Promise<boolean>
  readonly addListener: (callback: AnimationHookListener) => void
}

type AnimationHookListener = (value: number) => void

export const useAnimation = (initialAnimationValue: number, onMountAnimationConfig?: SpringAnimationConfig | TimingAnimationConfig, onMountAnimationCallback?: () => void): UseAnimationHook => {
  const [animationValue] = React.useState(new Animated.Value(initialAnimationValue))
  const isMounted = React.useRef(false)
  const animations = React.useRef<Animated.CompositeAnimation[]>([])
  const listeners = React.useRef<string[]>([])
  React.useEffect(
    () => {
      isMounted.current = true
      if (onMountAnimationConfig != null) {
        if ((onMountAnimationConfig as Animated.TimingAnimationConfig).duration) {
          const animation = Animated.timing(animationValue, { useNativeDriver: true , ...onMountAnimationConfig })
          animation.start(onMountAnimationCallback)
          animations.current = [...animations.current, animation]
        } else {
          const animation = Animated.spring(animationValue, { useNativeDriver: true , ...onMountAnimationConfig as SpringAnimationConfig })
          animation.start(onMountAnimationCallback)
          animations.current = [...animations.current, animation]
        }
      }
      return () => {
        isMounted.current = false
        animations.current.forEach((animation) => animation.stop())
        animations.current = []
        listeners.current.forEach((id) => animationValue.removeListener(id))
        listeners.current = []
      }
    },
    [],
  )

  const addListener = (callback: AnimationHookListener) => {
    const listener = animationValue.addListener(({ value }) => callback(value))
    listeners.current = [...listeners.current, listener]
  }

  return {
    startTiming: (config: TimingAnimationConfig) => new Promise((resolve) => {
      if (isMounted.current === false) {
        resolve(false)
        return
      }
      const animation = Animated.timing(animationValue, { useNativeDriver: true , ...config })
      animation.start(({ finished }) => resolve(finished))
      animations.current = [...animations.current, animation]
    }),
    startSpring: (config: SpringAnimationConfig) => new Promise((resolve) => {
      if (isMounted.current === false) {
        resolve(false)
        return
      }
      const animation = Animated.spring(animationValue, { useNativeDriver: true , ...config })
      animation.start(({ finished }) => resolve(finished))
      animations.current = [...animations.current, animation]
    }),
    value: animationValue,
    addListener,
  }
}

export const useIsFirstMount = () => {
  const isMountRef = React.useRef(true);
  React.useEffect(() => {
    isMountRef.current = false;
  }, []);
  return isMountRef.current;
}
