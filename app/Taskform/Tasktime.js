import React, { useState } from "react";
import {
  View,
  Text,
  Pressable,
  Switch,
  StyleSheet,
  Platform,
} from "react-native";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import { useNavigation } from "expo-router";
import { ExpandableSection } from "react-native-ui-lib";
import DateTimePicker from "@react-native-community/datetimepicker";
import AnalogClock from "../../components/AnalogClock";
import * as Haptics from "expo-haptics";
import {
  setStarttime,
  setEndtime,
  setRemindingTimeEnabled,
  setTimeSegment,
} from "../../hooks/reducers/taskSlice";
import SegmentedControl from "@react-native-segmented-control/segmented-control";

const Tasktime = () => {
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [selectedTime, setSelectedTime] = useState(new Date());
  const [selectedEndTime, setSelectedEndTime] = useState(new Date());
  const startTime = useSelector((state) => state.task.taskTime);
  const endTime = useSelector((state) => state.task.endTime);
  const remindingTimeEnabled = useSelector(
    (state) => state.task.remindingTimeEnabled
  );
  const timeSegment = useSelector((state) => state.task.timeSegment);
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const toggleSwitch = () => {
    dispatch(setRemindingTimeEnabled(!remindingTimeEnabled));
    if (!remindingTimeEnabled) {
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
    dispatch(setStarttime(formattedTime));
  };

  const handleEndDateChange = (event, date) => {
    const selectedDate = date || selectedEndTime;
    setDatePickerVisibility(false);
    setSelectedEndTime(selectedEndTime);
    const formattedTime = formatTime(selectedDate);
    dispatch(setEndtime(formattedTime));
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

  const _onChange = (event) => {
    dispatch(setTimeSegment(event.nativeEvent.selectedSegmentIndex));
  };

  return (
    <View>
      <Pressable
        onPress={() => navigation.goBack()}
        style={{ padding: 10, zIndex: 10, margin: 10, marginTop: 20 }}
      >
        <AntDesign name="back" size={25} color="black" />
      </Pressable>
      <View style={styles.Header}>
        <View
          style={{
            alignItems: "center",
          }}
        >
          {remindingTimeEnabled ? (
            <>
              {timeSegment == 0 ? (
                <Text style={styles.title}>Remind me at {startTime}</Text>
              ) : (
                <>
                  <Text style={styles.title}>
                    Remind me From {startTime} To {endTime} of the Day
                  </Text>
                </>
              )}
            </>
          ) : (
            <Text style={styles.title}>Do it at any time of the day</Text>
          )}
        </View>
      </View>
      <View style={styles.timeContainer}>
        <View style={styles.reminderToggle}>
          <Ionicons name="notifications" size={24} color="black" />
          <View style={{ marginLeft: -25 }}>
            <Text>Reminder</Text>
            <Text>Set a specific time to remind me</Text>
          </View>
          <Switch
            trackColor={{ false: "#dad9da", true: "green" }}
            thumbColor={remindingTimeEnabled ? "#e9e9e9" : "#f4f3f4"}
            ios_backgroundColor="#dad9da"
            onValueChange={toggleSwitch}
            value={remindingTimeEnabled}
            style={
              Platform.OS === "ios" && {
                transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }],
              }
            }
          />
        </View>
        <ExpandableSection
          top
          expanded={remindingTimeEnabled}
          onPress={() => {
            setDatePickerVisibility(true);
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          }}
        >
          <View>
            <SegmentedControl
              values={["Point Time", "Time Period"]}
              selectedIndex={timeSegment}
              onChange={_onChange}
              style={{ width: "90%", alignSelf: "center", marginTop: 30 }}
            />
            {timeSegment === 0 ? (
              <DateTimePicker
                value={selectedTime}
                mode="time"
                display="spinner"
                onChange={handleDateChange}
                style={styles.datePicker}
              />
            ) : (
              <>
                <DateTimePicker
                  value={selectedTime}
                  mode="time"
                  display="spinner"
                  onChange={handleDateChange}
                  style={[styles.datePicker, { marginBottom: 0 }]}
                />
                <Text
                  style={{
                    alignSelf: "center",
                    fontSize: 18,
                    fontFamily: "MontserratMedium",
                  }}
                >
                  TO
                </Text>
                <DateTimePicker
                  value={selectedEndTime}
                  mode="time"
                  display="spinner"
                  onChange={handleEndDateChange}
                />
              </>
            )}
          </View>
        </ExpandableSection>
      </View>
    </View>
  );
};

export default Tasktime;

const styles = StyleSheet.create({
  Header: {
    width: "90%",
    alignSelf: "center",
    marginBottom: 20,
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
    marginVertical: 10,
  },
  title: {
    fontSize: 25,
    color: "gray",
    fontWeight: "bold",
    textAlign: "center",
  },
});
