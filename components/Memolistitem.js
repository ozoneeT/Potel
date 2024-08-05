import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { Audio } from "expo-av";
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedStyle,
} from "react-native-reanimated";
import { Colors } from "@/constants/Colors";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { heightPercentageToDP } from "react-native-responsive-screen";
dayjs.extend(relativeTime);

const MemoListItem = ({ memo }) => {
  const [sound, setSound] = useState(null);
  const [status, setStatus] = useState(null);

  const loadSound = useCallback(async () => {
    try {
      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: memo.uri },
        { shouldPlay: false },
        onPlaybackStatusUpdate
      );
      setSound(newSound);
    } catch (error) {
      console.error("Error loading sound:", error);
    }
  }, [memo.uri]);

  const onPlaybackStatusUpdate = useCallback(
    async (newStatus) => {
      setStatus(newStatus);

      if (!newStatus.isLoaded || !sound) {
        return;
      }

      if (newStatus.didJustFinish) {
        await sound.setPositionAsync(0);
        setStatus({ ...newStatus, isPlaying: false });
      }
    },
    [sound]
  );

  useEffect(() => {
    loadSound();

    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [loadSound, memo]);

  const playSound = async () => {
    if (!sound) {
      return;
    }

    if (status?.isLoaded && status.isPlaying) {
      await sound.pauseAsync();
    } else {
      await sound.replayAsync();
    }
  };

  useEffect(() => {
    return sound
      ? () => {
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  const formatMillis = (millis) => {
    const minutes = Math.floor(millis / (1000 * 60));
    const seconds = Math.floor((millis % (1000 * 60)) / 1000);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  const isPlaying = status?.isLoaded ? status.isPlaying : false;
  const position = status?.isLoaded ? status.positionMillis : 0;
  const duration = status?.isLoaded ? status.durationMillis : 1;
  const progress = position / duration;

  const animatedIndicatorStyle = useAnimatedStyle(() => ({
    left: `${progress * 100}%`,
  }));

  const numLines = 35;
  const lines = [];

  if (memo.metering && memo.metering.length > 0) {
    for (let i = 0; i < numLines; i++) {
      const meteringIndex = Math.floor((i * memo.metering.length) / numLines);
      const nextMeteringIndex = Math.ceil(
        ((i + 1) * memo.metering.length) / numLines
      );
      const values = memo.metering.slice(meteringIndex, nextMeteringIndex);
      const average = values.reduce((sum, a) => sum + a, 0) / values.length;
      lines.push(average);
    }
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={playSound} style={{ padding: 5 }}>
        <FontAwesome5
          onPress={playSound}
          name={isPlaying ? "pause" : "play"}
          size={20}
          color={"gray"}
        />
      </TouchableOpacity>

      <View style={styles.playbackContainer}>
        <View style={styles.wave}>
          {lines.map((db, index) => (
            <View
              key={index}
              style={[
                styles.waveLine,
                {
                  height: interpolate(
                    db,
                    [heightPercentageToDP(Platform.OS === "ios" ? -4 : -30), 0],
                    [5, 50],
                    Extrapolate.CLAMP
                  ),
                  borderColor:
                    progress > index / lines.length
                      ? Colors.light.primary
                      : "gainsboro",
                  backgroundColor:
                    progress > index / lines.length
                      ? Colors.light.primary
                      : "gainsboro",
                },
              ]}
            />
          ))}
        </View>

        <Text
          style={{
            position: "absolute",
            left: 0,
            bottom: 5,
            color: "gray",
            fontFamily: "Inter",
            fontSize: 12,
          }}
        >
          {formatMillis(position)} / {formatMillis(duration)}
        </Text>
        <Text
          style={{
            position: "absolute",
            right: 0,
            bottom: 5,
            color: "gray",
            fontFamily: "Inter",
            fontSize: 12,
          }}
        >
          {dayjs(memo.createdAt).format("h:mm A")}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    margin: 5,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    borderRadius: 10,
    gap: 15,

    // shadow
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,

    elevation: 3,
  },

  playbackContainer: {
    flex: 1,
    height: 80,
    justifyContent: "center",
  },
  playbackBackground: {
    height: 3,
    backgroundColor: "gainsboro",
    borderRadius: 5,
  },
  playbackIndicator: {
    width: 10,
    aspectRatio: 1,
    borderRadius: 10,
    backgroundColor: "royalblue",
    position: "absolute",
  },

  wave: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
  },
  waveLine: {
    flex: 1,
    height: 30,
    backgroundColor: "gainsboro",
    borderRadius: 20,
    borderWidth: 1,
  },
});

export default MemoListItem;
