import React from "react";
import { router, Slot, Stack, Tabs } from "expo-router";
import { Pressable, Text } from "react-native";

const Layout = () => {
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerLeft: () => (
          <Pressable onPress={() => router.navigate("Chatlist")}>
            <Text>Goback</Text>
          </Pressable>
        ),
      }}
      initialRouteName="newMessage"
    />
  );
};

export default Layout;
