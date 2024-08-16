import {
  Dimensions,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React from "react";
import dummyImage from "@/assets/images/icon.png";
import { LinearGradient } from "expo-linear-gradient";

const hp = Dimensions.get("window").height * 0.3; // 30% of the height

dummyMemberImage = [
  require("@/assets/images/icon.png"),
  require("@/assets/images/icon.png"),
  require("@/assets/images/icon.png"),
  require("@/assets/images/icon.png"),
];
const exploreSquade = () => {
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#12c2e9", "#c471ed", "#f64f59"]}
        style={styles.Card}
      >
        <View style={styles.subCard}>
          <View style={styles.subCardHeader}>
            <View>
              <Image
                style={{
                  width: 100,
                  height: 100,
                  borderRadius: 50,
                  transform: [{ translateY: -20 }],
                  marginHorizontal: 20,
                  borderWidth: 2,
                  borderColor: "#030303",
                }}
                source={dummyImage}
                resizeMode="center"
              />
            </View>
            <View style={styles.memberContainer}>
              {dummyMemberImage.map((image, index) => (
                <Image
                  key={index}
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: 25,
                    marginLeft: index === 0 ? 0 : -15,
                  }}
                  source={image}
                />
              ))}
              <View>
                <Text style={styles.memberNumber}>706</Text>
              </View>
            </View>
          </View>
          <View>
            <Text style={styles.squadName}>Gamer Club</Text>
            <Text style={styles.squadHandle}>@GamersClub</Text>
            <Text style={styles.squadDescription}>
              A place where all game developers are welcomed to discuss, connect
              to unleash their creativity by helping each other.
            </Text>
          </View>
        </View>
        <View></View>
      </LinearGradient>
    </View>
  );
};

export default exploreSquade;

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    paddingTop: 10,
    Top: 10,
  },
  Card: {
    width: "80%",
    height: hp,
    borderRadius: 20,
    justifyContent: "flex-end",
  },
  subCard: {
    backgroundColor: "#252f3d",
    margin: 2,
    borderStartEndRadius: 25,
    borderStartStartRadius: 25,
    borderRadius: 20,
    width: "100%",
    height: hp / 1.2,
    shadowColor: "#000",
    shadowOffset: {
      width: 1,
      height: 2,
    },
    shadowOpacity: 0.52,
    shadowRadius: 5.46,

    elevation: 9,
  },
  memberContainer: {
    backgroundColor: "gray",
    flexDirection: "row",
    borderRadius: 20,
    padding: 5,
    position: "absolute",
    right: 0,
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
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  squadHandle: {
    color: "gray",
    fontSize: 16,
    marginBottom: 5,
  },
});
