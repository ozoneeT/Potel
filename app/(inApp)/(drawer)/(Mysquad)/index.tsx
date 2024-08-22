import * as React from "react";
import { View, StyleSheet, Text } from "react-native";
import { FadeInRight } from "react-native-reanimated";
import Carousel from "react-native-reanimated-carousel";
import {
  LongPressGestureHandler,
  TouchableOpacity,
} from "react-native-gesture-handler";
import Animated from "react-native-reanimated";
import Constants from "expo-constants";
import { ActivityIndicator } from "react-native";
import { Image } from "expo-image";

const HEADER_HEIGHT = 100;

interface Props {
  style?: any;
  index?: number;
  showIndex?: boolean;
  img?: any;
}

export const SBImageItem: React.FC<Props> = ({
  style,
  index: _index,
  showIndex = true,
  img,
}) => {
  const index = _index ?? 0;
  const source = React.useRef({
    uri: `https://picsum.photos/id/${index}/400/300`,
  }).current;

  return (
    <View style={[styles.container, style]}>
      <ActivityIndicator size="small" />
      <Image
        cachePolicy={"memory-disk"}
        key={index}
        style={styles.image}
        source={img ?? source}
      />
      {showIndex && (
        <Text
          style={{
            position: "absolute",
            color: "#6E6E6E",
            fontSize: 40,
            backgroundColor: "#EAEAEA",
            borderRadius: 5,
            overflow: "hidden",
            paddingHorizontal: 10,
            paddingTop: 2,
          }}
        >
          {index}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
    borderRadius: 8,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
    position: "absolute",
  },
});

interface SBItemProps {
  style?: any;
  index?: number;
  pretty?: boolean;
  showIndex?: boolean;
  img?: any;
}

export const SBItem: React.FC<SBItemProps> = (props) => {
  const {
    style,
    showIndex = true,
    index,
    pretty,
    img,
    ...animatedViewProps
  } = props;
  const enablePretty = Constants?.expoConfig?.extra?.enablePretty || false;
  const [isPretty, setIsPretty] = React.useState(pretty || enablePretty);

  return (
    <LongPressGestureHandler
      onActivated={() => {
        setIsPretty(!isPretty);
      }}
    >
      <Animated.View style={{ flex: 1 }} {...animatedViewProps}>
        <SBImageItem
          style={style}
          index={index}
          showIndex={typeof index === "number" && showIndex}
          img={img}
        />
      </Animated.View>
    </LongPressGestureHandler>
  );
};

function Index() {
  const [loop, setLoop] = React.useState<boolean>(false);
  const data = React.useRef<number[]>([...new Array(6).keys()]).current;
  const viewCount = 5;

  return (
    <View style={{ flex: 1 }}>
      <Carousel
        style={{
          width: "100%",
          height: 240,
          alignItems: "center",
          justifyContent: "center",
        }}
        width={280}
        height={210}
        mode="vertical-stack"
        loop={loop}
        snapEnabled={true}
        snapDirection="left"
        data={data}
        modeConfig={{
          snapDirection: "left",
          stackInterval: 8,
        }}
        customConfig={() => ({ type: "positive", viewCount })}
        renderItem={({ index }) => (
          <SBItem
            index={index}
            key={index}
            entering={FadeInRight.delay((viewCount - index) * 100).duration(
              200
            )}
          />
        )}
      />
    </View>
  );
}

export default Index;
