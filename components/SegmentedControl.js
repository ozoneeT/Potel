import React, { useRef, useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
  Dimensions,
  Pressable,
} from "react-native";
import { PanGestureHandler, State } from "react-native-gesture-handler";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";

const width = wp(70);

const SegmentedControl = ({
  segments,
  onIndexChange,
  sliderStyle,
  segmentStyle,
  segmentContainerStyle,
  textStyle,
  selectedTextStyle,
}) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const translateX = useRef(new Animated.Value(0)).current;

  const targetX = selectedIndex * (width / segments.length);

  useEffect(() => {
    Animated.spring(translateX, {
      toValue: targetX,
      useNativeDriver: true,
    }).start();
  }, [selectedIndex, segments.length, targetX]);

  const handlePress = useCallback(
    (index) => {
      onIndexChange(index);
      setSelectedIndex(index);
    },
    [onIndexChange]
  );

  return (
    <View style={styles.container}>
      <View style={[styles.segmentContainer, segmentContainerStyle]}>
        <PanGestureHandler>
          <Animated.View
            style={[
              styles.slider,
              sliderStyle,
              {
                transform: [{ translateX }],
                width: width / segments.length,
              },
            ]}
          />
        </PanGestureHandler>
        {segments.map((segment, index) => (
          <Pressable
            key={index}
            style={[
              styles.segment,
              segmentStyle,
              { width: width / segments.length },
              selectedIndex === index && styles.selectedSegment,
            ]}
            onPress={() => handlePress(index)}
          >
            <Text
              style={[
                styles.text,
                textStyle,
                (selectedIndex === index && styles.selectedText) ||
                  selectedTextStyle,
              ]}
            >
              {segment}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
  },
  segmentContainer: {
    flexDirection: "row",
    backgroundColor: "#f0f0f0",
    borderRadius: 15,
    overflow: "hidden",
    shadowColor: "#000000",
    shadowOffset: {
      width: 1,
      height: 1,
    },
    shadowOpacity: 0.5,
    shadowRadius: 2,
    elevation: 5,
  },
  segment: {
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 10,
  },
  text: {
    fontSize: 16,
    fontWeight: "500",
  },
  selectedText: {
    color: "#000000", // Adjust text color for selected segment
  },
  slider: {
    position: "absolute",
    height: "100%",
    backgroundColor: "#ffffff",
    borderRadius: 15,
    shadowColor: "#000000",
    shadowOffset: {
      width: 2,
      height: 1,
    },
    shadowOpacity: 0.5,
    shadowRadius: 3,
    elevation: 5,
  },
});

export default SegmentedControl;
