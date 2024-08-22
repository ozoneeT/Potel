import { StyleSheet, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";

import React from "react";
import type { StyleProp, ViewStyle } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import { useWindowDimensions } from "react-native";

type SplitAction = {
  label: string;
  onPress: () => void;
  backgroundColor: string;
};

type SplitButtonProps = {
  splitted: boolean;
  mainAction: SplitAction;
  leftAction: SplitAction;
  rightAction: SplitAction;
};

const ButtonHeight = 60;
export const SplitButton: React.FC<SplitButtonProps> = ({
  splitted,
  mainAction,
  leftAction,
  rightAction,
}) => {
  const { width: windowWidth } = useWindowDimensions();

  const paddingHorizontal = 20;
  const gap = 10;
  const SplittedButtonWidth = (windowWidth - paddingHorizontal * 2 - gap) / 2;

  const rLeftButtonStyle = useAnimatedStyle(() => {
    const leftButtonWidth = splitted ? SplittedButtonWidth : 0;
    return {
      width: withTiming(leftButtonWidth),
      opacity: withTiming(splitted ? 1 : 0),
    };
  }, [splitted]);

  const rLeftTextStyle = useAnimatedStyle(() => {
    return {
      opacity: withTiming(splitted ? 1 : 0, {
        duration: 150,
      }),
    };
  }, [splitted]);

  const rMainButtonStyle = useAnimatedStyle(() => {
    const mainButtonWidth = splitted
      ? SplittedButtonWidth
      : // IMPORTANT: This has been fixed from the original demo, it was:
        // SplittedButtonWidth * 2 (I forgot to add the gap between the buttons)
        SplittedButtonWidth * 2 + gap;
    return {
      width: withTiming(mainButtonWidth),
      marginLeft: withTiming(splitted ? gap : 0),
      backgroundColor: withTiming(
        splitted ? rightAction.backgroundColor : mainAction.backgroundColor
      ),
    };
  }, [splitted]);

  const rMainTextStyle = useAnimatedStyle(() => {
    return {
      opacity: withTiming(splitted ? 0 : 1),
    };
  }, [splitted]);

  const rRightTextStyle = useAnimatedStyle(() => {
    return {
      opacity: withTiming(splitted ? 1 : 0),
    };
  }, [splitted]);

  return (
    <View
      style={{
        width: "100%",
        height: ButtonHeight,
        paddingHorizontal,
        flexDirection: "row",
      }}
    >
      <PressableScale
        onPress={leftAction.onPress}
        style={[
          {
            backgroundColor: leftAction.backgroundColor,
          },
          rLeftButtonStyle,
          styles.button,
        ]}
      >
        <Animated.Text numberOfLines={1} style={[styles.label, rLeftTextStyle]}>
          {leftAction.label}
        </Animated.Text>
      </PressableScale>
      <PressableScale
        onPress={splitted ? rightAction.onPress : mainAction.onPress}
        style={[rMainButtonStyle, styles.button]}
      >
        <Animated.Text style={[styles.label, rMainTextStyle]}>
          {mainAction.label}
        </Animated.Text>
        <Animated.Text style={[styles.label, rRightTextStyle]}>
          {rightAction.label}
        </Animated.Text>
      </PressableScale>
    </View>
  );
};

type PressableScaleProps = {
  children?: React.ReactNode;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
};

export const PressableScale: React.FC<PressableScaleProps> = ({
  children,
  onPress,
  style,
}) => {
  const scale = useSharedValue(1);

  const gesture = Gesture.Tap()
    .maxDuration(10000)
    .onTouchesDown(() => {
      scale.value = withTiming(0.9);
    })
    .onTouchesUp(() => {
      if (onPress) {
        runOnJS(onPress)();
      }
    })
    .onFinalize(() => {
      scale.value = withTiming(1);
    });

  const rButtonStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  }, []);

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View style={[style, rButtonStyle]}>{children}</Animated.View>
    </GestureDetector>
  );
};

export const Palette = {
  card: "#302E37",
  highlight: "#EA3F4C",
  background: "#18141D",
  text: "white",
};
const App = () => {
  const [splitted, setSplitted] = useState(false);

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <SplitButton
        splitted={splitted}
        mainAction={{
          label: "Stop",
          onPress: () => {
            console.log("Stop");
            setSplitted(true);
          },
          backgroundColor: Palette.card,
        }}
        leftAction={{
          label: "Resume",
          onPress: () => {
            console.log("Resume");
            setSplitted(false);
          },
          backgroundColor: Palette.card,
        }}
        rightAction={{
          label: "Finish",
          onPress: () => {
            console.log("Finish");
            setSplitted(false);
          },
          backgroundColor: Palette.highlight,
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Palette.background,
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    fontSize: 16,
    color: Palette.text,
    textTransform: "lowercase",
    position: "absolute",
  },
  button: {
    height: ButtonHeight,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 30,
    borderCurve: "continuous",
  },
});

export default App;
