import {
  FlatList,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useCallback, useEffect, useMemo, useRef } from "react";
import { TextInput } from "react-native-gesture-handler";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import { useState } from "react";
import {
  Ionicons,
  MaterialCommunityIcons,
  FontAwesome6,
  AntDesign,
  Octicons,
} from "@expo/vector-icons";
import { useSelector, useDispatch } from "react-redux";
import {
  setTaskIcon,
  setTaskColor,
  setTaskName,
  setRepeat,
  addTask,
  resetTaskDetails,
} from "../../hooks/reducers/taskSlice";
import { FlashList } from "@shopify/flash-list";
import { useNavigation } from "expo-router";
import { SheetManager } from "react-native-actions-sheet";
import DateTimePicker from "@react-native-community/datetimepicker";
import { setStartDate, setEndDate } from "../../hooks/reducers/taskSlice";
import { format, isToday, isYesterday, isTomorrow } from "date-fns";
import { ScrollView } from "react-native";
const listofColors = [
  {
    id: 1,
    color: "#e9d9ff",
  },
  {
    id: 2,
    color: "#fed9fa",
  },
  {
    id: 3,
    color: "#fee4c0",
  },
  {
    id: 4,
    color: "#fef17e",
  },
  {
    id: 5,
    color: "#ddf8b5",
  },
  {
    id: 6,
    color: "#d2e6fe",
  },
  {
    id: 7,
    color: "#cbf3ea",
  },
];

const Index = () => {
  const [typing, setTyping] = useState(false);
  const router = useNavigation();
  const inputRef = useRef(null);
  const repeatDays = useSelector((state) => state.repeatDays.repeatDays);
  const selectedDays = useSelector((state) => state.monthlyDays.selectedDays);
  const selectedIndex = useSelector((state) => state.repeatIndex.repeatIndex);
  const selectedDay = useSelector((state) => state.intervalDays.selectedDay);
  const [selectRepeat, setSelectrepeat] = useState();
  const selectedCategory = useSelector((state) => state.task.masterCategory);
  const repeatOccurence = useSelector((state) => state.task.repeatOccurence);
  const remindingTime = useSelector((state) => state.task.remindingTime);
  const reminderEnabled = useSelector((state) => state.task.reminderEnabled);
  const startDate = useSelector((state) => state.task.startDate);
  const endDate = useSelector((state) => state.task.endDate);
  const taskName = useSelector((state) => state.task.taskName);
  const taskIcon = useSelector((state) => state.task.taskIcon);
  const taskColor = useSelector((state) => state.task.taskColor);
  const repeat = useSelector((state) => state.task.repeat);
  const masterCategory = useSelector((state) => state.task.masterCategory);
  useEffect(() => {
    const Selectingrepeat = () => {
      if (selectedIndex == 0) {
        dispatch(setRepeat(`${renderSelectedDays()}`));
      } else if (selectedIndex == 1) {
        dispatch(setRepeat(`Every month On ${formatSelectedDays()}`));
      } else if (selectedIndex == 2) {
        dispatch(setRepeat(`Every ${selectedDay} days`));
      }
    };
    Selectingrepeat();
  }, [selectedIndex, selectedDays, selectedDay, repeatDays]);

  const renderSelectedDays = () => {
    const weekDaysMap = {
      Sunday: "Sun",
      Monday: "Mon",
      Tuesday: "Tue",
      Wednesday: "Wed",
      Thursday: "Thu",
      Friday: "Fri",
      Saturday: "Sat",
    };

    const weekDays = Object.keys(weekDaysMap);

    if (repeatDays.length === weekDays.length) {
      return "EveryDay";
    } else {
      const sortedRepeatDays = [...repeatDays].sort(
        (a, b) => weekDays.indexOf(a) - weekDays.indexOf(b)
      );

      return sortedRepeatDays.map((day) => weekDaysMap[day]).join(", ");
    }
  };

  const formatSelectedDays = () => {
    if (selectedDays.length === 0) {
      return "";
    } else if (selectedDays.length === 1) {
      return `${selectedDays[0]}${getOrdinalSuffix(selectedDays[0])}`;
    } else {
      const formattedDays = selectedDays.map(
        (day) => `${day}${getOrdinalSuffix(day)}`
      );
      const lastDay = formattedDays.pop();
      return `${formattedDays.join(", ")} and ${lastDay}`;
    }
  };

  const getOrdinalSuffix = (day) => {
    if (day === 1 || day === 21 || day === 31) return "st";
    if (day === 2 || day === 22) return "nd";
    if (day === 3 || day === 23) return "rd";
    return "th";
  };

  const handleTyping = (value) => {
    setTyping(true);
    dispatch(setTaskName(value));
  };
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const [datePickerVisible, setDatePickerVisible] = useState(false);

  const dispatch = useDispatch();

  const handleDateChange = useCallback((event, selectedDate) => {
    if (Platform.OS === "android") {
      setDatePickerVisible(false);
    }
    if (event.type === "set") {
      const formattedDate = format(selectedDate, "yyyy-MM-dd");
      dispatch(setStartDate(formattedDate));
    }
  });

  const displayDate = () => {
    const date = new Date(startDate);
    if (isToday(date)) return "Today";
    if (isYesterday(date)) return "Yesterday";
    if (isTomorrow(date)) return "Tomorrow";
    return format(date, "EEEE, MMMM d, yyyy");
  };

  const handleAddTask = () => {
    const newTask = {
      taskName,
      taskIcon,
      taskColor,
      repeat,
      repeatOccurence,
      startDate,
      endDate,
      masterCategory,
      remindingTime,
      reminderEnabled,
    };

    dispatch(addTask(newTask));
    dispatch(resetTaskDetails());
    router.goBack();
  };

  return (
    <Pressable
      onPress={() => Keyboard.dismiss()}
      style={[styles.container, { backgroundColor: taskColor }]}
    >
      <ScrollView>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.keyboardAvoidingView}
        >
          <View style={styles.taskContainer}>
            {/* <Pressable onPress={() => SheetManager.show("addtaskicon")}> */}
            <Pressable onPress={() => SheetManager.show("addtaskicon")}>
              <View
                style={[
                  styles.addTaskIcon,
                  { backgroundColor: "black", padding: 5, borderRadius: 10 },
                ]}
              >
                <View>
                  <MaterialCommunityIcons
                    name={taskIcon}
                    size={50}
                    color="white"
                  />
                </View>
              </View>
            </Pressable>
            <Pressable
              style={{
                alignSelf: "flex-end",
                position: "absolute",
                right: 20,
                top: 10,
              }}
              onPress={handleAddTask}
            >
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: "300",
                  fontFamily: "PoppinsMedium",
                }}
              >
                Create
              </Text>
            </Pressable>
            <Pressable
              style={{
                alignSelf: "flex-end",
                position: "absolute",
                left: 20,
                top: 5,
                padding: 10,
              }}
              onPress={() => router.goBack()}
            >
              <AntDesign name="back" size={24} color="black" />
            </Pressable>
            <View
              style={{
                width: "100%",
                marginVertical: 10,
                alignItems: "center",
              }}
            >
              <TextInput
                ref={inputRef}
                placeholder="New Task"
                value={taskName}
                onChange={() => setTyping(true)}
                onChangeText={(value) => handleTyping(value)}
                style={styles.TaskInput}
                placeholderTextColor={"#a9a9a94d"}
                maxLength={50}
                multiline={true}
                width={"90%"}
                blurOnSubmit={true}
                onSubmitEditing={() => {
                  if (inputRef.current) {
                    inputRef.current.blur();
                  }
                }}
                returnKeyType="done"
              />
              {typing ? (
                <Text
                  style={{
                    color: "#a9a9a94d",
                    fontSize: 20,
                    fontFamily: "InterBold",
                  }}
                >
                  {taskName.length}/50
                </Text>
              ) : (
                <Text
                  style={{
                    color: "#a9a9a94d",
                    fontSize: 15,
                    fontFamily: "InterBold",
                  }}
                >
                  Tap to rename
                </Text>
              )}
            </View>
          </View>
        </KeyboardAvoidingView>
        <View
          style={{
            marginTop: 20,
            alignItems: "center",
            height: hp(5),
          }}
        >
          <FlatList
            data={listofColors}
            horizontal
            scrollEnabled={false}
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => (
              <>
                {item.color === taskColor && (
                  <View
                    style={{
                      position: "absolute",
                      zIndex: 10,
                      alignSelf: "center",
                      top: hp(0.7),
                      left: hp(2),
                    }}
                  >
                    <Ionicons name="checkmark" size={18} color="gray" />
                  </View>
                )}
                <Pressable
                  onPress={() => dispatch(setTaskColor(item.color))}
                  style={[
                    {
                      height: 30,
                      width: 30,
                      backgroundColor: item.color,
                      borderRadius: 20,
                      borderWidth: 2,
                      marginHorizontal: 10,
                      borderColor: "#ffffff",
                      shadowColor: "#000000",
                      shadowOffset: {
                        width: 1,
                        height: 1,
                      },
                      shadowOpacity: 0.25,
                      shadowRadius: 2,
                      elevation: 5,
                      marginBottom: 20,
                    },
                  ]}
                />
              </>
            )}
          />
        </View>
        <View style={styles.taskInfoList}>
          <Pressable
            style={styles.taskInfo}
            // onPress={() => SheetManager.show("repeat")}
            onPress={() => router.navigate("Repeat")}
          >
            <View style={[styles.taskwhenIcon, { backgroundColor: "#83f28f" }]}>
              <Ionicons name="repeat-outline" size={20} color="white" />
            </View>
            <View style={styles.taskWhen}>
              <View style={{ width: "90%" }}>
                <Text>Repeat</Text>
                <Text style={{ fontWeight: "bold" }}>{repeat}</Text>
              </View>
              <View
                style={{
                  width: "10%",
                  alignItems: "flex-end",
                }}
              >
                <AntDesign name="right" size={20} color="black" />
              </View>
            </View>
          </Pressable>

          <Pressable
            onPress={() => router.navigate("Goal")}
            style={[
              styles.taskInfo,
              {
                borderTopWidth: 0.17,
                borderTopColor: "ligthgray",
                borderBottomColor: "ligthgray",
                borderBottomWidth: 0.17,
              },
            ]}
          >
            <View style={[styles.taskwhenIcon, { backgroundColor: "#3868d9" }]}>
              <MaterialCommunityIcons name="target" size={20} color="white" />
            </View>
            <View style={[styles.taskWhen, {}]}>
              <View>
                <Text>Goal</Text>
                <Text style={{ fontWeight: "bold" }}>{repeatOccurence}</Text>
              </View>
              <AntDesign name="right" size={20} color="black" />
            </View>
          </Pressable>

          <Pressable
            onPress={() => router.navigate("Category")}
            style={styles.taskInfo}
          >
            <View style={[styles.taskwhenIcon, { backgroundColor: "#865e9c" }]}>
              <AntDesign name="tags" size={20} color="white" />
            </View>
            <View style={[styles.taskWhen, { borderBottomWidth: 0 }]}>
              <View>
                <Text>Category</Text>
                <Text style={{ fontWeight: "bold" }}>
                  {selectedCategory.categoryName} {selectedCategory.iconName}
                </Text>
              </View>
              <AntDesign name="right" size={20} color="black" />
            </View>
          </Pressable>
        </View>

        <View style={styles.taskInfoList}>
          <Pressable
            onPress={() => router.navigate("Reminder")}
            style={[styles.taskInfo]}
          >
            <View style={[styles.taskwhenIcon, { backgroundColor: "#8134af" }]}>
              <Ionicons name="notifications" size={20} color="white" />
            </View>
            <View style={[styles.taskWhen, { borderBottomWidth: 0 }]}>
              <View>
                <Text>Reminder</Text>
                {reminderEnabled ? (
                  <Text
                    style={{
                      fontWeight: "bold",
                    }}
                  >
                    Remind me at {remindingTime}
                  </Text>
                ) : (
                  <Text
                    style={{
                      fontWeight: "bold",
                    }}
                  >
                    No Reminder
                  </Text>
                )}
              </View>
              <AntDesign name="right" size={20} color="black" />
            </View>
          </Pressable>
        </View>

        <View style={styles.taskInfoList}>
          <Pressable
            onPress={() => setDatePickerVisible(!datePickerVisible)}
            style={[styles.taskInfo]}
          >
            <View style={[styles.taskwhenIcon, { backgroundColor: "#4194cb" }]}>
              <Ionicons name="calendar-sharp" size={20} color="white" />
            </View>
            <View style={[styles.taskWhen]}>
              <View>
                <Text>START DATE</Text>
                <Text style={{ fontWeight: "bold" }}>{displayDate()}</Text>
              </View>
              <AntDesign name="right" size={20} color="black" />
            </View>
          </Pressable>
        </View>

        {datePickerVisible && (
          <View
            style={{
              backgroundColor: "#fff",
              margin: 20,
              borderRadius: 20,
            }}
          >
            <DateTimePicker
              style={{ padding: 20 }}
              value={new Date(startDate)}
              mode="date"
              display="inline"
              onChange={handleDateChange}
            />
          </View>
        )}
      </ScrollView>
    </Pressable>
  );
};

export default Index;

const styles = StyleSheet.create({
  container: {
    backgroundColor: null,
    alignSelf: "center",
    flex: 1,
    width: "100%",
  },
  addTaskIcon: {
    alignItems: "center",
    justifyContent: "center",
  },
  TaskInput: {
    textAlign: "center",
    textAlignVertical: "center",
    width: "100%",
    fontSize: hp(3),
    fontFamily: "InterBold",
    alignItems: "center",
    alignSelf: "center",
    color: "#000000",
    justifyContent: "center",
  },
  taskContainer: {
    alignItems: "center",
    marginTop: 50,
  },
  iconGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  iconButton: {
    padding: 10,
    borderRadius: 20,
    margin: 10,
  },
  taskInfoList: {
    marginTop: 15,
    backgroundColor: "#ffffff",
    width: "90%",
    alignSelf: "center",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  taskInfo: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  taskWhen: {
    width: "80%",
    alignItems: "center",

    flexDirection: "row",
    justifyContent: "space-between",
  },
  taskwhenIcon: {
    padding: 7,
    backgroundColor: "red",
    marginRight: 20,
    borderRadius: 5,
  },
});
