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
import BottomSheet, {
  BottomSheetScrollView,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { useSelector, useDispatch } from "react-redux";
import {
  setTaskIcon,
  setTaskColor,
  setTaskName,
} from "../../hooks/reducers/taskSlice";
import { FlashList } from "@shopify/flash-list";
import { useNavigation } from "expo-router";

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
  const taskName = useSelector((state) => state.task.taskName);
  const dispatch = useDispatch();
  const taskIcon = useSelector((state) => state.task.taskIcon);
  const taskColor = useSelector((state) => state.task.taskColor);
  const [typing, setTyping] = useState(false);
  const router = useNavigation();

  const handleTyping = (value) => {
    setTyping(true);
    dispatch(setTaskName(value));
  };
  return (
    <Pressable
      onPress={() => Keyboard.dismiss()}
      style={[styles.container, { backgroundColor: taskColor }]}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoidingView}
      >
        <View style={styles.taskContainer}>
          <Pressable onPress={() => router.navigate("AddTaskIcon")}>
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
          <View
            style={{
              width: "100%",
              marginVertical: 10,
              alignItems: "center",
            }}
          >
            <TextInput
              placeholder="New Task"
              value={taskName}
              onChange={() => setTyping(true)}
              onChangeText={(value) => handleTyping(value)}
              style={styles.TaskInput}
              placeholderTextColor={"#a9a9a94d"}
              maxLength={50}
              numberOfLines={2}
              multiline
              width={"90%"}
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
          onPress={() => router.navigate("Repeat")}
        >
          <View style={[styles.taskwhenIcon, { backgroundColor: "#83f28f" }]}>
            <Ionicons name="repeat-outline" size={20} color="white" />
          </View>
          <View style={styles.taskWhen}>
            <View>
              <Text>Repeat</Text>
              <Text>EveryDay</Text>
            </View>
            <AntDesign name="right" size={20} color="black" />
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
              <Text>1 Time Per day</Text>
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
              <Text>Routine</Text>
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
              <Text>9:00 AM</Text>
            </View>
            <AntDesign name="right" size={20} color="black" />
          </View>
        </Pressable>
      </View>

      <View style={styles.taskInfoList}>
        <Pressable
          onPress={() => router.navigate("Startdate")}
          style={[styles.taskInfo]}
        >
          <View style={[styles.taskwhenIcon, { backgroundColor: "#4194cb" }]}>
            <Ionicons name="calendar-sharp" size={20} color="white" />
          </View>
          <View style={[styles.taskWhen]}>
            <View>
              <Text>START DATE</Text>
              <Text>Today</Text>
            </View>
            <AntDesign name="right" size={20} color="black" />
          </View>
        </Pressable>
      </View>
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
