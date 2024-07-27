import { View, Text } from "react-native";
import React from "react";
import { Stack } from "expo-router";

const _layout = () => {
  return <Stack screenOptions={{ animation: "slide_from_right" }} />;
};

export default _layout;
