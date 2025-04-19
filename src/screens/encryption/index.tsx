import { SafeAreaView, StyleSheet, Text, TextInput, View } from "react-native";
import { ThemeConstant } from "../../theme/themeConstant";
import { useEffect, useState } from "react";
import CustomButton from "../../components/CustomButton";
import EncryptedStorage from 'react-native-encrypted-storage';
import Toast from "react-native-toast-message";


export default function EncryptionKey() {
    const [key, setKey] = useState("");
    const [isKeyUpdated, setIsKeyUpdated] = useState(false)

    function handleKeyChange(val: string) {
        setKey(val)
    }

    useEffect(() => {
        checkStatus();
    }, [])

    async function checkStatus() {
        let eKey = await EncryptedStorage.getItem("encryption_key");
        if(eKey) {
            setIsKeyUpdated(true)
        }
    }

    async function updateEncryptionKey() {
        if(!key) {
            Toast.show({
                type: "info",
                text1: "Invalid Key"
            })
            return
        }
        await EncryptedStorage.setItem("encryption_key", key);
        Toast.show({
            type: "success",
            text1: "Key updated successfully!"
        })
        setKey("");
        setIsKeyUpdated(true)
    }

    async function resetKey() {
        await EncryptedStorage.removeItem("encryption_key");
        Toast.show({
            type: "success",
            text1: "Reset to default key success"
        })
        setIsKeyUpdated(false)
    }
    return (
        <SafeAreaView style={{ height: "100%", backgroundColor: ThemeConstant.BACKGROUND_COLOR }}>
            <View style={styles.container}>
                <Text style={styles.titleStyle}>
                    Enhance Your Security with a Custom Key
                </Text>
                <Text style={styles.textStyle}>This key is used to encrypt and protect your data. By default,
                    a secure key is set, but you can create your own for added security.
                </Text>
                <Text style={styles.infoText}>
                    Make sure to remember it — losing this key may result in loss of access to your data.
                </Text>

                <Text style={styles.label}>Encryption Key</Text>
                <TextInput
                    style={styles.input}
                    onChangeText={handleKeyChange}
                    value={key}
                />
                <CustomButton
                    text={isKeyUpdated ? "Update Key" : "Add Key"}
                    onPress={updateEncryptionKey}
                />
                <CustomButton
                    text={"Reset to Default Key"}
                    type="SECONDARY"
                    onPress={resetKey}
                />

                <Text style={styles.textStyle}>
                    <Text style={styles.infoText}>Warning: </Text>
                    Updating your encryption key will make previously saved records inaccessible.
                    Only new records added after the update will be accessible.
                </Text>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        marginHorizontal: ThemeConstant.MARGIN_HORIZONTAL
    },
    titleStyle: {
        color: ThemeConstant.FONT_COLOR,
        marginVertical: 10,
        fontWeight: "600",
        fontSize: 16
    },
    textStyle: {
        color: ThemeConstant.PLACEHOLDER_COLOR
    },
    infoText: {
        color: ThemeConstant.COLOR_BEIGE,
        marginVertical: 10,
    },
    label: {
        color: ThemeConstant.SECONDARY_FONT
    },

    input: {
        color: ThemeConstant.SECONDARY_FONT,
        marginVertical: 10,
        marginHorizontal: 5,
        paddingHorizontal: 5,
        backgroundColor: 'transparent',

        borderBottomWidth: 1,
        borderBottomColor: ThemeConstant.FONT_COLOR,
    },
})