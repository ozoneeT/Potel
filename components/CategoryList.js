import React, { useEffect, useState } from "react";
import { View, FlatList, Button, Text, StyleSheet } from "react-native";
import CategoryButton from "./CategoryButton"; // Adjust the path as necessary
import { useDispatch, useSelector } from "react-redux";
import {
  setExpandedId,
  setSelectedCategory,
  addCategory,
  updateCategory,
} from "../hooks/reducers/categorySlice"; // Adjust the path as needed
import dayjs from "dayjs";

const CategoryList = () => {
  const dispatch = useDispatch();
  const categories = useSelector((state) => state.categories.categories);
  const expandedId = useSelector((state) => state.categories.expandedId);
  const selectedCategory = useSelector(
    (state) => state.categories.selectedCategory
  );

  const today = dayjs();
  const currentHour = today.hour();

  useEffect(() => {
    let timeOfDay, iconName;

    if (currentHour >= 0 && currentHour < 6) {
      timeOfDay = "Midnight";
      iconName = "moon";
    } else if (currentHour >= 6 && currentHour < 12) {
      timeOfDay = "Morning";
      iconName = "cloud-sun";
    } else if (currentHour >= 12 && currentHour < 17) {
      timeOfDay = "Afternoon";
      iconName = "sun";
    } else if (currentHour >= 17 && currentHour < 20) {
      timeOfDay = "Evening";
      iconName = "cloud-moon";
    } else {
      timeOfDay = "Night";
      iconName = "moon";
    }

    dispatch(
      updateCategory({ id: "1", categoryName: timeOfDay, iconName: iconName })
    );
    dispatch(setSelectedCategory(timeOfDay)); // Set initial selected category to time of day
  }, [currentHour, dispatch]);

  const handlePress = (id, categoryName) => {
    if (expandedId === id && id !== "1") {
      // Allow "All" category to expand/collapse
      dispatch(setExpandedId(id));
    } else {
      dispatch(setExpandedId(id));
    }
    dispatch(setSelectedCategory(categoryName));
  };
  const addNewCategory = () => {
    const newCategory = {
      id: (categories.length + 1).toString(),
      iconName: "star",
      categoryName: `New Category ${categories.length + 1}`,
    };
    dispatch(addCategory(newCategory));
  };

  const renderItem = ({ item }) => (
    <CategoryButton
      iconName={item.iconName}
      categoryName={item.categoryName}
      isExpanded={item.id === expandedId}
      onPress={() => handlePress(item.id, item.categoryName)}
    />
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={categories}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        horizontal
        contentContainerStyle={styles.listContainer}
        showsHorizontalScrollIndicator={false}
      />
      {/* <Button title="Add Category" onPress={addCategory} />
      <Text style={styles.selectedCategoryText}>
        Selected Category: {selectedCategory}
      </Text> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginTop: "auto",
  },
  listContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
  },
  selectedCategoryText: {
    fontSize: 16,
    color: "black",
    marginTop: 10,
  },
});

export default CategoryList;
