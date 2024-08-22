import React, { useState } from "react";
import { Text, TouchableOpacity, StyleSheet, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";

const CollapsibleItem = ({
  title,
  content,
  index,
  expandedIndex,
  setExpandedIndex,
}) => {
  const isExpanded = expandedIndex === index;
  const collapsedHeight = 50;
  const expandedHeight = 150;

  const animatedHeight = useAnimatedStyle(() => {
    return {
      height: withTiming(isExpanded ? expandedHeight : collapsedHeight, {
        duration: 300,
      }),
    };
  });

  const handlePress = () => {
    setExpandedIndex(isExpanded ? null : index);
  };

  return (
    <Animated.View
      style={[styles.container, animatedHeight, { zIndex: isExpanded ? 1 : 0 }]}
    >
      <TouchableOpacity onPress={handlePress} style={styles.innerContainer}>
        <Text style={styles.title}>{title}</Text>
        {isExpanded && <Text style={styles.content}>{content}</Text>}
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    borderRadius: 10,
    marginVertical: -40, // Negative margin to stack items on each other
    overflow: "hidden",
  },
  innerContainer: {
    padding: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
  },
  content: {
    marginTop: 10,
    fontSize: 14,
  },
});

export default CollapsibleItem;
