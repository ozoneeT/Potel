import { Drawer } from "expo-router/drawer";
import Colors from "@/constants/Color";
import { Ionicons } from "@expo/vector-icons";
import { Link, Stack } from "expo-router";
import { TouchableOpacity, View, Text, Image } from "react-native";
import { heightPercentageToDP } from "react-native-responsive-screen";

export default function Layout() {
  return (
    <Drawer
      screenOptions={{
        swipeEdgeWidth: 500,
        drawerStyle: { width: "90%" },
        swipeMinDistance: 200,
        freezeOnBlur: true,
      }}
    >
      <Drawer.Screen
        name="index"
        options={{
          drawerLabel: "Index",
          title: "Chats",
          headerLargeTitle: true,
          headerStyle: {
            backgroundColor: "transparent", // Keep the header transparent
          },
          headerTintColor: Colors.primary, // Ensure text color contrasts well with the background
          headerSearchBarOptions: {
            placeholder: "Search",
          },

          // headerLargeTitle: true,
          // headerTransparent: true,
          // headerBlurEffect: "regular",
          // headerLeft: () => (
          //   <TouchableOpacity>
          //     <Ionicons
          //       name="ellipsis-horizontal-circle-outline"
          //       color={Colors.primary}
          //       size={30}
          //     />
          //   </TouchableOpacity>
          // ),
          // headerRight: () => (
          //   <View style={{ flexDirection: "row", gap: 30 }}>
          //     <TouchableOpacity>
          //       <Ionicons
          //         name="camera-outline"
          //         color={Colors.primary}
          //         size={30}
          //       />
          //     </TouchableOpacity>
          //     <Link href="/(modals)/new-chat" asChild>
          //       <TouchableOpacity>
          //         <Ionicons
          //           name="add-circle"
          //           color={Colors.primary}
          //           size={30}
          //         />
          //       </TouchableOpacity>
          //     </Link>
          //   </View>
          // ),
        }}
      />
    </Drawer>
  );
}
