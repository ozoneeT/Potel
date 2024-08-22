import { View, Text, useColorScheme } from "react-native";
import React from "react";
import { Stack } from "expo-router";
import { DrawerToggleButton } from "@react-navigation/drawer";

const _layout = () => {
  const colorScheme = useColorScheme();
  return (
    <Stack
      screenOptions={{
        headerTitle: "Chat",
        headerShown: true,
        headerBlurEffect: "regular",
        headerLargeTitle: true,
        headerTransparent: true,
        headerLargeTitleShadowVisible: false,
        headerLargeStyle: {
          backgroundColor: colorScheme === "dark" ? "#111111" : "#ffffff",
        },
        headerShadowVisible: false,
        headerSearchBarOptions: {
          placeholder: "Search for Chat",
        },
        headerLeft: () => <DrawerToggleButton />,
      }}
    />
  );
};

export default _layout;
