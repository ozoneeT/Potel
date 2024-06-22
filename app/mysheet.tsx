import React from "react";
import { Text, View } from "react-native";
import ActionSheet, {
  SheetManager,
  SheetProps,
  registerSheet,
} from "react-native-actions-sheet";

function MySheet(props: SheetProps) {
  return (
    <ActionSheet id={props.sheetId}>
      <View style={{ height: "40%", backgroundColor: "red" }}>
        <Text>Hello World</Text>
      </View>
    </ActionSheet>
  );
}

// Register your Sheet component.
registerSheet("mysheet", MySheet);

export default MySheet;
