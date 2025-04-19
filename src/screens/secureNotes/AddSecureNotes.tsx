import { useState } from "react";
import {
    View,
    Text,
    KeyboardAvoidingView,
    StyleSheet,
    SafeAreaView,
    ScrollView,
    TextInput,
} from "react-native";
import CustomButton from "../../components/CustomButton";
import Toast from "react-native-toast-message";
import { ThemeConstant } from "../../theme/themeConstant";
import { SALT } from "../../utils/constant";
import CryptoJS from "react-native-crypto-js";
import { DBContext } from "../../modals";
import EncryptedStorage from "react-native-encrypted-storage";

export default function AddSecureNotes(props: any) {
    const [titleText, setTitleText] = useState("");
    const [content, setContent] = useState("");
    const navigation = props.navigation;

    const { useRealm } = DBContext;
    const realm = useRealm()

    async function saveSecureNote() {
        if (!titleText) {
            Toast.show({
                type: "error",
                text1: "Title is required field.",
                visibilityTime: 2000,
            });
            return;
        }

        if (!content) {
            Toast.show({
                type: "error",
                text1: "Content is required field.",
                visibilityTime: 2000,
            });
            return;
        }
        try {
            const saltKey = await EncryptedStorage.getItem("encryption_key") ?? SALT;

            const encryptedContent = CryptoJS.AES.encrypt(content, saltKey).toString();
            realm.write(() => {
                realm.create("SecureNotes", {
                    title: titleText,
                    content: encryptedContent
                })
            });

            Toast.show({
                type: "success",
                text1: "Data Saved",
                visibilityTime: 2000
            })
            props.navigation.navigate("Main", { screen: "SecureNotes" });
        } catch (err) {
            console.log(err);
            Toast.show({
                type: "error",
                text1: "Something went wrong",
                visibilityTime: 2000,
            });
        }

    }

    return (
        <KeyboardAvoidingView
            behavior={"height"}
            contentContainerStyle={{ flex: 1 }}
            style={styles.container}
        >
            <SafeAreaView>
                <ScrollView style={styles.wrapper}>
                    <Text style={styles.subHeader}>Title *</Text>
                    <TextInput
                        style={styles.input}
                        value={titleText}
                        onChangeText={(text) => setTitleText(text)}
                    />

                    <Text style={styles.subHeader}>Content *</Text>
                    <TextInput
                        style={[styles.input, { textAlignVertical: 'top' }]}
                        value={content}
                        onChangeText={(text) => setContent(text)}
                        multiline
                        numberOfLines={8}
                    />

                    <View
                        style={{
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "center",
                            marginTop: 20,
                        }}
                    >
                        <View style={{ width: "45%", marginRight: 10 }}>
                            <CustomButton
                                text={"Cancel"}
                                type="SECONDARY"
                                onPress={() => navigation.goBack()}
                            />
                        </View>
                        <View style={{ width: "45%" }}>
                            <CustomButton
                                text={"Save"}
                                type="PRIMARY"
                                onPress={saveSecureNote}
                            />
                        </View>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </KeyboardAvoidingView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: ThemeConstant.BACKGROUND_COLOR,
    },
    wrapper: {
        margin: 10,
    },
    subHeader: {
        color: ThemeConstant.SECONDARY_FONT,
        marginTop: 5,
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
});