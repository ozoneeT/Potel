import _ from "lodash";
import React, { useCallback, useState } from "react";
import { FlatList } from "react-native";
import {
  View,
  Text,
  Incubator,
  WheelPicker,
  WheelPickerAlign,
  Colors,
  Typography,
  Button,
  ActionBar,
  Picker,
  Stepper,
  Dialog,
  PanningProvider,
} from "react-native-ui-lib";

const monthItems = _.map(
  [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ],
  (item) => ({ label: item, value: item, align: WheelPickerAlign.RIGHT })
);

const yearItems = _.times(2050, (i) => i)
  .reverse()
  .map((item) => ({ label: `${item}`, value: item }));
const dayItems = _.times(31, (i) => i + 1).map((day) => ({
  label: `${day}`,
  value: day,
}));

export default () => {
  const [showDialog, setShowDialog] = useState(false);
  const [yearsValue, setYearsValue] = useState(2022);

  const updateYearsInitialValue = useCallback(
    (increaseYears: boolean) => {
      increaseYears
        ? setYearsValue(Math.min(yearsValue + 1, 2049))
        : setYearsValue(Math.max(yearsValue - 1, 0));
    },
    [yearsValue]
  );

  const onChange = useCallback((value: number | string) => {
    setYearsValue(value as number);
  }, []);

  const onPickDaysPress = useCallback(() => {
    setShowDialog(true);
  }, []);

  const onDialogDismissed = useCallback(() => {
    setShowDialog(false);
  }, []);
  const data = ["new", "bimbo", "shola", "ogo"];

  return (
    <View flex padding-page>
      <Text h1>Wheel Picker</Text>

      <View row center marginT-30>
        <View center>
          <Text h3>Months</Text>
          <WheelPicker
            initialValue={"February"}
            activeTextColor={Colors.$textPrimary}
            inactiveTextColor={Colors.$textNeutralHeavy}
            items={monthItems}
            textStyle={Typography.text60R}
            numberOfVisibleRows={3}
          />
        </View>

        <View center>
          <Text h3>Years</Text>
          <WheelPicker
            numberOfVisibleRows={3}
            initialValue={yearsValue}
            items={yearItems}
            onChange={onChange}
          />
        </View>
      </View>

      <View center marginT-30>
        <Text body>Move the wheel programmatically</Text>
        <Text bodySmall $textNeutral>
          (by updating the initialValue prop)
        </Text>
        <View marginT-10 row>
          <Button
            size={Button.sizes.medium}
            label={"Previous"}
            marginR-20
            onPress={() => updateYearsInitialValue(false)}
          />
          <Button
            size={Button.sizes.medium}
            label={"Next"}
            onPress={() => updateYearsInitialValue(true)}
          />
        </View>
      </View>

      <View center marginT-40>
        <Text h3 marginB-20>
          Days
        </Text>
        <Button
          size={Button.sizes.small}
          label={"Pick Days"}
          onPress={onPickDaysPress}
        />
        <Incubator.Dialog
          width={"90%"}
          bottom
          visible={showDialog}
          onDismiss={onDialogDismissed}
          headerProps={{ showKnob: false, showDivider: false }}
        >
          <WheelPicker initialValue={5} label={"Days"} items={dayItems} />
        </Incubator.Dialog>
        <ActionBar
          actions={[
            { label: "Delete", onPress: () => console.log("delete") },
            { label: "hello" },
            { label: "new" },
          ]}
        />
        <Picker
          value={data}
          placeholder={"Placeholder"}
          onChange={() => console.log("changed")}
        >
          <FlatList
            data={data}
            renderItem={({ item }) => (
              <View>
                <Text>{item}</Text>
              </View>
            )}
          />
        </Picker>
        <Stepper />
        <Dialog
          visible={true}
          onDismiss={() => console.log("dismissed")}
          panDirection={PanningProvider.Directions.DOWN}
        >
          <Text>Content</Text>
        </Dialog>
        <Incubator.Slider
          value={1}
          minimumValue={0}
          maximumValue={10}
          onValueChange={() => console.log("value changed")}
        />
      </View>
    </View>
  );
};
