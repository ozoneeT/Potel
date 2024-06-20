import { View, Text, StyleSheet, Image } from "react-native";
import React from "react";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

export default function LogoBack() {
  return (
    <View style={{}}>
      <Image
        style={styles.backgroundImage}
        resizeMode="contain"
        source={require("../assets/images/splashBack.jpg")}
      ></Image>
    </View>
  );
}
const styles = StyleSheet.create({
  backgroundImage: {
    position: "absolute",
    width: "120%",
    left: -10,
  },
});
