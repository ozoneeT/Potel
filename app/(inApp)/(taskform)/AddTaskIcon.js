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
import React, { memo } from "react";
import { Link, useRouter } from "expo-router";
import { useDispatch, useSelector } from "react-redux";

import { AntDesign, MaterialCommunityIcons } from "@expo/vector-icons"; // Assuming you're using Expo icons
import { useRef } from "react";
import { setTaskIcon } from "@/hooks/reducers/taskSlice";
import { FlashList } from "@shopify/flash-list";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import { Platform } from "react-native";
import ActionSheet, {
  SheetManager,
  registerSheet,
} from "react-native-actions-sheet";

const AddTaskIcon = memo((props) => {
  const dispatch = useDispatch();

  const handleSelectIcon = (iconName) => {
    dispatch(setTaskIcon(iconName));
    SheetManager.hide("addtaskicon");
  };

  return (
    <ActionSheet id={props.sheetId}>
      <View style={[{ height: "80%" }]}>
        <View style={styles.iconHolder} />
        <Pressable
          onPress={() => SheetManager.hide("addtaskicon")}
          style={{
            left: "87%",
            padding: 10,
            position: "absolute",

            borderRadius: 20,
          }}
        ></Pressable>
        <View style={{ padding: 20 }}>
          <Pressable onPress={() => SheetManager.hide("addtaskicon")}>
            <AntDesign name="back" size={24} color="black" />
          </Pressable>
          <Text
            style={{
              fontSize: 27,
              marginTop: 10,
              fontFamily: "MontserratBold",
            }}
          >
            Change Icon
          </Text>
        </View>
        <View style={{ height: "150%" }}>
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
    </ActionSheet>
  );
});
registerSheet("addtaskicon", AddTaskIcon);
export default AddTaskIcon;

const styles = StyleSheet.create({
  iconGrid: {
    paddingHorizontal: 8,
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
    height: 5,
    borderRadius: 40,
    backgroundColor: "black",
    zIndex: 1,
    alignSelf: "center",
    marginVertical: 10,
  },
});
