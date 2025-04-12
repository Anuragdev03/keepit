import React from "react";
import { TextInput, View, Pressable, StyleSheet, Text, Dimensions } from "react-native";
import { ThemeConstant } from "../theme/themeConstant";

// Dimension
const deviceWidth = Dimensions.get("window").width;

interface SearchFieldProps {
    value?: string;
    handleChange: (text: string) => void;
    handleSearch?: () => void;
    showSearchButton?: boolean;
    placeholder?: string
}

export default function SearchField({ value, handleChange, handleSearch, showSearchButton = true, placeholder = "Search" }: SearchFieldProps) {
    return (
        <View style={styles.container}>
            <TextInput
                value={value}
                onChangeText={handleChange}
                style={[styles.input, {width: showSearchButton ? "80%" : "100%"}]}
                onSubmitEditing={handleSearch}
                placeholder={placeholder}
                placeholderTextColor={ThemeConstant.FONT_COLOR}
            />
            {showSearchButton ? <Pressable onPress={handleSearch} style={styles.button}>
                <Text style={{ color: ThemeConstant.FONT_COLOR }}>Search</Text>
            </Pressable> : null}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        maxWidth: deviceWidth,
        marginHorizontal: 10,
        marginBottom: 24
    },
    input: {
        borderWidth: 1,
        color: ThemeConstant.SECONDARY_FONT,
        // marginVertical: 10,
        // marginHorizontal: 5,
        paddingHorizontal: 5,
        borderColor: ThemeConstant.FONT_COLOR,
        borderRadius: 8,
        width: "80%",
    },
    button: {
        backgroundColor: ThemeConstant.PRIMARY_BUTTON,
        height: 40,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "20%",
        borderRadius: 8
    }
});
