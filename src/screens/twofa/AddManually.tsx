import React from "react";
import { View, Text, StyleSheet, ScrollView, Dimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useForm } from "react-hook-form";
import Toast from "react-native-toast-message";

// Redux
import CustomInput from "../../components/CustomInput";
import CustomButton from "../../components/CustomButton";
import { ThemeConstant } from "../../theme/themeConstant";
import { DBContext } from "../../modals";
import EncryptedStorage from "react-native-encrypted-storage";
import { SALT } from "../../utils/constant";
import CryptoJS from "react-native-crypto-js";

export default function AddManually(props: any) {

    //Form action
    const { handleSubmit, control, setValue } = useForm();

    const { useRealm } = DBContext;
    const realm = useRealm()

    const navigation = props.navigation;

    // Handle submit
    async function handleFormSubmit(data: any) {
        try {
            if (!data?.secret) {
                Toast.show({
                    type: "error",
                    text1: "Required values are missing",
                    visibilityTime: 2000,
                });
                return
            }
            const saltKey = await EncryptedStorage.getItem("encryption_key") ?? SALT;
            const encryptedSecret = CryptoJS.AES.encrypt(data?.secret, saltKey).toString();


            realm.write(() => {
                realm.create("Authenticator", {
                    secret: encryptedSecret,
                    type: "totp",
                    issuer: data?.issuer,
                    account: data?.account,
                    digits: 6,
                    period: 30
                })
            })

            Toast.show({
                type: "success",
                text1: "Account added successfully",
                visibilityTime: 2000,
            });
            props?.navigation.navigate("Main", { screen: "Authenticator" })
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
        <SafeAreaView style={styles.container}>
            <ScrollView>
                <View style={styles.wrapper}>
                    {/* User Name */}
                    <Text style={styles.subHeader}>Account</Text>
                    <CustomInput
                        name="account"
                        key={"account"}
                        control={control}
                        autoCapitalize="none"
                        rules={{ required: "Name is required" }}
                    />

                    {/* Password */}
                    <Text style={styles.subHeader}>Secret</Text>
                    <CustomInput
                        name="secret"
                        key={"secret"}
                        control={control}
                    />

                    {/* Website */}
                    <Text style={styles.subHeader}>Issuer</Text>
                    <CustomInput
                        name="issuer"
                        control={control}
                        key={"issuer"}
                    />

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
