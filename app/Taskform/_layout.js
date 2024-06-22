import React from "react";
import { Stack, Tabs } from "expo-router";

const _layout = () => {
  return (
    <Stack
      screenOptions={{ headerShown: false, presentation: "modal" }}
      initialRouteName="Newtask"
    />
  );
};

export default _layout;
