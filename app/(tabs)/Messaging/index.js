import React, { useState, useRef } from "react";
import {
  View,
  Text,
  Pressable,
  Dimensions,
  FlatList,
  StyleSheet,
  Image,
} from "react-native";
import { useNavigation } from "expo-router";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { Entypo, FontAwesome } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import * as Haptics from "expo-haptics";

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

  const Chats = ({ item }) => {
    return (
      <Pressable
        onPress={() =>
          navigation.navigate("newMessage", {
            id: item.id,
            sender: item.sender,
            image: item.image,
          })
        }
        style={styles.chatContainer}
      >
        <View style={styles.chatImage}>
          <Image
            source={{
              uri: item.image,
            }}
            style={{ width: 50, height: 50, borderRadius: 25, marginRight: 10 }}
          />
        </View>
        <View style={styles.chatMessage}>
          <Text>{item.sender}</Text>
          <Text numberOfLines={2} ellipsizeMode="tail">
            {item.lastMessage}
          </Text>
        </View>
        <View style={styles.chatTime}>
          <Text>{item.createdTime}</Text>
        </View>
      </Pressable>
    );
  };

  // Example data for FlatList
  const data = [
    {
      id: "1",
      sender: "Alice",
      lastMessage: "Hello there!",
      createdTime: "10:00 AM",
      image:
        "https://med.gov.bz/wp-content/uploads/2020/08/dummy-profile-pic.jpg",
    },
    {
      id: "2",
      sender: "Bob",
      lastMessage: "How are you?",
      createdTime: "10:30 AM",
      image:
        "https://cdn.pixabay.com/photo/2018/08/28/12/41/avatar-3637425_640.png",
    },
    // Add more items here
  ];

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <View style={styles.header}>
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
          <View style={styles.headerRight}>
            <View style={styles.icon1}>
              <FontAwesome
                name="search"
                size={20}
                color={Colors.dark.primary}
              />
            </View>
            <View style={styles.icon2}>
              <Entypo
                name="dots-three-vertical"
                size={20}
                color={Colors.dark.primary}
              />
            </View>
          </View>
        </View>
        <View style={styles.segmentContainer}>
          <FlatList
            data={["All", "Unreads", "Groups", "LikeMinded", "Collaboration"]}
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
                  <Text style={{}}>{item}</Text>
                </Pressable>
              );
            }}
          />
        </View>
      </View>
      <FlatList
        ref={flatListRef}
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={Chats}
      />
    </View>
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
