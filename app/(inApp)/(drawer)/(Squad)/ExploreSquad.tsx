import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
  ViewToken,
  Animated,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import {
  runOnJS,
  useAnimatedRef,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useDerivedValue,
  useScrollViewOffset,
  useSharedValue,
} from "react-native-reanimated";
import React, { useCallback, useEffect, useRef, useState } from "react";

import {
  CategoryListItem,
  StoryListItemHeight,
  StoryListItemWidth,
  WindowWidth,
} from "@/components/SquadCategory/category";
import { ListItem } from "@/components/SquadCategory/listItem";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { BlurView } from "expo-blur";

export const squadData = [
  {
    squadCategory: "Category 1",
    gradient: ["#12c2e9", "#c471ed", "#f64f59"],
    squads: [
      { header: "General", image: require("@/assets/images/icon.png") },
      { header: "Community", image: require("@/assets/images/BG.png") },
      { header: "Work", image: require("@/assets/images/profile.jpeg") },
      { header: "Random", image: require("@/assets/images/potel.png") },
      { header: "Personal", image: require("@/assets/images/sun.png") },
      { header: "Health", image: require("@/assets/images/welcome.png") },
      { header: "Travel", image: require("@/assets/images/potelbot.png") },
      { header: "Fitness", image: require("@/assets/images/icon.png") },
      { header: "Education", image: require("@/assets/images/BG.png") },
      {
        header: "Entertainment",
        image: require("@/assets/images/profile.jpeg"),
      },
      { header: "Technology", image: require("@/assets/images/potel.png") },
      { header: "Food", image: require("@/assets/images/sun.png") },
      { header: "Music", image: require("@/assets/images/welcome.png") },
      { header: "Fashion", image: require("@/assets/images/potelbot.png") },
      { header: "Lifestyle", image: require("@/assets/images/icon.png") },
      { header: "Business", image: require("@/assets/images/BG.png") },
      { header: "Finance", image: require("@/assets/images/profile.jpeg") },
      { header: "Science", image: require("@/assets/images/potel.png") },
      { header: "Art", image: require("@/assets/images/sun.png") },
      { header: "History", image: require("@/assets/images/welcome.png") },
    ],
  },
  {
    squadCategory: "Category 2",
    gradient: ["#b92b27", "#1565C0"],
    squads: [
      { header: "General", image: require("@/assets/images/icon.png") },
      { header: "Community", image: require("@/assets/images/BG.png") },
      { header: "Work", image: require("@/assets/images/profile.jpeg") },
      { header: "Random", image: require("@/assets/images/potel.png") },
      { header: "Personal", image: require("@/assets/images/sun.png") },
      { header: "Health", image: require("@/assets/images/welcome.png") },
      { header: "Travel", image: require("@/assets/images/potelbot.png") },
      { header: "Fitness", image: require("@/assets/images/icon.png") },
      { header: "Education", image: require("@/assets/images/BG.png") },
      {
        header: "Entertainment",
        image: require("@/assets/images/profile.jpeg"),
      },
      { header: "Technology", image: require("@/assets/images/potel.png") },
      { header: "Food", image: require("@/assets/images/sun.png") },
      { header: "Music", image: require("@/assets/images/welcome.png") },
      { header: "Fashion", image: require("@/assets/images/potelbot.png") },
      { header: "Lifestyle", image: require("@/assets/images/icon.png") },
      { header: "Business", image: require("@/assets/images/BG.png") },
      { header: "Finance", image: require("@/assets/images/profile.jpeg") },
      { header: "Science", image: require("@/assets/images/potel.png") },
      { header: "Art", image: require("@/assets/images/sun.png") },
      { header: "History", image: require("@/assets/images/welcome.png") },
    ],
  },
  {
    squadCategory: "Category 3",
    gradient: ["#12c2e9", "#c471ed"],
    squads: [
      { header: "General", image: require("@/assets/images/icon.png") },
      { header: "Community", image: require("@/assets/images/BG.png") },
      { header: "Work", image: require("@/assets/images/profile.jpeg") },
      { header: "Random", image: require("@/assets/images/potel.png") },
      { header: "Personal", image: require("@/assets/images/sun.png") },
      { header: "Health", image: require("@/assets/images/welcome.png") },
      { header: "Travel", image: require("@/assets/images/potelbot.png") },
      { header: "Fitness", image: require("@/assets/images/icon.png") },
      { header: "Education", image: require("@/assets/images/BG.png") },
      {
        header: "Entertainment",
        image: require("@/assets/images/profile.jpeg"),
      },
      { header: "Technology", image: require("@/assets/images/potel.png") },
      { header: "Food", image: require("@/assets/images/sun.png") },
      { header: "Music", image: require("@/assets/images/welcome.png") },
      { header: "Fashion", image: require("@/assets/images/potelbot.png") },
      { header: "Lifestyle", image: require("@/assets/images/icon.png") },
      { header: "Business", image: require("@/assets/images/BG.png") },
      { header: "Finance", image: require("@/assets/images/profile.jpeg") },
      { header: "Science", image: require("@/assets/images/potel.png") },
      { header: "Art", image: require("@/assets/images/sun.png") },
      { header: "History", image: require("@/assets/images/welcome.png") },
    ],
  },
];

const data = new Array(50).fill(0).map((_, index) => ({ id: index }));
const App = () => {
  const animatedRef = useAnimatedRef<Animated.ScrollView>();
  // const scrollOffset = useScrollViewOffset(animatedRef);
  const viewableItems = useSharedValue<ViewToken[]>([]);
  const scrollOffset = useSharedValue(0);
  const gradientSharedValue = useSharedValue(["#000", "#000"]);
  const [activeGradient, setActiveGradient] = useState<string[]>([
    "#000",
    "#000",
  ]);
  const bottomSheetRef = useRef<BottomSheet>(null);
  // Handle scroll event
  // Calculate gradient directly in useAnimatedStyle

  // Handle scroll event
  const handleScroll = (event) => {
    scrollOffset.value = event.nativeEvent.contentOffset.x;
  };
  // const activeIndex = useDerivedValue(() => {
  //   return scrollOffset.value / StoryListItemWidth;
  // }, [scrollOffset]);

  // const activeGradientValue = useDerivedValue(() => {
  //   const index = Math.round(activeIndex.value);
  //   // console.log("Gradient index:", index); // Log the index used to fetch gradient
  //   // console.log("Category item:", categoryItem[index]); // Log the category item at the index
  //   return categoryItem[index]?.gradient || ["#000", "#000"];
  // }, [activeIndex]);

  // Update gradient in the parent component

  const snapPoints = ["50%", "70%"];
  // useDerivedValue(() => {
  //   console.log(scrollOffset.value);
  // });
  const ListPadding = WindowWidth - StoryListItemWidth;
  const openBottomSheet = () => {
    bottomSheetRef.current?.snapToIndex(0);
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      <FlatList
        contentInsetAdjustmentBehavior="automatic"
        data={squadData}
        keyExtractor={(item, index) => index.toString()}
        onViewableItemsChanged={({ viewableItems: vItems }) => {
          viewableItems.value = vItems;
        }}
        ListHeaderComponent={() => (
          <View
            style={{
              height: StoryListItemHeight + 30,
              width: "100%",
            }}
          >
            <Animated.ScrollView
              ref={animatedRef}
              horizontal
              snapToInterval={StoryListItemWidth}
              decelerationRate={"fast"}
              onScroll={handleScroll}
              disableIntervalMomentum
              showsHorizontalScrollIndicator={false}
              scrollEventThrottle={16} // 1/60fps = 16ms
              contentContainerStyle={{
                width: StoryListItemWidth * squadData.length + ListPadding,
              }}
            >
              {squadData.map((category, index) => {
                return (
                  <CategoryListItem
                    index={index}
                    imageSource={category.squads[0]?.image} // Use the first squad's image as representative
                    key={index}
                    scrollOffset={scrollOffset}
                    gradient={category.gradient}
                    header={category.squadCategory}
                  />
                );
              })}
            </Animated.ScrollView>
          </View>
        )}
        renderItem={({ item }) => (
          <View>
            {item.squads.map((squad, squadIndex) => (
              <Pressable
                onPress={() => openBottomSheet(squad)}
                key={squadIndex}
              >
                <ListItem
                  item={squad}
                  viewableItems={viewableItems}
                  gradient={item.gradient} // Use the category's gradient
                />
              </Pressable>
            ))}
          </View>
        )}
      />
      <BottomSheet
        ref={bottomSheetRef}
        snapPoints={snapPoints}
        index={-1}
        enablePanDownToClose
        backgroundComponent={() => (
          <BlurView
            style={{
              ...StyleSheet.absoluteFillObject,
            }}
            intensity={200}
          />
        )}
        containerStyle={{}}
      >
        <BottomSheetView style={styles.contentContainer}>
          <Text>Awesome 🎉</Text>
        </BottomSheetView>
      </BottomSheet>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  contentContainer: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "transparent",
  },
});

export default App;
