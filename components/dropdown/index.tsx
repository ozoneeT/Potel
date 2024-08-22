import {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { DropdownItemType, DropdownListItem } from "./dropdown-list-item";
import React, { useState } from "react";
import { View, StyleSheet, TouchableOpacity, Text } from "react-native";
import Animated from "react-native-reanimated";

type DropdownProps = {
  header: DropdownItemType;
  options: DropdownItemType[];
};

const Dropdown: React.FC<DropdownProps> = ({ header, options }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const height = useSharedValue(0);

  const toggleDropdown = () => {
    setIsExpanded(!isExpanded);
    height.value = withTiming(isExpanded ? 0 : options.length * 60);
  };

  const animatedStyle = useAnimatedStyle(() => ({
    height: height.value,
    overflow: "hidden",
    marginBottom: -20, // Adjust margin to maintain stacking effect
    zIndex: isExpanded ? 0 : 1, // Ensure expanded dropdowns stay on top
  }));

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={toggleDropdown}>
        <View style={styles.headerContainer}>
          <Text style={styles.label}>{header.label}</Text>
          <Text>{isExpanded ? "▲" : "▼"}</Text>
        </View>
      </TouchableOpacity>
      <Animated.View style={animatedStyle}>
        {options.map((item, index) => (
          <DropdownListItem key={index} {...item} />
        ))}
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 10,
    zIndex: 1,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    backgroundColor: "#1B1B1B",
    borderRadius: 10,
    zIndex: 2,
  },
  label: {
    color: "#D4D4D4",
    fontSize: 18,
  },
});

export { Dropdown };
