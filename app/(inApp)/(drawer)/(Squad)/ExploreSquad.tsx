import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
  ViewToken,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import Animated, {
  useAnimatedRef,
  useScrollViewOffset,
  useSharedValue,
} from "react-native-reanimated";
import React, { useRef } from "react";

import {
  CategoryListItem,
  StoryListItemHeight,
  StoryListItemWidth,
  WindowWidth,
} from "@/components/SquadCategory/category";
import { ListItem } from "@/components/SquadCategory/listItem";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { BlurView } from "expo-blur";

export const categoryItem = [
  {
    image: require("@/assets/images/icon.png"),
    gradient: ["#4c669f", "#3b5998", "#192f6a"],
    header: "General",
  },
  {
    image: require("@/assets/images/BG.png"),
    gradient: ["#b92b27", "#1565C0"], // Fixed double #
    header: "Community",
  },
  {
    image: require("@/assets/images/profile.jpeg"),
    gradient: ["#12c2e9", "#c471ed", "#f64f59"], // Fixed double #
    header: "Work",
  },
  {
    image: require("@/assets/images/potel.png"),
    gradient: ["#FC466B", "#3F5EFB"], // Fixed double #
    header: "Random",
  },
  {
    image: require("@/assets/images/sun.png"),
    gradient: ["#59C173", "#a17fe0", "#5D26C1"],
    header: "Personal",
  },
  {
    image: require("@/assets/images/welcome.png"),
    gradient: ["#8360c3", "#2ebf91"],
    header: "Health",
  },
  {
    image: require("@/assets/images/potelbot.png"),
    gradient: ["#f953c6", "#b91d73"],
    header: "Travel",
  },
];
const data = new Array(50).fill(0).map((_, index) => ({ id: index }));
const App = () => {
  const animatedRef = useAnimatedRef<Animated.ScrollView>();
  const scrollOffset = useScrollViewOffset(animatedRef);
  const viewableItems = useSharedValue<ViewToken[]>([]);
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = ["50%", "70%"];
  const activeCategoryIndex = useSharedValue(0);

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
        data={data}
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
              disableIntervalMomentum
              showsHorizontalScrollIndicator={false}
              scrollEventThrottle={16} // 1/60fps = 16ms
              contentContainerStyle={{
                width: StoryListItemWidth * categoryItem.length + ListPadding,
              }}
            >
              {categoryItem.map((story, index) => {
                return (
                  <CategoryListItem
                    index={index}
                    imageSource={story.image}
                    key={index}
                    scrollOffset={scrollOffset}
                    gradient={story.gradient}
                    header={story.header}
                    activeCategoryIndex={activeCategoryIndex}
                  />
                );
              })}
            </Animated.ScrollView>
          </View>
        )}
        renderItem={({ item }) => {
          return (
            <Pressable onPress={openBottomSheet}>
              <ListItem
                item={item}
                viewableItems={viewableItems}
                activeCategoryIndex={activeCategoryIndex}
                gradient={categoryItem[activeCategoryIndex.value].gradient}
              />
            </Pressable>
          );
        }}
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
