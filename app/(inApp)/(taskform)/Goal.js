import React, { useMemo, useState } from "react";
import { View, StyleSheet, Text, Platform } from "react-native";
import { Picker } from "@react-native-picker/picker";
import {
  Incubator,
  WheelPicker,
  WheelPickerAlign,
  Colors,
  Typography,
  Button,
} from "react-native-ui-lib";
import { setRepeatOccurence } from "@/hooks/reducers/taskSlice";
import { useDispatch, useSelector } from "react-redux";

const IosPicker = () => {
  const dispatch = useDispatch();
  const pickerData = [
    Array.from({ length: 1000 }, (_, index) => (index + 1).toString()),
    [" times ", " min "],
    ["daily ", "weekly ", "monthly "],
  ];

  const repeatOccurence = useSelector((state) => state.task.repeatOccurence);

  const handlePickerChange = (value, index) => {
    const newrepeatOccurence = [...repeatOccurence];
    newrepeatOccurence[index] = value;
    dispatch(setRepeatOccurence(newrepeatOccurence));
  };

  return (
    <View style={styles.pickerContainer}>
      <Picker
        selectedValue={repeatOccurence[0]}
        onValueChange={(value) => handlePickerChange(value, 0)}
        style={[styles.picker, { width: 110 }]}
      >
        {pickerData[0].map((item) => (
          <Picker.Item key={item} label={item} value={item} />
        ))}
      </Picker>
      <Picker
        selectedValue={repeatOccurence[1]}
        onValueChange={(value) => handlePickerChange(value, 1)}
        style={[styles.picker, { width: 120 }]}
      >
        {pickerData[1].map((item) => (
          <Picker.Item key={item} label={item} value={item} />
        ))}
      </Picker>
      <Picker
        selectedValue={repeatOccurence[2]}
        onValueChange={(value) => handlePickerChange(value, 2)}
        style={[styles.picker, { width: 150 }]}
      >
        {pickerData[2].map((item) => (
          <Picker.Item key={item} label={item} value={item} />
        ))}
      </Picker>
    </View>
  );
};

import _ from "lodash";
const AndriodPicker = () => {
  const dispatch = useDispatch();

  const pickerData = useMemo(
    () => [
      Array.from({ length: 1000 }, (_, index) => ({
        label: (index + 1).toString(),
        value: (index + 1).toString(),
        align: WheelPickerAlign.RIGHT,
      })),
      [
        { label: "times", value: " times " },
        { label: "min", value: " min " },
      ],
      [
        { label: "Daily", value: "daily" },
        { label: "Weekly", value: "weekly" },
        { label: "Monthly", value: "monthly" },
      ],
    ],
    []
  );

  const repeatOccurence = useSelector((state) => state.task.repeatOccurence);

  const handleValueChange = (index, value) => {
    const updatedValues = [...repeatOccurence];
    updatedValues[index] = value;
    dispatch(setRepeatOccurence(updatedValues));
  };
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 20 }}>
        Wheel Picker
      </Text>

      <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
        {pickerData.map((data, index) => (
          <View key={index} style={{ alignItems: "center" }}>
            <Text style={{ fontSize: 16, marginBottom: 10 }}>
              Column {index + 1}
            </Text>
            <WheelPicker
              initialValue={repeatOccurence[index]}
              items={data}
              numberOfVisibleRows={3}
              onChange={(value) => handleValueChange(index, value)}
            />
          </View>
        ))}
      </View>
    </View>
  );
};
const Goal = () => {
  return (
    <View style={styles.container}>
      {Platform.OS == "ios" ? <IosPicker /> : <AndriodPicker />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  pickerContainer: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "center",
  },
  picker: {},
});

export default Goal;
