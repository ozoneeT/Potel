import { Stack } from "expo-router";
import { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Text, View } from "react-native";

import Onboarding from "./onboarding";

const OnBoardingLayout = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Onboarding></Onboarding>
    </GestureHandlerRootView>
  );
};

export default OnBoardingLayout;
