import React, { Suspense, lazy, useEffect } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Stack, Tabs } from "expo-router";
import { ActivityIndicator, View } from "react-native";

const _layout = () => {
  return <Tabs screenOptions={{ headerShown: false }} />;
};

export default _layout;
