import React, { useState } from "react";
import { View, FlatList, StyleSheet } from "react-native";
import NotificationItem from "@/components/Notification"; // Import the notification item component

const data = [
  { title: "Notification 1", content: "This is the first notification." },
  { title: "Notification 2", content: "This is the second notification." },
  { title: "Notification 3", content: "This is the third notification." },
];

export default function App() {
  const [expandedIndex, setExpandedIndex] = useState(null);

  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
          <NotificationItem
            title={item.title}
            content={item.content}
            index={index}
            expandedIndex={expandedIndex}
            setExpandedIndex={setExpandedIndex}
          />
        )}
        scrollEnabled={false} // Disable scroll to maintain the stacking effect
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    paddingHorizontal: 10,
    backgroundColor: "#eee",
  },
});
