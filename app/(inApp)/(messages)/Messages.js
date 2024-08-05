import React, {
  useState,
  useRef,
  useCallback,
  useEffect,
  useMemo,
} from "react";
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
  Image,
  TouchableOpacity,
  Keyboard,
  Alert,
  ActivityIndicator,
  ScrollView,
  Button,
  Animated,
} from "react-native";
import {
  Entypo,
  FontAwesome,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { X } from "lucide-react-native";
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
import messagesData from "@/context/messages.json";
import bg from "@/assets/images/BG.png";
import { Colors } from "@/constants/Colors";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { router } from "expo-router";
import { FlashList } from "@shopify/flash-list";
import LottieView from "lottie-react-native";
import axios from "axios";
import cheerio from "cheerio";
import { Audio } from "expo-av";
import { useSharedValue } from "react-native-reanimated";
import MemoListItem from "@/components/Memolistitem";
import * as ImagePicker from "expo-image-picker";
import { BlurView } from "expo-blur";
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from "react-native-gesture-handler";

dayjs.extend(relativeTime);

const ChatRoom = () => {
  const [messages, setMessages] = useState(messagesData);
  const newMessageRef = useRef("");
  const flatListRef = useRef(null);
  const swipeableRefs = useRef({});
  const [replyingText, setReplyingText] = useState("");
  const textInputRef = useRef(null);
  const route = useRoute();
  const sender = route.params?.sender;
  const senderImage = route.params?.senderImage;
  const [typing, setTyping] = useState(false);
  const recordingRef = useRef(null);
  const audioMeteringRef = useRef([]);
  const metering = useSharedValue(-100);
  const imageRef = useRef(null);
  const [isSending, setIsSending] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const lottieRef = useRef(null);

  const handleDelete = (id) => {
    setMessages((prevMessages) => prevMessages.filter((msg) => msg.id !== id));
  };
  const currentDate = new Date();

  const handleSendMessage = useCallback(() => {
    const newMessage = newMessageRef.current.trim();
    if (newMessage) {
      setIsSending(true);
      setTyping(false);

      let messageToSend = newMessage;

      if (replyingText) {
        messageToSend = `Replying to: ${replyingText}\n\n${messageToSend}`;
        setReplyingText("");
      }

      const newMsg = {
        id: messages.length + 1,
        text: messageToSend,
        type: "text",
        createdAt: new Date().toISOString(),
        user: { id: "u1", name: "User" }, // assuming "u1" is the current user
      };

      setMessages((prevMessages) => [newMsg, ...prevMessages]);
      newMessageRef.current = ""; // Clear the ref value
      textInputRef.current.clear(); // Clear the input field
      flatListRef.current.scrollToOffset({ animated: true, offset: 0 });

      setIsSending(false);
    }
  }, [messages, replyingText]);

  async function StartRecording() {
    console.log("start Recording");
    try {
      audioMeteringRef.current = [];
      setIsRecording(true);

      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY,
        undefined,
        100
      );
      recordingRef.current = recording;

      recording.setOnRecordingStatusUpdate((status) => {
        if (status.metering) {
          const currentMetering = status.metering || -100;
          metering.value = currentMetering;
          audioMeteringRef.current = [
            ...audioMeteringRef.current,
            currentMetering,
          ];
        }
      });
    } catch (err) {
      console.error("Failed to start recording", err);
    }
  }

  async function stopRecording() {
    if (!recordingRef.current) {
      return;
    }

    try {
      setIsRecording(false);
      console.log("Stopping recording..");
      const recording = recordingRef.current;
      recordingRef.current = null;
      await recording.stopAndUnloadAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
      });
      const uri = recording.getURI();
      if (uri) {
        const newVoiceMessage = {
          id: messages.length + 1,
          metering: audioMeteringRef.current,
          type: "voice",
          text: "Voice",
          uri: uri,
          createdAt: new Date().toISOString(),
          user: { id: "u1", name: "User" }, // assuming "u1" is the current user
        };

        setMessages((prevMessages) => [newVoiceMessage, ...prevMessages]);
        flatListRef.current.scrollToOffset({ animated: true, offset: 0 });
      }
    } catch (err) {
      console.error("Failed to stop recording", err);
    }
  }

  const longPress = Gesture.LongPress()
    .onStart(StartRecording)
    .onFinalize(stopRecording);

  const pickImage = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: false,
        quality: 1,
      });

      if (!result.canceled) {
        const newImageUri = result.assets[0].uri;
        imageRef.current = newImageUri;

        const newImage = {
          id: messages.length + 1,
          type: "image",
          text: "Image",
          uri: newImageUri,
          createdAt: new Date().toISOString(),
          user: { id: "u1", name: "User" }, // assuming "u1" is the current user
        };
        setMessages((prevMessages) => [newImage, ...prevMessages]);
        flatListRef.current.scrollToOffset({ animated: true, offset: 0 });
      }
    } catch (err) {
      console.error("Failed to pick image", err);
    }
    bottomSheetRef.current?.close();
  };

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

  const MessageItemRender = ({ item }) => {
    const myMessage = isMyMessage(item);
    const swipeableRef = swipeableRefs.current[item.id] || React.createRef();
    swipeableRefs.current[item.id] = swipeableRef;

    if (item.type === "text") {
      return (
        <>
          <View
            style={[
              myMessage
                ? [
                    {
                      borderTopEndRadius: 20,
                      borderTopStartRadius: 20,
                      borderBottomLeftRadius: 20,
                      backgroundColor: Colors.dark.primary,
                    },
                  ]
                : [
                    {
                      borderTopEndRadius: 20,
                      borderTopStartRadius: 20,
                      borderBottomRightRadius: 20,
                      backgroundColor: "#ffffff",
                    },
                  ],
            ]}
          >
            {item.text.includes("Replying to:") && (
              <View style={styles.replyingInMessage}>
                <Text style={{ paddingVertical: 5, fontWeight: "bold" }}>
                  You
                </Text>
                <Text
                  style={styles.replyingInMessageText}
                  ellipsizeMode="tail"
                  numberOfLines={3}
                >
                  {item.text.split("\n\n")[0]}
                </Text>
              </View>
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
        </>
      );
    }

    if (item.type === "voice") {
      return (
        <View>
          <MemoListItem memo={item} />
        </View>
      );
    }

    if (item.type === "image") {
      return (
        <View style={{ padding: 5 }}>
          <Image
            source={{ uri: item.uri }}
            resizeMode="cover"
            style={{ borderRadius: 15, width: "100%" }}
            aspectRatio={1}
          />
          <Text
            style={[
              styles.messageTime,
              { marginTop: 10 },
              myMessage ? styles.myMessageTime : styles.otherMessageTime,
            ]}
          >
            {dayjs(item.createdAt).format("h:mm A")}
          </Text>
        </View>
      );
    }
  };
  const renderMessageItem = useCallback(
    ({ item }) => {
      const myMessage = isMyMessage(item);
      const swipeableRef = swipeableRefs.current[item.id] || React.createRef();
      swipeableRefs.current[item.id] = swipeableRef;

      const renderLeftActions = (progress, dragX) => {
        const scale = progress.interpolate({
          inputRange: [0, 1],
          outputRange: [0.5, 1],
          extrapolate: "clamp",
        });

        return (
          <RectButton style={styles.leftAction}>
            <Animated.View
              style={[
                styles.replyImageWrapper,
                {
                  width: widthPercentageToDP(20),
                  height: "100%",
                  justifyContent: "center",
                  transform: [{ scale }],
                },
                myMessage && { alignItems: "flex-end", right: "80%" },
              ]}
            >
              <MaterialCommunityIcons
                name="reply-circle"
                size={40}
                color={Colors.dark.backgroundGrayText}
              />
            </Animated.View>
          </RectButton>
        );
      };

      const handleDelete = (id) => {
        setMessages((prevMessages) =>
          prevMessages.filter((msg) => msg.id !== id)
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
          <View
            style={[
              styles.messageContainer,
              item.type === "voice" && { width: "80%" },
              myMessage ? [styles.myMessage] : [styles.otherMessage],
            ]}
          >
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
              containerStyle={[
                !myMessage && {
                  marginLeft: 10,
                },
                myMessage && {
                  marginRight: 10,
                },
                { overflow: "visible" },
              ]}
            >
              <MessageItemRender item={item} />
            </Swipeable>
          </View>
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
    if (url.startsWith("http://") || url.startsWith("https://")) {
      return url;
    }
    if (url.startsWith("www.")) {
      return `https://${url}`;
    }
    return `https://www.${url}`;
  };

  const fetchLinkMetadata = async (url) => {
    try {
      const formattedUrl = formatUrl(url);
      const response = await axios.get(formattedUrl);
      const html = response.data;
      const $ = cheerio.load(html);

      // Extract metadata
      const title =
        $('meta[property="og:title"]').attr("content") || $("title").text();
      const description =
        $('meta[name="description"]').attr("content") ||
        $('meta[property="og:description"]').attr("content");

      let image = $('meta[property="og:image"]').attr("content");
      if (!image) {
        const linkTags = $(
          'link[rel="icon"], link[rel="shortcut icon"], link[rel="apple-touch-icon"]'
        );
        if (linkTags.length > 0) {
          image = linkTags.first().attr("href");
          // Handle relative URL for favicon
          if (image && !image.startsWith("http")) {
            image = new URL(image, formattedUrl).href;
          }
        }
      }

      const metadata = {
        title,
        description,
        image,
      };

      setLinkMetadata(metadata);
      console.log("Link metadata fetched:", metadata);
    } catch (error) {
      console.error("Error fetching link metadata:", error);
    }
  };

  const handleTextChange = (text) => {
    newMessageRef.current = text;

    const urls = text.match(urlPattern);
    const domainSuffixPattern = /\.(com|net|org|co|io|me|tv|biz|info)$/i;

    if (domainSuffixPattern.test(text)) {
      fetchLinkMetadata(`https://www.${text}`);
    }

    if (urls && urls.length > 0) {
      urls.forEach((url) => {
        const formattedUrl = formatUrl(url);
        fetchLinkMetadata(formattedUrl);
      });
    } else {
      setLinkMetadata(null);
    }

    if (text.length > 0 && typing === false) {
      setTyping(true);
    }
    if (text.length === 0 && typing === true) {
      setTyping(false);
    }
  };

  //BottomSheet component

  const bottomSheetRef = useRef(null);

  const snapPoints = useMemo(() => ["30%"], []);

  const handleOpenPress = () => {
    bottomSheetRef.current?.snapToIndex(0);
  };

  return (
    <View style={styles.safeArea}>
      {isRecording && (
        <BlurView intensity={20} style={styles.absolute}>
          <LottieView
            ref={lottieRef}
            source={require("@/assets/lottie/soundwaveprimary.json")}
            autoPlay
            loop
            style={styles.lottie}
          />
        </BlurView>
      )}

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
            contentContainerStyle={{}}
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
                    <View style={{}} key={message.id}>
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
              {linkMetadata.image && (
                <Image
                  source={{ uri: linkMetadata.image }}
                  style={{ width: 50, height: 50, resizeMode: "contain" }}
                />
              )}
              {linkMetadata.title && (
                <Text style={styles.title}>{linkMetadata.title}</Text>
              )}
              {linkMetadata.description && (
                <Text style={styles.description}>
                  {linkMetadata.description}
                </Text>
              )}
            </View>
          )}

          {replyingText && (
            <Animated.View style={styles.replyingContainer}>
              <View style={styles.replyingContent}>
                <View style={styles.replyingUser}>
                  <Text>
                    Replying to <Text style={{ fontWeight: "bold" }}>You</Text>
                  </Text>
                </View>
                <Text
                  ellipsizeMode="tail"
                  numberOfLines={1}
                  style={styles.replyingText}
                >
                  {replyingText}
                </Text>
              </View>
              <Pressable
                style={styles.replyingDismis}
                onPress={() => setReplyingText()}
              >
                <X color={"gray"} size={20} />
              </Pressable>
            </Animated.View>
          )}

          <View style={[styles.inputContainer]}>
            <TouchableOpacity style={{ padding: 5 }} onPress={handleOpenPress}>
              <Ionicons name="attach" size={24} color="black" />
            </TouchableOpacity>
            {/* <Animated.View style={[animatedRecordWave, styles.recordWave]} /> */}

            <TextInput
              ref={textInputRef}
              style={styles.textInput}
              value={newMessageRef}
              onChangeText={handleTextChange}
              placeholder="Type a message"
              multiline={true}
              autoCorrect
            />

            {!typing && (
              <GestureDetector gesture={longPress}>
                <Pressable
                  style={styles.micIcon}
                  // onPressOut={stopRecording}
                  // onLongPress={StartRecording}
                >
                  <Ionicons
                    name="mic"
                    size={20}
                    color={Colors.light.background}
                  />
                </Pressable>
              </GestureDetector>
            )}
            {typing && (
              <Pressable
                onPress={handleSendMessage}
                style={styles.sendButton}
                accessibilityLabel="Send message"
              >
                <Ionicons
                  name="send"
                  size={20}
                  color={Colors.light.background}
                />
              </Pressable>
            )}
          </View>
          <>
            <BottomSheet
              enablePanDownToClose
              snapPoints={snapPoints}
              index={-1}
              ref={bottomSheetRef}
            >
              <BottomSheetView style={styles.contentContainer}>
                <View>
                  <TouchableOpacity
                    onPress={pickImage}
                    style={{
                      backgroundColor: "gray",
                      padding: 10,
                      width: 70,
                      margin: 10,
                    }}
                  >
                    <Entypo name="camera" size={24} color="black" />
                  </TouchableOpacity>
                </View>
              </BottomSheetView>
            </BottomSheet>
          </>
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
    height: "100%",
  },
  inputContainer: {
    flexDirection: "row",
    padding: 10,
    backgroundColor: Colors.light.background,
    alignItems: "flex-end",
    paddingBottom: heightPercentageToDP(4),
    zIndex: 1000,
  },
  textInput: {
    flex: 1,
    padding: 10,
    borderColor: Colors.light.border,
    borderWidth: 1,
    borderRadius: 20,
    marginRight: 10,
    minHeight: 20, // Adjust based on line height
    maxHeight: 80,
  },
  sendButton: {
    backgroundColor: Colors.light.primary,
    borderRadius: 20,
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  micIcon: {
    backgroundColor: Colors.light.primary,
    borderRadius: 20,
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  messageContainer: {
    marginVertical: 5,
    overflow: "visible",

    // marginRight: 20,
  },
  myMessage: {
    alignSelf: "flex-end",
    marginLeft: "20%",
    overflow: "visible",
  },
  otherMessage: {
    alignSelf: "flex-start",
    marginRight: "20%",
  },
  messageText: {
    fontSize: 16,
    padding: 10,
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
    paddingHorizontal: 10,
    paddingBottom: 5,
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
    justifyContent: "space-between",
    flexDirection: "row",
    padding: 10,
  },

  replyingContent: {
    color: Colors.light.text,
    fontSize: 16,
    maxWidth: "80%",
  },
  replyingDismis: {
    height: 25,
    width: 25,
    backgroundColor: "lightgrey",
    borderRadius: 20,
    fontSize: 15,
    fontWeight: "bold",
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
  },
  replyingText: { fontSize: 13, marginRight: 10, color: "gray" },
  replyingInMessage: {
    fontSize: 13,
    padding: 10,
    backgroundColor: "#ffd836",
    borderRadius: 10,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    borderRadius: 20,
    margin: 5,
  },
  replyingInMessageText: { fontSize: 13 },
  replyingUser: { marginVertical: 5 },
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
    fontFamily: "PoppinsSemiBold",
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
  imageGallery: { width: 100, height: 100 },
  photoContainer: { height: "100%" },
  recordWave: {
    position: "absolute",
    backgroundColor: Colors.light.primary,
    opacity: 0.5,
    right: 0,
  },
  recordingWave: {
    width: 1000,
    height: 1000,
    position: "absolute",
    left: -30,
    bottom: -50,
  },
  absolute: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    bottom: 0,
    zIndex: 1,
  },
  lottie: {
    width: 300,
    height: 300,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3.84,
    elevation: 5,
  },
});

export default ChatRoom;
