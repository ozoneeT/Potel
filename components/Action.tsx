import { Pressable, StyleSheet, View } from "react-native";
import React, { FC } from "react";
import Animated, {
  interpolate,
  SharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";
import { TAction } from "./Card";

type Props = {
  translateX: SharedValue<number>;
  action: TAction;
  index: number;
  isActive: boolean;
  onPress: () => void;
  onExpand: () => void;
};
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
const ACTIONS_LENGTH = 3;
const BASE_OFFSET = 60;
const STEP = BASE_OFFSET / (ACTIONS_LENGTH - 1);

export const Action: FC<Props> = ({
  translateX,
  action,
  index,
  isActive,
  onPress,
  onExpand,
}) => {
  const { Icon, color, ActiveIcon } = action;
  const ActionIcon = isActive ? ActiveIcon : Icon;

  const dotStyle = useAnimatedStyle(() => {
    const tX = interpolate(
      translateX.value,
      [-90, 0, 90],
      [-BASE_OFFSET + STEP * index, 0, BASE_OFFSET - STEP * index]
    );
    const opacity = interpolate(
      translateX.value,
      [-90, -70, 70, 90],
      [1, 0, 0, 1]
    );

    return {
      opacity,
      transform: [{ translateX: tX }],
    };
  });

  const iconStyle = useAnimatedStyle(() => {
    const tX = interpolate(
      translateX.value,
      [-90, 0, 90],
      [-BASE_OFFSET + STEP * index, 0, BASE_OFFSET - STEP * index]
    );
    const size = interpolate(
      translateX.value,
      [-90, 0, 90],
      [30, 0, 30],
      "clamp"
    );

    const opacity = interpolate(
      translateX.value,
      [-90, -70, 70, 90],
      [1, 0, 0, 1]
    );

    return {
      width: size,
      height: size,
      opacity,
      transform: [{ translateX: tX }],
    };
  });

  return (
    <Pressable style={styles.actionContainer}>
      <AnimatedPressable
        style={[styles.iconContainer, dotStyle]}
        onPress={onPress}
      >
        <ActionIcon color={color} fill={color} />
      </AnimatedPressable>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  actionContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  iconContainer: {
    overflow: "hidden",
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
  },
});
