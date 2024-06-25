import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { setmasterCategory } from "../../hooks/reducers/categorySlice";
import { router } from "expo-router";

const Category = () => {
  const categories = useSelector((state) => state.categories.categories);
  const expandedId = useSelector((state) => state.categories.expandedId);
  const selectedCategory = useSelector(
    (state) => state.categories.masterCategory
  );
  const dispatch = useDispatch();

  const categoryPressed = (categoryName, iconName) => {
    dispatch(setmasterCategory({ categoryName, iconName }));
    router.back();
  };

  return (
    <View>
      <FlatList
        data={categories}
        contentContainerStyle={{ marginTop: 40 }}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => categoryPressed(item.categoryName, item.iconName)}
            style={{
              backgroundColor: "lightgrey",
              padding: 20,
              margin: 10,
              borderRadius: 25,
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Text style={{ marginRight: 10 }}>{item.iconName}</Text>
            <Text>{item.categoryName}</Text>
          </Pressable>
        )}
        keyExtractor={(item) => item.id}
      />
      <Text>
        {selectedCategory.iconName} {selectedCategory.categoryName}
      </Text>
    </View>
  );
};

export default Category;

const styles = StyleSheet.create({});
