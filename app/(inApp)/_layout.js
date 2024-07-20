import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { Stack } from "expo-router";

const _layout = () => {
  return (
    <Stack screenOptions={{ headerShown: false }} initialRouteName="(tabs)">
      <Stack.Screen
        name="(taskform)"
        options={{
          presentation: "modal",
          headerTransparent: true,
          headerBlurEffect: "regular",
          headerShown: false,
        }}
      />
    </Stack>
  );
};

export default _layout;

const styles = StyleSheet.create({});
