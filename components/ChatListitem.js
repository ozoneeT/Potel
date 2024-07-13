import { Image, StyleSheet, Text, View } from "react-native";
import React from "react";

const ChatListitem = () => {
  return (
    <View>
      <Image
        source={{
          uri: "https://scontent-los2-1.xx.fbcdn.net/v/t39.30808-1/297585560_3431857003767443_3338558876947054712_n.jpg?stp=dst-jpg_p200x200&_nc_cat=101&ccb=1-7&_nc_sid=0ecb9b&_nc_eui2=AeHLpK2WHdb1b7O55i_yWc-76C01zyc6TpDoLTXPJzpOkAQJKResYakxEzsTEDIEfcYrHEQzOWkzWh3NpjqtQEqp&_nc_ohc=pSr2oTZu03IQ7kNvgGoA6jl&_nc_ht=scontent-los2-1.xx&oh=00_AYA5EKhJztcsxZlwnsBAWGmibfb-j09tEVvOOSjZahOBvA&oe=66977FDC",
        }}
        style={styles.image}
      />
      <View>
        <View>
          <Text>David</Text>
        </View>
      </View>
    </View>
  );
};

export default ChatListitem;

const styles = StyleSheet.create({});
