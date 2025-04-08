import { useEffect, useState } from "react";
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
import DeleteModal from "../../components/DeleteModal";
import { DBContext } from "../../modals";

export default function EditSecureNotes(props: any) {
    const [titleText, setTitleText] = useState("");
    const [content, setContent] = useState("");
    const navigation = props.navigation;
    const [deleteModal, setDeleteModal] = useState(false);

    const paramsData = props?.route?.params?.data;
    const notesData = JSON.parse(paramsData);

    const { useRealm } = DBContext;
    const realm = useRealm()

    useEffect(() => {
        updateFields();
    }, [])

    function updateFields() {
        try {
            if (notesData) {
                setTitleText(notesData?.title);
                let bytes = CryptoJS.AES.decrypt(notesData?.content, SALT);
                const decryptedValue = bytes.toString(CryptoJS.enc.Utf8);
                setContent(decryptedValue);
            }
        } catch (err) {
            console.log(err)
        }
    }

    function updateNotes() {
        try {
            const encryptedContent = CryptoJS.AES.encrypt(content, SALT).toString();
            const id = new Realm.BSON.ObjectId(notesData?._id);

            realm.write(() => {
                const record = realm.objectForPrimaryKey("SecureNotes", id);
                if (record) {
                    record.updatedAt = new Date().toISOString();
                    if (titleText) record.title = titleText;
                    if (content) record.content = encryptedContent;
                }
            })

            Toast.show({
                type: "success",
                text1: "Record updated successfully"
            })
            props.navigation.navigate("Main", { screen: "SecureNotes" });

        } catch (err) {
            console.log(err);
            Toast.show({
                type: "error",
                text1: "Something went wrong"
            })
        }
    }

    function handleDelete() {
        setDeleteModal(!deleteModal);
    }

    function deleteNote() {
        try {
            const id = new Realm.BSON.ObjectId(notesData?._id);
            realm.write(() => {
                realm.delete(realm.objectForPrimaryKey("SecureNotes", id))
            });

            handleDelete();
            Toast.show({
                type: "success",
                text1: "Record deleted successfully"
            })
            props.navigation.navigate("Main", { screen: "SecureNotes" });
        } catch (err) {
            console.log(err);
            Toast.show({
                type: "error",
                text1: "Something went wrong"
            })
        }
    }

    return (
        <KeyboardAvoidingView
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
                        style={styles.input}
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
                                text={"Delete"}
                                type="TERTIARY"
                                onPress={handleDelete}
                            />
                        </View>
                        <View style={{ width: "45%" }}>
                            <CustomButton
                                text={"Save"}
                                type="PRIMARY"
                                onPress={updateNotes}
                            />
                        </View>
                    </View>
                    <DeleteModal
                        modalVisible={deleteModal}
                        closeModal={handleDelete}
                        handleDelete={deleteNote}
                    />
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