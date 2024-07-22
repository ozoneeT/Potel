// VoiceNote.js

import React, { useState, useEffect } from "react";
import { Audio } from "expo-av";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

const VoiceNote = () => {
  const [recordings, setRecordings] = useState([]);
  const [recording, setRecording] = useState(null);
  const [playing, setPlaying] = useState(-1);
  const [sound, setSound] = useState(null);

  async function startRecording() {
    try {
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      let { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      setRecording(recording);
    } catch (err) {
      console.error("Failed to start recording", err);
    }
  }

  async function stopRecording() {
    try {
      await recording.stopAndUnloadAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
      });

      const uri = recording.getURI();
      console.log("Recording URI: ", uri);

      setRecordings([
        ...recordings,
        {
          name: `Recording ${recordings.length + 1}`,
          recording: recording,
        },
      ]);

      setRecording(null);
      // Add code here to send the voice note
    } catch (err) {
      console.error("Failed to stop recording", err);
    }
  }

  useEffect(() => {
    return sound
      ? () => {
          sound.unloadAsync();
          console.log("Unloaded Sound");
        }
      : undefined;
  }, [sound]);

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Voice Note Component</Text>
      <View style={styles.list}>
        {recordings.map((recording, index) => (
          <View key={index}>
            <TouchableOpacity
              onPress={async () => {
                const { sound } =
                  await recording.recording.createNewLoadedSoundAsync(
                    {
                      isLooping: false,
                      isMuted: false,
                      volume: 1.0,
                      rate: 1.0,
                      shouldCorrectPitch: true,
                    },
                    (status) => {
                      // console.log(status)
                    },
                    false
                  );
                setSound(sound);
                setPlaying(index);
                await sound.playAsync();
                await sound.setOnPlaybackStatusUpdate(async (status) => {
                  if (status.didJustFinish) {
                    setPlaying(-1);
                    await sound.unloadAsync();
                  }
                });
              }}
              style={styles.playButton}
            >
              <Ionicons
                name={playing !== index ? "play" : "pause"}
                size={30}
                color="white"
              >
                <Text style={styles.recordingName}>{recording.name}</Text>
              </Ionicons>

              <Ionicons
                name="trash"
                size={30}
                color="white"
                onPress={() => {
                  setRecordings(recordings.filter((rec, i) => i !== index));
                }}
              />
            </TouchableOpacity>
          </View>
        ))}
      </View>
      <View
        style={{
          flex: 1,
          flexDirection: "row",
          justifyContent: "center",
          alignSelf: "center",
          bottom: 100,
          position: "absolute",
          padding: 10,
        }}
      >
        <TouchableOpacity
          style={styles.button}
          onLongPress={startRecording}
          onPressOut={stopRecording}
        >
          <Text
            style={{
              textAlign: "center",
            }}
          >
            {recording ? "Stop Recording" : "Start Recording"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    justifyContent: "space-evenly",
  },
  container: {
    backgroundColor: "#fff",
    height: "100%",
    marginTop: 50,
  },
  contentContainer: {
    flex: 1,
  },
  heading: {
    color: "green",
    fontSize: 30,
    textAlign: "center",
    fontWeight: "bold",
  },
  list: {
    marginTop: 20,
    flex: 1,
    flexDirection: "column",
  },
  modal: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    alignItems: "center",
    backgroundColor: "#DDDDDD",
    padding: 10,
    marginTop: 10,
    borderRadius: 20,
    width: 100,
    height: 40,
  },
  recordingName: {
    fontSize: 18,
    color: "white",
    fontWeight: "bold",
  },
  playButton: {
    backgroundColor: "gray",
    borderRadius: 50,
    padding: 10,
    margin: 10,
    flexDirection: "row",
    justifyContent: "space-between",
  },
});

export default VoiceNote;
