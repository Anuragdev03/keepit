import React from "react";
import { Controller, Control, FieldValues, RegisterOptions } from "react-hook-form";
import { View, TextInput, StyleSheet, Text, KeyboardTypeOptions } from "react-native";
import { ThemeConstant } from "../theme/themeConstant";

interface TextAreaProps {
    name: string;
    control: Control<FieldValues>;
    placeholder?: string;
    secureTextEntry?: boolean;
    keyboardType?: KeyboardTypeOptions;
    autoCapitalize?: "none" | "sentences" | "words" | "characters";
    numberOfLines?: number;
}

const TextArea: React.FC<TextAreaProps> = ({
    name,
    control,
    placeholder,
    secureTextEntry = false,
    keyboardType = "default",
    autoCapitalize = "none",
    numberOfLines = 4,
}) => {
    return (
        <View style={styles.container}>
            <Controller
                name={name}
                control={control}
                render={({ field: { value, onChange, onBlur } }) => (
                    <TextInput
                        multiline={true}
                        numberOfLines={numberOfLines}
                        value={value}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        placeholder={placeholder}
                        style={styles.input}
                        secureTextEntry={secureTextEntry}
                        placeholderTextColor={ThemeConstant.PLACEHOLDER_COLOR}
                        keyboardType={keyboardType}
                        autoCapitalize={autoCapitalize}
                    />
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {},
    input: {
        color: ThemeConstant.SECONDARY_FONT,
        marginVertical: 10,
        marginHorizontal: 5,
        paddingHorizontal: 5,
        backgroundColor: 'transparent',

        borderBottomWidth: 1,
        borderBottomColor: ThemeConstant.FONT_COLOR,
    },
});

export default TextArea;