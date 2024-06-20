import { View, Text, StyleSheet, Image } from "react-native";
import React, { useEffect } from "react";
import LottieView from "lottie-react-native";

import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import LogoBack from "../components/LogoBack";

export default function StartPage() {
  return (
    <View style={styles.container}>
      <LogoBack style={{}}></LogoBack>
      <View style={styles.logoContainer}>
        <Image
          style={styles.logo}
          source={require("../assets/images/potel.png")}
          resizeMode="contain"
        />
        <Text style={styles.logoText}>POTEL</Text>
        <Text style={styles.subtitle}>Live a Productive life</Text>
        <LottieView
          style={styles.loader}
          source={require("../assets/lottie/dotyellow.json")}
          autoPlay
          loop
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  logo: {
    alignSelf: "center",
    justifyContent: "center",
    width: "30%",
    height: "30%",
    top: hp(6),
  },
  logoContainer: {
    justifyContent: "center",
    height: "100%",
    alignItems: "center",
  },
  logoText: {
    color: "#fff",
    alignSelf: "center",
    fontSize: hp(6),
    marginTop: hp(1),
    letterSpacing: wp(1),
  },
  subtitle: {
    color: "#fff",
    alignSelf: "center",
    fontSize: hp(1.5),
    letterSpacing: wp(0.7),
  },
  loader: {
    width: 100,
    height: 100,
    top: "20%",
  },
});
