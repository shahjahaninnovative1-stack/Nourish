import React, { useEffect, useRef } from 'react';
import { Animated, Easing, PanResponder, Platform, Pressable, Text, View, ViewStyle } from 'react-native';
import { colors, fonts, radii } from '../theme';

const NATIVE = Platform.OS !== 'web';

/**
 * Gives its child real perspective depth: it floats on a slow idle sway and
 * tilts toward a horizontal drag, then springs back. Done with perspective
 * transforms rather than WebGL so it runs unchanged in Expo Go and on the web.
 * Only horizontal drags are claimed, so vertical scrolling still works over it.
 */
export function Tilt({ children, style, max = 12 }: { children: React.ReactNode; style?: ViewStyle; max?: number }) {
  const idle = useRef(new Animated.Value(0)).current;
  const drag = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(idle, { toValue: 1, duration: 3200, easing: Easing.inOut(Easing.sin), useNativeDriver: NATIVE }),
        Animated.timing(idle, { toValue: -1, duration: 3200, easing: Easing.inOut(Easing.sin), useNativeDriver: NATIVE }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [idle]);

  const pan = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_e, g) => Math.abs(g.dx) > 8 && Math.abs(g.dx) > Math.abs(g.dy) * 1.5,
      onPanResponderMove: (_e, g) => drag.setValue(Math.max(-1, Math.min(1, g.dx / 120))),
      onPanResponderRelease: () => Animated.spring(drag, { toValue: 0, friction: 5, useNativeDriver: NATIVE }).start(),
      onPanResponderTerminate: () => Animated.spring(drag, { toValue: 0, friction: 5, useNativeDriver: NATIVE }).start(),
    })
  ).current;

  const rotateY = Animated.add(
    idle.interpolate({ inputRange: [-1, 1], outputRange: [-3, 3] }),
    drag.interpolate({ inputRange: [-1, 1], outputRange: [-max, max] })
  ).interpolate({ inputRange: [-90, 90], outputRange: ['-90deg', '90deg'] });
  const rotateX = idle.interpolate({ inputRange: [-1, 1], outputRange: ['2.5deg', '-1deg'] });

  return (
    <Animated.View {...pan.panHandlers} style={[style, { transform: [{ perspective: 900 }, { rotateX }, { rotateY }] }]}>
      {children}
    </Animated.View>
  );
}

/** Stacked slabs under a card so it reads as a physical object with thickness. */
export function Slab({ children, color, radius = 24, depth = 2, style }: { children: React.ReactNode; color: string; radius?: number; depth?: number; style?: ViewStyle }) {
  return (
    <View style={[{ paddingBottom: depth * 5 }, style]}>
      {Array.from({ length: depth }, (_, i) => (
        <View
          key={i}
          style={{
            position: 'absolute', left: (depth - i) * 5, right: (depth - i) * 5, bottom: i * 5, height: 40,
            borderBottomLeftRadius: radius, borderBottomRightRadius: radius, backgroundColor: color, opacity: 0.35 + i * 0.25,
          }}
        />
      ))}
      {children}
    </View>
  );
}

/** A button with an extruded edge that physically depresses when pressed. */
export function Press3D({
  label, onPress, style, face = colors.ink, edge = colors.accentDark, textColor = colors.onDark, height = 52,
}: { label: string; onPress: () => void; style?: ViewStyle; face?: string; edge?: string; textColor?: string; height?: number }) {
  return (
    <Pressable onPress={onPress} style={[{ height, borderRadius: radii.md, backgroundColor: edge }, style]}>
      {({ pressed }) => (
        <View
          style={{
            position: 'absolute', left: 0, right: 0, top: pressed ? 4 : 0, bottom: pressed ? 0 : 5,
            borderRadius: radii.md, backgroundColor: face, alignItems: 'center', justifyContent: 'center',
          }}
        >
          <Text style={{ fontFamily: fonts.bodyBold, fontSize: 15, color: textColor }}>{label}</Text>
        </View>
      )}
    </Pressable>
  );
}
