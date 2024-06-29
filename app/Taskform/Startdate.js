// components/StartDate.js
import React, { useState } from "react";
import { StyleSheet, Text, View, Pressable } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useDispatch, useSelector } from "react-redux";
import { setStartDate } from "../../hooks/reducers/taskSlice";

const StartDate = () => {
  const [datePickerVisible, setDatePickerVisible] = useState(true);
  const startDate = useSelector((state) => state.task.startDate);
  const dispatch = useDispatch();

  const handleDateChange = (event, selectedDate) => {
    if (event.type === "set") {
      const formattedDate = format(selectedDate, "yyyy-MM-dd");
      dispatch(setStartDate(formattedDate));
    }
    setDatePickerVisible(false);
  };

  const displayDate = () => {
    const date = new Date(startDate);
    if (isToday(date)) return "Today";
    if (isYesterday(date)) return "Yesterday";
    if (isTomorrow(date)) return "Tomorrow";
    return format(date, "EEEE, MMMM d, yyyy");
  };

  return (
    <View style={styles.container}>
      <Pressable onPress={() => setDatePickerVisible(true)}>
        <Text style={styles.dateText}>{displayDate()}</Text>
      </Pressable>
      {datePickerVisible && (
        <DateTimePicker
          value={new Date(startDate)}
          mode="date"
          display="default"
          onChange={handleDateChange}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  dateText: {
    fontSize: 18,
    color: "black",
  },
});

export default StartDate;
