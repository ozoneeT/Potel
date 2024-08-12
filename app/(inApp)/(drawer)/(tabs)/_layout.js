import React, { Suspense, lazy, useEffect } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Stack, Tabs } from "expo-router";
import { ActivityIndicator, View } from "react-native";
import { DrawerToggleButton } from "@react-navigation/drawer";
const _layout = () => {
  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen
        name="Chatlist"
        options={{
          headerShown: true,
          headerLeft: () => <DrawerToggleButton />,
        }}
      />
    </Tabs>
  );
};

export default _layout;
