import React, { useEffect } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { FontAwesome6 } from "@expo/vector-icons";
import Animated, {
  Easing,
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";

const CategoryButton = ({ iconName, categoryName, isExpanded, onPress }) => {
  const offset = useSharedValue(isExpanded ? 1 : 0);

  useEffect(() => {
    offset.value = withTiming(isExpanded ? 1 : 0, {
      duration: 1000,
      easing: Easing.out(Easing.exp),
    });
  }, [isExpanded, offset]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: offset.value,
      transform: [
        {
          translateX: offset.value * 5, // Slide in effect
        },
      ],
    };
  });

  return (
    <Pressable
      onPress={onPress}
      style={[styles.button, isExpanded && styles.expandedButton]}
    >
      <Text style={{ fontSize: 25 }}>{iconName}</Text>
      {isExpanded && (
        <Animated.View style={[styles.categoryNameContainer, animatedStyle]}>
          <Text style={styles.categoryNameText}>{categoryName}</Text>
        </Animated.View>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
    borderRadius: 24,
    backgroundColor: "#f3f3f3",
    margin: 5,
  },
  expandedButton: {
    backgroundColor: "#f3f3f3", // Change background color when expanded
  },
  categoryNameContainer: {
    paddingHorizontal: 5,
    borderRadius: 24,
  },
  categoryNameText: {
    fontSize: 16,
    color: "black",
    fontFamily: "MontserratSemiBold",
  },
});

export default CategoryButton;
