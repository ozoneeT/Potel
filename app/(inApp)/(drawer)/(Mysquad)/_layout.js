import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";

const Tab = createMaterialTopTabNavigator();

import { Tabs } from "expo-router";
import { withLayoutContext } from "expo-router";
import { BlurView } from "expo-blur";
import { StyleSheet, useColorScheme } from "react-native";

// Create a MaterialTopTabs navigator
const MaterialTopTabs = createMaterialTopTabNavigator().Navigator;

// Wrap the MaterialTopTabs with withLayoutContext from expo-router
const MaterialTopTabsLayout = withLayoutContext(MaterialTopTabs);

const _layout = () => {
  const colorScheme = useColorScheme();
  return (
    <MaterialTopTabsLayout
      screenOptions={{
        tabBarLabelStyle: { fontSize: 12 },

        tabBarStyle: { backgroundColor: "transparent", top: 100 },
        tabBarBackground: () => (
          <BlurView
            intensity={80}
            tint={colorScheme === "dark" ? "dark" : "light"}
            style={{
              ...StyleSheet.absoluteFillObject,
            }}
          />
        ),
      }}
    ></MaterialTopTabsLayout>
  );
};

export default _layout;
