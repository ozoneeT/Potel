import {
  View,
  Text,
  Button,
  StyleSheet,
  Image,
  Touchable,
  TouchableOpacity,
  TextInput,
  Alert,
  TouchableHighlight,
  useWindowDimensions,
  KeyboardAvoidingView,
  ScrollView,
  ActivityIndicator,
  Modal,
  useColorScheme,
} from "react-native";
import React, { useState, useEffect, useRef } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import Checkbox from "expo-checkbox";
import { useRouter } from "expo-router";
import Loading from "../components/Loading";
import { useAuth } from "../context/authContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import LottieView from "lottie-react-native";
import CustomKeyboardView from "../components/CustomKeyboardView";
import SegmentedControl from "../components/SegmentedControl";
import Animated, {
  FadeIn,
  FadeOut,
  BounceInRight,
  SlideOutLeft,
  BounceOutLeft,
  SlideInRight,
  FadeOutLeft,
  SlideOutUp,
  SlideInLeft,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
  heightPercentageToDP,
} from "react-native-responsive-screen";

import { LinearGradient } from "expo-linear-gradient";
import { collection, getDocs, query, where } from "@firebase/firestore";
import AntDesign from "@expo/vector-icons/AntDesign";
import { auth, db } from "../FirebaseConfig";
import NetInfo from "@react-native-community/netinfo";
import LogoBack from "../components/LogoBack";
import {
  GoogleAuthProvider,
  getAuth,
  getRedirectResult,
  signInWithRedirect,
} from "firebase/auth";
import * as firebase from "firebase/app";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Colors } from "@/constants/Colors";
import LoginBack from "../assets/images/newback.png";
export default function SignIn() {
  const colorScheme = useColorScheme();
  const router = useRouter();

  const [isChecked, setIsChecked] = useState(false);

  const options = ["Login", "Register"];
  const [selectedOption, setSelectedOption] = useState("Login");

  const [showFullTerms, setShowFullTerms] = useState(false);

  const gradientColors =
    colorScheme === "dark" ? ["#FBB040", "#EDBB0A"] : ["#ffffff", "#ffffff"];

  const clearAsyncStorage = async () => {
    try {
      await AsyncStorage.clear();
      console.log("cleared");
    } catch (error) {
      console.log * error;
    }
  };
  // Login Form
  const LoginForm = () => {
    const emailRef = useRef("");
    const PasswordRef = useRef("");
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const provider = new GoogleAuthProvider();
    const auth = getAuth();

    const signInWithGoogle = async () => {
      const auth = getAuth();
      getRedirectResult(auth)
        .then((result) => {
          // This gives you a Google Access Token. You can use it to access Google APIs.
          const credential = GoogleAuthProvider.credentialFromResult(result);
          const token = credential.accessToken;

          // The signed-in user info.
          const user = result.user;
          // IdP data available using getAdditionalUserInfo(result)
          // ...
        })
        .catch((error) => {
          // Handle Errors here.
          const errorCode = error.code;
          const errorMessage = error.message;
          // The email of the user's account used.
          const email = error.customData.email;
          // The AuthCredential type that was used.
          const credential = GoogleAuthProvider.credentialFromError(error);
          // ...
        });
    };

    const { login, appResetPassword } = useAuth();
    // const handleLogin = async () => {

    //   if (!emailRef.current || !PasswordRef.current) {
    //     Alert.alert("Sign In", "Please fill all the fields!");
    //     return;
    //   }
    //   setLoading(true);
    //   const response = await login(emailRef.current, PasswordRef.current);
    //   setLoading(false);
    //   if (!response.success) {
    //     Alert.alert("Sign IN", response.msg);
    //   }
    // };

    const handleLogin = async () => {
      if (!emailRef.current || !PasswordRef.current) {
        Alert.alert("Sign In", "Please fill all the fields!");
        return;
      }

      setLoading(true);

      // Determine login type (email or username)
      const inputValue = emailRef.current.trim();
      let loginField;
      if (/\.(com|net|org)$/.test(inputValue)) {
        // Check for common email domain suffixes
        loginField = "email";
      } else if (/\@/.test(inputValue)) {
        // Check for "@" symbol (less reliable)
        loginField = "email";
      } else {
        loginField = "username"; // Assume username if not an email
      }
      if (loginField == "username") {
        try {
          const usersRef = collection(db, "users");
          const querySnapshot = await getDocs(
            query(usersRef, where("username", "==", inputValue.toLowerCase())) // Use the current value for username
          );

          // Check if a user with the provided username exists
          if (querySnapshot.empty) {
            Alert.alert("Login Error", "Username not found.");
            setLoading(false);
            return;
          }

          // Extract email from the first matching user document (assuming usernames are unique)
          const userDoc = querySnapshot.docs[0];
          const userEmail = userDoc.data().email; // Access the "email" field in the user document

          // Proceed with login using the fetched email and password
          const response = await login(userEmail, PasswordRef.current);
          // ... rest of your login logic (handle success/failure)
        } catch (error) {
          setLoading(false);
          Alert.alert("Sign In", "An error occurred. Please try again.");
          console.error("Login error:", error); // Log the error for debugging
        }
      }

      if (loginField == "email") {
        setLoading(true);
        const response = await login(
          emailRef.current.trim(),
          PasswordRef.current
        );
        setLoading(false);
        if (!response.success) {
          Alert.alert("Sign IN", response.msg);
        }
      }
    };

    const [isPasswordShown, setIsPasswordShown] = useState(false);
    const [isAvailable, setIsAvailable] = useState(true);
    const [uloading, setuLoading] = useState(false);
    const [udisplay, setuDisplay] = useState(false);
    const [uIcon, setuIcon] = useState("checkcircle");
    const [uIconcolor, setuIconcolor] = useState("green");
    const [isTakenText, setisTakenText] = useState("Username is Taken");
    const [floading, setfLoading] = useState(false);

    const handleForgetPassword = async () => {
      console.log("pressed");

      if (!emailRef.current) {
        Alert.alert("Forget Password", "Please Provide your email or username");
        return;
      }

      setfLoading(true);

      // Determine login type (email or username)
      const inputValue = emailRef.current.trim();
      let loginField;
      if (/\.(com|net|org)$/.test(inputValue)) {
        // Check for common email domain suffixes
        loginField = "email";
      } else if (/\@/.test(inputValue)) {
        // Check for "@" symbol (less reliable)
        loginField = "email";
      } else {
        loginField = "username"; // Assume username if not an email
      }
      if (loginField == "username") {
        try {
          const usersRef = collection(db, "users");
          const querySnapshot = await getDocs(
            query(usersRef, where("username", "==", inputValue.toLowerCase())) // Use the current value for username
          );

          // Check if a user with the provided username exists
          if (querySnapshot.empty) {
            Alert.alert("Unable to Reset", "Username not found.");
            setfLoading(false);
            return;
          }

          // Extract email from the first matching user document (assuming usernames are unique)
          const userDoc = querySnapshot.docs[0];
          const userEmail = userDoc.data().email; // Access the "email" field in the user document

          // Proceed with login using the fetched email and password
          const response = await appResetPassword(userEmail);
          setfLoading(false);
          if (response.success) {
            setShowModal(false);
            console.log(response);
            Alert.alert("Reset Password Email Sent");
          } else {
            console.log("Unknown Error Details:", response); // Log unknown error details
            Alert.alert("Error", "An unknown error occurred");
          }

          // ... rest of your login logic (handle success/failure)
        } catch (error) {
          setfLoading(false);
          Alert.alert("ForgetPassword", "An error occurred. Please try again.");
          console.error("Login error:", error); // Log the error for debugging
        }
      }

      if (loginField == "email") {
        const userEmail = emailRef.current.trim().toLowerCase(); // Get and lowercase email

        const usersRef = collection(db, "users");
        const querySnapshot = await getDocs(
          query(usersRef, where("email", "==", userEmail))
        );

        // Check if a user with the provided email exists
        if (querySnapshot.empty) {
          Alert.alert("Unable to Reset", "Account Does Not Exist");
          setfLoading(false);
          return;
        }
        setfLoading(true);
        const response = await appResetPassword(userEmail);

        setfLoading(false);
        console.log(response);
        if (response.success) {
          setShowModal(false);
          console.log(response);
          Alert.alert("Reset Password Email Sent");
        } else {
          if (response.error) {
            // Check if error object exists
            console.log("Firebase Error Details:", response.Error); // Log the error details
            const errorCode = response.error.code;

            if (errorCode === "auth/invalid-email") {
              Alert.alert(
                "Invalid Email",
                "Please enter a valid email address."
              );
            } else if (errorCode === "auth/user-not-found") {
              Alert.alert("User Not Found", "User not found");
            } else {
              Alert.alert("Error", `Error Code: ${errorCode}`);
            }
          } else {
            console.log("Unknown Error Details:", response); // Log unknown error details
            Alert.alert("Error", "An unknown error occurred");
          }
        }
        if (!response.success) {
          Alert.alert("Forget Password", response.msg);
        }
      }
    };

    return (
      <ScrollView>
        <Animated.View
          style={styles.loginForm}
          entering={SlideInLeft}
          exiting={SlideOutLeft}
        >
          <View style={styles.usernameField}>
            <Text style={styles.formText}>Username or Email</Text>
            <TextInput
              style={[
                styles.formInput,
                {
                  backgroundColor:
                    colorScheme === "light"
                      ? Colors.light.background
                      : Colors.dark.gray,
                  color:
                    colorScheme === "dark"
                      ? Colors.dark.text
                      : Colors.light.text,
                },
              ]}
              placeholder="username or Email"
              placeholderTextColor={"#575758"}
              keyboardType="email-address"
              onChangeText={(value) => (emailRef.current = value)}
            ></TextInput>
          </View>
          <View style={styles.usernameField}>
            <Text style={[styles.formText]}>Password</Text>
            <TextInput
              style={[
                styles.formInput,
                {
                  backgroundColor:
                    colorScheme === "light"
                      ? Colors.light.background
                      : Colors.dark.gray,
                  color:
                    colorScheme === "dark"
                      ? Colors.dark.text
                      : Colors.light.text,
                },
              ]}
              placeholder="****************"
              placeholderTextColor={"#575758"}
              secureTextEntry={isPasswordShown}
              onChangeText={(value) => (PasswordRef.current = value)}
            ></TextInput>
            <TouchableOpacity
              onPress={() => setIsPasswordShown(!isPasswordShown)}
              style={{
                position: "absolute",
                right: 12,
                top: hp("8.7%"),
              }}
            >
              {isPasswordShown == true ? (
                <Ionicons name="eye-off" size={24} color={"#575758"} />
              ) : (
                <Ionicons name="eye" size={24} color={"#575758"} />
              )}
            </TouchableOpacity>
          </View>
          <View style={{ alignItems: "center" }}>
            <TouchableOpacity onPress={() => handleLogin()} activeOpacity={0.9}>
              <LinearGradient
                style={styles.bigLogin}
                colors={gradientColors}
                start={{ x: 0.2, y: 0.5 }}
                end={{ x: 1, y: 0 }}
              >
                <View
                  style={{
                    justifyContent: "center",
                  }}
                >
                  {loading ? (
                    <View style={[styles.loader, { top: -5 }]}>
                      <Loading />
                    </View>
                  ) : (
                    <Text
                      style={{
                        fontSize: 20,
                        color:
                          colorScheme === "dark"
                            ? Colors.dark.text
                            : Colors.light.text,

                        paddingVertical: 10,
                      }}
                    >
                      Log In
                    </Text>
                  )}
                </View>
              </LinearGradient>
            </TouchableOpacity>

            {/* Forgot Passowrd */}
            <View style={styles.forgotPassword}>
              <TouchableHighlight onPress={() => setShowModal(true)}>
                <Text style={{ color: "#fff" }}>Forgot Your Password?</Text>
              </TouchableHighlight>
              <Text style={{ color: "#fff", marginTop: 20 }}>Or</Text>
            </View>
          </View>
          <View style={styles.oauth}>
            <View style={styles.oauthIcon}>
              <Image
                style={styles.icon}
                source={require("../assets/images/facebookIcon.png")}
              />
              <Text style={styles.oauthText}>Facebook</Text>
            </View>
            <TouchableOpacity
              onPress={signInWithGoogle}
              style={styles.oauthIcon}
            >
              <Image
                style={styles.icon}
                source={require("../assets/images/googleIcon.png")}
              />
              <Text style={styles.oauthText}>Google</Text>
            </TouchableOpacity>
          </View>

          {/*  Forget Password */}
          <Modal
            animationType="slide"
            transparent={true}
            visible={showModal}
            onRequestClose={() => setShowModal(false)}
          >
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <ThemedView
                lightColor={Colors.light.background}
                darkColor={Colors.dark.background}
                style={styles.modal}
              >
                <View style={styles.usernameField}>
                  <Text style={[styles.formText, { alignSelf: "center" }]}>
                    Forgot Password?
                  </Text>
                  <View style={[styles.usernameField]}>
                    {!isAvailable && !uloading && udisplay && (
                      <Text
                        style={{
                          color: "red",
                          width: "80%",
                          fontSize: 12,
                        }}
                      >
                        {isTakenText}
                      </Text>
                    )}
                    <Text style={styles.formText}>Email Address</Text>
                    <TextInput
                      style={[
                        styles.formInput,
                        {
                          width: "100%",
                          height: 50,
                          backgroundColor:
                            colorScheme === "dark"
                              ? Colors.dark.text
                              : Colors.light.text,
                          color:
                            colorScheme === "dark"
                              ? Colors.dark.background
                              : Colors.light.background,
                        },
                      ]}
                      placeholder="username or email"
                      placeholderTextColor={
                        colorScheme === "dark"
                          ? Colors.dark.background
                          : Colors.light.background
                      }
                      onChangeText={(value) => (emailRef.current = value)}
                      keyboardType="email-address"
                    ></TextInput>
                  </View>

                  {floading ? (
                    <View style={styles.loader}>
                      <Loading />
                    </View>
                  ) : (
                    <TouchableOpacity onPress={() => handleForgetPassword()}>
                      <LinearGradient
                        style={[styles.bigLogin, { width: "100%" }]}
                        colors={["#FBB040", "#EDBB0A"]}
                        start={{ x: 0.1, y: 0.3 }}
                        end={{ x: 0.25, y: 0 }}
                      >
                        <Text style={{ fontSize: 20, color: "#fff" }}>
                          Submit
                        </Text>
                      </LinearGradient>
                    </TouchableOpacity>
                  )}
                </View>

                <TouchableOpacity onPress={() => setShowModal(false)}>
                  <Text
                    style={{
                      alignSelf: "center",
                      padding: 10,
                      color:
                        colorScheme === "dark"
                          ? Colors.dark.text
                          : Colors.light.text,
                    }}
                  >
                    Close
                  </Text>
                </TouchableOpacity>
              </ThemedView>
            </View>
          </Modal>
        </Animated.View>
      </ScrollView>
    );
  };

  // Forget Password

  // REGISTRATION
  const RegistrationForm = () => {
    const emailRef = useRef("");
    const PasswordRef = useRef("");
    const usernameRef = useRef("");
    const { register } = useAuth();
    const [isPasswordShown, setIsPasswordShown] = useState(false);
    const [isAvailable, setIsAvailable] = useState(true);
    const [loading, setLoading] = useState(false);
    const [uloading, setuLoading] = useState(false);
    const [udisplay, setuDisplay] = useState(false);
    const [uIcon, setuIcon] = useState("checkcircle");
    const [uIconcolor, setuIconcolor] = useState("green");
    const [isTakenText, setisTakenText] = useState("Username is Taken");
    const allowedChars = /^[a-zA-Z0-9_]+$/;
    // Password complexity check
    const hasLowercase = /[a-z]/.test(PasswordRef.current);
    const hasUppercase = /[A-Z]/.test(PasswordRef.current);
    const hasNumber = /[0-9]/.test(PasswordRef.current);
    const minLength = 8; // Adjust minimum length as needed
    const [isPasswordValid, setIsPasswordValid] = useState(false);
    const [passwordCheckText, setpasswordCheckText] = useState("");
    const [passwordCheckColor, setPasswordCheckColor] = useState("red");

    const handleRegister = async () => {
      if (!emailRef.current || !PasswordRef.current || !usernameRef.current) {
        Alert.alert("Sign Up", "Please fill all the fields!");
        return;
      }

      if (!allowedChars.test(usernameRef.current)) {
        Alert.alert(
          "SignUP Error",
          "Invalid username (special characters found)"
        );
        return;
      }
      if (usernameRef.current.length < 5) {
        Alert.alert("Sign Up", "Username must contain atleast 5 characters");
        return;
      }
      // password Comlexity
      if (
        PasswordRef.current.length < minLength ||
        !hasLowercase ||
        !hasUppercase
      ) {
        Alert.alert(
          "Sign Up",
          "Password must be at least " +
            minLength +
            " characters and contain a lowercase letter and an uppercase letter"
        );
        return;
      }

      setLoading(true);
      let response = await register(
        emailRef.current.toLowerCase().trim(),
        PasswordRef.current,
        usernameRef.current.toLowerCase().trim()
      );
      setLoading(false);
      console.log("got result", response);

      if (!response.success) {
        Alert.alert("sign Up", response.msg);
      }
    };

    const handleUsernameChange = async (value) => {
      usernameRef.current = value.trim(); // Update the value of the ref
      setuLoading(true);

      if (value.length > 4 && allowedChars.test(value)) {
        setuDisplay(true);
        // Check if username length is greater than 5
        try {
          const connectionState = await NetInfo.fetch();
          const isConnected = connectionState.isConnected; // true/false
          const timeOut = 10000;
          console.log(isConnected);
          if (isConnected) {
            const usersRef = collection(db, "users");
            const querySnapshot = await getDocs(
              query(
                usersRef,
                where("username", "==", value.toLowerCase().trim())
              ), // Use the current value for username
              { timeOut: timeOut }
            );
            console.log(querySnapshot.empty);
            // If there are any documents, the username is taken
            setuLoading(false);
            // console.log(querySnapshot.empty);
            // console.log(
            //   `Username availability: ${
            //     querySnapshot.empty ? "Available" : "Taken"
            //   }`
            // ); // Informative logging

            if (querySnapshot.empty) {
              setuIcon("checkcircle");
              setuIconcolor("green");
              setIsAvailable(true);
            } else {
              setuIcon("closecircle");
              setuIconcolor("red");
              setIsAvailable(false);
              setisTakenText("Username is Taken");
            }
          } else {
            console.warn("Offline: Username availability check skipped.");
            setuIcon("infocircle"); // Use a neutral icon (optional)
            setuIconcolor("gray"); // Set a neutral color (optional)
            setIsAvailable(false); // Set availability to unknown
            setisTakenText("Check internet connection to verify username.");
            setuDisplay(true);
          }
        } catch (error) {
          if (error.code === "firestore/timeout") {
            console.warn(
              "Slow internet: Username availability check timed out."
            );
            setuIcon("helpcircle"); // Use a neutral icon
            setuIconcolor("orange"); // Indicate potential issue
            setIsAvailable(null); // Set availability to unknown
            setisTakenText("Slow internet. Username check may be inaccurate.");
          } else {
            console.error("Error checking username:", error);
            // Handle other errors
          }
        }
      } else {
        setIsAvailable(true); // Reset availability if username length is not greater than 5
        setuLoading(false);
        setuDisplay(false);
      }
      if (value.length === 0) {
        // Handle empty input (optional)
        setIsAvailable(true); // Reset availability if needed
        setuLoading(false); // Hide loading indicator
        setuDisplay(false); // Hide error indicator (optional)
        setisTakenText(""); // Clear any previous error message (optional)
        // console.log("Empty input");
      } else if (!allowedChars.test(value)) {
        setIsAvailable(false);
        setuIcon("closecircle");
        setuIconcolor("red");
        setisTakenText(
          "Only letters, numbers, and underscores (_) are allowed"
        );
        setuDisplay(true);
        // console.log("error: Invalid username (special characters found)");
      }
    };

    const handlePassword = (value) => {
      PasswordRef.current = value;
      const hasLowercase = /[a-z]/.test(value);
      const hasUppercase = /[A-Z]/.test(value);
      const hasNumber = /[0-9]/.test(value);
      const specialchar = /[^a-zA-Z0-9]/; // Matches anything except alphanumeric
      const hasSpecial = specialchar.test(value);

      if (value.length >= minLength && hasLowercase && hasUppercase) {
        if (hasNumber && hasSpecial) {
          setIsPasswordValid(true);
          setPasswordCheckColor("green");
          setpasswordCheckText("Great 👌");
        } else if (hasNumber) {
          setIsPasswordValid(true);
          setPasswordCheckColor("yellow");
          setpasswordCheckText("Better(You can make it Great add Symbols 👍)");
        } else {
          setIsPasswordValid(true);
          setPasswordCheckColor("coral");
          setpasswordCheckText(
            "Good (But you can make it better add Numbers😉)"
          );
        }
      } else {
        setIsPasswordValid(false);
        setPasswordCheckColor("red");
        setpasswordCheckText("Use More Complex Password(with UpperCase)");
      }
      if (value.length === 0) {
        setIsPasswordValid(false);
        setPasswordCheckColor("red");
        setpasswordCheckText("");
      }
    };

    return (
      <CustomKeyboardView>
        <View style={[styles.registraionForm]}>
          <View style={[styles.usernameField]}>
            <Text style={styles.formText}>Username</Text>

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <TextInput
                style={[
                  styles.formInput,
                  {
                    backgroundColor:
                      colorScheme === "light"
                        ? Colors.light.background
                        : Colors.dark.gray,
                    color:
                      colorScheme === "dark"
                        ? Colors.dark.text
                        : Colors.light.text,
                  },
                ]}
                placeholder="Username"
                placeholderTextColor={"#575758"}
                onChangeText={handleUsernameChange}
                keyboardType="default"
              />
              {/* Adjust position to avoid overlap */}
              <View style={{ right: wp(5), top: 28.5, position: "absolute" }}>
                {uloading && <ActivityIndicator style={{}} />}
                {(!isAvailable || isAvailable) && !uloading && udisplay && (
                  <AntDesign
                    name={uIcon}
                    size={20}
                    color={uIconcolor}
                    style={{}}
                  />
                )}
              </View>
            </View>
          </View>
          <View style={styles.usernameField}>
            {!isAvailable && !uloading && udisplay && (
              <Text
                style={{
                  color: "red",
                  width: "80%",
                  fontSize: 12,
                }}
              >
                {isTakenText}
              </Text>
            )}
            <Text style={styles.formText}>Email Address</Text>
            <TextInput
              style={[
                styles.formInput,
                {
                  backgroundColor:
                    colorScheme === "light"
                      ? Colors.light.background
                      : Colors.dark.gray,
                  color:
                    colorScheme === "dark"
                      ? Colors.dark.text
                      : Colors.light.text,
                },
              ]}
              placeholder="you@example.com"
              placeholderTextColor={"#575758"}
              onChangeText={(value) => (emailRef.current = value)}
              keyboardType="email-address"
            ></TextInput>
          </View>
          <View style={styles.usernameField}>
            <Text style={[styles.formText]}>Password</Text>
            <TextInput
              style={[
                styles.formInput,
                {
                  backgroundColor:
                    colorScheme === "light"
                      ? Colors.light.background
                      : Colors.dark.gray,
                  color:
                    colorScheme === "dark"
                      ? Colors.dark.text
                      : Colors.light.text,
                },
              ]}
              placeholder="****************"
              placeholderTextColor={"#575758"}
              secureTextEntry={isPasswordShown}
              onChangeText={handlePassword}
            ></TextInput>
            <TouchableOpacity
              onPress={() => setIsPasswordShown(!isPasswordShown)}
              style={{
                position: "absolute",
                right: 1,
                padding: 15,
                top: hp(6.57),
              }}
            >
              {isPasswordShown == true ? (
                <Ionicons name="eye-off" size={24} color={"black"} />
              ) : (
                <Ionicons name="eye" size={24} color={"black"} />
              )}
            </TouchableOpacity>
          </View>
          <Text style={{ color: passwordCheckColor, fontSize: 12 }}>
            {passwordCheckText}
          </Text>
          <View>
            {loading ? (
              <View style={styles.loader}>
                <Loading />
              </View>
            ) : (
              <TouchableOpacity
                onPress={() => handleRegister()}
                activeOpacity={0.9}
              >
                <LinearGradient
                  style={styles.bigLogin}
                  colors={gradientColors}
                  start={{ x: 0.2, y: 0.5 }}
                  end={{ x: 1, y: 0 }}
                >
                  <View
                    style={{
                      justifyContent: "center",
                    }}
                  >
                    {loading ? (
                      <View style={[styles.loader, { top: -5 }]}>
                        <Loading />
                      </View>
                    ) : (
                      <Text
                        style={{
                          fontSize: 20,
                          color:
                            colorScheme === "dark"
                              ? Colors.dark.text
                              : Colors.light.text,

                          paddingVertical: 10,
                        }}
                      >
                        Register
                      </Text>
                    )}
                  </View>
                </LinearGradient>
              </TouchableOpacity>
            )}
            {/* Forgot Passowrd */}
            <View style={styles.forgotPassword}>
              {/* <TouchableHighlight onPress={() => console.log("pressed")}>
              <Text style={{ color: "#fff" }}>Forgot Your Password?</Text>
            </TouchableHighlight> */}
              <Text style={{ color: "#fff", marginTop: -5 }}>Or</Text>
            </View>
          </View>
          <View style={styles.oauth}>
            <View style={styles.oauthIcon}>
              <Image
                style={styles.icon}
                source={require("../assets/images/facebookIcon.png")}
              />
              <Text style={styles.oauthText}>Facebook</Text>
            </View>
            <View style={styles.oauthIcon}>
              <Image
                style={styles.icon}
                source={require("../assets/images/googleIcon.png")}
              />
              <Text style={styles.oauthText}>Google</Text>
            </View>
          </View>
        </View>
      </CustomKeyboardView>
    );
  };

  return (
    <ThemedView
      lightColor={Colors.light.primary}
      darkColor={Colors.dark.background}
      style={styles.loginContainer}
    >
      <Image
        style={{ position: "absolute", width: "150%", top: -150 }}
        source={LoginBack}
      />
      <SafeAreaView style={styles.logoContainer}>
        <Button title="clear" onPress={() => clearAsyncStorage()}></Button>
        <Image
          style={styles.logo}
          source={require("../assets/images/potel.png")}
          resizeMode="contain"
        />
        <Text style={styles.PotelText}>POTEL</Text>
        <Text style={styles.PotelSubtitle}>Stay Informed, Stay Productive</Text>
      </SafeAreaView>
      <View
        style={[
          styles.SegmentedControl,
          { marginTop: heightPercentageToDP(1) },
        ]}
      >
        <SegmentedControl
          options={options}
          selectedOption={selectedOption}
          onOptionPress={setSelectedOption}
        ></SegmentedControl>
      </View>
      {/* Login form  */}
      {selectedOption == "Login" && <LoginForm></LoginForm>}

      {/* End of Login Form */}

      {/* Registration start */}

      <RegistrationForm></RegistrationForm>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  loginContainer: {
    flex: 1,
  },
  logo: { width: 90, height: 90, margin: 10 },
  logoContainer: {
    width: wp("100%"),
    alignItems: "center",
  },
  PotelText: {
    fontFamily: "MontserratRegular",
    color: "#fff",
    fontSize: hp("5%"),
    letterSpacing: 5,
    textShadowColor: "#222222",
    textShadowRadius: 0.5,
    textShadowOffset: {
      width: 0,
      height: 1,
    },
  },
  PotelSubtitle: {
    fontFamily: "Inter",
    color: "#fff",
    fontSize: hp("1.2%"),
    textShadowColor: "#222222",
    textShadowRadius: 0.5,
    textShadowOffset: {
      width: 0,
      height: 0.5,
    },
  },
  SegmentedControl: { alignItems: "center" },
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
  loader: {
    alignSelf: "center",
  },
  loginForm: {
    marginTop: hp("1%"),
    alignSelf: "center",
    marginBottom: 50,
    zIndex: 100,
    height: "100%",
  },
  registraionForm: {
    alignSelf: "center",
    marginBottom: 50,
  },
  formText: {
    color: "#575758",
    fontSize: hp("2.1%"),
    marginTop: 20,
  },
  formInput: {
    width: wp("85%"),
    padding: 10,
    paddingVertical: hp("1.5%"),
    fontSize: hp("1.9%"),
    marginTop: 15,
    borderRadius: 10,
  },
  bigLogin: {
    width: wp("85%"),
    fontSize: hp("1.9%"),
    borderRadius: 10,
    color: "#575758",
    alignItems: "center",
    marginTop: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 1,
      height: 1,
    },
    shadowOpacity: 1,
    elevation: 5,
    maxHeight: 50,
    overflow: "hidden",
  },
  forgotPassword: {
    color: "#fff",
    marginVertical: 15,
    justifyContent: "center",
    alignItems: "center",
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
  modal: {
    padding: 20,
    width: wp("80%"),
    borderRadius: 25,
    elevation: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.5,
    shadowRadius: 5,
  },
});
