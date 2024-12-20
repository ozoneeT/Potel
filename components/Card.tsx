import React, { useState } from "react";
import { View, Text, StyleSheet, Image, Pressable } from "react-native";
import Animated, {
  clamp,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import {
  Flag,
  FlagOff,
  LucideIcon,
  MessageCircle,
  MessageCircleOff,
  Star,
  StarOff,
} from "lucide-react-native";
import { snapPoint } from "react-native-redash";
import { Action } from "./Action";
import { LIGHT_SPRING_CONFIG, MEDIUM_SPRING_CONFIG } from "@/constants/spring";
export type TAction = {
  id: string;
  Icon: LucideIcon;
  ActiveIcon: LucideIcon;
  color: string;
};
const AnimatedImage = Animated.createAnimatedComponent(Image);
import { Colors } from "@/constants/Colors";

const ACTIONS = [
  { id: "star", Icon: Star, ActiveIcon: StarOff, color: "orange" },
  { id: "bookmark", Icon: Flag, ActiveIcon: FlagOff, color: "red" },
  {
    id: "message",
    Icon: MessageCircle,
    ActiveIcon: MessageCircleOff,
    color: "green",
  },
];

const Card = ({ cardText, cardImage, cardHeadline, cardTime }) => {
  const translateX = useSharedValue(0);
  const [selectedAction, setSelectedAction] = useState<null | TAction>(null);

  const gesture = Gesture.Pan()

    .onChange((event) => {
      translateX.value = clamp(translateX.value + event.changeX, -100, 0);
    })
    .onEnd((event) => {
      translateX.value = withSpring(
        snapPoint(
          event.translationX + translateX.value,
          event.velocityX,
          [0, -100]
        ),
        MEDIUM_SPRING_CONFIG
      );
    });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
    };
  });

  const imageAStyle = useAnimatedStyle(() => {
    const rotateZ = interpolate(translateX.value, [-90, 0], [-120, 30]);
    return {
      transform: [{ rotateZ: `${rotateZ}deg` }],
    };
  });

  const containerAStyle = useAnimatedStyle(() => {
    const tX = withSpring(translateX.value / 4, LIGHT_SPRING_CONFIG);
    return {
      transform: [
        {
          translateX: tX,
        },
      ],
    };
  });

  const handleActionPress = (item: TAction) => {
    translateX.value = withSpring(0, MEDIUM_SPRING_CONFIG);
    setSelectedAction(selectedAction?.id === item.id ? null : item);
  };

  const handleOnExpand = () => {
    translateX.value = withSpring(-100, MEDIUM_SPRING_CONFIG);
  };

  return (
    <Animated.View style={[styles.chatContainer, containerAStyle]}>
      <GestureDetector gesture={gesture}>
        <Animated.View style={[styles.card, animatedStyle]}>
          <View style={styles.movableContent}>
            {selectedAction ? (
              <selectedAction.Icon
                color={selectedAction.color}
                fill={selectedAction.color}
                size={30}
              />
            ) : (
              <View style={styles.chatImage}>
                <AnimatedImage
                  source={{ uri: cardImage }}
                  style={[
                    {
                      width: 50,
                      height: 50,
                      borderRadius: 25,
                      marginRight: 10,
                    },
                    imageAStyle,
                  ]}
                />
              </View>
            )}

            <View style={styles.chatMessage}>
              <Text style={{ fontWeight: "bold", fontSize: 17 }}>
                {cardHeadline}
              </Text>
              <Text numberOfLines={2} ellipsizeMode="tail">
                {cardText}
              </Text>
            </View>
            <View style={styles.chatTime}>
              <Text>{cardTime}</Text>
            </View>
          </View>
        </Animated.View>
      </GestureDetector>
      <View style={styles.stationaryContent}>
        <Pressable onPress={handleOnExpand} style={styles.actions}>
          {ACTIONS.map((action, index) => (
            <Action
              key={index}
              index={index}
              action={action}
              isActive={selectedAction?.id === action.id}
              onExpand={handleOnExpand}
              onPress={() => handleActionPress(action)}
              translateX={translateX}
            />
          ))}
        </Pressable>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  card: {
    backgroundColor: "#fff",
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  image: {
    width: 30,
    height: 30,
  },
  movableContent: {
    flexDirection: "row",
    flex: 1,
  },
  text: {
    fontSize: 16,
    color: "#333",
    fontWeight: "500",
    lineHeight: 24,
    marginLeft: 8,
  },
  stationaryContent: {
    padding: 16,
    alignItems: "flex-end",
    marginLeft: 16,
  },
  timeText: {
    fontSize: 12,
    color: "#999",
    marginBottom: 8,
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    columnGap: 4,
    position: "absolute",
    bottom: 20,
    zIndex: 40,
    right: 16,
  },
  action: {
    backgroundColor: "gray",
    width: 6,
    height: 6,
    borderRadius: 3,
    overflow: "hidden",
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

export default Card;
