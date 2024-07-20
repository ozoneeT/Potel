import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Slot, Stack, useRouter, useSegments } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect } from "react";
import "react-native-reanimated";
import { useColorScheme } from "@/hooks/useColorScheme";
import { AuthContextProvider, useAuth } from "../context/authContext";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import store from "../hooks/store";
import { Provider } from "react-redux";
import { SheetProvider } from "react-native-actions-sheet";
import "./sheets"; // here
import { ToastProvider } from "react-native-toast-notifications";
import { MenuProvider } from "react-native-popup-menu";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();
const MainLayout = () => {
  const { isAuthenticated } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (typeof isAuthenticated == "undefined") return;
    const inApp = segments[0] == "app";
    if (isAuthenticated && !inApp) {
      router.replace("(tabs)");
    } else if (isAuthenticated == false) {
      router.replace("(inApp)/Authentication/Authentication");
    } else {
      router.replace("(tabs)");
    }
  }, [isAuthenticated]);

  return <Slot />;
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    MontserratBlack: require("../assets/fonts/Montserrat-Black.ttf"),
    MontserratBold: require("../assets/fonts/Montserrat-Bold.ttf"),
    MontserratLight: require("../assets/fonts/Montserrat-Light.ttf"),
    MontserratMedium: require("../assets/fonts/Montserrat-Medium.ttf"),
    MontserratRegular: require("../assets/fonts/Montserrat-Regular.ttf"),
    MontserratSemiBold: require("../assets/fonts/Montserrat-SemiBold.ttf"),
    PoppinsBlack: require("../assets/fonts/Poppins-Black.ttf"),
    MontserratThin: require("../assets/fonts/Montserrat-Thin.ttf"),
    PoppinsBold: require("../assets/fonts/Poppins-Bold.ttf"),
    PoppinsLight: require("../assets/fonts/Poppins-Light.ttf"),
    PoppinsMedium: require("../assets/fonts/Poppins-Medium.ttf"),
    PoppinsRegular: require("../assets/fonts/Poppins-Regular.ttf"),
    PoppinsSemiBold: require("../assets/fonts/Poppins-SemiBold.ttf"),
    Inter: require("../assets/fonts/Inter-Regular.ttf"),
    InterSemiBold: require("../assets/fonts/Inter-SemiBold.ttf"),
    InterThin: require("../assets/fonts/Inter-Thin.ttf"),
    InterBold: require("../assets/fonts/Inter-Bold.ttf"),
    InterLight: require("../assets/fonts/Inter-Light.ttf"),
    InterMedium: require("../assets/fonts/Inter-Medium.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <Provider store={store}>
      <ToastProvider>
        <SafeAreaProvider>
          <SheetProvider>
            <MenuProvider>
              <GestureHandlerRootView>
                <ThemeProvider
                  value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
                >
                  <AuthContextProvider>
                    <MainLayout />
                  </AuthContextProvider>
                </ThemeProvider>
              </GestureHandlerRootView>
            </MenuProvider>
          </SheetProvider>
        </SafeAreaProvider>
      </ToastProvider>
    </Provider>
  );
}
