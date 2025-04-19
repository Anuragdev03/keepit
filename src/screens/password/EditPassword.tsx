import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Dimensions, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import CryptoJS from "react-native-crypto-js";
import { SALT } from "../../utils/constant";
import { SafeAreaView } from "react-native-safe-area-context";
import MuiIcon from "react-native-vector-icons/MaterialIcons";
import Ionicons from "react-native-vector-icons/Ionicons";

import CustomButton from "../../components/CustomButton";
import { ThemeConstant } from "../../theme/themeConstant";
import CustomInput from "../../components/CustomInput";
import { copyToClipboard } from "../../utils/helpers";
import TextArea from "../../components/TextArea";
import DeleteModal from "../../components/DeleteModal";

import { Realm } from '@realm/react'
import { DBContext } from "../../modals";
import Toast from "react-native-toast-message";
import EncryptedStorage from "react-native-encrypted-storage";


export default function EditPassword(props: any) {
    const navigation = props.navigation;
    const { handleSubmit, control, setValue, getValues } = useForm();

    const [deleteModal, setDeleteModal] = useState(false)
    const paramsData = props?.route?.params?.data;
    const credentialsData = JSON.parse(paramsData);
    const [showPassword, setShowPassword] = useState(false);

    const { useRealm } = DBContext;
    const realm = useRealm()

    useEffect(() => {
        updateFields()
    }, []);

    async function updateFields() {
        try {
            if (credentialsData) {
                const saltKey = await EncryptedStorage.getItem("encryption_key") ?? SALT;
                let bytes = CryptoJS.AES.decrypt(credentialsData?.password, saltKey);
                const decryptedValue = bytes.toString(CryptoJS.enc.Utf8);

                setValue("userName", credentialsData?.user_name);
                setValue("password", decryptedValue);
                setValue("website", credentialsData?.website);
                setValue("category", credentialsData?.category);
                setValue("note", credentialsData?.note);
            }
        } catch (err) {
            console.log(err)
        }
    }

    async function handleFormSubmit(data: any) {
        try {
            const saltKey = await EncryptedStorage.getItem("encryption_key") ?? SALT;
            
            const id = new Realm.BSON.ObjectId(credentialsData?._id);
            const encryptedPassword = CryptoJS.AES.encrypt(data?.password, saltKey).toString();

            realm.write(() => {
                const record = realm.objectForPrimaryKey("PasswordRecord", id)
                if (record) {
                    record.updatedAt = new Date().toISOString();
                    if (data?.userName) record.user_name = data.userName;
                    if (data?.password) record.password = encryptedPassword;
                    if (data?.website) record.website = data.website;
                    if (data?.category) record.category = data.category;
                    if (data?.note) record.note = data.note;
                }
                Toast.show({
                    type: "success",
                    text1: "Record updated successfully"
                })
                navigation.navigate("Main");
            })
        } catch (err) {
            console.log(err);
            Toast.show({
                type: "error",
                text1: "Something went wrong"
            })
        }
    }

    function deleteCredentialRecord() {
        try {
            const id = new Realm.BSON.ObjectId(credentialsData?._id);
            realm.write(() => {
                realm.delete(realm.objectForPrimaryKey("PasswordRecord", id))
            })
            handleDeleteModalChange();
            Toast.show({
                type: "success",
                text1: "Record deleted successfully"
            })
            navigation.navigate("Main");
        } catch (err) {
            console.log(err);
            Toast.show({
                type: "error",
                text1: "Something went wrong"
            })
        }
    }

    function handleDeleteModalChange() {
        setDeleteModal(!deleteModal)
    }

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView>
                <View style={styles.wrapper}>
                    {/* User Name */}
                    <Text style={styles.subHeader}>User Name</Text>
                    <View style={{ position: "relative" }}>
                        <CustomInput
                            name="userName"
                            placeholder={"john@email.com"}
                            control={control}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            rules={{ required: "User name is required" }}
                        />
                        <Pressable
                            style={{ position: "absolute", right: 0 }}
                            onPress={() => copyToClipboard(getValues("userName"))}
                        >
                            <MuiIcon name="content-copy" size={24} color={ThemeConstant.PLACEHOLDER_COLOR} />
                        </Pressable>
                    </View>

                    {/* Password */}
                    <Text style={styles.subHeader}>Password</Text>
                    <View style={{ position: "relative" }}>
                        <CustomInput
                            name="password"
                            placeholder={"Min 8 characters"}
                            control={control}
                            rules={{
                                required: "Password is required",
                                minLength: {
                                    value: 6,
                                    message: "Password should be minimum 6 characters",
                                },
                            }}
                            secureTextEntry={!showPassword}
                        />
                        <Pressable
                            style={{ position: "absolute", right: 0 }}
                            onPress={() => copyToClipboard(getValues("password"))}
                        >
                            <MuiIcon name="content-copy" size={24} color={ThemeConstant.PLACEHOLDER_COLOR} />
                        </Pressable>
                        <Pressable
                            style={{ position: "absolute", right: 30 }}
                            onPress={() => setShowPassword(!showPassword)}
                        >
                            <Ionicons name={showPassword ? "eye-off" : "eye"} size={24} color={ThemeConstant.PLACEHOLDER_COLOR} />
                        </Pressable>
                    </View>

                    {/* Website */}
                    <Text style={styles.subHeader}>Website</Text>
                    <CustomInput
                        name="website"
                        placeholder={"example.com"}
                        control={control}
                    />

                    {/* Category */}
                    <Text style={styles.subHeader}>Category</Text>
                    <CustomInput name="category" control={control} />

                    {/* Note */}
                    <Text style={styles.subHeader}>Note</Text>
                    <TextArea name="note" control={control} />
                    <View
                        style={{
                            flexDirection: "row",
                            width: Dimensions.get("window").width - 10,
                            justifyContent: "space-around",
                        }}
                    >
                        <View style={{ width: "45%" }}>
                            <CustomButton
                                onPress={handleDeleteModalChange}
                                text="Delete"
                                type="TERTIARY"
                            />
                        </View>
                        <View style={{ width: "45%" }}>
                            <CustomButton
                                onPress={handleSubmit(handleFormSubmit)}
                                text="Update"
                            />
                        </View>
                    </View>
                    <DeleteModal modalVisible={deleteModal} closeModal={handleDeleteModalChange} handleDelete={deleteCredentialRecord} />
                </View>
            </ScrollView>
        </SafeAreaView>
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
});