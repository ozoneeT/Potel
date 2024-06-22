import React, { useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { PanGestureHandler } from "react-native-gesture-handler";

const { width } = Dimensions.get("window");
const SEGMENT_WIDTH = (width - 40) / 3; // Adjust the width of each segment

const SegmentedControl = () => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const translateX = useRef(new Animated.Value(0)).current;

  const segments = ["Light", "Standard", "Pro"];

  const handlePress = (index) => {
    setSelectedIndex(index);
    Animated.spring(translateX, {
      toValue: index * SEGMENT_WIDTH,
      useNativeDriver: true,
    }).start();
  };

  const handleGesture = Animated.event(
    [
      {
        nativeEvent: {
          translationX: translateX,
        },
      },
    ],
    { useNativeDriver: true }
  );

  const handleGestureEnd = (event) => {
    const { translationX } = event.nativeEvent;
    let newIndex = Math.round(
      (selectedIndex * SEGMENT_WIDTH + translationX) / SEGMENT_WIDTH
    );
    newIndex = Math.max(0, Math.min(newIndex, segments.length - 1));
    setSelectedIndex(newIndex);
    Animated.spring(translateX, {
      toValue: newIndex * SEGMENT_WIDTH,
      useNativeDriver: true,
    }).start();
  };

  return (
    <View style={styles.container}>
      <View style={styles.segmentContainer}>
        <PanGestureHandler
          onGestureEvent={handleGesture}
          onEnded={handleGestureEnd}
        >
          <Animated.View
            style={[styles.slider, { transform: [{ translateX }] }]}
          />
        </PanGestureHandler>
        {segments.map((segment, index) => (
          <TouchableOpacity
            key={index}
            style={styles.segment}
            onPress={() => handlePress(index)}
          >
            <Text style={styles.text}>{segment}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 50,
  },
  segmentContainer: {
    flexDirection: "row",
    width: width - 40,
    backgroundColor: "#f0f0f0",
    borderRadius: 25,
    overflow: "hidden",
  },
  segment: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 10,
  },
  text: {
    fontSize: 16,
    fontWeight: "500",
  },
  slider: {
    position: "absolute",
    width: SEGMENT_WIDTH,
    height: "100%",
    backgroundColor: "#ffffff",
    borderRadius: 25,
    elevation: 5,
  },
});

export default SegmentedControl;
