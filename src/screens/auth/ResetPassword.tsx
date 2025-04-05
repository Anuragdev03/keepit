import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet, Text, TextInput, View } from "react-native"
import { ThemeConstant } from "../../theme/themeConstant";
import CustomButton from "../../components/CustomButton";
import { useState } from "react";
import Toast from "react-native-toast-message";
import EncryptedStorage from 'react-native-encrypted-storage';

export default function ResetPassword(props:any) {
    const [newPin, setNewPin] = useState("");
    const [recoveryCode, setRecoveryCode] = useState("");

    async function handleReset() {
        const validCode = await EncryptedStorage.getItem("recovery_code");
        console.log(newPin, validCode, recoveryCode);

        if(!validCode) {
            Toast.show({
                type: "error",
                text1: "The recovery code not available on you device. PIN code reset not possible",
                visibilityTime: 2000,
            });
            return
        }

        if(!newPin) {
            Toast.show({
                type: "error",
                text1: "New PIN is required",
                visibilityTime: 2000,
            });
            return
        }

        if(!recoveryCode) {
            Toast.show({
                type: "error",
                text1: "Recovery code is required",
                visibilityTime: 2000,
            });
            return
        }

        if(validCode !== recoveryCode) {
            Toast.show({
                type: "error",
                text1: "Recovery code is wrong",
                visibilityTime: 2000,
            });
            return
        }

        if (validCode === recoveryCode) {
            await EncryptedStorage.setItem("pin", newPin);
            Toast.show({
                type: "success",
                text1: "PIN code updated successfully",
                visibilityTime: 2000,
            });
            props.navigation.navigate("Login");
        }
    }
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.wrapper}>
                <Text style={styles.subHeader}>Recovery Code:</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Enter Recovery Code"
                    placeholderTextColor={ThemeConstant.PLACEHOLDER_COLOR}
                    onChangeText={text => setRecoveryCode(text)}
                />

                <Text style={styles.subHeader}>New PIN code:</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Enter New PIN Code"
                    placeholderTextColor={ThemeConstant.PLACEHOLDER_COLOR}
                    keyboardType="numeric"
                    maxLength={4}
                    onChangeText={text => setNewPin(text)}
                />

                <CustomButton
                    text={"Reset PIN"}
                    onPress={handleReset}
                />
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        backgroundColor: ThemeConstant.BACKGROUND_COLOR,
    },
    wrapper: {
        margin: 10,
    },
    input: {
        borderWidth: 1,
        color: ThemeConstant.SECONDARY_FONT,
        marginVertical: 10,
        marginHorizontal: 5,
        paddingHorizontal: 5,

        borderBottomColor: ThemeConstant.FONT_COLOR,
        borderTopColor: "transparent",
        borderLeftColor: "transparent",
        borderRightColor: "transparent",
    },
    subHeader: {
        color: ThemeConstant.SECONDARY_FONT,
        marginTop: 5,
    },
})