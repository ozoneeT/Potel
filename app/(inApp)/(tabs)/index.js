import {
  View,
  Text,
  Button,
  StyleSheet,
  Image,
  Touchable,
  TouchableOpacity,
  TextInput,
  TouchableHighlight,
  useWindowDimensions,
  Pressable,
} from "react-native";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { router } from "expo-router";
import { AuthContextProvider, useAuth } from "@/context/authContext";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { Ionicons } from "@expo/vector-icons";

import { Entypo } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "react-native-vector-icons/FontAwesome";
import Animated, {
  Easing,
  interpolate,
  useAnimatedProps,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import LottieView from "lottie-react-native";
import PotelHead from "@/assets/images/potelHead.png";
import RadarGray from "@/assets/lottie/RadarGray.json";
import Card from "@/components/Card";

export default function Home() {
  const { logout, user } = useAuth();
  const scale = useSharedValue(0);
  const ease = Easing.inOut(Easing.ease);
  const width = useWindowDimensions.width;
  const height = useWindowDimensions.height;
  const [display, setDisplay] = useState("none");
  const snapPoints = useMemo(() => ["15%", "50%", "100%"], []);
  const BottomSheetRef = useRef(null);
  const handleOpenPress = () => BottomSheetRef.current?.close();
  const handleClosePress = () => BottomSheetRef.current?.snapToIndex();

  const animatedStyles = useAnimatedStyle(() => ({
    transform: [{ scale: interpolate(scale.value, [0, 1], [1, 1.1]) }], // Map scale value to scale transform
  }));

  useEffect(() => {
    scale.value = withDelay(
      0, // No delay
      withRepeat(
        withTiming(1, { duration: 1500, easing: ease }), // Animate to scale 1 over 1.5 seconds
        -1, // Repeat indefinitely
        true // Don't start immediately
      )
    );
  }, []);

  const handleLogout = async () => {
    await logout();
  };

  const resetAsyncStorage = async () => {
    try {
      await AsyncStorage.clear();
      console.log("AsyncStorage is cleared");
    } catch (error) {
      console.error("Error", error);
    }
  };

  const rotationAnimation = useSharedValue(0);
  const startAnimation = () => {
    rotationAnimation.value = withRepeat(
      withSequence(
        withTiming(25, { duration: 150 }),
        withTiming(0, { duration: 150 })
      ),
      4,
      false
    );
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotationAnimation.value}deg` }],
  }));

  return (
    <View style={styles.loginContainer}>
      <Text style={{ color: "#ffffff", top: 40 }}>
        Welcome Home {user?.username}
      </Text>

      <Pressable onPress={() => startAnimation()} style={styles.headerLeft}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginBottom: -5,
            marginLeft: 5,
          }}
        >
          <Text style={styles.greetingText}>Hello</Text>
          <Animated.View style={animatedStyle}>
            <Text style={styles.hand}>👋</Text>
          </Animated.View>
        </View>
        <Text style={styles.nameText}>Jade</Text>
      </Pressable>
      <View style={styles.circleInner}>
        <Animated.View style={[styles.innerCircle, animatedStyles]}>
          <TouchableOpacity style={{ backgroundColor: "red" }} />
          <View style={styles.circle}>
            <Image
              style={{ width: 90, zIndex: 1 }}
              resizeMode="contain"
              source={PotelHead}
            ></Image>
            <LinearGradient
              style={styles.circle}
              colors={["#000000", "#101010cf"]}
              start={{ x: 0.1, y: 0.3 }}
              end={{ x: 0.25, y: 0 }}
            />
          </View>
        </Animated.View>
        <Card cardText={"helo"} cardTime={"7/12/24"}></Card>
        <View
          style={{
            width: "120%",
            height: "100%",
            position: "absolute",
            zIndex: -1,
          }}
        >
          <LottieView
            style={{ flex: 1, display: display }}
            autoPlay
            loop
            source={RadarGray}
          ></LottieView>
        </View>
      </View>

      <View>
        <AuthContextProvider>
          <Button title="Logout" onPress={handleLogout}></Button>
        </AuthContextProvider>
      </View>
      {/* <BottomSheet
        ref={BottomSheetRef}
        snapPoints={snapPoints}
        // handleIndicatorStyle={{ backgroundColor: "red" }}
      >
        <View>
          <Text>Hellow</Text>
        </View>
      </BottomSheet> */}
    </View>
  );
}
const styles = StyleSheet.create({
  loginContainer: {
    flex: 1,
    backgroundColor: "#fff",
  },

  circle: {
    backgroundColor: "red",
    width: 180,
    height: 180,
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#969090", // Base color for the circle
    borderColor: "#ffffffff",
    borderWidth: 5,
    position: "absolute",
  },
  circleInner: {
    width: "100%",
    height: "70%",
    alignItems: "center",
  },
  innerCircle: {
    width: "100%",
    height: "73%",
    justifyContent: "center",
    left: "26%",
  },
  logoContainer: {
    width: wp("100%"),
    alignItems: "center",
    top: hp("5.5%"),
  },
  PotelText: {
    fontFamily: "montserratRegular",
    color: "#fff",
    fontSize: hp("5%"),
    letterSpacing: 5,
  },
  PotelSubtitle: {
    // fontFamily: "Inter",
    color: "#fff",
    fontSize: hp("1.2%"),
  },
  NaviButton: {
    marginTop: hp("10%"),
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#1A1A1B",
    // width: wp("50%"),
    // padding: hp("1%"),
    alignSelf: "center",
    borderRadius: 14,
    // paddingHorizontal: hp("2%"),
  },
  loginButton: {
    // backgroundColor: "#262629",
    paddingVertical: hp("1.5%"),
    paddingHorizontal: hp("3%"),
    borderRadius: 14,
    marginRight: 10,
    fontFamily: "montserratMedium",
  },
  registerButton: {
    backgroundColor: "#262629",
    paddingVertical: hp("1.5%"),
    paddingHorizontal: hp("3%"),
    borderRadius: 14,
    fontFamily: "montserratMedium",
  },
  loginForm: {
    marginTop: hp("5%"),
    alignSelf: "center",
    display: "none",
  },
  registraionForm: {
    marginTop: hp("1%"),
    alignSelf: "center",
    display: "flex",
  },
  formText: {
    color: "#575758",
    fontSize: hp("2.1%"),
    marginTop: 20,
  },
  formInput: {
    width: wp("85%"),
    // height: hp("2%"),
    backgroundColor: "#262629",
    padding: 10,
    paddingVertical: hp("1.5%"),
    fontSize: hp("1.9%"),
    marginTop: 15,
    borderRadius: 10,
    color: "#575758",
  },
  bigLogin: {
    width: wp("85%"),
    // height: hp("2%"),
    backgroundColor: "#262629",
    padding: 10,
    paddingVertical: hp("1.5%"),
    fontSize: hp("1.9%"),
    marginTop: 15,
    borderRadius: 10,
    color: "#575758",
    alignItems: "center",
    marginTop: 50,
  },
  forgotPassword: {
    color: "#fff",
    alignItems: "center",
    marginVertical: 15,
  },
  oauth: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignContent: "center",
    alignItems: "center",
  },
  icon: {
    // width: wp("10%"),
    // height: hp("5%"),
    aspectRatio: 1,
    marginHorizontal: 10,
  },
  oauthIcon: {
    flexDirection: "row",
    backgroundColor: "#575758",
    width: wp("33.5%"),
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: 10,
  },
  oauthText: {
    color: "#fff",
    fontSize: 15,
  },
  facebook: {
    flexDirection: "row",
  },

  chatTime: {
    marginLeft: 10,
  },
  hand: {
    fontSize: 22,
  },
  greetingText: {
    fontSize: 15,
    fontFamily: "PoppinsRegular",
  },
  nameText: {
    fontSize: 23,
    fontFamily: "PoppinsSemiBold",
  },
});
