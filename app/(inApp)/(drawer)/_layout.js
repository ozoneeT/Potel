import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Drawer } from "expo-router/drawer";
import { Pressable, Text, View } from "react-native";

export default function Layout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer
        screenOptions={{
          swipeEdgeWidth: 100,
        }}
        initialRouteName="(publicSquad)"
      >
        <Drawer.Screen
          name="(publicSquad)"
          options={{
            headerTitle: "Squad",
            headerRight: () => (
              <View style={{}}>
                <Pressable style={{ paddingHorizontal: 15 }}>
                  <Text style={{ color: "gray", fontSize: 15 }}>
                    {" "}
                    + New Squad
                  </Text>
                </Pressable>
              </View>
            ),
          }}
        />
        <Drawer.Screen name="(tabs)" options={{ headerShown: false }} />
      </Drawer>
    </GestureHandlerRootView>
  );
}
