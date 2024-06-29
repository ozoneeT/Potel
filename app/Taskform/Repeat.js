import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  Button,
  FlatList,
  Pressable,
  useColorScheme,
} from "react-native";
// import SegmentedControl from "../../components/SegmentedControl"; // Adjust the path as needed
import { useContext } from "react";
import ActionSheet, {
  SheetManager,
  SheetProps,
  registerSheet,
} from "react-native-actions-sheet";
import { useSelector, useDispatch } from "react-redux";
import {
  setRepeatDays,
  setRepeatMonthlyDays,
  setRepeatIntervalDays,
  setRepeatIndex,
} from "../../hooks/reducers/repeatDaysSlice"; // Adjust the import path as necessary
import SegmentedControl from "@react-native-segmented-control/segmented-control";
import { AntDesign } from "@expo/vector-icons";

const Repeat = (props) => {
  const dispatch = useDispatch();

  const Daily = () => {
    const repeatDays = useSelector((state) => state.repeatDays.repeatDays);

    const WeekDays = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];

    const toggleDay = (day) => {
      if (repeatDays.includes(day)) {
        if (repeatDays.length > 1) {
          // Ensure there is at least one day selected
          dispatch(setRepeatDays(repeatDays.filter((d) => d !== day)));
        }
      } else {
        dispatch(setRepeatDays([...repeatDays, day]));
      }
    };

    return (
      <View style={{ width: "95%" }}>
        <FlatList
          data={WeekDays}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <Pressable
              style={[
                styles.dayContainer,
                repeatDays.includes(item) && styles.selectedDayContainer,
              ]}
              onPress={() => toggleDay(item)}
            >
              <Text>{item}</Text>
              {repeatDays.includes(item) && (
                <Text style={{ marginLeft: "auto", textAlign: "left" }}>
                  ✔️
                </Text>
              )}
            </Pressable>
          )}
        />
      </View>
    );
  };

  const Monthly = () => {
    const selectedDays = useSelector((state) => state.repeatDays.monthlyDays);

    const days = Array.from({ length: 31 }, (_, i) => i + 1);

    const handlePress = (day) => {
      if (selectedDays.includes(day)) {
        dispatch(setRepeatMonthlyDays(selectedDays.filter((d) => d !== day)));
      } else {
        dispatch(setRepeatMonthlyDays([...selectedDays, day]));
      }
    };

    return (
      <View style={{ width: "100%", padding: 5 }}>
        <FlatList
          data={days}
          keyExtractor={(item) => item.toString()}
          numColumns={7} // Display 7 days per row for calendar view
          renderItem={({ item }) => (
            <Pressable
              style={[
                {
                  justifyContent: "center",
                  alignItems: "center",
                  width: 50,
                  height: 50,
                  borderColor: "#d5d5d551",
                  borderWidth: 1,
                },
                selectedDays.includes(item) && styles.selectedDayContainer,
              ]}
              onPress={() => handlePress(item)}
            >
              <Text>{item}</Text>
            </Pressable>
          )}
        />
      </View>
    );
  };

  const Interval = () => {
    const selectedDay = useSelector((state) => state.repeatDays.intervalDays);

    const handlePress = (day) => {
      if (selectedDay === day) {
        dispatch(setRepeatIntervalDays(null)); // Deselect if already selected
      } else {
        dispatch(setRepeatIntervalDays(day)); // Select the current day
      }
    };

    const days = Array.from({ length: 29 }, (_, i) => i + 2);
    return (
      <View style={{ width: "95%" }}>
        <FlatList
          data={days}
          keyExtractor={(item) => item.toString()}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <Pressable
              style={[
                {
                  paddingVertical: 15,
                  paddingHorizontal: 10,
                  borderBottomColor: "lightgray",
                  borderBottomWidth: 1,
                },
                selectedDay === item && styles.selectedDayContainer,
              ]}
              onPress={() => handlePress(item)}
            >
              <Text style={{ fontSize: 17, fontFamily: "MontserratMedium" }}>
                Every
                <Text
                  style={{ textAlign: "right", fontFamily: "MontserratBold" }}
                >
                  {" "}
                  {item}{" "}
                </Text>
                days
              </Text>
            </Pressable>
          )}
        />
      </View>
    );
  };

  const renderComponent = () => {
    switch (selectedIndex) {
      case 0:
        return <Daily />;
      case 1:
        return <Monthly />;
      case 2:
        return <Interval />;
      default:
        return null;
    }
  };

  const colorScheme = useColorScheme();
  const [textColor, setTextColor] = useState("#000");

  const selectedIndex = useSelector((state) => state.repeatDays.repeatIndex);

  useEffect(() => {
    setTextColor(colorScheme === "dark" ? "#FFF" : "#000");

    const handleIndexChange = () => {
      if (selectedIndex === 0) {
        dispatch(setRepeatIntervalDays(3));
        dispatch(setRepeatMonthlyDays([1]));
      } else if (selectedIndex === 1) {
        dispatch(
          setRepeatDays([
            "Sunday",
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
          ])
        );
        dispatch(setRepeatIntervalDays(2));
      } else if (selectedIndex === 2) {
        dispatch(
          setRepeatDays([
            "Sunday",
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
          ])
        );
        dispatch(setRepeatMonthlyDays([1]));
      }
    };
    handleIndexChange();
  }, [colorScheme, selectedIndex, dispatch]);

  const _onChange = (event) => {
    dispatch(setRepeatIndex(event.nativeEvent.selectedSegmentIndex));
  };

  return (
    <View style={[styles.container, { height: "70%" }]}>
      <View style={styles.Header}>
        <Pressable>
          <AntDesign name="back" size={25} color="black" />
        </Pressable>
        <View style={{ alignItems: "center", flex: 1, marginLeft: -50 }}>
          <Text style={{ fontSize: 20 }}>Repeat</Text>
        </View>
      </View>
      <View style={styles.segmentContainer}>
        <SegmentedControl
          values={["Daily", "Monthly", "Interval"]}
          selectedIndex={selectedIndex}
          onChange={_onChange}
          style={{ width: "90%", alignSelf: "center", marginTop: 30 }}
        />
      </View>
      <View style={styles.componentContainer}>{renderComponent()}</View>
      <Text>{selectedIndex}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
  },
  Header: {
    flexDirection: "row",
    marginHorizontal: 20,
    marginTop: 30,
    alignItems: "center",
    width: "100%",
  },
  segmentedContainer: {
    alignSelf: "center",
    marginTop: 20,
  },
  componentContainer: {
    marginTop: 20,
    alignItems: "center",
  },
  sliderStyle: {
    borderRadius: 5,
    padding: 2,
  },
  segmentStyle: {
    paddingVertical: 5,
  },
  segmentContainerStyle: {
    borderRadius: 5,
  },
  textStyle: {
    fontSize: 15,
    fontWeight: "400",
    color: "gray",
  },
  dayContainer: {
    flexDirection: "row",
    width: "95%",
    alignSelf: "center",
    padding: 20,
    paddingVertical: 15,
    marginVertical: 1,
    backgroundColor: "lightgray",
  },
  selectedDayContainer: {
    backgroundColor: "#a8d5e2", // Different background color for selected days
  },
});
registerSheet("repeat", Repeat);
export default Repeat;
