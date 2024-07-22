import { useState, useEffect } from "react";
import {
  Button,
  Text,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Image,
  View,
  Platform,
} from "react-native";
import * as MediaLibrary from "expo-media-library";

export default function App() {
  const [albums, setAlbums] = useState(null);
  const [permissionResponse, requestPermission] = MediaLibrary.usePermissions();

  async function getAlbums() {
    if (permissionResponse.status !== "granted") {
      await requestPermission();
    }
    const fetchedAlbums = await MediaLibrary.getAlbumsAsync({
      includeSmartAlbums: true,
    });
    setAlbums(fetchedAlbums);
  }

  return (
    <SafeAreaView style={styles.container}>
      <Button onPress={getAlbums} title="Get albums" />
      <ScrollView>
        {albums &&
          albums.map((album) => <AlbumEntry key={album.id} album={album} />)}
      </ScrollView>
    </SafeAreaView>
  );
}

function AlbumEntry({ album }) {
  const [assets, setAssets] = useState([]);

  useEffect(() => {
    async function getAlbumAssets() {
      try {
        const albumAssets = await MediaLibrary.getAssetsAsync({
          album,
          mediaType: "photo",
        });
        const updatedAssets = await Promise.all(
          albumAssets.assets.map(async (asset) => {
            const assetInfo = await MediaLibrary.getAssetInfoAsync(asset.id);
            return { ...asset, localUri: assetInfo.localUri };
          })
        );
        setAssets(updatedAssets);
      } catch (error) {
        console.error("Error fetching assets:", error);
      }
    }
    getAlbumAssets();
  }, [album]);

  return (
    <View key={album.id} style={styles.albumContainer}>
      <Text>
        {album.title} - {album.assetCount ?? "no"} assets
      </Text>
      <View style={styles.albumAssetsContainer}>
        {assets &&
          assets.map((asset) => {
            return (
              <Image
                key={asset.id}
                source={{ uri: asset.localUri }}
                style={styles.image}
              />
            );
          })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 8,
    justifyContent: "center",
    ...Platform.select({
      android: {
        paddingTop: 40,
      },
    }),
  },
  albumContainer: {
    paddingHorizontal: 20,
    marginBottom: 12,
    gap: 4,
  },
  albumAssetsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  image: {
    width: 50,
    height: 50,
    margin: 5,
  },
});
