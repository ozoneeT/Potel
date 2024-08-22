import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Drawer } from "expo-router/drawer";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { BlurView } from "expo-blur";

export default function Layout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer
        screenOptions={{
          swipeEdgeWidth: 100,
        }}
        initialRouteName="(Squad)"
      >
        <Drawer.Screen
          name="(Squad)"
          options={{
            headerTitle: "Squad",
            headerShown: false,
            // headerTransparent: true,
            // headerBlurEffect: "regular",
            // headerBackground: () => (
            //   <BlurView
            //     intensity={80}
            //     tint="dark"
            //     style={{
            //       ...StyleSheet.absoluteFillObject,
            //     }}
            //   />
            // ),
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
