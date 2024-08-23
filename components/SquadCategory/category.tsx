import { Image, type ImageSource } from "expo-image";
import { Dimensions, Text } from "react-native";
import type { SharedValue } from "react-native-reanimated";
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  useAnimatedRef,
  useScrollViewOffset,
  useDerivedValue,
} from "react-native-reanimated";
import React from "react";
import { StyleSheet, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import { LinearGradient } from "expo-linear-gradient";

export const WindowWidth = Dimensions.get("window").width;
export const StoryListItemWidth = WindowWidth * 0.9;
export const StoryListItemHeight = StoryListItemWidth / 3;

type CategoryListItemProps = {
  imageSource: ImageSource;
  index: number;
  scrollOffset: SharedValue<number>;
  gradient: string[];
  header: string;
};

export const CategoryListItem: React.FC<CategoryListItemProps> = ({
  imageSource,
  gradient,
  header,
  index,
  scrollOffset,
}) => {
  const rContainerStyle = useAnimatedStyle(() => {
    const activeIndex = scrollOffset.value / StoryListItemWidth;
    const paddingLeft = (WindowWidth - StoryListItemWidth) / 4;
    const translateX = interpolate(
      activeIndex,
      [index - 2, index - 1, index, index + 1], // input range [-1 ,0 , 1]
      [120, 60, 0, -StoryListItemWidth - paddingLeft * 4], // output range
      Extrapolation.CLAMP
    );

    const scale = interpolate(
      activeIndex,
      [index - 2, index - 1, index, index + 1],
      [0.5, 0.86, 1, 1], // output range
      Extrapolation.CLAMP
    );
    return {
      left: paddingLeft,
      transform: [
        {
          translateX: scrollOffset.value + translateX,
        },
        { scale },
      ],
    };
  }, []);

  return (
    <Animated.View
      style={[
        {
          zIndex: -index,
          justifyContent: "center",
        },
        rContainerStyle,
      ]}
    >
      <LinearGradient
        colors={gradient}
        start={{ x: 0, y: 0.2 }}
        end={{ x: 1, y: 0.5 }}
        style={{
          width: StoryListItemWidth,
          height: StoryListItemHeight,
          position: "absolute",
          borderRadius: 20,
          borderWidth: 2,
          borderColor: "#fff",
        }}
      >
        <View style={styles.categoryView}>
          <Text style={styles.categoryText}>{header}</Text>
        </View>
      </LinearGradient>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  categoryText: {
    fontFamily: "PoppinsBlack",
    fontSize: 40,
    color: "#fff",
  },
  categoryView: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
