import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { Stack } from "expo-router";
import { DrawerToggleButton } from "@react-navigation/drawer";

const _layout = () => {
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerBlurEffect: "regular",
        headerLargeTitle: true,
        headerTransparent: true,
        headerLargeTitleShadowVisible: false,

        headerShadowVisible: false,
        headerSearchBarOptions: {
          placeholder: "Search for Squad",
        },
        headerLeft: () => <DrawerToggleButton />,
      }}
    />
  );
};

export default _layout;

const styles = StyleSheet.create({});
