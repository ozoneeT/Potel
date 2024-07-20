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
  TouchableOpacity,
  Keyboard,
  Alert,
  ActivityIndicator,
  ScrollView,
  Button,
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
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
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
import cheerio from "cheerio";
import { useMemo } from "react";
import * as MediaLibrary from "expo-media-library";
import * as FileSystem from "expo-file-system";
import { Picker } from "@react-native-picker/picker";
import { Audio } from "expo-av";

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
    setNewMessage(text);

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

  const [hasPermission, setHasPermission] = useState(null);
  const [albums, setAlbums] = useState([]);
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [photoUris, setPhotoUris] = useState([]);
  const [loading, setLoading] = useState(false);
  const bottomSheetRef = useRef(null);

  const snapPoints = useMemo(() => ["25%", "50%", "100%"], []);

  // Function to request permissions
  const requestPermissions = async () => {
    const { status } = await MediaLibrary.requestPermissionsAsync();
    if (status === "granted") {
      setHasPermission(true);
      fetchAlbums();
    } else {
      setHasPermission(false);
      Alert.alert(
        "Permission Required",
        "Permission to access photos is required. Please grant permission in your device settings.",
        [
          { text: "Retry", onPress: requestPermissions },
          { text: "Cancel", onPress: () => console.log("Permission denied") },
        ]
      );
    }
  };

  const fetchAlbums = async () => {
    try {
      const albums = await MediaLibrary.getAlbumsAsync({
        includeSmartAlbums: true,
      });
      setAlbums(albums);
      if (albums.length > 0) {
        setSelectedAlbum(albums[0].id); // Set the album ID instead of the whole album object
      }
    } catch (error) {
      console.error("Error fetching albums:", error);
    }
  };

  const fetchPhotos = async (albumId) => {
    setLoading(true);
    try {
      let allPhotos = [];
      let hasNextPage = true;
      let cursor = null;

      while (hasNextPage) {
        const {
          assets,
          endCursor,
          hasNextPage: morePages,
        } = await MediaLibrary.getAssetsAsync({
          mediaType: "photo",
          album: albumId,
          first: 100,
          after: cursor,
        });
        allPhotos = [...allPhotos, ...assets];
        cursor = endCursor;
        hasNextPage = morePages;
      }

      setPhotos(allPhotos);
    } catch (error) {
      console.error("Error fetching photos:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    requestPermissions();
  }, []);

  useEffect(() => {
    if (selectedAlbum) {
      fetchPhotos(selectedAlbum);
    }
  }, [selectedAlbum]);

  useEffect(() => {
    (async () => {
      if (photos.length > 0) {
        try {
          const uris = await Promise.all(
            photos.map(async (photo) => {
              const info = await MediaLibrary.getAssetInfoAsync(photo.id);
              return info.localUri || info.uri;
            })
          );
          setPhotoUris(uris);
        } catch (error) {
          console.error("Error fetching photo URIs:", error);
        }
      }
    })();
  }, [photos]);

  const handleOpenPress = () => {
    bottomSheetRef.current?.expand();
  };

  const renderItem = ({ item }) => (
    <Image source={{ uri: item }} style={styles.imageGallery} />
  );

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
            <TouchableOpacity style={{ padding: 5 }} onPress={handleOpenPress}>
              <Ionicons name="attach" size={24} color="black" />
            </TouchableOpacity>
            <TextInput
              ref={textInputRef}
              style={styles.textInput}
              value={newMessage}
              onChangeText={handleTextChange}
              placeholder="Type a message"
            />

            {!typing && (
              <Pressable style={styles.micIcon}>
                <Ionicons
                  name="mic"
                  size={20}
                  color={Colors.light.background}
                />
              </Pressable>
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
                {hasPermission === null ? (
                  <Text>Requesting permission...</Text>
                ) : hasPermission === false ? (
                  <Text>
                    Permission denied. Please grant permission to access photos.
                  </Text>
                ) : (
                  <>
                    <Picker
                      selectedValue={selectedAlbum}
                      onValueChange={(itemValue) => setSelectedAlbum(itemValue)}
                    >
                      {albums.map((album) => (
                        <Picker.Item
                          key={album.id}
                          label={album.title}
                          value={album.id}
                        />
                      ))}
                    </Picker>
                    {loading ? (
                      <ActivityIndicator size="large" color="#0000ff" />
                    ) : (
                      <FlatList
                        data={photoUris}
                        keyExtractor={(item) => item}
                        renderItem={renderItem}
                        numColumns={4}
                        initialNumToRender={50}
                        onEndReachedThreshold={0.5}
                        ListFooterComponent={loading && <ActivityIndicator />}
                      />
                    )}
                  </>
                )}
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
    alignItems: "center",
    paddingBottom: heightPercentageToDP(4),
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
  micIcon: {
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
  imageGallery: { width: 100, height: 100 },
  photoContainer: { height: "100%" },
});

export default ChatRoom;
