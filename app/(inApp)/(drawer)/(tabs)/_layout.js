import React, { Suspense, lazy, useEffect } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Tabs } from "expo-router";
import { BlurView } from "expo-blur";
import { StyleSheet, useColorScheme } from "react-native";

const _layout = () => {
  const colorScheme = useColorScheme();
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: { position: "absolute" },
        tabBarBackground: () => (
          <BlurView
            intensity={80}
            tint={colorScheme === "dark" ? "dark" : "light"}
            style={{
              ...StyleSheet.absoluteFillObject,
              backgroundColor: "transparent",
              overflow: "hidden",
            }}
          />
        ),
      }}
    >
      <Tabs.Screen name="Chatlist" screenOptions={{}} />
    </Tabs>
  );
};

export default _layout;
