import React, { useCallback, useRef } from "react";
import { Animated, StyleSheet, Text, View, I18nManager } from "react-native";
import { RectButton } from "react-native-gesture-handler";
import Swipeable from "react-native-gesture-handler/Swipeable";
import { Ionicons } from "@expo/vector-icons";
import Colors from "@/constants/Color";

const openRowRef = { current: null }; // Shared ref for tracking the open row

const AppleStyleSwipeableRow = ({ children }) => {
  const swipeableRow = useRef(null);

  const renderRightAction = (text, color, x, progress) => {
    const trans = progress.interpolate({
      inputRange: [0, 1],
      outputRange: [x, 0],
    });

    const pressHandler = () => {
      swipeableRow.current?.close();
    };

    return (
      <Animated.View style={{ flex: 1, transform: [{ translateX: trans }] }}>
        <RectButton
          style={[styles.rightAction, { backgroundColor: color }]}
          onPress={pressHandler}
        >
          <Ionicons
            name={text === "More" ? "ellipsis-horizontal" : "archive"}
            size={24}
            color={"#fff"}
            style={{ paddingTop: 10 }}
          />
          <Text style={styles.actionText}>{text}</Text>
        </RectButton>
      </Animated.View>
    );
  };

  const renderRightActions = (progress, _dragAnimatedValue) => (
    <View
      style={{
        width: 192,
        flexDirection: I18nManager.isRTL ? "row-reverse" : "row",
      }}
    >
      {renderRightAction("More", "#C8C7CD", 192, progress)}
      {renderRightAction("Archive", Colors.muted, 128, progress)}
    </View>
  );

  const onSwipeableWillOpen = useCallback(() => {
    openRowRef.current = swipeableRow.current;
  }, []);
  const closeRow = useCallback(() => {
    if (openRowRef.current && openRowRef.current !== swipeableRow.current) {
      openRowRef.current.close();
    }
  }, []);

  return (
    <Swipeable
      ref={swipeableRow}
      friction={1}
      enableTrackpadTwoFingerGesture
      rightThreshold={40}
      renderRightActions={renderRightActions}
      onSwipeableWillOpen={onSwipeableWillOpen}
      onSwipeableOpenStartDrag={closeRow}
      overshootRight={false}
    >
      {children}
    </Swipeable>
  );
};

const styles = StyleSheet.create({
  leftAction: {
    flex: 1,
    backgroundColor: "#497AFC",
    justifyContent: "center",
  },
  actionText: {
    color: "white",
    fontSize: 16,
    backgroundColor: "transparent",
    padding: 10,
  },
  rightAction: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
  },
});

export default AppleStyleSwipeableRow;
