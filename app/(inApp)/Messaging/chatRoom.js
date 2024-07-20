import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Animated,
  Button,
} from "react-native";
import ChatBubble from "react-native-chat-bubble";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import messagesData from "@/context/messages.json";

const AnimatedMessage = ({ text, sent }) => {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <Animated.View
      style={[
        styles.messageContainer,
        sent ? styles.sentMessage : styles.receivedMessage,
        { opacity, transform: [{ translateY }] },
      ]}
    >
      <ChatBubble
        isOwnMessage={true}
        bubbleColor="#1084ff"
        tailColor="#1084ff"
        withTail={true}
        onPress={() => console.log("Bubble Pressed!")}
      >
        <Text style={styles.messageText}>{text}</Text>
      </ChatBubble>
    </Animated.View>
  );
};

const ChatRoom = () => {
  const [messages, setMessages] = useState(messagesData);
  const [inputText, setInputText] = useState("");
  const flatListRef = useRef();

  const handleSend = () => {
    if (inputText.trim()) {
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          id: Math.random().toString(),
          text: inputText,
          sent: true,
          received: false,
        },
      ]);
      setInputText("");
    }
  };

  const handleReceive = () => {
    setMessages((prevMessages) => [
      ...prevMessages,
      {
        id: Math.random().toString(),
        text: "Received message",
        sent: false,
        received: true,
      },
    ]);
  };

  useEffect(() => {
    if (messages.length) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  }, [messages]);

  const renderItem = ({ item }) => (
    <AnimatedMessage text={item.text} sent={item.sent} />
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Chat Room</Text>
      </View>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.chatContainer}
        keyboardVerticalOffset={0}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={[
            styles.messagesList,
            { flexGrow: 1, justifyContent: "flex-end" }, // Adjust padding as necessary
          ]}
        />
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={inputText}
            onChangeText={setInputText}
            placeholder="Type a message"
          />
          <TouchableOpacity onPress={handleSend} style={styles.sendButton}>
            <Icon name="send" size={24} color="#007AFF" />
          </TouchableOpacity>
          <Button title="Receive" onPress={handleReceive} />
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    backgroundColor: "#007AFF",
    paddingVertical: 15,
    paddingHorizontal: 10,
    paddingTop: 50,
    alignItems: "center",
  },
  headerTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  chatContainer: {
    flex: 1,
  },
  messagesList: {
    padding: 10,
  },
  messageContainer: {
    maxWidth: "80%",
    padding: 10,
    borderRadius: 20,
    marginBottom: 10,
  },
  sentMessage: {
    alignSelf: "flex-end",
  },
  receivedMessage: {
    alignSelf: "flex-start",
  },
  messageText: {
    fontSize: 16,
    color: "white",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: "#ddd",
    backgroundColor: null,
  },
  input: {
    flex: 1,
    padding: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 20,
    marginRight: 10,
  },
  sendButton: {
    padding: 10,
  },
});

export default ChatRoom;
