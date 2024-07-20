import {
  View,
  Text,
  ScrollView,
  FlatList,
  SafeAreaView,
  Platform,
} from "react-native";
import chats from "@/assets/data/chats.json";
import ChatRow from "@/components/ChatRow";
import { defaultStyles } from "@/constants/Styles";

const Page = () => {
  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={{
        paddingBottom: 40,
        backgroundColor: "#fff",
      }}
    >
      <SafeAreaView style={Platform.OS === "android" && { marginTop: 100 }}>
        <FlatList
          data={chats}
          renderItem={({ item }) => <ChatRow {...item} />}
          keyExtractor={(item) => item.id.toString()}
          ItemSeparatorComponent={() => (
            <View style={[defaultStyles.separator, { marginLeft: 90 }]} />
          )}
          scrollEnabled={false}
        />
      </SafeAreaView>
    </ScrollView>
  );
};
export default Page;
