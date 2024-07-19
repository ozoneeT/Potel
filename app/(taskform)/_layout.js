import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { Stack } from "expo-router";

const _layout = () => {
  return (
    <Stack
      screenOptions={{ headerShown: false, animation: "slide_from_bottom" }}
      initialRouteName="Newtask"
    >
      <Stack.Screen name="Newtask" />
    </Stack>
  );
};

export default _layout;

const styles = StyleSheet.create({});
