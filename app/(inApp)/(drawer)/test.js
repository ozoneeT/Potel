import React, { useState, useRef, useEffect } from "react";
import { View, Button, StyleSheet, Animated } from "react-native";
import { Audio } from "expo-av";
import Svg, { Path } from "react-native-svg";

const VoiceNote = () => {
  const [recording, setRecording] = useState(null);
  const [sound, setSound] = useState(null);
  const [waveData, setWaveData] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [circleSize, setCircleSize] = useState(1);
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (sound) {
      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded) {
          setPlaybackPosition(status.positionMillis);
        }
      });
    }
  }, [sound]);

  const startRecording = async () => {
    try {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });
      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      setRecording(recording);
    } catch (error) {
      console.error("Error starting recording", error);
    }
  };

  const stopRecording = async () => {
    if (recording) {
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      setRecording(null);

      const { sound } = await Audio.Sound.createAsync({ uri });
      setSound(sound);
    }
  };

  const playPause = async () => {
    if (!sound) return;
    const status = await sound.getStatusAsync();
    if (status.isPlaying) {
      await sound.pauseAsync();
    } else {
      await sound.playAsync();
    }
    setIsPlaying(!status.isPlaying);
  };

  const updateCircleSize = (pitch) => {
    const scale = 1 + pitch / 1000;
    Animated.timing(scaleAnim, {
      toValue: scale,
      duration: 100,
      useNativeDriver: true,
    }).start();
  };

  const renderCircle = () => (
    <Animated.View
      style={[
        styles.circle,
        {
          transform: [{ scale: scaleAnim }],
        },
      ]}
    />
  );

  const renderWaveLine = () => {
    const pathData = generateWaveformPath(waveData);
    return (
      <Svg height="100" width="300">
        <Path d={pathData} fill="none" stroke="black" strokeWidth="2" />
      </Svg>
    );
  };

  const generateWaveformPath = (waveData) => {
    let path = "M0,50";
    waveData.forEach((point, index) => {
      path += `L${index * 10},${50 - point}`;
    });
    path += `L${waveData.length * 10},50`;
    return path;
  };

  return (
    <View style={styles.container}>
      <Button
        title={recording ? "Stop Recording" : "Start Recording"}
        onPress={recording ? stopRecording : startRecording}
      />
      <Button title={isPlaying ? "Pause" : "Play"} onPress={playPause} />
      {renderCircle()}
      <View style={styles.waveContainer}>{renderWaveLine()}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  circle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "blue",
  },
  waveContainer: {
    width: 300,
    height: 100,
    backgroundColor: "#f0f0f0",
  },
});

export default VoiceNote;
