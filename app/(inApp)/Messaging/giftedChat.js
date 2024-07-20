import React, { useState, useCallback, useEffect, useRef } from "react";
import { ImageBackground, StyleSheet, View } from "react-native";
import { Swipeable } from "react-native-gesture-handler";
import {
  GiftedChat,
  Bubble,
  InputToolbar,
  Send,
  SystemMessage,
} from "react-native-gifted-chat";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import ChatMessageBox from "@/components/ChatMessageBox";
import ReplyMessageBar from "@/components/ReplyMessageBar";
import Colors from "@/constants/Color";
import messageData from "@/assets/data/messages.json";

const Page = () => {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [replyMessage, setReplyMessage] = useState(null);
  const swipeableRowRef = useRef(null);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    const formattedMessages = messageData.map((message) => ({
      _id: message.id,
      text: message.msg,
      createdAt: new Date(message.date),
      user: {
        _id: message.from,
        name: message.from ? "You" : "Bob",
      },
    }));

    setMessages([
      ...formattedMessages,
      {
        _id: 0,
        system: true,
        text: "All your base are belong to us",
        createdAt: new Date(),
        user: {
          _id: 0,
          name: "Bot",
        },
      },
    ]);
  }, []);

  const onSend = useCallback((newMessages = []) => {
    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, newMessages)
    );
  }, []);

  const renderInputToolbar = useCallback(
    (props) => (
      <InputToolbar
        {...props}
        containerStyle={styles.inputToolbar}
        renderActions={() => (
          <View style={styles.inputToolbarActions}>
            <Ionicons name="add" color={Colors.primary} size={28} />
          </View>
        )}
      />
    ),
    []
  );

  const updateRowRef = useCallback(
    (ref) => {
      if (
        ref &&
        replyMessage &&
        ref.props.children.props.currentMessage?._id === replyMessage._id
      ) {
        swipeableRowRef.current = ref;
      }
    },
    [replyMessage]
  );

  useEffect(() => {
    if (replyMessage && swipeableRowRef.current) {
      swipeableRowRef.current.close();
      swipeableRowRef.current = null;
    }
  }, [replyMessage]);

  return (
    <ImageBackground
      source={require("@/assets/images/pattern.png")}
      style={[styles.imageBackground, { marginBottom: insets.bottom }]}
    >
      <GiftedChat
        messages={messages}
        onSend={(newMessages) => onSend(newMessages)}
        onInputTextChanged={setText}
        user={{ _id: 1 }}
        renderSystemMessage={(props) => (
          <SystemMessage {...props} textStyle={styles.systemMessage} />
        )}
        bottomOffset={insets.bottom}
        renderAvatar={null}
        maxComposerHeight={100}
        textInputProps={styles.composer}
        renderBubble={(props) => (
          <Bubble
            {...props}
            textStyle={{ right: styles.bubbleTextRight }}
            wrapperStyle={{
              left: styles.bubbleWrapperLeft,
              right: styles.bubbleWrapperRight,
            }}
          />
        )}
        renderSend={(props) => (
          <View style={styles.sendContainer}>
            {text === "" ? (
              <>
                <Ionicons
                  name="camera-outline"
                  color={Colors.primary}
                  size={28}
                />
                <Ionicons name="mic-outline" color={Colors.primary} size={28} />
              </>
            ) : (
              <Send {...props} containerStyle={styles.sendButton}>
                <Ionicons name="send" color={Colors.primary} size={28} />
              </Send>
            )}
          </View>
        )}
        renderInputToolbar={renderInputToolbar}
        renderChatFooter={() => (
          <ReplyMessageBar
            clearReply={() => setReplyMessage(null)}
            message={replyMessage}
          />
        )}
        onLongPress={(context, message) => setReplyMessage(message)}
        renderMessage={(props) => (
          <ChatMessageBox
            {...props}
            setReplyOnSwipeOpen={setReplyMessage}
            updateRowRef={updateRowRef}
          />
        )}
      />
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  imageBackground: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  inputToolbar: {
    backgroundColor: Colors.background,
  },
  inputToolbarActions: {
    height: 44,
    justifyContent: "center",
    alignItems: "center",
    left: 5,
  },
  systemMessage: {
    color: Colors.gray,
  },
  composer: {
    backgroundColor: "#fff",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: Colors.lightGray,
    paddingHorizontal: 10,
    paddingTop: 8,
    fontSize: 16,
    marginVertical: 4,
  },
  bubbleTextRight: {
    color: "#000",
  },
  bubbleWrapperLeft: {
    backgroundColor: "#fff",
  },
  bubbleWrapperRight: {
    backgroundColor: Colors.lightGreen,
  },
  sendContainer: {
    height: 44,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 14,
    paddingHorizontal: 14,
  },
  sendButton: {
    justifyContent: "center",
  },
});

export default React.memo(Page);
