import React from "react";
import { View, Pressable, Text, StyleSheet } from "react-native";
import { ThemeConstant } from "../../theme/themeConstant";
import MuiIcon from "react-native-vector-icons/MaterialIcons";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

// Define the type for your data object
interface SecureNote {
  uid: string;
  issuer: string;
  account: string
  [key: string]: any; // in case there are additional properties
}

// Define the props for the component
interface ListProps {
  data: SecureNote;
  index: number;
  navigation: NativeStackNavigationProp<any>; // Replace `any` with your stack param list if available
}

const List: React.FC<ListProps> = ({ data, index, navigation }) => {
  return (
    <Pressable
      onPress={() => navigation.navigate("ViewOtpScreen", { data: JSON.stringify(data) })}
      style={styles.container}
      key={data?.uid + index}
    >
      <View style={styles.content}>
        <View
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexDirection: "row",
            width: "100%",
          }}
        >
          <View>
            <Text style={{ color: ThemeConstant.COLOR_WHITE, fontWeight: "600", fontSize: 18 }}>
              {index + 1}. {data?.issuer}
            </Text>
            <Text style={{ color: ThemeConstant.SECONDARY_FONT, fontSize: 12 }}>{data?.account}</Text>
          </View>
          <MuiIcon
            name="keyboard-arrow-right"
            size={24}
            color={ThemeConstant.COLOR_BEIGE}
          />
        </View>
      </View>
    </Pressable>
  );
};

export default List;

const styles = StyleSheet.create({
  container: {
    marginHorizontal: ThemeConstant.MARGIN_HORIZONTAL,
    padding: 15,
    backgroundColor: ThemeConstant.cardBg,
    borderRadius: 10,
    marginVertical: 4,
  },
  content: {
    flexDirection: "row",
  },
});
