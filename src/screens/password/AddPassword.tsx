import React from "react";
import { View, Text, StyleSheet, ScrollView, Dimensions, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useForm } from "react-hook-form";
import Toast from "react-native-toast-message";

// Redux
import CustomInput from "../../components/CustomInput";
import CustomButton from "../../components/CustomButton";
import TextArea from "../../components/TextArea";
import CryptoJS from "react-native-crypto-js";
import { ThemeConstant } from "../../theme/themeConstant";
import { SALT } from "../../utils/constant";
import { DBContext } from "../../modals";
import { randomStringGenerator } from "../../utils/randomStringGenerator";
import EncryptedStorage from "react-native-encrypted-storage";

export default function AddPassword(props: any) {

    //Form action
    const { handleSubmit, control, setValue } = useForm();
    
    const { useRealm } = DBContext;
    const realm = useRealm()

    const navigation = props.navigation;

    // Handle submit
    async function handleFormSubmit(data: any) {

        if (!data?.userName) {
            Toast.show({
                type: "error",
                text1: "User name is required field",
                visibilityTime: 2000
            })
            return;
        }

        if (!data?.password) {
            Toast.show({
                type: "error",
                text1: "Password is required field",
                visibilityTime: 2000
            })
            return;
        }

        if (!data?.website) {
            Toast.show({
                type: "error",
                text1: "Website is required field",
                visibilityTime: 2000
            })
            return;
        }

        const saltKey = await EncryptedStorage.getItem("encryption_key") ?? SALT;

        const encryptedPassword = CryptoJS.AES.encrypt(data?.password, saltKey).toString();

        try {
            realm.write(() => {
                realm.create("PasswordRecord", {
                    user_name: data?.userName,
                    password: encryptedPassword,
                    website: data?.website,
                    category: data?.category ?? "",
                    note: data?.note ?? ""
                })
            })
            Toast.show({
                type: "success",
                text1: "Data Saved",
                visibilityTime: 2000
            })
            props.navigation.navigate("Main", { screen: "Credentials" })
        } catch (err) {
            console.log(err)
        }
    }

    function generatePassword() {
        const password = randomStringGenerator(16);
        setValue("password", password)
    }

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView>
                <View style={styles.wrapper}>
                    {/* User Name */}
                    <Text style={styles.subHeader}>User Name</Text>
                    <CustomInput
                        name="userName"
                        key={"username"}
                        placeholder={"john@email.com"}
                        control={control}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        rules={{ required: "User name is required" }}
                    />

                    {/* Password */}
                    <Text style={styles.subHeader}>Password</Text>
                    <CustomInput
                        name="password"
                        key={"password"}
                        placeholder={"Min 8 characters"}
                        control={control}
                        rules={{
                            required: "Password is required",
                            minLength: {
                                value: 6,
                                message: "Password should be minimum 6 characters",
                            },
                        }}
                    />

                    <Pressable onPress={generatePassword}>
                        <Text style={styles.gen_pwd}>Generate Password</Text>
                    </Pressable>

                    {/* Website */}
                    <Text style={styles.subHeader}>Website</Text>
                    <CustomInput
                        name="website"
                        placeholder={"example.com"}
                        control={control}
                        key={"website"}
                    />

                    {/* Category */}
                    <Text style={styles.subHeader}>Category</Text>
                    <CustomInput name="category" control={control} placeholder="Social Media/Email" key={"category"} />

                    {/* Note */}
                    <Text style={styles.subHeader}>Note</Text>
                    <TextArea name="note" control={control} numberOfLines={6} key={"note"} />
                    <View
                        style={{
                            flexDirection: "row",
                            width: Dimensions.get("window").width - 10,
                            justifyContent: "space-around",
                        }}
                    >
                        <View style={{ width: "45%" }}>
                            <CustomButton
                                onPress={() => navigation.goBack()}
                                text="Cancel"
                                type="SECONDARY"
                            />
                        </View>
                        <View style={{ width: "45%" }}>
                            <CustomButton
                                onPress={handleSubmit(handleFormSubmit)}
                                text="Save"
                            />
                        </View>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
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
    gen_pwd: {
        color: ThemeConstant.FONT_COLOR,
        fontSize: 12,
        alignSelf: "flex-end",
        textDecorationLine: "underline"
    }
});
