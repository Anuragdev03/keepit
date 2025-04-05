import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import MuiIcon from "react-native-vector-icons/MaterialIcons";

import { ThemeConstant } from "../../theme/themeConstant";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

interface PasswordItem {
    id: string;
    website: string;
    user_name: string;
  }
  
  interface PasswordListProps {
    data: PasswordItem;
    index: number;
    navigation: NativeStackNavigationProp<any>; // Adjust the type based on your navigation stack
  }
  

export default function PasswordList({ data, index, navigation }: PasswordListProps) {
    return (
      <Pressable 
        onPress={() => navigation.navigate("EditCredentials", {data: JSON.stringify(data)})} 
        style={styles.container} 
        key={data.id}
      >
        <View style={styles.content}>
          <View style={styles.row}>
            <View>
              <Text style={styles.websiteText}>
                {index + 1}. {data?.website}
              </Text>
              <Text style={styles.usernameText}>
                {data?.user_name}
              </Text>
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
  }

  const styles = StyleSheet.create({
    container: {
      marginHorizontal: ThemeConstant.MARGIN_HORIZONTAL,
      padding: 10,
      backgroundColor: ThemeConstant.cardBg,
      borderRadius: 10,
      marginVertical: 4,
    },
    content: {
      flexDirection: "row"
    },
    row: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexDirection: "row",
        width: "100%",
      },
      websiteText: {
        color: ThemeConstant.COLOR_WHITE,
        fontWeight: "600",
      },
      usernameText: {
        color: ThemeConstant.FONT_COLOR,
        opacity: 0.6,
      },
  });