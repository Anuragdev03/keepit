import React, { useEffect } from "react";
import { Controller, Control, FieldValues, RegisterOptions } from "react-hook-form";
import { View, TextInput, StyleSheet, Text, KeyboardTypeOptions } from "react-native";
import { ThemeConstant } from "../theme/themeConstant";


interface CustomInputProps {
    name: string;
    control: Control<FieldValues>;
    placeholder?: string;
    secureTextEntry?: boolean;
    keyboardType?: KeyboardTypeOptions;
    autoCapitalize?: "none" | "sentences" | "words" | "characters";
    rules?: RegisterOptions;
}

const CustomInput: React.FC<CustomInputProps> = ({
    name,
    control,
    placeholder,
    secureTextEntry = false,
    keyboardType = "default",
    autoCapitalize = "none",
    rules = {},
}) => {
    
    return (
        <Controller
            name={name}
            control={control}
            rules={rules}
            render={({
                field: { value, onChange, onBlur },
                fieldState: { error },
            }) => (
                <>
                    <View style={styles.container}>
                        <TextInput
                            value={value}
                            onChangeText={onChange}
                            onBlur={onBlur}
                            placeholder={placeholder}
                            style={[
                                styles.input,
                                {
                                    borderBottomColor: error
                                        ? ThemeConstant.COLOR_DANGER
                                        : ThemeConstant.FONT_COLOR,
                                },
                            ]}
                            secureTextEntry={secureTextEntry}
                            placeholderTextColor={ThemeConstant.PLACEHOLDER_COLOR}
                            keyboardType={keyboardType}
                            autoCapitalize={autoCapitalize}
                        />
                    </View>
                    {error && (
                        <Text style={{ color: ThemeConstant.COLOR_DANGER }}>
                            {error.message ? error.message : `Error in ${name} field.`}
                        </Text>
                    )}
                </>
            )}
        />
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

export default CustomInput;
