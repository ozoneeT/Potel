import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { AntDesign } from "@expo/vector-icons";

const Reminder = () => {
  return (
    <View>
      <View style={styles.header} />
      <View style={styles.timeContainer}>
        <View>
          <AntDesign name="pluscircle" size={24} color="black" />
        </View>
      </View>
    </View>
  );
};

export default Reminder;

const styles = StyleSheet.create({});
