import {
  Button,
  Pressable,
  StyleSheet,
  Switch,
  Text,
  View,
} from "react-native";
import React from "react";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import { ExpandableSection } from "react-native-ui-lib";
import { useState } from "react";
import { Platform } from "react-native";
import * as Haptics from "expo-haptics";
import DateTimePicker from "@react-native-community/datetimepicker";
import AnalogClock from "@/components/AnalogClock";
import {
  setRemindingTime,
  setReminderEnabled,
} from "@/hooks/reducers/taskSlice";
import { useDispatch, useSelector } from "react-redux";
import { useNavigation, useRouter } from "expo-router";

const Reminder = () => {
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [selectedTime, setSelectedTime] = useState(new Date());
  const remindingTime = useSelector((state) => state.task.remindingTime);
  const reminderEnabled = useSelector((state) => state.task.reminderEnabled);
  const dispatch = useDispatch();

  const toggleSwitch = () => {
    dispatch(setReminderEnabled(!reminderEnabled));
    if (!reminderEnabled) {
      setDatePickerVisibility(true);
    } else {
      setDatePickerVisibility(false);
    }
  };

  const handleDateChange = (event, date) => {
    const selectedDate = date || selectedTime;
    setDatePickerVisibility(false);
    setSelectedTime(selectedDate);
    const formattedTime = formatTime(selectedDate);
    dispatch(setRemindingTime(formattedTime));
  };

  const formatTime = (date) => {
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    const strMinutes = minutes < 10 ? "0" + minutes : minutes;
    return hours + ":" + strMinutes + " " + ampm;
  };

  const router = useNavigation();

  return (
    <View>
      <View style={styles.Header}>
        <Pressable
          onPress={() => router.goBack()}
          style={{ padding: 10, zIndex: 10 }}
        >
          <AntDesign name="back" size={25} color="black" />
        </Pressable>
        <View style={{ alignItems: "center", flex: 1, marginLeft: -50 }}>
          {reminderEnabled ? (
            <Text
              style={{
                fontSize: 25,
                color: "black",
                top: 30,
                fontWeight: "bold",
              }}
            >
              Remind me at {remindingTime}
            </Text>
          ) : (
            <Text
              style={{
                fontSize: 25,
                color: "black",
                top: 30,
                fontWeight: "bold",
              }}
            >
              No Reminder
            </Text>
          )}
        </View>
      </View>
      <View style={styles.timeContainer}>
        <View style={styles.reminderToggle}>
          <Ionicons name="notifications" size={24} color="black" />
          <View style={{ marginLeft: -25 }}>
            <Text>Reminder</Text>
            <Text>Set a specific time of remind me</Text>
          </View>
          <Switch
            trackColor={{ false: "#dad9da", true: "green" }}
            thumbColor={reminderEnabled ? "#e9e9e9" : "#f4f3f4"}
            ios_backgroundColor="#dad9da"
            onValueChange={toggleSwitch}
            value={reminderEnabled}
            style={
              Platform.OS === "ios" && {
                transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }],
              }
            }
          />
        </View>
        <ExpandableSection
          top
          expanded={reminderEnabled}
          onPress={() => {
            setDatePickerVisibility(true);
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          }}
        >
          <View>
            {Platform.OS === "ios" ? (
              <DateTimePicker
                value={selectedTime}
                mode="time"
                display="spinner"
                onChange={handleDateChange}
                style={styles.datePicker}
              />
            ) : isDatePickerVisible ? (
              <>
                <DateTimePicker
                  value={selectedTime}
                  mode="time"
                  display="spinner"
                  onChange={handleDateChange}
                  style={styles.datePicker}
                />
              </>
            ) : (
              <Pressable onPress={() => setDatePickerVisibility(true)}>
                <AnalogClock
                  hours={selectedTime.getHours()}
                  minutes={selectedTime.getMinutes()}
                />
              </Pressable>
            )}
          </View>
        </ExpandableSection>
      </View>
    </View>
  );
};

export default Reminder;

const styles = StyleSheet.create({
  Header: {
    flexDirection: "row",
    marginHorizontal: 20,
    marginVertical: 30,
    alignItems: "center",
    width: "100%",
  },
  timeContainer: {
    marginTop: 40,
  },
  reminderToggle: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  label: {
    fontSize: 18,
    marginBottom: 8,
  },
  picker: {
    width: "100%",
    backgroundColor: "white",
    borderRadius: 8,
  },
  selectedDate: {
    marginTop: 16,
    fontSize: 16,
  },
  datePicker: {
    marginVertical: 40,
  },
});
