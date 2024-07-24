import React, { useState, useRef } from "react";
import {
  View,
  Text,
  Pressable,
  Dimensions,
  FlatList,
  StyleSheet,
  Image,
  ScrollView,
  SafeAreaView,
} from "react-native";
import { Link, router, useNavigation } from "expo-router";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import AppleStyleSwipeableRow from "@/components/AppleStyleSwipeableRow";
import { Entypo, FontAwesome } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import * as Haptics from "expo-haptics";
import chats from "@/assets/data/chats.json";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { Platform } from "react-native";
dayjs.extend(relativeTime);
import { useHeaderHeight } from "@react-navigation/elements";
import { FlashList } from "@shopify/flash-list";

const Messaging = () => {
  const [selectedIndex, setSelectedIndex] = useState("All");
  const navigation = useNavigation();
  const flatListRef = useRef(null);

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

  const Chats = React.memo(({ item }) => {
    const headerHight = useHeaderHeight();
    const currentDate = dayjs(item.date);
    const today = dayjs();
    const yesterday = dayjs().subtract(1, "day");
    const isToday = currentDate.isSame(today, "day");
    const isYesterday = currentDate.isSame(yesterday, "day");
    const isCurrentWeek = currentDate.isSame(today, "week");

    let formattedDate = "";

    if (isToday) {
      formattedDate = currentDate.format("hh:mm A"); // Show time if chat is today
    } else if (isYesterday) {
      formattedDate = "Yesterday"; // Show 'Yesterday' if chat was yesterday
    } else if (isCurrentWeek) {
      formattedDate = currentDate.format("dddd"); // Show day name if chat is in the current week
    } else {
      formattedDate = currentDate.format("M/D/YY"); // Show date in format 7/9/24 if not this week
    }

    return (
      <AppleStyleSwipeableRow>
        {/* <Link href="/(messages)/Messages" asChild> */}
        <Pressable
          style={styles.chatContainer}
          onPress={() =>
            navigation.navigate("(messages)/Messages", {
              id: item.id,
              sender: item.from,
              senderImage: item.img,
            })
          }
        >
          <View style={styles.chatImage}>
            <Image
              source={{
                uri: item.img,
              }}
              style={{
                width: 50,
                height: 50,
                borderRadius: 25,
                marginRight: 10,
              }}
            />
          </View>
          <View style={styles.chatMessage}>
            <Text style={{ fontWeight: "bold", fontSize: 17 }}>
              {item.from}
            </Text>
            <Text numberOfLines={2} ellipsizeMode="tail">
              {item.msg}
            </Text>
          </View>
          <View style={styles.chatTime}>
            <Text>{formattedDate}</Text>
          </View>
        </Pressable>
        {/* </Link> */}
      </AppleStyleSwipeableRow>
    );
  });

  // Example data for FlatList

  return (
    <SafeAreaView
      style={[
        Platform.OS === "android" ? { marginTop: 20 } : null,
        { flex: 1 },
      ]}
    >
      <FlashList
        estimatedItemSize={500}
        data={chats}
        keyboardDismissMode="on-drag"
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <Chats item={item} navigation={navigation} />}
        ListHeaderComponent={
          <View style={styles.headerContainer}>
            <View style={styles.segmentContainer}>
              <FlashList
                estimatedItemSize={20}
                data={[
                  "All",
                  "Unreads",
                  "Groups",
                  "LikeMinded",
                  "Collaboration",
                ]}
                horizontal
                showsHorizontalScrollIndicator={false}
                renderItem={({ item }) => {
                  return (
                    <Pressable
                      onPress={() => [
                        setSelectedIndex(item),
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium),
                      ]}
                      style={[
                        styles.segment,
                        selectedIndex === item && {
                          backgroundColor: Colors.dark.primary,
                        },
                      ]}
                    >
                      <Text>{item}</Text>
                    </Pressable>
                  );
                }}
              />
            </View>
          </View>
        }
        contentContainerStyle={{
          paddingBottom: 40,
          backgroundColor: "#fff",
        }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    alignSelf: "center",
  },
  header: {
    paddingTop: 40,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: 15,
  },
  headerRight: {
    flexDirection: "row",
  },
  icon1: {
    height: 40,
    width: 40,
    borderRadius: 25,
    borderColor: Colors.light.text,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  icon2: {
    height: 40,
    width: 40,
    borderRadius: 25,
    borderColor: Colors.light.text,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 10,
  },
  segmentContainer: {
    width: "100%",
    marginVertical: 10,
  },
  segment: {
    borderRadius: 20,
    padding: 10,
    marginHorizontal: 10,
    left: 5,
  },
  chatContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    marginHorizontal: 10,
    paddingVertical: 10,
  },
  chatImage: {
    marginRight: 10,
  },
  chatMessage: {
    flex: 1,
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

export default Messaging;
