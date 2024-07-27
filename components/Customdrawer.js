import React, { useRef } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import { Drawer } from 'expo-router/drawer';
import { PanGestureHandler } from 'react-native-gesture-handler';
import Animated, { useAnimatedGestureHandler, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const DRAWER_WIDTH = SCREEN_WIDTH * 0.8;

const CustomDrawer = ({ children }) => {
  const translateX = useSharedValue(-DRAWER_WIDTH);
  const drawerRef = React.forwardRef();

  const gestureHandler = useAnimatedGestureHandler({
    onStart: (_, ctx) => {
      ctx.startX = translateX.value;
    },
    onActive: (event, ctx) => {
      translateX.value = Math.max(ctx.startX + event.translationX, -DRAWER_WIDTH);
    },
    onEnd: () => {
      if (translateX.value > -DRAWER_WIDTH / 2) {
        translateX.value = withSpring(0);
      } else {
        translateX.value = withSpring(-DRAWER_WIDTH);
      }
    },
  });

  const openDrawer = () => {
    translateX.value = withSpring(0);
  };

  const closeDrawer = () => {
    translateX.value = withSpring(-DRAWER_WIDTH);
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <View style={{ flex: 1 }}>
      <PanGestureHandler onGestureEvent={gestureHandler}>
        <Animated.View style={[styles.drawer, animatedStyle]}>
          <Drawer ref={drawerRef}>
            <Drawer.Screen
              name="index"
              options={{
                drawerLabel: 'Home',
                title: 'overview',
              }}
            />
          </Drawer>
        </Animated.View>
      </PanGestureHandler>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  drawer: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: DRAWER_WIDTH,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
});

export default CustomDrawer;
