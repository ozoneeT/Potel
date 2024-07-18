import Colors from "@/constants/Color";
import Color from "@/constants/Colors";
import { Entypo, FontAwesome, Ionicons } from "@expo/vector-icons";
import { Link, Stack } from "expo-router";
import { TouchableOpacity, View, Text, Image, StyleSheet } from "react-native";
import { heightPercentageToDP } from "react-native-responsive-screen";

const Layout = () => {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: "Chats",
          headerLargeTitle: true,
          headerTransparent: true,
          headerBlurEffect: "regular",
          headerLeft: () => (
            <TouchableOpacity>
              <Ionicons
                name="ellipsis-horizontal-circle-outline"
                color={Colors.primary}
                size={30}
              />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <View style={styles.headerRight}>
              <View style={styles.icon1}>
                <FontAwesome name="search" size={20} color={Colors.primary} />
              </View>
              <View style={styles.icon2}>
                <Entypo
                  name="dots-three-vertical"
                  size={20}
                  color={Colors.primary}
                />
              </View>
            </View>
          ),
          headerStyle: {
            backgroundColor: "#fff",
          },
          headerSearchBarOptions: {
            placeholder: "Search",
          },
        }}
      />
    </Stack>
  );
};

const styles = StyleSheet.create({
  headerRight: {
    flexDirection: "row",
  },
  icon1: {
    height: 40,
    width: 40,
    borderRadius: 25,
    borderColor: Colors.primary,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  icon2: {
    height: 40,
    width: 40,
    borderRadius: 25,
    borderColor: Colors.primary,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 10,
  },
});
export default Layout;
