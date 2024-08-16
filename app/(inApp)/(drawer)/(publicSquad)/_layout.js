import { Tabs } from "expo-router";
import { withLayoutContext } from "expo-router";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";

// Create a MaterialTopTabs navigator
const MaterialTopTabs = createMaterialTopTabNavigator().Navigator;

// Wrap the MaterialTopTabs with withLayoutContext from expo-router
const MaterialTopTabsLayout = withLayoutContext(MaterialTopTabs);

const _layout = () => {
  return (
    <MaterialTopTabsLayout
      screenOptions={{
        tabBarLabelStyle: { fontSize: 12 },
      }}
    >
      <MaterialTopTabsLayout.Screen
        name="exploreSquad"
        options={{ title: "Find LikeMided" }}
      />
      <MaterialTopTabsLayout.Screen
        name="yourSquad"
        options={{ title: "Your Squad" }}
      />
    </MaterialTopTabsLayout>
  );
};

export default _layout;
