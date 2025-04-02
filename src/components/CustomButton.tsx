import React from "react";
import {
  Text,
  StyleSheet,
  Pressable,
  ActivityIndicator,
} from "react-native";
import {ThemeConstant} from "../theme/themeConstant";

interface CustomButtonProps {
    onPress: () => void;
    text: string;
    type?: "PRIMARY" | "SECONDARY" | "TERTIARY"; // Adjust based on your use cases
    bgColor?: string;
    fgColor?: string;
    isLoading?: boolean;
  }

  const CustomButton: React.FC<CustomButtonProps> = ({
    onPress,
    text,
    type = "PRIMARY",
    bgColor,
    fgColor,
    isLoading = false,
  }) => {
    return (
      <Pressable
        onPress={onPress}
        style={[
          styles.container,
          styles[`container_${type}`], // Type assertion for dynamic styles
          bgColor ? { backgroundColor: bgColor } : {},
        ]}
      >
        {isLoading ? (
          <ActivityIndicator size="small" color="#0000ff" />
        ) : (
          <Text
            style={[
              styles.text,
              styles[`text_${type}` as keyof typeof styles], // Type assertion
              fgColor ? { color: fgColor } : {},
            ]}
          >
            {text}
          </Text>
        )}
      </Pressable>
    );
  };

const styles:any = StyleSheet.create({
  container: {
    width: "100%",

    padding: 12,
    marginVertical: 5,

    alignItems: "center",
    borderRadius: 5,
  },

  container_PRIMARY: {
    backgroundColor: ThemeConstant.PRIMARY_BUTTON,
  },

  container_SECONDARY: {
    backgroundColor: ThemeConstant.SECONDARY_BUTTON,
  },

  container_TERTIARY: {
    backgroundColor: ThemeConstant.COLOR_DANGER,
    borderColor: ThemeConstant.COLOR_WHITE,
  },

  text: {
    color: ThemeConstant.FONT_COLOR,
    letterSpacing: 1
  },

  text_SECONDARY: {
    color: ThemeConstant.POWDER_WHITE
  },

  text_TERTIARY: {
    color: ThemeConstant.COLOR_WHITE,
    fontWeight: "600",
    letterSpacing: 1
  },
});

export default CustomButton;
