import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Svg, { Circle, Line, Text as SvgText } from "react-native-svg";

const AnalogClock = ({ hours, minutes }) => {
  const radius = 100;
  const center = radius;
  const strokeWidth = 5;
  const hoursAngle = ((hours % 12) + minutes / 60) * 30;
  const minutesAngle = minutes * 6;
  const isPM = hours >= 12;
  const hourHandLength = radius * 0.5; // Adjust the length as needed
  const minuteHandLength = radius * 0.75; // Adjust the length as needed

  const polarToCartesian = (angle, length) => {
    const angleRad = (angle - 90) * (Math.PI / 180.0);
    return {
      x: center + length * Math.cos(angleRad),
      y: center + length * Math.sin(angleRad),
    };
  };

  const hourHand = polarToCartesian(hoursAngle, hourHandLength);
  const minuteHand = polarToCartesian(minutesAngle, minuteHandLength);

  return (
    <View style={styles.container}>
      <Svg height="300" width="300" viewBox="0 0 220 220">
        {/* Clock Face */}
        <Circle
          cx={center}
          cy={center}
          r={radius - strokeWidth / 2}
          stroke="black"
          strokeWidth={strokeWidth}
          fill="white"
        />
        {/* AM/PM Indicator */}
        <SvgText
          x={center}
          y={center + radius / 2}
          textAnchor="middle"
          fontSize="20"
          fill={isPM ? "red" : "blue"}
        >
          {isPM ? "PM" : "AM"}
        </SvgText>
        {/* Hour Hand */}
        <Line
          x1={center}
          y1={center}
          x2={hourHand.x}
          y2={hourHand.y}
          stroke="black"
          strokeWidth="5"
        />
        {/* Minute Hand */}
        <Line
          x1={center}
          y1={center}
          x2={minuteHand.x}
          y2={minuteHand.y}
          stroke="black"
          strokeWidth="4"
        />
        {/* Center Circle */}
        <Circle cx={center} cy={center} r="5" fill="black" />
      </Svg>
      <Text style={styles.timeText}>{`${hours % 12}:${
        minutes < 10 ? "0" : ""
      }${minutes} ${isPM ? "PM" : "AM"}`}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
  timeText: {
    marginTop: 10,
    fontSize: 20,
    fontWeight: "bold",
  },
});

export default AnalogClock;
