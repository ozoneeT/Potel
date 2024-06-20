import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
  useColorScheme,
} from "react-native";
import React from "react";
import Animated, {
  FadeIn,
  FadeOut,
  BounceInRight,
  SlideOutLeft,
  BounceOutLeft,
  SlideInRight,
  FadeOutLeft,
  SlideOutUp,
  SlideInLeft,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { Colors } from "@/constants/Colors";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";

type SegmentedControlProps = {
  options: string[];
  selectedOption: string;
  onOptionPress?: (option: string) => void;
};
const SegmentedControl: React.FC<SegmentedControlProps> = React.memo(
  ({ options, selectedOption, onOptionPress }) => {
    const { width: windowWidth } = useWindowDimensions();
    const internalPadding = 20;
    const SegmentedControlWidth = windowWidth - 150;
    const itemWidth =
      (SegmentedControlWidth - internalPadding) / options.length;
    const rStyle = useAnimatedStyle(() => {
      return {
        left: withTiming(
          itemWidth * options.indexOf(selectedOption) + internalPadding / 2
        ),
      };
    }, [selectedOption, options, itemWidth]);
    const colorScheme = useColorScheme();
    return (
      <ThemedView
        lightColor={Colors.light.primary}
        darkColor={Colors.dark.gray}
        style={[
          styles.container,

          {
            width: windowWidth - 150,
            paddingLeft: internalPadding / 2,
            borderColor:
              colorScheme === "dark" ? Colors.dark.background : "white",
          },
        ]}
      >
        <Animated.View style={[rStyle]}>
          <ThemedView
            lightColor={Colors.light.background}
            darkColor={Colors.dark.background}
            style={{
              position: "absolute",
              width: itemWidth,

              borderRadius: 10,
              height: "80%",
              top: "10%",
              shadowColor: "#000",
              shadowOffset: {
                width: 0,
                height: 0,
              },

              shadowOpacity: 0.5,
              elevation: 10,
              zIndex: -1,
              left: -10,
            }}
          />
        </Animated.View>
        {options.map((option) => {
          return (
            <TouchableOpacity
              onPress={() => {
                onOptionPress?.(option);
              }}
              key={option}
              style={[
                {
                  width: itemWidth,
                  justifyContent: "center",
                  alignItems: "center",
                },
              ]}
            >
              <ThemedText
                lightColor={Colors.light.text}
                darkColor={Colors.dark.text}
                style={styles.optionText}
              >
                {option}
              </ThemedText>
            </TouchableOpacity>
          );
        })}
      </ThemedView>
    );
  }
);

export default SegmentedControl;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    height: 60,
    borderRadius: 10,

    borderWidth: 2,
  },
  optionText: {
    fontFamily: "PoppinsMedium",
  },
});
