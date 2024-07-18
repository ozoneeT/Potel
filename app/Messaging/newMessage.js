import React, { useState, useRef, useCallback } from "react";
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
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import dayjs from "dayjs";
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

import messagesData from "../../context/messages.json";
import bg from "../../assets/images/BG.png";
import { Colors } from "@/constants/Colors";

dayjs.extend(relativeTime);

const ChatRoom = () => {
  const [messages, setMessages] = useState(messagesData);
  const [newMessage, setNewMessage] = useState("");
  const flatListRef = useRef(null);
  const swipeableRefs = useRef({});
  const [replyingText, setReplyingText] = useState();
  const textInputRef = useRef(null);

  const handleSendMessage = useCallback(() => {
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
        setReplyingText(item.text);
      };

      return (
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
              myMessage ? styles.myMessage : styles.otherMessage,
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
                  myMessage ? styles.myMessageText : styles.otherMessageText,
                ]}
              >
                {item.text.includes("Replying to:")
                  ? item.text.split("\n\n")[1]
                  : item.text}
              </Text>
              <Text
                style={[
                  styles.messageTime,
                  myMessage ? styles.myMessageTime : styles.otherMessageTime,
                ]}
              >
                {dayjs(item.createdAt).format("h:mm A")}
              </Text>
            </View>
          </View>
        </Swipeable>
      );
    },
    [isMyMessage]
  );

  const groupedMessages = groupMessagesByDate(messages);
  const groupedMessagesArray = Object.keys(groupedMessages).map((date) => ({
    date,
    messages: groupedMessages[date],
  }));

  return (
    <View style={styles.safeArea}>
      <ImageBackground source={bg} style={styles.backgroundImage}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
          style={styles.container}
          renderKeyboardHeader={() => (
            <View style={{ backgroundColor: "red", height: 100, width: 200 }}>
              <Text style={styles.keyboardHeaderText}>
                Your custom header text
              </Text>
            </View>
          )}
        >
          <FlatList
            ref={flatListRef}
            keyboardDismissMode="interactive"
            data={groupedMessagesArray}
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
            contentContainerStyle={{ paddingBottom: 10, paddingHorizontal: 10 }}
          />

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
              onChangeText={setNewMessage}
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
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
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
    borderRadius: 10,
    maxWidth: "80%",
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
});

export default ChatRoom;
