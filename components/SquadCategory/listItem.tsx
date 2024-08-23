import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import {
  Dimensions,
  Pressable,
  StyleSheet,
  Text,
  View,
  ViewToken,
} from "react-native";
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

type ListItemProps = {
  viewableItems: Animated.SharedValue<ViewToken[]>;
  item: {
    id: number;
  };
  activeGradient: string[];
};

const ListItem: React.FC<ListItemProps> = React.memo(
  ({ item, viewableItems, gradient }) => {
    const dummyMemberImage = [
      require("@/assets/images/icon.png"),
      require("@/assets/images/icon.png"),
      require("@/assets/images/icon.png"),
      require("@/assets/images/icon.png"),
    ];
    const rStyle = useAnimatedStyle(() => {
      const isVisible = Boolean(
        viewableItems.value
          .filter((item) => item.isViewable)
          .find((viewableItem) => viewableItem.item.id === item.id)
      );
      // console.log(interpolatedGradient);
      return {
        opacity: withTiming(isVisible ? 1 : 0.5),
        transform: [
          {
            scale: withTiming(isVisible ? 1 : 0.9),
          },
        ],
      };
    }, []);
    // const hp = Dimensions.get("window").height * 0.15; // 30% of the height
    return (
      <Animated.View style={[rStyle, styles.container]}>
        <LinearGradient
          colors={gradient} // Gradient colors
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradientBorder}
        >
          <View style={styles.innerBox}>
            <View style={styles.cardImages}>
              <Image
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: 50,
                  // transform: [{ translateY: -20 }],

                  borderWidth: 2,
                  borderColor: "#030303",
                }}
                source={dummyMemberImage}
                contentFit="cover"
              />
            </View>

            <View style={styles.cardText}>
              <Text style={styles.squadName}>{item.header}</Text>
              <Text style={styles.squadHandle}>@GamersClub</Text>
              <Text style={styles.squadDescription} numberOfLines={2}>
                A place where all game developers are welcomed to discuss,
                connect to unleash their creativity by helping each other.
              </Text>
            </View>
            <Text style={{ position: "absolute", right: 10, top: 10 }}>🌐</Text>
            <LinearGradient
              colors={["#12c2e9", "#c471ed", "#f64f59"]}
              style={styles.CardButtonGradient}
              start={{ x: 0.2, y: 0.5 }}
            >
              <Pressable style={styles.CardButton}>
                <Text style={styles.ButtonText}>{`>`}</Text>
              </Pressable>
            </LinearGradient>
          </View>
        </LinearGradient>
      </Animated.View>
    );
  }
);

const styles = StyleSheet.create({
  container: { alignItems: "center" },
  Card: {
    width: "95%",
    borderRadius: 20,
    zIndex: -1,
    justifyContent: "center",
  },
  subCard: {
    backgroundColor: "#252f3d",
    margin: 2,
    borderStartEndRadius: 25,
    borderStartStartRadius: 25,
    borderRadius: 15,

    flexDirection: "row",
    shadowColor: "#000",
    shadowOffset: {
      width: 1,
      height: 2,
    },
    shadowOpacity: 0.52,
    shadowRadius: 5.46,
    elevation: 9,
    justifyContent: "space-between",
    alignItems: "center",
  },
  memberContainer: {
    backgroundColor: "gray",
    flexDirection: "row",
    borderRadius: 20,
    padding: 5,
    position: "absolute",
    left: 0,
    marginRight: 10,
    top: "30%",
    alignItems: "center",
  },
  memberNumber: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
    paddingHorizontal: 10,
  },
  squadName: {
    color: "#11111",
    fontSize: 20,
    fontWeight: "bold",
  },
  squadHandle: {
    color: "#22222",
    fontSize: 16,
    marginBottom: 5,
  },
  squadDescription: {
    color: "#22222",
  },

  cardImages: {
    width: "20%",
  },
  cardText: {
    padding: 10,
    width: "70%",
    alignSelf: "center",
  },
  CardButton: {
    width: "100%",
    backgroundColor: "#252f3d",
    alignSelf: "center",
    alignItems: "center",
    borderRadius: 10,
  },
  CardButtonGradient: {
    width: "20%",
    alignSelf: "center",
    alignItems: "center",
    borderRadius: 10,
    padding: 2,
    paddingBottom: 3,
  },
  ButtonText: {
    padding: 10,
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    alignSelf: "center",
    width: "100%",
  },
  gradientBorder: {
    padding: 4, // Thickness of the border
    borderRadius: 15, // Border radius for rounded corners
    width: "90%",
    marginVertical: 10,
  },
  innerBox: {
    backgroundColor: "rgba(255, 255, 255,0.6)",
    borderRadius: 12, // Smaller border radius to fit inside the gradient border
    flexDirection: "row",
    padding: 10,
    alignItems: "center",
    overflow: "hidden",
  },
  boxText: {
    fontSize: 16,
    color: "#333", // Text color
  },
});

export { ListItem };
