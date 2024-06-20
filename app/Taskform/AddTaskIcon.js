const icons = [
  "account",
  "airplane",
  "alarm",
  "alert",
  "alien",
  "apple",
  "archive",
  "arm-flex",
  "baby-carriage",
  "bag-personal",
  "basketball",
  "beach",
  "bed",
  "beer",
  "bicycle",
  "binoculars",
  "book",
  "boombox",
  "bottle-soda",
  "brain",
  "briefcase",
  "broom",
  "brush",
  "bus",
  "cake",
  "calculator",
  "calendar",
  "camera",
  "car",
  "cart",
  "cash",
  "castle",
  "cat",
  "chart-bar",
  "chat",
  "check",
  "checkbox-marked",
  "chess-queen",
  "chili-mild",
  "circle",
  "city",
  "clipboard-check",
  "clock",
  "cloud",
  "coffee",
  "cog",
  "compass",
  "cookie",
  "cow",
  "credit-card",
  "crown",
  "cupcake",
  "currency-usd",
  "database",
  "delete",
  "diamond",
  "dog",
  "door",
  "dots-horizontal",
  "drama-masks",
  "earth",
  "egg",
  "email",
  "emoticon-happy",
  "eye",
  "fan",
  "ferry",
  "file",
  "film",
  "filter",
  "fish",
  "flag",
  "flash",
  "flower",
  "folder",
  "food",
  "football",
  "fountain",
  "fridge",
  "gamepad",
  "gas-station",
  "gift",
  "glass-cocktail",
  "globe-model",
  "golf",
  "hamburger",
  "hammer",
  "hand-heart",
  "headphones",
  "heart",
  "home",
  "hospital",
  "ice-cream",
  "image",
];

import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import React from "react";
import { Link, useRouter } from "expo-router";
import { useDispatch, useSelector } from "react-redux";

import { BottomSheetScrollView } from "@gorhom/bottom-sheet"; // Adjust import as per your library
import { MaterialCommunityIcons } from "@expo/vector-icons"; // Assuming you're using Expo icons
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { useRef } from "react";
import { setTaskIcon } from "../../hooks/reducers/taskSlice";
import { FlashList } from "@shopify/flash-list";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import { Platform } from "react-native";

const AddTaskIcon = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  const handleSelectIcon = (iconName) => {
    dispatch(setTaskIcon(iconName));
    router.dismiss();
  };

  return (
    <View
      style={[
        styles.container,
        Platform.OS === "android"
          ? { marginTop: hp(18) }
          : { marginTop: hp(30) },
      ]}
    >
      <View style={styles.iconHolder} />
      <Pressable
        onPress={() => router.dismiss()}
        style={{
          left: "87%",
          padding: 10,
          position: "absolute",

          borderRadius: 20,
        }}
      >
        <Text>❌</Text>
      </Pressable>
      <View style={{ flex: 1, borderRadius: 20 }}>
        <FlashList
          data={icons}
          keyExtractor={(item) => item}
          estimatedItemSize={300}
          contentContainerStyle={styles.iconGrid}
          numColumns={5}
          renderItem={({ item }) => (
            <Pressable
              onPress={() => handleSelectIcon(item)}
              style={styles.iconButton}
            >
              <MaterialCommunityIcons name={item} size={30} color="black" />
            </Pressable>
          )}
        />
      </View>
    </View>
  );
};

export default AddTaskIcon;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  iconGrid: {
    padding: 16,
  },
  iconButton: {
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    margin: 8,
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
  },
  iconHolder: {
    width: 100,
    height: 10,
    borderRadius: 40,
    backgroundColor: "black",
    zIndex: 1,
    alignSelf: "center",
    marginVertical: 10,
  },
});
