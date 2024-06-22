import {
  View,
  Text,
  Button,
  ActivityIndicator,
  SafeAreaView,
  StyleSheet,
  Alert,
  Image,
  Modal,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import LoadingSplash from "../components/LoadingSplash";
import Checkbox from "expo-checkbox";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { Pressable } from "react-native";

import { StatusBar } from "expo-status-bar";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";

import {
  GestureDetector,
  Gesture,
  Directions,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
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
} from "react-native-reanimated";
import Entypo from "@expo/vector-icons/Entypo";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Colors } from "@/constants/Colors";
import { useFocusEffect, useNavigation } from "@react-navigation/native";

// onbarding Flatlist content

const onboardingSteps = [
  {
    icon: "helloRobot",
    title: "Stay Updated with PotelBOT",
    description:
      "Receive instant notifications when power is available at specific Locations in Eksu, ensuring you never miss an opportunity to charge your gadgets or make good use of Eksu Power.Say goodbye to missed charging opportunities and hello to uninterrupted productivity with Potel Bot.",
    display: "none",
    backDisplay: "none",
    imagefile: require("../assets/images/potelbot.png"),
    aspectRatio: 0.3,
    position: hp(-2),
    subtitle: "",
    titleSize: hp(10),
    subtitleSize: hp(2.5),
    buttonText: "continue",
    buttonColor: "#c29b29",
    subtitleColor: "#e69a07",
    backgroundColor: "#f5c435",
    titleColor: "#c29b29",
  },
  {
    icon: "people-arrows",
    title: "POTEL CAMPUS CONNECT",
    description:
      "Uniting Like-Minded Individuals for Shared Success. Whether you're a gamer seeking comradeship, an entrepreneur hustling for success, or a student from any department eager to connect, our platform offers dedicated rooms tailored to your interests and goals",
    display: "none",
    backDisplay: "flex",
    imagefile: require("../assets/images/community.png"),
    aspectRatio: 0.2,
    position: hp(-45),
    subtitle: "",
    titleSize: 70,
    subtitleSize: hp(3),
    buttonText: "continue",
    buttonColor: "#23a3dc",
    subtitleColor: "#fff",
    marginBottom: hp(1),
    backgroundColor: "#23a3dc",
    titleColor: "#23a3dc",
  },
  {
    icon: "book-reader",
    title: "POTEL SCHEDULER",
    description:
      "Elevate Your Productivity with Time Management Mastery. Whether it's studying for exams, completing assignments, or pursuing personal goals, Potel Scheduler empowers you to make the most of your time",
    display: "flex",
    backDisplay: "flex",
    imagefile: require("../assets/images/scheduler.png"),
    aspectRatio: 0.35,
    position: hp(20),
    subtitle: "",
    titleSize: 80,
    subtitleSize: 25,
    buttonText: "Sign In",
    buttonColor: "#f5c435",
    subtitleColor: "#fff",
    backgroundColor: "#f5c435",
    titleColor: "#f5c435",
  },
];

export default function Onboarding() {
  const [loading, setLoading] = useState(true);
  const [termsChecked, setTermsChecked] = useState(false);
  const [screenIndex, setScreenIndex] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [showFullTerms, setShowFullTerms] = useState(false);
  const navigation = useNavigation();

  // Terms and condtion function

  const data = onboardingSteps[screenIndex];
  useEffect(() => {
    const getTermsChecked = async () => {
      try {
        const termsCheckedStorage = await AsyncStorage.getItem("termsChecked");
        if (termsCheckedStorage === "true") {
          navigation.navigate("Authentication");
        } else {
          setLoading(false);
        }
      } catch (error) {
        console.error("Error", error);
        setLoading(false);
      }
    };
    getTermsChecked();
  }, []);

  const handleTermsCheck = async () => {
    setTermsChecked(!termsChecked);
    try {
      await AsyncStorage.setItem("termsChecked", String(!termsChecked));
    } catch (error) {
      console.error("Error setting terms checked status:", error);
    }
  };
  const handleLinkPress = () => {
    // Replace 'https://example.com' with your actual URL
    Linking.openURL("https://example.com");
  };
  const handleModalClose = () => {
    // Replace 'https://example.com' with your actual URL
    setShowModal(false);
    setShowFullTerms(false);
  };
  const handleShowFullTerms = () => {
    setShowFullTerms(!showFullTerms);
  };
  if (loading) {
    return (
      <View style={{ flex: 1 }}>
        <LoadingSplash></LoadingSplash>
      </View>
    );
  }

  // lottie fuction
  playAnimation = () => {
    this.setState({ speed: 1 });
  };

  pauseAnimation = () => {
    this.setState({ speed: 0 });
  };

  // onboarding functions

  // continue onboarding function
  const onContinue = () => {
    const isLastScreen = screenIndex === onboardingSteps.length - 1;
    const isSecondScreen = screenIndex === onboardingSteps.length - 2;
    if (isLastScreen) {
      endOnboarding();
    } else {
      setScreenIndex(screenIndex + 1);
    }
  };

  const onSkip = () => {
    setScreenIndex(onboardingSteps.length - 1); // Navigate to the last screen
  };
  // navigation back onborading screen

  const onBack = () => {
    const isFirstScreen = screenIndex === 0;
    if (isFirstScreen) {
      endOnboarding();
    } else {
      setScreenIndex(screenIndex - 1);
    }
  };

  // end of onBoarding  Navigating to sign Up screen

  const endOnboarding = () => {
    if (termsChecked === "false" || termsChecked === false) {
      setShowModal(true);
      console.log("Terms not Checked");
    } else {
      router.replace("Authentication");
    }
  };

  // swipe Gesture

  const swipes = Gesture.Simultaneous(
    Gesture.Fling().direction(Directions.LEFT).onEnd(onContinue),
    Gesture.Fling().direction(Directions.RIGHT).onEnd(onBack)
  );

  return (
    <>
      <View style={[styles.page, { backgroundColor: data.backgroundColor }]}>
        {/* // lotiee background */}
        <StatusBar style="light" />
        <Modal
          animationType="slide"
          transparent={true}
          visible={showModal}
          onRequestClose={() => setShowModal(false)}
        >
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <View style={styles.modal}>
              <ScrollView style={{ maxHeight: 300 }}>
                <Text style={styles.terms}>
                  Accept the terms and Condition to continue. By using the Potel
                  application, you agree to abide by the terms and conditions
                  outlined herein. Failure to comply with these terms may result
                  in account deactivation.
                </Text>
                {!showFullTerms && (
                  <TouchableOpacity onPress={handleShowFullTerms}>
                    <Text style={{ color: "blue" }}>Read more</Text>
                  </TouchableOpacity>
                )}
                {showFullTerms && (
                  <>
                    <Text style={styles.terms}>
                      1. By accessing or using the Potel application, you agree
                      to be bound by these Terms. If you do not agree to these
                      Terms, you may not access or use the Potel application.
                    </Text>
                    <Text style={styles.terms}>
                      2.To access certain features of the Potel application, you
                      may be required to register for an account. When creating
                      an account, you must provide accurate and complete
                      information. You are responsible for maintaining the
                      confidentiality of your account credentials and for all
                      activities that occur under your account.
                    </Text>
                    <Text style={styles.terms}>
                      3. Your privacy is important to us. Please review our
                      Privacy Policy to understand how we collect, use, and
                      disclose information about you when you use the Potel
                      application.
                    </Text>
                    <Text style={styles.terms}>
                      4. You agree to use the Potel application only for lawful
                      purposes and in accordance with these Terms. You may not
                      share nudity images, misleading information, or engage in
                      scamming other users. Any user found violating these terms
                      will have their account deactivated.
                    </Text>
                    <Text style={styles.terms}>
                      5. Users are expected to use Potel responsibly and to
                      treat other users with respect and courtesy. We encourage
                      positive and constructive interactions within the Potel
                      community.
                    </Text>
                    <Text style={styles.terms}>
                      6. Potel may display advertisements within the application
                      for funding purposes. By using the Potel application, you
                      agree to the display of advertisements as part of our
                      efforts to manage the app and provide the best service
                      possible.
                    </Text>
                    <Text style={styles.terms}>
                      7. We reserve the right to suspend or terminate your
                      access to the Potel application at any time for any reason
                      without notice. You may also terminate your account at any
                      time by contacting us.
                    </Text>
                    <Text style={styles.terms}>
                      If you have any questions or concerns about these Terms,
                      please contact us at{" "}
                      <TouchableOpacity onPress={handleLinkPress}>
                        <Text
                          style={{
                            color: "blue",
                            textDecorationLine: "underline",
                          }}
                        >
                          support@potel.com
                        </Text>
                      </TouchableOpacity>
                    </Text>
                  </>
                )}
              </ScrollView>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  display: data.display,
                  marginVertical: 10,
                  width: wp("55%"),
                }}
              >
                <Checkbox
                  style={{ marginRight: 20, padding: 10, marginHorizontal: 5 }}
                  value={termsChecked}
                  onValueChange={handleTermsCheck}
                  color={termsChecked ? "#CEF202" : undefined}
                />
                <Text style={styles.terms}>
                  Accept terms and Condition to continue
                </Text>
              </View>
              <TouchableOpacity onPress={() => handleModalClose()}>
                <Text style={{ alignSelf: "center", padding: 10 }}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        <GestureDetector gesture={swipes}>
          <View style={styles.pageContent} key={screenIndex}>
            <Text
              onPress={onBack}
              style={[styles.backButton, { display: data.backDisplay }]}
            >
              Back
            </Text>
            <Text onPress={() => onSkip()} style={styles.skipButton}>
              Skip
            </Text>
            <Animated.View
              entering={FadeIn}
              exiting={SlideOutLeft}
              style={styles.images}
            >
              <View
                style={{
                  alignSelf: "center",
                  alignItems: "center",
                }}
              >
                <Image
                  style={[
                    styles.splashImage,
                    {
                      aspectRatio: data.aspectRatio,
                      top: data.position,
                    },
                  ]}
                  source={data.imagefile}
                  resizeMode="contain"
                />
              </View>
            </Animated.View>

            {/* after robot content */}

            <ThemedView
              lightColor={Colors.light.background}
              darkColor={Colors.dark.background}
              style={styles.footer}
            >
              <ThemedView style={{ height: "60%" }}>
                <Animated.Text
                  entering={SlideInRight}
                  exiting={SlideOutLeft}
                  style={styles.subtitle}
                >
                  {data.subtitle}
                </Animated.Text>
                <Animated.Text
                  entering={SlideInRight}
                  exiting={SlideOutLeft}
                  style={[styles.title, { color: data.titleColor }]}
                >
                  {data.title}
                </Animated.Text>
                <Animated.Text
                  entering={SlideInRight.delay(50)}
                  exiting={SlideOutLeft}
                  style={[styles.description]}
                >
                  <ThemedText
                    lightColor={Colors.light.text}
                    darkColor={Colors.dark.text}
                  >
                    {data.description}
                  </ThemedText>
                </Animated.Text>
              </ThemedView>
              {/* OnBoarding Button */}
              <View
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                  top: hp(3),
                }}
              >
                <Pressable
                  onPress={onContinue}
                  style={[styles.button, { backgroundColor: data.buttonColor }]}
                >
                  <Entypo name="chevron-right" size={50} color="white" />
                </Pressable>
                <View style={styles.buttonShadow} />
              </View>
            </ThemedView>
          </View>
        </GestureDetector>
        <View style={styles.stepIndicatorContainer}>
          {onboardingSteps.map((step, index) => (
            <View
              key={index}
              style={[
                styles.stepIndicator,
                {
                  backgroundColor: index === screenIndex ? "yellow" : "white",
                },
              ]}
            />
          ))}
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  page: {
    // alignItems: 'center',
    flex: 1,
  },
  images: {
    bottom: hp("62%"),
  },
  splashImage: {},

  pageContent: {
    alignItems: "center",
  },

  subtitle: {
    color: "#FDFDFD",
    fontSize: 20,
    fontFamily: "PoppinsLight",
    alignSelf: "center",
    margin: -20,
    letterSpacing: 8,
  },
  title: {
    fontFamily: "PoppinsBold",
    fontSize: hp(4),
    textAlign: "center",
  },
  description: {
    // fontFamily: "SpaceMono",
    textAlign: "center",
    fontFamily: "PoppinsMedium",
    overflow: "hidden",
    height: "70%",
  },
  footerText: {
    marginVertical: hp(2),
    width: hp("40%"),
  },
  terms: {
    color: "gray",
    fontSize: 15,
    // fontFamily: "Inter",
    lineHeight: 28,
  },
  footer: {
    width: "100%",
    marginTop: "auto",
    zIndex: 5,
    borderRadius: 30,
    height: "50%",
    top: hp(5),
    padding: 20,
    paddingTop: 30,
  },
  buttonsRow: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "center",
    justifyContent: "spaceBetween",
  },
  button: {
    backgroundColor: "#000",
    borderRadius: 40,
    alignItems: "center",
    width: 70,
    height: 70,
    borderColor: "#fff",
    justifyContent: "center",
    zIndex: 100,
  },
  buttonShadow: {
    width: 80,
    height: 80,
    borderRadius: 55,
    backgroundColor: "rgba(0, 0, 0, 0.1)",
    position: "absolute",
    zIndex: -1,
  },
  buttonText: {
    color: "#FDFDFD",
    // fontFamily: "InterSemi",
    fontSize: 16,

    padding: 15,
    paddingHorizontal: 25,
  },
  // steps
  stepIndicatorContainer: {
    position: "absolute",
    flexDirection: "row",
    gap: 8,
    marginHorizontal: 15,
    top: hp(-35),
    width: wp(15),
    alignSelf: "center",
    justifyContent: "center",
    android: {
      top: hp(-40),
    },
  },
  stepIndicator: {
    top: "10%",
    flex: 1,
    height: 8,
    backgroundColor: "gray",
    borderRadius: 10,
    width: 8, // Width same as height to make it circular
    height: 8, // Height to define circular shape
    borderRadius: 4,
  },
  skipButton: {
    color: "#FDFDFD",
    // fontFamily: "InterSemi",
    fontSize: 16,
    padding: 8,
    paddingHorizontal: 25,
    marginLeft: "auto",
    marginTop: hp(5),
    marginTop: hp(1),
    borderRadius: 10,
    borderColor: "#fff",
    borderWidth: 2,
    zIndex: 100,
    right: 10,
  },
  backButton: {
    color: "#FDFDFD",
    // fontFamily: "InterSemi",
    fontSize: 16,
    paddingHorizontal: 25,
    position: "absolute",
    left: 0,
    marginTop: hp(6),
    marginTop: hp(1),
    zIndex: 100,
  },
  modal: {
    backgroundColor: "white",
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
