import React from "react";
import { Stack, Tabs } from "expo-router";

const _layout = () => {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="Newtask"
        options={{
          presentation: "modal",
          animation: "slide_from_bottom",
        }}
      />
      <Stack.Screen
        name="AddTaskIcon"
        options={{
          presentation: "transparentModal",
          animation: "slide_from_bottom",
        }}
      />
      <Stack.Screen
        name="Category"
        options={{
          presentation: "transparentModal",
          animation: "slide_from_bottom",
        }}
      />
      <Stack.Screen
        name="Repeat"
        options={{
          presentation: "transparentModal",
          animation: "slide_from_bottom",
        }}
      />
      <Stack.Screen
        name="Reminder"
        options={{
          presentation: "transparentModal",
          animation: "slide_from_bottom",
        }}
      />
      <Stack.Screen
        name="Startdate"
        options={{
          presentation: "transparentModal",
          animation: "slide_from_bottom",
        }}
      />
      <Stack.Screen
        name="Goal"
        options={{
          presentation: "transparentModal",
          animation: "slide_from_bottom",
        }}
      />
    </Stack>
  );
};

export default _layout;
