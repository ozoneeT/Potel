// VoiceMessage.js

import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Audio } from "expo-av";
import Ionicons from "@expo/vector-icons/Ionicons";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

const VoiceMessage = ({ message, onDelete }) => {
  const [sound, setSound] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(null);

  useEffect(() => {
    // Calculate the duration when the component mounts
    const loadSound = async () => {
      const { sound } = await Audio.Sound.createAsync({ uri: message.uri });
      const status = await sound.getStatusAsync();
      setDuration(status.durationMillis / 1000);
      setSound(sound);
    };

    loadSound();
  }, [message.uri]);

  const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes < 10 ? "0" : ""}${minutes}:${
      remainingSeconds < 10 ? "0" : ""
    }${remainingSeconds}`;
  };

  const handlePlayPause = async () => {
    if (isPlaying) {
      await sound.pauseAsync();
      setIsPlaying(false);
    } else {
      await sound.playFromPositionAsync(0);
      setIsPlaying(true);

      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.didJustFinish) {
          setIsPlaying(false);
          sound.setPositionAsync(0); // Reset the playback position to the beginning
        }
      });
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handlePlayPause} style={styles.playButton}>
        <Ionicons name={isPlaying ? "pause" : "play"} size={24} color="white" />
      </TouchableOpacity>
      <View>
        <Text style={styles.messageText}>{formatDuration(duration)}</Text>
      </View>
      {/* <Text>{dayjs(message.createdAt).format("h:mm A")}</Text> */}
      <TouchableOpacity
        onPress={() => onDelete(message.id)}
        style={styles.deleteButton}
      >
        <Ionicons name="trash" size={24} color="red" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#ECECEC",
    borderRadius: 10,
    marginVertical: 5,
  },
  playButton: {
    marginRight: 10,
    backgroundColor: "green",
    padding: 10,
    borderRadius: 50,
  },

  deleteButton: {
    marginLeft: 10,
  },
});

export default VoiceMessage;
