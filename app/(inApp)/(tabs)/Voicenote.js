import { Audio } from "expo-av";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import {
  Button,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function App() {
  const [recordings, setRecordings] = useState([]);
  const [recording, setRecording] = useState(null);
  const [recordingName, setRecordingName] = useState("");
  const [playing, setPlaying] = useState(-1);
  const [sound, setSound] = useState(null);
  const [isDialogVisible, setDialogVisible] = useState(false);

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
      audio = recording;
      setRecording(recording);
    } catch (err) {
      console.error("Failed to start recording", err);
    }
  }
  async function stopRecording() {
    await recording.stopAndUnloadAsync();
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
    });
    setDialogVisible(true);
  }
  const handleSaveRecording = () => {
    if (recordingName.trim() !== "") {
      setRecordings([
        ...recordings,
        {
          name: recordingName,
          recording: recording,
        },
      ]);
      setRecording(undefined);
      setDialogVisible(false);
      setRecordingName("");
    }
  };
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
      <StatusBar style="auto" />
      <Text style={styles.heading}>Welcome to GeeksforGeeks</Text>

      <Modal
        visible={isDialogVisible}
        animationType="slide"
        style={styles.modal}
      >
        <View style={styles.column}>
          <Text>Enter Recording Name:</Text>
          <TextInput
            style={{
              height: 40,
              borderColor: "gray",
              borderWidth: 1,
              marginBottom: 10,
              padding: 10,
              width: 200,
              borderRadius: 20,
            }}
            onChangeText={(text) => setRecordingName(text)}
            value={recordingName}
          />
          <Pressable style={styles.button} onPress={handleSaveRecording}>
            <Text>Save</Text>
          </Pressable>
          <Pressable
            style={styles.button}
            onPress={() => setDialogVisible(false)}
          >
            <Text>Cancel</Text>
          </Pressable>
        </View>
      </Modal>
      <View style={styles.list}>
        {recordings.map((recording, index) => {
          return (
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
          );
        })}
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
        <Pressable
          style={styles.button}
          onPress={recording ? stopRecording : startRecording}
        >
          <Text
            style={{
              textAlign: "center",
            }}
          >
            {recording ? "Stop Recording" : "Start Recording"}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

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
  column: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
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
