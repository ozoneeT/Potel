import React, {
  useState,
  useRef,
  useCallback,
  useEffect,
  useMemo,
  memo,
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
  Linking,
} from "react-native";
import {
  Entypo,
  FontAwesome,
  FontAwesome5,
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
  Easing,
  interpolate,
  Extrapolate,
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
  const [typingText, setTypingText] = useState(false);
  const recordingRef = useRef(null);
  const audioMeteringRef = useRef([]);
  const metering = useSharedValue(-100);
  const imageRef = useRef(null);
  const [isSending, setIsSending] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const lottieRef = useRef(null);
  const [replyingMessageId, setReplyingMessageId] = useState(null);

  const scrollY = useSharedValue(0);

  const meteringValue = useRef(new Animated.Value(0)).current;
  const [meteringValues, setMeteringValues] = useState([]);
  const animatedMeteringValues = useRef(
    new Array(maxValues).fill(new Animated.Value(1))
  ); // Initialize animated values

  const maxValues = 100;
  const compressionThreshold = maxValues * 0.8;
  const [isPlaying, setIsPlaying] = useState(false);
  const [sound, setSound] = useState(null);
  const [recordingUri, setRecordingUri] = useState(null);
  const [isRecordingPreview, setisRecordingPreview] = useState(false);
  const domainLinksRef = useRef();

  // async function StartRecording() {
  //   console.log("start Recording");
  //   try {
  //     audioMeteringRef.current = [];
  //     setIsRecording(true);

  //     await Audio.requestPermissionsAsync();
  //     await Audio.setAudioModeAsync({
  //       allowsRecordingIOS: true,
  //       playsInSilentModeIOS: true,
  //     });

  //     const { recording } = await Audio.Recording.createAsync(
  //       Audio.RecordingOptionsPresets.HIGH_QUALITY,
  //       undefined,
  //       100
  //     );
  //     recordingRef.current = recording;

  //     recording.setOnRecordingStatusUpdate((status) => {
  //       if (status.metering) {
  //         const currentMetering = status.metering || -100;

  //         const scale = Math.max(0.1, 1 + currentMetering / 50);

  //         meteringValue.setValue(scale);

  //         audioMeteringRef.current = [...audioMeteringRef.current, scale];

  //         setMeteringValues((prev) => {
  //           let newValues = [...prev, scale];

  //           if (newValues.length > compressionThreshold) {
  //             const excess = newValues.length - compressionThreshold;

  //             // Gradually compress the excess lines
  //             for (let i = 0; i < excess; i++) {
  //               const index = i % newValues.length;
  //               newValues[index] =
  //                 (newValues[index] + newValues[index + 1]) / 2;
  //               newValues.splice(index + 1, 1);
  //             }
  //           }

  //           return newValues;
  //         });
  //       }
  //     });
  //   } catch (err) {
  //     console.error("Failed to start recording", err);
  //   }
  // }

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

          // Calculate the scale based on metering value
          const scale = Math.max(0.1, 1 + currentMetering / 50);

          // Set the animated value
          meteringValue.setValue(scale); // Directly set the scale value

          metering.value = currentMetering;

          audioMeteringRef.current = [
            ...audioMeteringRef.current,
            currentMetering,
          ];
          setMeteringValues((prev) => {
            const newValues = [...prev, scale];
            return newValues.slice(-maxValues);
          });
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
      setisRecordingPreview(true);
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
        setRecordingUri(uri);

        // Use the durationMillis obtained before stopping
        // const newVoiceMessage = {
        //   id: messages.length + 1,
        //   metering: audioMeteringRef.current,
        //   type: "voice",
        //   text: "Voice",
        //   duration: formattedDuration,
        //   uri: uri,
        //   createdAt: new Date().toISOString(),
        //   user: { id: "u1", name: "User" }, // assuming "u1" is the current user
        // };

        // setMessages((prevMessages) => [newVoiceMessage, ...prevMessages]);
        // flatListRef.current.scrollToOffset({ animated: true, offset: 0 });
      }
    } catch (err) {
      console.error("Failed to stop recording", err);
    } finally {
      // Clear the waveform and reset recording reference

      setMeteringValues([]); // Clear the waveform lines
      recordingRef.current = null; // Reset the recording reference
    }
  }

  const processMeteringData = (meteringData, numLines = 35) => {
    const lines = [];
    if (meteringData && meteringData.length > 0) {
      for (let i = 0; i < numLines; i++) {
        const start = Math.floor((i * meteringData.length) / numLines);
        const end = Math.ceil(((i + 1) * meteringData.length) / numLines);
        const segment = meteringData.slice(start, end);
        const average =
          segment.reduce((sum, value) => sum + value, 0) / segment.length;
        lines.push(average);
      }
    }
    return lines;
  };

  const FinishedRecording = ({ meteringData }) => {
    const lines = processMeteringData(meteringData);

    return (
      <View style={styles.waveContainer}>
        <TouchableOpacity onPress={playSound} style={{ padding: 5 }}>
          <FontAwesome5
            name={isPlaying ? "pause" : "play"}
            size={20}
            color={"gray"}
          />
        </TouchableOpacity>
        {lines.map((db, index) => (
          <View
            key={index}
            style={[
              styles.waveLine,
              {
                height: interpolate(
                  db,
                  [heightPercentageToDP(Platform.OS === "ios" ? -3 : -30), 0],
                  [5, 50],
                  Extrapolate.CLAMP
                ),
                backgroundColor:
                  progress > index / lines.length
                    ? Colors.light.primary
                    : "gainsboro",
              },
            ]}
          />
        ))}
        <TouchableOpacity onPress={SendVoiceNote} style={{ padding: 5 }}>
          <Text>Send</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const soundObjectRef = useRef(new Audio.Sound());
  const [progress, setProgress] = useState(0);
  const soundPositionRef = useRef(0); // Using useRef for sound position

  const playSound = async () => {
    const uri = recordingUri;

    try {
      if (!isPlaying) {
        if (soundPositionRef.current === 0) {
          console.log("Loading and playing recorded audio...");
          await soundObjectRef.current.loadAsync({ uri });
        }

        await soundObjectRef.current.playFromPositionAsync(
          soundPositionRef.current
        );
        setIsPlaying(true);

        soundObjectRef.current.setOnPlaybackStatusUpdate((status) => {
          if (status.isLoaded) {
            soundPositionRef.current = status.positionMillis;
            const currentProgress =
              status.positionMillis / status.durationMillis; // Calculate progress
            setProgress(currentProgress); // Update progress
          }
          if (status.didJustFinish) {
            setIsPlaying(false);
            setProgress(0); // Reset progress after playback finishes
            soundPositionRef.current = 0;
            soundObjectRef.current.unloadAsync();
          }
        });
      } else {
        await soundObjectRef.current.pauseAsync();
        setIsPlaying(false);
      }
    } catch (error) {
      console.error("Failed to play or pause the recording", error);
    }
  };

  React.useEffect(() => {
    return sound
      ? () => {
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  const SendVoiceNote = async () => {
    try {
      // Ensure sound object is unloaded before sending the voice note
      if (soundObjectRef.current) {
        await soundObjectRef.current.unloadAsync();
      }

      // Create and send the new voice message
      const newVoiceMessage = {
        id: messages.length + 1,
        metering: audioMeteringRef.current,
        type: "voice",
        text: "Voice",
        uri: recordingUri,
        createdAt: new Date().toISOString(),
        user: { id: "u1", name: "User" }, // assuming "u1" is the current user
      };

      setMessages((prevMessages) => [newVoiceMessage, ...prevMessages]);
      flatListRef.current.scrollToOffset({ animated: true, offset: 0 });

      // Reset state for recording preview
      setisRecordingPreview(false);

      // Reset references and state for the next recording
      setRecordingUri(null); // Clear the recording URI
      soundObjectRef.current = new Audio.Sound(); // Create a new sound object
      soundPositionRef.current = 0; // Reset position
    } catch (error) {
      console.error("Failed to send voice note and reset", error);
    }
  };

  // const FinishedRecording = () => {
  //   memo.metering = audioMeteringRef;
  //   const numLines = 35;
  //   const lines = [];

  //   if (memo.metering && memo.metering.length > 0) {
  //     for (let i = 0; i < numLines; i++) {
  //       const meteringIndex = Math.floor((i * memo.metering.length) / numLines);
  //       const nextMeteringIndex = Math.ceil(
  //         ((i + 1) * memo.metering.length) / numLines
  //       );
  //       const values = memo.metering.slice(meteringIndex, nextMeteringIndex);
  //       const average = values.reduce((sum, a) => sum + a, 0) / values.length;
  //       lines.push(average);
  //     }
  //   }
  //   console.log(lines);
  //   return (
  //     <View style={styles.wave}>
  //       {lines.map((db, index) => (
  //         <View
  //           key={index}
  //           style={[
  //             styles.waveLine,
  //             {
  //               height: interpolate(
  //                 db,
  //                 [heightPercentageToDP(Platform.OS === "ios" ? -3 : -30), 0],
  //                 [5, 50],
  //                 Extrapolate.CLAMP
  //               ),
  //               borderColor:
  //                 progress > index / lines.length
  //                   ? Colors.light.primary
  //                   : "gainsboro",
  //               backgroundColor:
  //                 progress > index / lines.length
  //                   ? Colors.light.primary
  //                   : "gainsboro",
  //             },
  //           ]}
  //         />
  //       ))}
  //     </View>
  //   );
  // };

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
      setTypingText(false);

      // Functional update to ensure we're working with the latest state
      setMessages((prevMessages) => {
        const newMsg = {
          id: prevMessages.length + 1,
          text: newMessage,
          type: "text",
          createdAt: new Date().toISOString(),
          user: { id: "u1", name: "User" },
          repliedTo: replyingMessageId || null,
          links: domainLinksRef.current, // Include detected links
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
        // Define regex pattern for links
        const linkPattern =
          /(\b[a-zA-Z0-9.-]+)\.(com|net|org|co|io|me|tv|biz|info)\b/g;

        // Function to process text and identify links
        const processText = (text) => {
          let parts = [];
          let lastIndex = 0;

          text.replace(linkPattern, (match, p1, p2, offset) => {
            // Push text before the link
            if (offset > lastIndex) {
              parts.push({
                text: text.slice(lastIndex, offset),
                isLink: false,
              });
            }
            // Push the link
            parts.push({ text: match, isLink: true });
            lastIndex = offset + match.length;
            return match;
          });

          // Push the remaining text after the last link
          if (lastIndex < text.length) {
            parts.push({ text: text.slice(lastIndex), isLink: false });
          }

          return parts;
        };

        const segments = processText(item.text);

        return (
          <View
            style={[
              isMyMessage(item)
                ? {
                    borderTopEndRadius: 20,
                    borderTopStartRadius: 20,
                    borderBottomLeftRadius: 20,
                    backgroundColor: Colors.dark.primary,
                  }
                : {
                    borderTopEndRadius: 20,
                    borderTopStartRadius: 20,
                    borderBottomRightRadius: 20,
                    backgroundColor: "#ffffff",
                  },
              styles.messageContain,
            ]}
          >
            <Text style={styles.messageText}>
              {segments.map((segment, index) => (
                <Text
                  key={index}
                  style={segment.isLink ? styles.linkText : styles.nonLinkText}
                  onPress={() => {
                    if (segment.isLink) {
                      const formattedUrl = formatUrl(segment.text);
                      Linking.openURL(formattedUrl).catch((err) => {
                        console.error("Failed to open URL:", err);
                        alert("Failed to open URL. Please check the link.");
                      });
                    }
                  }}
                >
                  {segment.text}
                </Text>
              ))}
            </Text>
            <Text
              style={[
                styles.messageTime,
                isMyMessage(item)
                  ? styles.myMessageTime
                  : styles.otherMessageTime,
              ]}
            >
              {dayjs(item.createdAt).format("h:mm A")}
            </Text>
          </View>
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
                isMyMessage(item)
                  ? styles.myMessageTime
                  : styles.otherMessageTime,
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

  const typingTimeoutRef = useRef(null);

  const handleTextChange = (text) => {
    newMessageRef.current = text;

    // Define domain suffix pattern to identify domain suffixes
    const domainSuffixPattern =
      /(\b[a-zA-Z0-9.-]+)\.(com|net|org|co|io|me|tv|biz|info)\b/i;

    // Find all domain suffix matches in the text
    const match = text.match(domainSuffixPattern);

    let detectedLinks = [];

    if (match) {
      // Extract the domain with the suffix
      const domainWithSuffix = match[0];

      // Ensure the URL is correctly formatted
      const formattedUrl = formatUrl(domainWithSuffix);

      // Fetch metadata for the formatted URL
      fetchLinkMetadata(formattedUrl).catch((error) => {
        console.error("Error fetching link metadata:", error);
      });

      // Extract the domain with the suffix
      detectedLinks = match.map((domainWithSuffix) =>
        formatUrl(domainWithSuffix)
      );
    } else {
      setLinkMetadata(null);
    }

    // Store detected links in the ref
    domainLinksRef.current = detectedLinks;

    // Update typing state
    if (text.length > 0) {
      setTyping(true);
      setTypingText(true);
    } else if (typing) {
      setTyping(false);
      setTypingText(false);
    }

    // Handle typing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      setTypingText(false);
    }, 10000); // 10 seconds
  };

  // Helper function to format URLs
  const formatUrl = (url) => {
    // Ensure the URL starts with http or https
    if (!/^https?:\/\//i.test(url)) {
      url = `https://${url}`;
    }
    return url;
  };

  const bottomSheetRef = useRef(null);

  const { height } = Dimensions.get("window");

  const sheetHeight = useRef(new Animated.Value(0)).current;
  const bottomSheetOpenRef = useRef(false);

  const openSheet = () => {
    Animated.timing(sheetHeight, {
      toValue: hp("40%"), // Desired height when the sheet is open
      isInteraction: true,
      useNativeDriver: false,
      duration: 400,
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

  // useEffect(() => {
  //   const keyboardDidShowListener = Keyboard.addListener(
  //     "keyboardDidShow",
  //     () => {
  //       openSheet();
  //     }
  //   );

  //   // Clean up the listener on unmount
  //   return () => {
  //     keyboardDidShowListener.remove();
  //   };
  // }, []);

  return (
    <>
      <View style={{ overflow: "hidden" }}>
        <LinearGradient colors={["#ece9e6", "#059ff2"]}>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{ height: "100%" }}
            keyboardVerticalOffset={-70}
          >
            <View style={[styles.flashListContainer]}>
              <FlatList
                estimatedItemSize={300}
                ref={flatListRef}
                keyboardDismissMode="interactive"
                data={groupedMessagesArray}
                contentContainerStyle={{
                  paddingTop: hp("20%"),
                  paddingBottom: hp("15%"),
                }}
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
                ListHeaderComponent={() => {}}
                inverted
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
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: 25,
                        marginRight: 10,
                      }}
                    />
                    <View style={{}}>
                      <Text style={styles.headerTitle}>{sender}</Text>
                      {typingText && <Text>Typing ...</Text>}
                    </View>
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

              <BlurView
                intensity={400}
                tint="light"
                style={[styles.inputContainer]}
              >
                <View>
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

                  {linkMetadata && (
                    <View style={styles.linkMetadataContainer}>
                      <View>
                        {linkMetadata.image && (
                          <Image
                            source={{ uri: linkMetadata.image }}
                            style={[
                              styles.linkMetadataImage,
                              {
                                width: 50,
                                height: 50,
                                resizeMode: "contain",
                              },
                            ]}
                          />
                        )}
                      </View>
                      <View style={{ width: "75%" }}>
                        {linkMetadata.title && (
                          <Text
                            style={[styles.linkMetadataTitle]}
                            ellipsizeMode="tail"
                            numberOfLines={1}
                          >
                            {linkMetadata.title}
                          </Text>
                        )}
                        {linkMetadata.description && (
                          <View style={styles.linkMetadatadescription}>
                            <Text ellipsizeMode="tail" numberOfLines={1}>
                              {linkMetadata.description}
                            </Text>
                          </View>
                        )}
                      </View>
                      <View
                        style={{
                          flex: 1,

                          alignItems: "flex-end",
                        }}
                      >
                        <Pressable
                          style={styles.linkMetaDataCancel}
                          onPress={() => setLinkMetadata(null)}
                        >
                          <X color={"gray"} size={20} />
                        </Pressable>
                      </View>
                    </View>
                  )}
                  {isRecordingPreview && (
                    <FinishedRecording
                      meteringData={audioMeteringRef.current}
                    />
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
                  <View style={styles.textInput}>
                    {isRecording ? (
                      <View style={styles.recordingWaveLine}>
                        <FlatList
                          data={[...meteringValues].reverse()}
                          horizontal
                          keyExtractor={(item, index) => index.toString()}
                          contentContainerStyle={{
                            alignItems: "center",
                          }}
                          renderItem={({ item }) => (
                            <Animated.View
                              style={[
                                styles.line,
                                {
                                  height: item * 30, // Adjust height based on metering scale
                                  transform: [{ scaleY: item }],
                                  borderRadius: 100,
                                },
                              ]}
                            />
                          )}
                          inverted // Makes the waveform grow from left to right
                        />
                      </View>
                    ) : (
                      <TextInput
                        ref={textInputRef}
                        value={newMessageRef}
                        onChangeText={handleTextChange}
                        placeholder="Type a message"
                        multiline={true}
                        onFocus={() => {
                          {
                            Platform.OS === "ios" && openSheet();
                          }
                        }}
                        autoCorrect
                      />
                    )}
                  </View>

                  {!typing && (
                    // <GestureDetector gesture={longPress}>
                    <>
                      {isRecording ? (
                        <Pressable
                          style={styles.micIcon}
                          onPress={stopRecording}
                        >
                          <Ionicons
                            name="mic"
                            size={20}
                            color={Colors.light.background}
                          />
                        </Pressable>
                      ) : (
                        <Pressable
                          style={styles.micIcon}
                          // onPressOut={stopRecording}
                          // onLongPress={StartRecording}
                          onPress={StartRecording}
                        >
                          <Ionicons
                            name="mic"
                            size={20}
                            color={Colors.light.background}
                          />
                        </Pressable>
                      )}
                    </>
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
              {/* </KeyboardAvoidingView> */}
            </View>
          </KeyboardAvoidingView>
          {/* {isRecording && (
            <View intensity={20} style={styles.absolute}>
              <LottieView
                ref={lottieRef}
                source={require("@/assets/lottie/soundwaveprimary.json")}
                autoPlay
                loop
                style={styles.lottie}
              />
            </View>
          )} */}
        </LinearGradient>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  safeArea: {},

  flashListContainer: { height: "120%" },
  inputContainer: {
    flexDirection: "row",
    padding: 5,
    flexDirection: "column",
    width: "100%",
    zIndex: 1000,
    paddingBottom: hp(5),
    transform: [{ translateY: -150 }],
  },
  recordingWaveLine: { height: 20, borderRadius: 30 },
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
  messageContain: {
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
    padding: 10,
  },
  nonLinkText: {
    fontSize: 16,
  },
  linkText: {
    fontSize: 16,
    color: "blue",
    textDecorationLine: "underline",
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

  linkMetadataContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
  },
  linkMetadataImage: {
    marginLeft: -10,
    marginRight: 10,
  },
  linkMetadataTitle: {
    fontWeight: "bold",
    fontSize: hp(2),
  },
  linkMetadatadescription: {
    alignSelf: "flex-start",
    fontSize: hp(1),
  },
  linkMetaDataCancel: {
    height: 25,
    width: 25,
    backgroundColor: "lightgrey",
    borderRadius: 20,
    fontSize: 15,
    alignItems: "center",
    justifyContent: "center",
    left: 5,
  },
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
    alignItems: "center",
  },
  backButton: {
    padding: 5,
  },
  headerTitleContainer: {},
  headerTitle: {
    fontSize: 25,
    fontWeight: "bold",
    color: Colors.light.text,
    fontFamily: "PoppinsSemiBold",
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
    backgroundColor: "black",
    // To ensure smooth animation
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
    top: -100,
  },
  sheetContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  line: {
    width: 2.5,
    backgroundColor: "lightgray",
    marginHorizontal: 1,
    boarderRadius: 100,
  },
  waveContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
  },
  waveLine: {
    flexDirection: "row",
    width: 3,
    marginHorizontal: 1,
    borderRadius: 2,
  },
});

export default ChatRoom;
