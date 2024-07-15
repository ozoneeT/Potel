import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ImageBackground,
  Image,
  Pressable,
} from "react-native";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

import { useState } from "react";
import {
  AntDesign,
  Entypo,
  FontAwesome,
  Ionicons,
  MaterialIcons,
} from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import messagesData from "../../../context/messages.json";
import bg from "../../../assets/images/BG.png";
import { Colors } from "@/constants/Colors";

import { useRoute, useNavigation } from "@react-navigation/native";
import { useEffect } from "react";
import { KeyboardAvoidingView } from "react-native";
import { Platform } from "react-native";
import { FlatList } from "react-native";
import { useRef } from "react";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

const processMessages = (messages) => {
  return messages.map((message, index) => {
    const currentMessageDate = dayjs(message.createdAt).startOf("day");
    const previousMessageDate =
      index > 0 ? dayjs(messages[index - 1].createdAt).startOf("day") : null;

    return {
      ...message,
      showDate:
        !previousMessageDate || !currentMessageDate.isSame(previousMessageDate),
    };
  });
};

// Use this function to process your messages data
const messages = processMessages(messagesData);

const ChatHeader = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const chatId = route.params?.id;
  55;
  const chatName = route.params?.sender;
  const image = route.params?.image;
  return (
    <View style={styles.header}>
      <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
        <AntDesign name="arrowleft" size={24} color="black" />
      </Pressable>
      <View style={styles.headerLeft}>
        <Image
          source={{
            uri: image,
          }}
          style={{ width: 50, height: 50, borderRadius: 25, marginRight: 10 }}
        />
        <View>
          <Text style={styles.chatName}>{chatName}</Text>
          <Text style={styles.chatStatus}>Online</Text>
        </View>
      </View>
      <View style={styles.headerRight}>
        <View style={styles.icon1}>
          <Ionicons name="call" size={20} color={Colors.dark.primary} />
        </View>
        <View style={styles.icon2}>
          <FontAwesome
            name="video-camera"
            size={20}
            color={Colors.dark.primary}
          />
        </View>
      </View>
    </View>
  );
};
const InputBox = ({ onSend }) => {
  const [newMessage, setNewMessage] = useState("");

  const route = useRoute();
  const navigation = useNavigation();

  const chatId = route.params?.id;
  const chatName = route.params?.sender;

  const handleSend = () => {
    if (newMessage.trim()) {
      onSend(newMessage.trim());
      setNewMessage("");
    }
  };

  return (
    <View style={styles.inputBoxContainer}>
      <AntDesign name="plus" size={20} color="royalblue" />
      <TextInput
        value={newMessage}
        onChangeText={setNewMessage}
        style={styles.input}
        placeholder="Type your message..."
      />
      <MaterialIcons
        onPress={handleSend}
        style={styles.send}
        name="send"
        size={16}
        color="white"
      />
    </View>
  );
};

const Message = ({ message }) => {
  const isMyMessage = () => {
    return message.user.id === "u1";
  };

  const formatDate = (date) => {
    const today = dayjs().startOf("day");
    const yesterday = dayjs().subtract(1, "day").startOf("day");
    const messageDate = dayjs(date).startOf("day");

    if (messageDate.isSame(today)) {
      return "Today";
    } else if (messageDate.isSame(yesterday)) {
      return "Yesterday";
    } else if (messageDate.isSame(today, "week")) {
      return messageDate.format("dddd");
    } else {
      return messageDate.format("ddd, MMM D");
    }
  };

  return (
    <>
      {message.showDate && (
        <View style={styles.dateContainer}>
          <Text style={styles.dateText}>{formatDate(message.createdAt)}</Text>
        </View>
      )}
      <View
        style={[
          styles.messageContainer,
          {
            backgroundColor: isMyMessage() ? "#DCF8C5" : "white",
            alignSelf: isMyMessage() ? "flex-end" : "flex-start",
          },
        ]}
      >
        <Text>{message.text}</Text>
        <Text style={styles.time}>
          {dayjs(message.createdAt).format("h:mma")}
        </Text>
      </View>
    </>
  );
};

const ChatScreen = () => {
  const [messages, setMessages] = useState(processMessages(messagesData));
  const flatListRef = useRef(null);
  const route = useRoute();
  const navigation = useNavigation();

  const handleSendNewMessage = (newMessageText) => {
    const newMessage = {
      id: Math.random().toString(),
      text: newMessageText,
      user: { id: "u1" },
      createdAt: new Date().toISOString(),
    };
    setMessages((prevMessages) =>
      processMessages([newMessage, ...prevMessages])
    );
  };

  useEffect(() => {
    if (flatListRef.current) {
      flatListRef.current.scrollToOffset({ animated: true, offset: 0 });
    }
  }, [messages]);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
      style={styles.bg}
    >
      <ImageBackground source={bg} style={styles.bg}>
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={({ item }) => <Message message={item} />}
          style={styles.list}
          inverted
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: "flex-end",
            paddingBottom: 70,
          }}
        />
        <InputBox onSend={handleSendNewMessage} />
      </ImageBackground>
    </KeyboardAvoidingView>
  );
};

export default ChatScreen;

const styles = StyleSheet.create({
  bg: {
    flex: 1,
  },
  list: {
    padding: 10,
  },
  header: {
    paddingTop: hp(6),
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingBottom: 15,
    alignItems: "center",
    backgroundColor: "#ffffff",
  },
  backButton: {
    padding: 5,
    paddingRight: 15,
    marginRight: 5,
  },
  headerRight: {
    flexDirection: "row",
    marginLeft: "auto",
  },
  headerLeft: { flexDirection: "row", alignItems: "center" },
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
  chatName: {
    fontSize: hp(2.5),
    fontFamily: "PoppinsSemiBold",
    marginBottom: -5,
  },
  chatStatus: {
    fontFamily: "PoppinsRegular",
  },
  dateContainer: {
    alignSelf: "center",
    marginVertical: 10,
    paddingVertical: 2,
    paddingHorizontal: 10,
    backgroundColor: "#e0e0e0",
    borderRadius: 10,
  },
  dateText: {
    color: "#333",
  },
  messageContainer: {
    margin: 5,
    padding: 10,
    borderRadius: 10,
    maxWidth: "80%",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
    elevation: 1,
  },
  time: {
    color: "gray",
    alignSelf: "flex-end",
  },

  inputBoxContainer: {
    flexDirection: "row",
    backgroundColor: "whitesmoke",
    padding: 5,
    paddingHorizontal: 10,
    alignItems: "center",
  },
  input: {
    flex: 1,
    backgroundColor: "white",
    padding: 5,
    paddingHorizontal: 10,
    marginHorizontal: 10,

    borderRadius: 50,
    borderColor: "lightgray",
    borderWidth: StyleSheet.hairlineWidth,
  },
  send: {
    backgroundColor: "royalblue",
    padding: 7,
    borderRadius: 15,
    overflow: "hidden",
  },
  chatDate: {
    backgroundColor: "red",
  },
});
