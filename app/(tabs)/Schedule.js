import React, { useState, useCallback, useEffect, useRef } from "react";
import {
  View,
  FlatList,
  Text,
  Pressable,
  StyleSheet,
  Dimensions,
  Button,
  useColorScheme,
  TextInput,
} from "react-native";
import dayjs from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import { Colors } from "@/constants/Colors";
import {
  AntDesign,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { ThemedView } from "@/components/ThemedView";
import CategoryList from "../../components/CategoryList";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useNavigation, useRouter } from "expo-router";
import { setSelectedDate } from "../../hooks/reducers/selectedDaySlice";
import { setWeekDay } from "../../hooks/reducers/dateSlice";
import { useDispatch, useSelector } from "react-redux";
import { FlashList } from "@shopify/flash-list";
import { NumberInput, RadioButton } from "react-native-ui-lib";
import isBetween from "dayjs/plugin/isBetween";

dayjs.extend(isoWeek); // Extend dayjs with isoWeek plugin
dayjs.extend(isBetween);

const getDates = (startDate, numDays) => {
  const dates = [];
  for (let i = 0; i < numDays; i++) {
    dates.push(startDate.add(i, "day").format("YYYY-MM-DD"));
  }
  return dates;
};

const DateItem = React.memo(({ date, isSelected, onSelect, isCurrentDate }) => (
  <View
    style={{
      width: Dimensions.get("window").width / 7,
      alignItems: "center",
    }}
  >
    <Pressable
      onPress={() => onSelect(date)}
      style={[
        isSelected
          ? { backgroundColor: Colors.dark.primary }
          : { opacity: 0.4 },
        isCurrentDate && { backgroundColor: Colors.dark.primary },
        styles.daygroup,
      ]}
    >
      <Text
        style={[
          styles.dayName,
          { color: Colors.dark.backgroundGray },
          isSelected && {},
        ]}
      >
        {dayjs(date).format("dd")}
      </Text>
      <View
        style={[
          styles.dayNumber,
          isSelected && { backgroundColor: "#ffffff" },
          isCurrentDate && { backgroundColor: "#ffffff" },
        ]}
      >
        <Text
          style={[
            isSelected && styles.dayNumberText,
            {
              color: Colors.dark.backgroundGray,
              fontFamily: "MontserratSemiBold",
            },
          ]}
        >
          {dayjs(date).format("D")}
        </Text>
      </View>
    </Pressable>
  </View>
));

const App = () => {
  const today = dayjs();
  const weekDay = useSelector((state) => state.date.weekDay);
  const weekDaynew = weekDay - 7;
  const startOfLastWeek = today
    .subtract(1, "week") // Go back 1 week from today
    .startOf("isoWeek") // Start of ISO week (typically Monday), so we need to adjust
    .isoWeekday(weekDay)
    .subtract(1, "week");
  const selectedDate = useSelector((state) => state.selectedDate);
  const dispatch = useDispatch();
  const [dates, setDates] = useState(getDates(startOfLastWeek, 28)); // Show 35 days initially
  const isCurrentDate = today.format("YYYY-MM-DD");
  const flatListRef = useRef(null);
  const initialScrollDone = useRef(false);
  const windowWidth = Dimensions.get("window").width;
  const itemWidth = windowWidth / 7;
  onethirdWidth = windowWidth / 3;
  const colorScheme = useColorScheme();
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const router = useNavigation();
  const tasks = useSelector((state) => state.task.tasks);

  useEffect(() => {
    if (!initialScrollDone.current) {
      const todayIndex = dates.findIndex(
        (date) => date === today.format("YYYY-MM-DD")
      );
      if (todayIndex !== -1) {
        const dayOfWeek = today.isoWeekday() - weekDaynew; // Get the day of the week (0-6, where 0 is Monday)
        const initialOffset = todayIndex * itemWidth - dayOfWeek * itemWidth; // Positioning today in its normal position within the week
        setTimeout(() => {
          flatListRef.current?.scrollToOffset({
            offset: initialOffset,
            animated: true,
          });
          initialScrollDone.current = true; // Mark initial scroll as done
        }, 100); // Delay to allow the flatlist to initialize
      }
    }
  }, [dates, today]);

  const handleTodayClick = useCallback(() => {
    const todayIndex = dates.findIndex(
      (date) => date === today.format("YYYY-MM-DD")
    );
    if (todayIndex !== -1) {
      const dayOfWeek = today.isoWeekday() - weekDaynew; // Get the day of the week (0-6, where 0 is Monday)
      const initialOffset = todayIndex - dayOfWeek; // Calculate the correct index to scroll to
      if (initialOffset >= 0 && initialOffset < dates.length) {
        flatListRef.current?.scrollToIndex({
          index: initialOffset,
          animated: true,
        });
      } else {
        console.warn(`Calculated index ${initialOffset} is out of range`);
      }
    }
    dispatch(setSelectedDate(today.format("YYYY-MM-DD")));
  }, [today, dates, dispatch]);

  const onViewableItemsChanged = useCallback(
    ({ viewableItems }) => {
      if (viewableItems.length > 0) {
        const selectedDayName = dayjs(selectedDate).format("dd");

        // Find the item that matches the selectedDayName
        const newSelectedDate = viewableItems.find(
          ({ item }) => dayjs(item).format("dd") === selectedDayName
        )?.item;

        // Fallback to the last viewable date if no match found
        const dateToSet =
          newSelectedDate || viewableItems[viewableItems.length - 1].item;

        dispatch(setSelectedDate(dateToSet));
      }
    },
    [dispatch, selectedDate]
  );

  const handleSelectDate = useCallback(
    (date) => {
      dispatch(setSelectedDate(date));
    },
    [dispatch]
  );

  const getFriendlyDate = (date) => {
    const selected = dayjs(date);
    const todayDate = dayjs().startOf("day");
    const diffDays = selected.diff(todayDate, "day");

    if (diffDays === 0) return "Today";
    if (diffDays === -1) return "Yesterday";
    if (diffDays === 1) return "Tomorrow";
    return selected.format("MMMM D");
  };

  const renderItem = ({ item }) => (
    <DateItem
      date={item}
      isSelected={selectedDate === item}
      onSelect={handleSelectDate}
      isCurrentDate={isCurrentDate === item}
    />
  );

  const renderTodayButton = () => {
    if (selectedDate === today.format("YYYY-MM-DD")) {
      return null;
    }

    const selected = dayjs(selectedDate);
    const isBeforeToday = selected.isBefore(today);

    return (
      <Pressable
        onPress={handleTodayClick}
        style={[styles.todayButton, { backgroundColor: Colors.dark.primary }]}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            left: 3,
            paddingHorizontal: 10,
          }}
        >
          <Text>
            {!isBeforeToday && (
              <AntDesign name="caretleft" size={12} color="black" />
            )}
          </Text>

          <Text style={styles.todayButtonText}>Today</Text>

          <Text>
            {isBeforeToday && (
              <AntDesign name="caretright" size={12} color="black" />
            )}
          </Text>
        </View>
      </Pressable>
    );
  };

  const getItemLayout = (data, index) => ({
    length: Dimensions.get("window").width / 7,
    offset: (Dimensions.get("window").width / 7) * index - 1,
    index,
  });

  const onScrollToIndexFailed = (info) => {
    const wait = new Promise((resolve) => setTimeout(resolve, 500));
    wait.then(() => {
      flatListRef.current?.scrollToIndex({
        index: info.index,
        animated: true,
      });
    });
  };

  const handleConfirm = (event, date) => {
    setDatePickerVisibility(false);
    if (date) {
      const formattedDate = dayjs(date).format("YYYY-MM-DD");
      dispatch(setSelectedDate(formattedDate));

      // Scroll to the selected date if it exists in the list
      const index = dates.findIndex((item) => item === formattedDate);
      if (index !== -1 && flatListRef.current) {
        flatListRef.current.scrollToIndex({ index, animated: true });
      }
    }
  };

  const showDatePicker = () => {
    setDatePickerVisibility(!isDatePickerVisible);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const selectedCategory = useSelector((state) => state.categories.expandedId);
  const infinityDate = dayjs().add(10, "year");
  // Helper function to check if a date matches any of the selected repeat days
  // Helper function to check if a task repeats on the selected day
  const isRepeatDay = (task, date) => {
    const dayName = date.format("dddd"); // Get the day name, e.g., "Monday"
    return task.taskRepeat.includes(dayName);
  };

  // Helper function to check if a task repeats on the selected date of the month
  const isMonthlyDay = (task, date) => {
    const dayOfMonth = date.date(); // Get the day of the month, e.g., 1, 2, 3
    return task.taskRepeat.includes(dayOfMonth);
  };

  // Helper function to check if a task repeats at a specific interval from the start date
  const isIntervalDay = (task, date) => {
    const startDate = dayjs(task.startDate);
    const diffInDays = date.diff(startDate, "day");
    return diffInDays % task.taskRepeat === 0;
  };

  // Filter tasks based on selected date and repeat settings
  const filteredTasks = tasks.filter((task) => {
    const taskEndDate = task.endDateEnabled
      ? dayjs(task.endDate)
      : infinityDate;
    const isWithinDateRange = dayjs(selectedDate).isBetween(
      task.startDate,
      taskEndDate,
      null,
      "[]"
    );
    const isMatchingCategory =
      selectedCategory === "1" || task.masterCategory.id === selectedCategory;

    // Check repeat conditions
    const repeatConditionsMet =
      (task.repeatType === "daily" && isRepeatDay(task, dayjs(selectedDate))) ||
      (task.repeatType === "monthly" &&
        isMonthlyDay(task, dayjs(selectedDate))) ||
      (task.repeatType === "interval" &&
        isIntervalDay(task, dayjs(selectedDate)));

    return isWithinDateRange && isMatchingCategory && repeatConditionsMet;
  });
  // End of Date Render Functions

  const renderTaskItem = ({ item }) => (
    <View
      style={[
        styles.taskItem,
        {
          backgroundColor: item.taskColor,
          flexDirection: "row",
          padding: 10,
          height: 120,
          borderRadius: 40,
          margin: 10,
        },
      ]}
    >
      <View style={{ justifyContent: "center", marginRight: 20 }}>
        <MaterialCommunityIcons
          name={item.taskIcon}
          size={50}
          color={"#222222"}
        ></MaterialCommunityIcons>
      </View>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          width: "75%",
        }}
      >
        <View style={{ justifyContent: "center" }}>
          <View>
            <Text
              style={{
                color: "gray",
                fontWeight: "bold",
                fontSize: 20,
                width: 200,
              }}
              ellipsizeMode="tail"
              numberOfLines={1}
            >
              {item.taskName}
            </Text>
            <Text style={{ color: "#222222" }}>{item.remindingTime}</Text>
            <Text>{item.newTime}</Text>
          </View>

          <View
            style={{
              borderRadius: 20,
              backgroundColor: "#fff",
              width: 30,
              height: 30,
              marginTop: 20,
            }}
          />
        </View>
        <RadioButton value={null} size={25} />
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.dateContainer,
          { backgroundColor: Colors.dark.lighterPrimary },
        ]}
      >
        <View style={styles.dateHeader}>
          <View style={{ width: onethirdWidth }}>{renderTodayButton()}</View>
          <View
            style={{
              width: onethirdWidth,
              alignItems: "center",
            }}
          >
            {selectedDate && (
              <Text style={styles.selectedDateText}>
                {getFriendlyDate(selectedDate)}
              </Text>
            )}
          </View>
          <View style={{ width: onethirdWidth, alignItems: "flex-end" }}>
            <Pressable onPress={showDatePicker}>
              <Ionicons
                name="calendar"
                size={24}
                color={
                  colorScheme === "dark" ? Colors.dark.text : Colors.light.text
                }
              />
            </Pressable>
          </View>
        </View>

        <View style={styles.dateRender}>
          <FlatList
            data={dates}
            estimatedItemSize={300}
            ref={flatListRef}
            renderItem={renderItem}
            keyExtractor={(item) => item}
            horizontal
            pagingEnabled
            snapToAlignment="start"
            snapToInterval={Dimensions.get("window").width} // Snap to full-width pages
            decelerationRate="fast" // Fast deceleration for snapping effect
            showsHorizontalScrollIndicator={false}
            onViewableItemsChanged={onViewableItemsChanged}
            viewabilityConfig={{ itemVisiblePercentThreshold: 50 }}
            getItemLayout={getItemLayout}
            onScrollToIndexFailed={onScrollToIndexFailed}
            onMomentumScrollEnd={() =>
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
            }
          />
        </View>
      </View>

      {/* End of Date Render and Beggining of Category */}
      <View style={styles.content}>
        {isDatePickerVisible && (
          <DateTimePicker
            value={new Date(selectedDate)}
            mode="date"
            display="spinner"
            onChange={handleConfirm}
            onTouchCancel={hideDatePicker}
          />
        )}

        <FlatList
          data={filteredTasks}
          renderItem={renderTaskItem}
          keyExtractor={(item, index) => index.toString()}
        />
        <View style={styles.addTaskButton}>
          <Pressable onPress={() => router.navigate("Taskform")}>
            <AntDesign
              name="pluscircle"
              size={45}
              color={Colors.light.primary}
            />
          </Pressable>
        </View>
        <CategoryList />
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    backgroundColor: "#ffffff",
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
  },
  selected: {
    backgroundColor: "lightblue",
  },
  dayName: {
    fontSize: 15,
    fontFamily: "MontserratSemiBold",
  },
  dayNumber: {
    fontSize: 15,
    borderColor: "#22222238",
    borderWidth: 0.5,
    height: 30,
    width: 30,
    marginTop: "auto",
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  dayNumberText: {},
  dateContainer: {
    height: hp(25),
    marginBottom: -20,
  },
  daygroup: {
    borderRadius: 20,
    alignItems: "center",
    height: hp(8.5),
    width: hp(5),
    paddingVertical: 5,
  },
  dateRender: { bottom: hp(4) },
  dateHeader: {
    marginVertical: 40,
    height: hp(5),
    flexDirection: "row",
    alignItems: "center",
  },
  selectedDateText: {
    fontSize: 16,
    fontWeight: "bold",
    fontFamily: "MontserratBold",
  },
  todayButton: {
    borderRadius: 15,
    height: hp(3.6),
    width: hp(10),
    left: -10,
    justifyContent: "center",
    paddingHorizontal: 5,
  },
  todayButtonText: {
    fontSize: 13,
    fontFamily: "MontserratMedium",
    marginHorizontal: 2,
  },
  currentDate: {},
  // end of Date and Date Render Style
  // Begining of Category styling

  categoryContainer: {
    backgroundColor: null,
  },
  category: {
    width: 150,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    height: 45,
    marginLeft: 5,
  },
  categoryText: {
    color: "gray",
    fontFamily: "PoppinsBold",
    fontSize: hp(2.5),
    width: "71%",
    marginLeft: 5,
  },
  categoryIcon: {
    width: "20%",
    marginLeft: 10,
    right: -5,
    justifyContent: "flex-start",
  },

  button: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderRadius: 24,
    backgroundColor: "#e0e0e0",
    margin: 5,
  },
  categoryNameContainer: {
    marginLeft: 10,
  },
  categoryNameText: {
    fontSize: 16,
    color: "black",
  },

  listContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
  },
  expandedButton: {
    backgroundColor: "#f3f3f3", // Change background color when expanded
  },
  addTaskButton: {
    top: "72%",
    margin: 30,
    position: "absolute",
    right: 0,
  },
});

export default App;
