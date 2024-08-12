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
  Dimensions,
  PanResponder,
} from "react-native";
import {
  Entypo,
  FontAwesome,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { X, Mic, Undo } from "lucide-react-native";
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
import MemoListItem from "@/components/Memolistitem";
import * as ImagePicker from "expo-image-picker";
import { BlurView } from "expo-blur";
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from "react-native-gesture-handler";

dayjs.extend(relativeTime);

import {
  useSharedValue,
  useAnimatedScrollHandler,
  scrollTo,
} from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";

const { height } = Dimensions.get("window");
const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

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
  const [replyingMessageId, setReplyingMessageId] = useState(null);
  const scrollY = useSharedValue(0);

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
        console.log(status.meter);
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
      const recording = recordingRef.current;

      // Fetch the status and get the duration before stopping
      const status = await recording.getStatusAsync();

      const durationMillis = status.durationMillis;

      // Convert durationMillis to minutes and seconds
      const minutes = Math.floor(durationMillis / 60000);
      const seconds = Math.floor((durationMillis % 60000) / 1000);

      // Format the duration as "0:00"
      const formattedDuration = `${minutes}:${seconds
        .toString()
        .padStart(2, "0")}`;

      // Proceed to stop and unload the recording
      await recording.stopAndUnloadAsync();

      // Reset audio mode after stopping the recording
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
      });

      const uri = recording.getURI();
      if (uri) {
        // Use the durationMillis obtained before stopping
        const newVoiceMessage = {
          id: messages.length + 1,
          metering: audioMeteringRef.current,
          type: "voice",
          text: "Voice",
          duration: formattedDuration,
          uri: uri,
          createdAt: new Date().toISOString(),
          user: { id: "u1", name: "User" }, // assuming "u1" is the current user
        };

        setMessages((prevMessages) => [newVoiceMessage, ...prevMessages]);
        flatListRef.current.scrollToOffset({ animated: true, offset: 0 });
      }
    } catch (err) {
      console.error("Failed to stop recording", err);
    } finally {
      recordingRef.current = null; // Reset the recording reference
    }
  }

  const handleDelete = (id) => {
    setMessages((prevMessages) => prevMessages.filter((msg) => msg.id !== id));
  };
  const currentDate = new Date();

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

  const groupedMessages = groupMessagesByDate(messages);
  const groupedMessagesArray = Object.keys(groupedMessages).map((date) => ({
    date,
    messages: groupedMessages[date],
  }));

  const isMyMessage = useCallback((message) => {
    return message.user.id === "u1"; // assuming "u1" is the current user
  }, []);

  const handleSendMessage = useCallback(() => {
    const newMessage = newMessageRef.current.trim();
    if (newMessage) {
      setIsSending(true);
      setTyping(false);

      // Functional update to ensure we're working with the latest state
      setMessages((prevMessages) => {
        const newMsg = {
          id: prevMessages.length + 1,
          text: newMessage,
          type: "text",
          createdAt: new Date().toISOString(),
          user: { id: "u1", name: "User" },
          repliedTo: replyingMessageId || null,
        };

        return [newMsg, ...prevMessages];
      });

      newMessageRef.current = ""; // Clear the ref value
      textInputRef.current.clear(); // Clear the input field
      flatListRef.current.scrollToOffset({ animated: true, offset: 0 });

      setReplyingMessageId(null); // Clear the replying message ID
      setIsSending(false);
    }
  }, [replyingMessageId, messages]);

  const MessageItemRender = ({ item }) => {
    const myMessage = isMyMessage(item);

    const renderReplyingMessage = (item) => {
      if (item.repliedTo) {
        const repliedMessage = messages.find(
          (msg) => msg.id === item.repliedTo
        );
        if (repliedMessage && repliedMessage.type === "text") {
          return (
            <View style={{ alignItems: "flex-end", opacity: 0.5 }}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Undo size={20} />
                <Text
                  style={{ fontSize: 12, marginVertical: 5, marginLeft: 5 }}
                >
                  You replied to {repliedMessage.user.name}
                </Text>
              </View>
              <View style={styles.replyingInMessage}>
                <Text
                  style={styles.replyingInMessageText}
                  ellipsizeMode="tail"
                  numberOfLines={3}
                >
                  {repliedMessage.text}
                </Text>
              </View>
            </View>
          );
        }
        if (repliedMessage && repliedMessage.type === "voice") {
          return (
            <View style={{ alignItems: "flex-end", opacity: 0.5 }}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Undo size={20} />
                <Text
                  style={{ fontSize: 12, marginVertical: 5, marginLeft: 5 }}
                >
                  You replied to {repliedMessage.user.name}
                </Text>
              </View>
              <View style={[styles.replyingInMessage]}>
                <Mic />
                <Text
                  style={styles.replyingInMessageText}
                  ellipsizeMode="tail"
                  numberOfLines={3}
                >
                  {repliedMessage.duration}
                </Text>
              </View>
            </View>
          );
        }
      }
      return null;
    };

    const renderMainMessage = (item) => {
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
                styles.mesageContain,
              ]}
            >
              <Text
                style={[
                  styles.messageText,
                  myMessage ? styles.myMessageText : styles.otherMessageText,
                ]}
              >
                {item.text}
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

    return (
      <>
        {renderReplyingMessage(item)}
        {renderMainMessage(item)}
      </>
    );
  };

  const flattenGroupedMessages = useCallback(() => {
    return groupedMessagesArray.reduce((acc, group) => {
      return [...acc, ...group.messages];
    }, []);
  }, [groupedMessagesArray]);

  const scrollToMessage = (repliedToMessageId) => {
    const flattenedMessages = flattenGroupedMessages();

    const messageIndex = flattenedMessages.findIndex(
      (message) => message.id === repliedToMessageId
    );

    if (messageIndex !== -1 && flatListRef.current) {
      console.log(`Scrolling to index: ${messageIndex}`); // Debug log

      flatListRef.current.scrollToIndex({
        animated: true,
        index: messageIndex,
        viewPosition: 0.8, // Scroll to the end of the visible area
        viewOffset: 10, // Adjust this offset value as needed
      });
    } else {
      console.log("Message not found or flatListRef is null");
    }
  };

  // const scrollToMessage = (repliedToMessageId) => {
  //   const flattenedMessages = flattenGroupedMessages();

  //   const messageIndex = flattenedMessages.findIndex(
  //     (message) => message.id === repliedToMessageId
  //   );

  //   if (messageIndex !== -1 && flatListRef.current) {
  //     const invertedIndex = flattenedMessages.length - 1 - messageIndex;

  //     flatListRef.current.scrollToIndex({
  //       animated: true,
  //       index: invertedIndex,
  //       viewPosition: 1, // Adjust this value as needed
  //     });
  //   } else {
  //     console.log("Message not found or flatListRef is null");
  //   }
  // };

  // const scrollToMessage = (repliedToId) => {
  //   if (!repliedToId) return;

  //   const messageIndex = messages.findIndex((msg) => msg.id === repliedToId);

  //   if (messageIndex !== -1 && flatListRef.current) {
  //     flatListRef.current.scrollToIndex({
  //       animated: true,
  //       index: messageIndex,
  //     });
  //   } else {
  //     console.log("Message not found or flashListRef is null");
  //   }
  // };

  const renderMessageItem = ({ item }) => {
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

    const renderRightActions = (progress, dragX) => {
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
              myMessage && { alignItems: "flex-end", left: "15%" },
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
      setReplyingMessageId(item.id);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      textInputRef.current.focus();
    };

    return (
      <Pressable
        onPress={() => {
          if (item.repliedTo) {
            scrollToMessage(item.repliedTo);
          } else {
            console.log("This message is not a reply.");
          }
        }}
        style={[
          styles.messageContainer,
          item.type === "voice" && { width: "80%" },
          myMessage ? [styles.myMessage] : [styles.otherMessage],
        ]}
      >
        <Swipeable
          ref={swipeableRef}
          {...(myMessage ? { renderRightActions } : { renderLeftActions })}
          onSwipeableWillOpen={() => {
            swipeableRef.current.close();
            onSwipeableWillOpen(item);
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            textInputRef.current.focus();
          }}
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
      </Pressable>
    );
  };

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

  // const calculateEstimatedItemSize = () => {
  //   // Sample items to estimate average height
  //   const sampleMessages = groupedMessagesArray.slice(0, 10);

  //   // Estimate the total height
  //   let totalHeight = 0;
  //   sampleMessages.forEach((item) => {
  //     totalHeight += getItemHeight(item);
  //   });

  //   // Calculate average height
  //   return totalHeight / sampleMessages.length;
  // };

  // const getItemHeight = (item) => {
  //   // Return the height based on your specific conditions
  //   // Adjust according to the type, content, or media in the message
  //   if (item.type === "text") {
  //     return 80; // Adjust this value based on your text message height
  //   } else if (item.type === "voice") {
  //     return 100; // Adjust this value for voice messages
  //   } else if (item.type === "image") {
  //     return 150; // Adjust for image messages
  //   }

  //   // Default height if type is unknown
  //   return 100;
  // };

  //BottomSheet component

  const translateY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      (event) => {
        Animated.timing(translateY, {
          toValue: -event.endCoordinates.height,
          duration: 300,
          useNativeDriver: true, // Ensure native driver for performance
        }).start();
      }
    );

    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        Animated.timing(translateY, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start();
      }
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  const bottomSheetRef = useRef(null);

  const { height } = Dimensions.get("window");

  const sheetHeight = useRef(new Animated.Value(0)).current;
  const bottomSheetOpenRef = useRef(false);

  // const openSheet = () => {
  //   Keyboard.dismiss();
  //   bottomSheetOpenRef.current = true;
  //   Animated.parallel([
  //     Animated.spring(translateY, {
  //       toValue: 0,
  //       useNativeDriver: true,
  //       friction: 5,
  //     }).start(),
  //     Animated.spring(contentMarginBottom, {
  //       toValue: sheetHeight,
  //       useNativeDriver: false,
  //     }).start(),
  //   ]);
  // };

  // const closeSheet = () => {
  //   bottomSheetOpenRef.current = false;
  //   Animated.parallel([
  //     Animated.spring(translateY, {
  //       toValue: sheetHeight,
  //       useNativeDriver: true,
  //     }).start(),
  //     Animated.spring(contentMarginBottom, {
  //       toValue: 0,
  //       useNativeDriver: false,
  //     }).start(),
  //   ]);
  // };

  const openSheet = () => {
    Animated.timing(sheetHeight, {
      toValue: 320, // Desired height when the sheet is open
      isInteraction: true,
      useNativeDriver: false,
      duration: 300,
    }).start();
  };

  const closeSheet = () => {
    Animated.timing(sheetHeight, {
      toValue: 0, // Animate back to height 0
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const snapPoints = useMemo(() => ["30%"], []);

  const handleOpenPress = () => {
    Keyboard.dismiss();
    bottomSheetRef.current?.snapToIndex(0);
  };

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => {
        openSheet();
      }
    );

    // Clean up the listener on unmount
    return () => {
      keyboardDidShowListener.remove();
    };
  }, []);

  return (
    <>
      <View
        style={{
          flex: 1,
        }}
      >
        <LinearGradient colors={["#ece9e6", "#ffffff"]}>
          {/* <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
          > */}
          <View style={[styles.flashListContainer]}>
            <FlatList
              estimatedItemSize={300} // Adjust this dynamically if needed
              ref={flatListRef}
              keyboardDismissMode="interactive"
              data={groupedMessagesArray}
              contentContainerStyle={{ paddingVertical: 110 }}
              keyExtractor={(item) => item.date}
              renderItem={({ item }) => (
                <View style={{}}>
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

            <BlurView intensity={200} tint="light" style={[styles.header]}>
              <Pressable
                onPress={() => router.back()}
                style={styles.backButton}
              >
                <Entypo
                  name="chevron-left"
                  size={24}
                  color={Colors.light.text}
                />
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
                  <FontAwesome
                    name="phone"
                    size={24}
                    color={Colors.light.text}
                  />
                </Pressable>
                <Pressable style={styles.icon}>
                  <Entypo
                    name="dots-three-vertical"
                    size={24}
                    color={Colors.light.text}
                  />
                </Pressable>
              </View>
            </BlurView>
            <View
              style={[
                { bottom: 80, flex: 1 },
                replyingMessageId && { bottom: 115 },
              ]}
            >
              <BlurView
                intensity={200}
                tint="light"
                style={[styles.inputContainer]}
              >
                <View>
                  {linkMetadata && (
                    <View>
                      {linkMetadata.image && (
                        <Image
                          source={{ uri: linkMetadata.image }}
                          style={{
                            width: 50,
                            height: 50,
                            resizeMode: "contain",
                          }}
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

                  {replyingMessageId && (
                    <View intensity={200} style={styles.replyingContainer}>
                      <View style={styles.replyingContent}>
                        <View style={styles.replyingUser}>
                          <Text>
                            <Text style={{ fontWeight: "bold" }}>
                              {
                                messages.find(
                                  (msg) => msg.id === replyingMessageId
                                )?.user.name
                              }
                            </Text>
                          </Text>
                        </View>
                        <Text
                          ellipsizeMode="tail"
                          numberOfLines={1}
                          style={styles.replyingText}
                        >
                          {
                            messages.find((msg) => msg.id === replyingMessageId)
                              ?.text
                          }
                        </Text>
                      </View>
                      <Pressable
                        style={styles.replyingDismis}
                        onPress={() => setReplyingMessageId(null)}
                      >
                        <X color={"gray"} size={20} />
                      </Pressable>
                    </View>
                  )}
                </View>
                <View
                  style={[{ flexDirection: "row", alignItems: "flex-end" }]}
                >
                  <TouchableOpacity
                    style={{ padding: 5 }}
                    onPress={() => {
                      Keyboard.dismiss(); // Dismiss the keyboard
                    }}
                  >
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
                    onFocus={() => {
                      openSheet(); // Open bottom sheet when TextInput is focused
                    }}
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
              </BlurView>
            </View>
          </View>
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
          {/* </KeyboardAvoidingView> */}
        </LinearGradient>
      </View>

      {/* <BottomSheet
        enablePanDownToClose
        snapPoints={snapPoints}
        index={-1}
        ref={bottomSheetRef}
        onChange={(index) => {
          if (bottomSheetRef.current) {
            bottomSheetRef.current.expanded = index !== -1;
          }
        }}
        containerStyle={{
          zIndex: 1000,
        }}
      >
        <View style={styles.contentContainer}>
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
        </View>
      </BottomSheet> */}

      <Animated.View
        style={[
          styles.bottomSheet,
          {
            height: sheetHeight,
          },
        ]}
      >
        <View style={styles.sheetContent}>
          <Text style={{ fontSize: 18 }}>This is a custom bottom sheet!</Text>
          <TouchableOpacity onPress={closeSheet} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </>
  );
};

const styles = StyleSheet.create({
  safeArea: {},

  flashListContainer: { height: "100%" },
  inputContainer: {
    flexDirection: "row",
    padding: 10,
    height: 120,
    flexDirection: "column",
    width: "100%",
    zIndex: 1000,
  },
  textInput: {
    flex: 1,
    padding: hp(1),
    borderColor: Colors.light.border,
    borderWidth: 1,
    borderRadius: 20,
    marginRight: 10,
    minHeight: hp(2), // Adjust based on line height
    maxHeight: 90,
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
    overflow: "visible",
    maxWidth: "70%",

    // marginRight: 20,
  },
  mesageContain: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    marginVertical: 5,
    alignSelf: "flex-end",
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
    flexShrink: 1,
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
    marginLeft: "auto",
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
    justifyContent: "space-between",
    flexDirection: "row",
    padding: 5,
    position: "relative",
    width: "100%",
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
    padding: 10,
    backgroundColor: "#e8e8e8",

    borderRadius: 10,
    alignSelf: "flex-end", // Adjust this to flex-start
    marginBottom: -30,

    flexDirection: "row",
    paddingBottom: 30,
    alignItems: "center",
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
    paddingHorizontal: 10,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    paddingTop: heightPercentageToDP(5),
    width: "100%",
    position: "absolute",
  },
  backButton: {
    padding: 5,
  },
  headerTitleContainer: {
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
  contentContainer: {
    zIndex: 1000,
    height: "100%",
  },

  bottomSheet: {
    width: "100%",
    backgroundColor: "white",
    overflow: "hidden", // To ensure smooth animation
  },
  sheetContent: {
    padding: 20,
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: "red",
    padding: 10,
    borderRadius: 5,
  },
  closeButtonText: {
    color: "white",
    fontSize: 16,
  },
  sheetContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default ChatRoom;
