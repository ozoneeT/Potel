import React, { useState, useRef, useCallback, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ImageBackground,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  FlatList,
  Animated,
  Image,
} from "react-native";
import {
  Entypo,
  FontAwesome,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import dayjs from "dayjs";
import { useNavigation, useRoute } from "@react-navigation/native";
import relativeTime from "dayjs/plugin/relativeTime";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
  heightPercentageToDP,
  widthPercentageToDP,
} from "react-native-responsive-screen";
import Swipeable from "react-native-gesture-handler/Swipeable";
import { RectButton } from "react-native-gesture-handler";
import * as Haptics from "expo-haptics";
import messagesData from "../../../context/messages.json";
import bg from "../../../assets/images/BG.png";
import { Colors } from "@/constants/Colors";
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from "react-native-popup-menu";
import { LongPressGestureHandler, State } from "react-native-gesture-handler";
import { router } from "expo-router";
import { FlashList } from "@shopify/flash-list";
import LottieView from "lottie-react-native";
import axios from "axios";
dayjs.extend(relativeTime);

const ChatRoom = () => {
  const [messages, setMessages] = useState(messagesData);
  const [newMessage, setNewMessage] = useState("");
  const flatListRef = useRef(null);
  const swipeableRefs = useRef({});
  const [replyingText, setReplyingText] = useState();
  const textInputRef = useRef(null);
  const route = useRoute();
  const sender = route.params?.sender;
  const senderImage = route.params?.senderImage;
  const [typingDisplay, setTypingDisplay] = useState("none");
  const [typing, setTyping] = useState(false);

  const handleSendMessage = useCallback(() => {
    setTyping(false);
    if (newMessage.trim()) {
      let messageToSend = newMessage;

      if (replyingText) {
        messageToSend = `Replying to: ${replyingText}\n\n${messageToSend}`;
        setReplyingText("");
      }

      const newMsg = {
        id: messages.length + 1,
        text: messageToSend,
        createdAt: new Date().toISOString(),
        user: { id: "u1", name: "User" }, // assuming "u1" is the current user
      };

      setMessages([newMsg, ...messages]);
      setNewMessage("");
      flatListRef.current.scrollToOffset({ animated: true, offset: 0 });
    }
  }, [newMessage, messages, replyingText]);

  const groupMessagesByDate = useCallback((messages) => {
    return messages.reduce((groups, message) => {
      const date = dayjs(message.createdAt).startOf("day").format();
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(message);
      return groups;
    }, {});
  }, []);

  const renderDateHeader = useCallback((date) => {
    const today = dayjs().startOf("day");
    const messageDate = dayjs(date).startOf("day");

    if (today.isSame(messageDate, "day")) {
      return "Today";
    } else if (today.subtract(1, "day").isSame(messageDate, "day")) {
      return "Yesterday";
    } else if (today.subtract(6, "day").isBefore(messageDate)) {
      return messageDate.format("dddd");
    } else {
      return messageDate.format("dddd, D MMM");
    }
  }, []);

  const isMyMessage = useCallback((message) => {
    return message.user.id === "u1"; // assuming "u1" is the current user
  }, []);

  const renderMessageItem = useCallback(
    ({ item }) => {
      const myMessage = isMyMessage(item);
      const swipeableRef = swipeableRefs.current[item.id] || React.createRef();
      swipeableRefs.current[item.id] = swipeableRef;

      const renderLeftActions = (progress, dragX) => {
        const trans = dragX.interpolate({
          inputRange: [0, 50, 100, 101],
          outputRange: [-20, 0, 0, 1],
        });

        const opacity = progress.interpolate({
          inputRange: [0, 1],
          outputRange: [0, 1],
        });

        const scale = progress.interpolate({
          inputRange: [0, 1],
          outputRange: [0.8, 1],
        });

        return (
          <RectButton
            style={styles.leftAction}
            onPress={() => [
              swipeableRef.current.close(),
              console.log("close"),
              ,
            ]}
          >
            <Animated.View
              style={[
                styles.replyImageWrapper,
                {
                  width: widthPercentageToDP(20),
                  height: "100%",
                  justifyContent: "center",
                  opacity,
                  transform: [{ scale }],
                },
                myMessage && { alignItems: "flex-end" },
              ]}
            >
              <MaterialCommunityIcons
                name="reply-circle"
                size={26}
                color={Colors.dark.backgroundGrayText}
              />
            </Animated.View>
          </RectButton>
        );
      };
      const onSwipeableWillOpen = (item) => {
        const originalText = item.text.includes("Replying to:")
          ? item.text.split("\n\n")[1]
          : item.text;
        setReplyingText(originalText);
      };

      return (
        <>
          <Menu>
            <MenuOptions>
              <MenuOption onSelect={() => alert(`Save`)} text="Save" />
              <MenuOption onSelect={() => alert(`Delete`)}>
                <Text style={{ color: "red" }}>Delete</Text>
              </MenuOption>
              <MenuOption
                onSelect={() => alert(`Not called`)}
                disabled={true}
                text="Disabled"
              />
            </MenuOptions>

            <MenuTrigger>
              <Swipeable
                ref={swipeableRef}
                renderLeftActions={renderLeftActions}
                onSwipeableWillOpen={() => [
                  swipeableRef.current.close(),
                  onSwipeableWillOpen(item),
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium),
                  textInputRef.current.focus(),
                ]}
                overshootLeft={false}
                overshootRight={false}
                leftThreshold={70}
                friction={2}
              >
                <View
                  style={[
                    styles.messageContainer,
                    myMessage
                      ? [
                          styles.myMessage,
                          {
                            borderTopEndRadius: 20,
                            borderTopStartRadius: 20,
                            borderBottomLeftRadius: 20,
                          },
                        ]
                      : [
                          styles.otherMessage,
                          {
                            borderTopEndRadius: 20,
                            borderTopStartRadius: 20,
                            borderBottomRightRadius: 20,
                          },
                        ],
                  ]}
                >
                  <View>
                    {item.text.includes("Replying to:") && (
                      <Text style={styles.replyingText}>
                        {item.text.split("\n\n")[0]}
                      </Text>
                    )}
                    <Text
                      style={[
                        styles.messageText,
                        myMessage
                          ? styles.myMessageText
                          : styles.otherMessageText,
                      ]}
                    >
                      {item.text.includes("Replying to:")
                        ? item.text.split("\n\n")[1]
                        : item.text}
                    </Text>
                    <Text
                      style={[
                        styles.messageTime,
                        myMessage
                          ? styles.myMessageTime
                          : styles.otherMessageTime,
                      ]}
                    >
                      {dayjs(item.createdAt).format("h:mm A")}
                    </Text>
                  </View>
                </View>
              </Swipeable>
            </MenuTrigger>
          </Menu>
        </>
      );
    },
    [isMyMessage]
  );

  const groupedMessages = groupMessagesByDate(messages);
  const groupedMessagesArray = Object.keys(groupedMessages).map((date) => ({
    date,
    messages: groupedMessages[date],
  }));

  const [linkMetadata, setLinkMetadata] = useState();
  // Updated URL pattern to capture a broader range of domain suffixes
  const urlPattern =
    /(?:https?:\/\/|www\.)[^\s/$.?#].[^\s]*\.[a-zA-Z]{2,}(?:\/[^\s]*)?/gi;

  const formatUrl = (url) => {
    // Check if URL starts with 'http://', 'https://', or 'www.'
    if (url.startsWith("http://") || url.startsWith("https://")) {
      return url;
    }

    // Check if URL starts with 'www.'
    if (url.startsWith("www.")) {
      return `https://${url}`;
    }

    // For URLs without 'www.', prepend 'www.' and ensure 'https://'
    return `https://www.${url}`;
  };

  const fetchLinkMetadata = async (url) => {
    try {
      const formattedUrl = formatUrl(url);
      const response = await axios.get(formattedUrl);
      const headers = response.headers;
      // Process headers or response data as needed
      setLinkMetadata(headers);
      console.log("Link metadata fetched:", headers);
    } catch (error) {
      console.error("Error fetching link metadata:", error);
    }
  };

  const handleTextChange = (text) => {
    setNewMessage(text);

    // Find all URLs or domain names in the text
    const urls = text.match(urlPattern);

    // Handle case where text includes a domain suffix directly
    const domainSuffixPattern =
      /\.(com|net|org|co|io|me|tv|biz|info|edu|gov|xyz|mil|int|arpa|aero|asia|biz|cat|coop|jobs|mobi|museum|name|post|pro|tel|travel|xxx)$/i;
    if (domainSuffixPattern.test(text)) {
      fetchLinkMetadata(`https://www.${text}`);
    }

    // Fetch metadata for each detected URL
    if (urls && urls.length > 0) {
      urls.forEach((url) => {
        // Ensure proper URL formatting
        const formattedUrl = formatUrl(url);
        fetchLinkMetadata(formattedUrl);
      });
    } else {
      setLinkMetadata(null);
    }

    // Handle typing status
    if (text.length > 0 && typing === false) {
      setTyping(true);
    }
    if (text.length === 0 && typing === true) {
      setTyping(false);
    }
  };

  return (
    <View style={styles.safeArea}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Entypo name="chevron-left" size={24} color={Colors.light.text} />
        </Pressable>
        <View style={styles.headerTitleContainer}>
          <View style={styles.headerMiddle}>
            <Image
              source={{ uri: senderImage }}
              style={{ width: 40, height: 40, borderRadius: 25 }}
            />

            <Text style={styles.headerTitle}>{sender}</Text>
          </View>
        </View>
        <View style={styles.headerIcons}>
          <Pressable style={styles.icon}>
            <FontAwesome
              name="video-camera"
              size={24}
              color={Colors.light.text}
            />
          </Pressable>
          <Pressable style={styles.icon}>
            <FontAwesome name="phone" size={24} color={Colors.light.text} />
          </Pressable>
          <Pressable style={styles.icon}>
            <Entypo
              name="dots-three-vertical"
              size={24}
              color={Colors.light.text}
            />
          </Pressable>
        </View>
      </View>
      <ImageBackground source={bg} style={styles.backgroundImage}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
          style={styles.container}
        >
          <FlashList
            estimatedItemSize={500}
            ref={flatListRef}
            keyboardDismissMode="interactive"
            data={groupedMessagesArray}
            contentContainerStyle={{
              paddingLeft: 20,
            }}
            keyExtractor={(item) => item.date}
            renderItem={({ item }) => (
              <View>
                <View style={styles.dateHeader}>
                  <Text style={styles.dateHeaderText}>
                    {renderDateHeader(item.date)}
                  </Text>
                </View>
                {item.messages
                  .slice()
                  .reverse()
                  .map((message) => (
                    <View key={message.id}>
                      {renderMessageItem({ item: message })}
                    </View>
                  ))}
              </View>
            )}
            inverted
            ListHeaderComponent={
              typing && (
                <View>
                  <LottieView
                    style={styles.loader}
                    source={require("@/assets/lottie/typing.json")}
                    autoPlay
                    loop
                  />
                </View>
              )
            }
          />
          {linkMetadata && (
            <View>
              <Text>Link Metadata: {JSON.stringify(linkMetadata)}</Text>
            </View>
          )}

          {replyingText && (
            <Animated.View style={styles.replyingContainer}>
              <Text
                ellipsizeMode="tail"
                numberOfLines={1}
                style={styles.replyingText}
              >
                {replyingText}
              </Text>
              <Pressable
                style={styles.replyingDismis}
                onPress={() => setReplyingText()}
              >
                <Text>X</Text>
              </Pressable>
            </Animated.View>
          )}
          <View style={[styles.inputContainer]}>
            <TextInput
              ref={textInputRef}
              style={styles.textInput}
              value={newMessage}
              onChangeText={handleTextChange}
              placeholder="Type a message"
            />
            <Pressable
              onPress={handleSendMessage}
              style={styles.sendButton}
              accessibilityLabel="Send message"
            >
              <Ionicons name="send" size={24} color="white" />
            </Pressable>
          </View>
        </KeyboardAvoidingView>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  backgroundImage: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: "flex-end",
    width: "100%",
  },
  inputContainer: {
    flexDirection: "row",
    padding: 10,
    backgroundColor: Colors.light.background,
  },
  textInput: {
    flex: 1,
    padding: 10,
    borderColor: Colors.light.border,
    borderWidth: 1,
    borderRadius: 20,
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: Colors.light.primary,
    borderRadius: 20,
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  messageContainer: {
    padding: 10,
    marginVertical: 5,
    maxWidth: "80%",
    marginRight: 20,
  },
  myMessage: {
    backgroundColor: Colors.light.primary,
    alignSelf: "flex-end",
  },
  otherMessage: {
    backgroundColor: Colors.light.background,
    alignSelf: "flex-start",
  },
  messageText: {
    fontSize: 16,
  },
  myMessageText: {
    color: Colors.light.text,
  },
  otherMessageText: {
    color: Colors.light.text,
  },
  messageTime: {
    fontSize: 12,
    alignSelf: "flex-end",
  },
  myMessageTime: {
    color: Colors.light.subText,
  },
  otherMessageTime: {
    color: Colors.light.subText,
  },
  dateHeader: {
    alignItems: "center",
    marginVertical: 10,
  },
  dateHeaderText: {
    fontSize: 14,
    color: Colors.light.subText,
  },
  // leftAction: {
  //   backgroundColor: Colors.light.primary,
  //   justifyContent: "center",
  //   flex: 1,
  // },
  actionText: {
    color: "white",
    top: "40%",
  },
  replyingContainer: {
    backgroundColor: Colors.dark.text,
    padding: 10,
    color: Colors.light.text,
    fontSize: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  replyingText: {
    width: "40%",
  },
  replyingDismis: {
    padding: 10,
    backgroundColor: "red",
    borderRadius: 10,
    fontSize: 15,
    fontWeight: "bold",
  },
  replyingText: { fontSize: 15, color: "red" },
  menu: {
    position: "absolute",
    top: 0,
    right: 0,
    backgroundColor: "white",
    padding: 10,
    borderRadius: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  menuOption: {
    marginBottom: 5,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 15,
    backgroundColor: Colors.light.background,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    paddingTop: heightPercentageToDP(5),
  },
  backButton: {
    padding: 5,
  },
  headerTitleContainer: {
    flex: 1,
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 25,
    fontWeight: "bold",
    color: Colors.light.text,
    fontFamily: "puppinsSemiBold",
    marginLeft: 10,
  },
  headerIcons: {
    flexDirection: "row",
  },
  icon: {
    marginLeft: 15,
  },
  headerMiddle: {
    flexDirection: "row",
    alignItems: "center",
  },
  loader: {
    width: heightPercentageToDP(10),
    height: heightPercentageToDP(10),
    top: "20%",
  },
});

export default ChatRoom;
