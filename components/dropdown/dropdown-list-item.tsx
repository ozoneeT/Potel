import { AntDesign } from "@expo/vector-icons";
import { View, Text, StyleSheet } from "react-native";
import React from "react";

type DropdownItemType = {
  label: string;
  iconName: string;
};

const DropdownListItem: React.FC<DropdownItemType> = ({ label, iconName }) => {
  return (
    <View style={styles.itemContainer}>
      <AntDesign name={iconName as any} size={20} color="#D4D4D4" />
      <Text style={styles.label}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    backgroundColor: "#333",
    borderRadius: 10,
    marginBottom: -20, // Overlapping margin for stacking effect
    zIndex: 1,
  },
  label: {
    color: "#D4D4D4",
    marginLeft: 10,
    fontSize: 16,
  },
});

export { DropdownListItem, DropdownItemType };
