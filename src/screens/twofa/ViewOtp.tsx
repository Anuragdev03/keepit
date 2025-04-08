import { Pressable, SafeAreaView, StyleSheet, Text, View } from "react-native";
import { totp } from 'otplib';
import { useEffect, useState } from "react";
import Toast from "react-native-toast-message";
import { ThemeConstant } from "../../theme/themeConstant";
import CustomButton from "../../components/CustomButton";
import DeleteModal from "../../components/DeleteModal";
import { DBContext } from "../../modals";
import { copyToClipboard } from "../../utils/helpers";
import MuiIcon from "react-native-vector-icons/MaterialIcons";

export default function ViewOTP(props: any) {
    const navigation = props.navigation;
    const accountData = props.route?.params?.data;
    const parsedData = JSON.parse(accountData);

    const [otp, setOtp] = useState("");
    const [remaining, setRemaining] = useState(30);
    const [deleteModal, setDeleteModal] = useState(false);

    const { useRealm } = DBContext;
    const realm = useRealm()

    useEffect(() => {
        updateOtp();
        const interval = setInterval(tick, 1000);

        return () => {
            clearInterval(interval)
        }
    }, [])

    function tick() {
        const step = 30;
        const now = Math.floor(Date.now() / 1000);
        const timeLeft = step - (now % step);
        setRemaining(timeLeft);

        if (timeLeft === 1) {
            updateOtp()
        }
    }

    const updateOtp = () => {
        const secret = parsedData?.secret;
        if (!secret) {
            Toast.show({
                type: "error",
                text1: "Important parameter is missing",
                visibilityTime: 2000,
            });
            return;
        }


        totp.options = { digits: parsedData?.digits, step: parsedData?.period }
        const token = totp.generate(secret);
        setOtp(token);
    };

    function handleDeleteModalChange() {
        setDeleteModal(!deleteModal)
    }

    function deleteRecord() {
        try {
            const id = new Realm.BSON.ObjectId(parsedData?._id);
            realm.write(() => {
                realm.delete(realm.objectForPrimaryKey("Authenticator", id))
            })
            handleDeleteModalChange();
            Toast.show({
                type: "success",
                text1: "Record deleted successfully"
            })
            navigation.navigate("Main", { screen: "Authenticator" });
        } catch (err) {
            console.log(err);
        }
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.card}>
                <Text style={styles.issuer}>{parsedData?.issuer}</Text>
                <Text style={styles.account}>{parsedData?.account}</Text>

                <View style={styles.otpContainer}>
                    <View style={styles.otpValue}>
                        <Text style={styles.otp}>{otp}</Text>
                        <Pressable
                            style={{ marginLeft: 12 }}
                            onPress={() => copyToClipboard(otp)}
                        >
                            <MuiIcon name="content-copy" size={24} color={ThemeConstant.PLACEHOLDER_COLOR} />
                        </Pressable>
                    </View>
                    <Text style={styles.otp}>{remaining}</Text>
                </View>
            </View>

            <View
                style={{
                    flexDirection: "row",
                    justifyContent: "space-around",
                    marginTop: 20
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
                        onPress={updateOtp}
                        text="Generate New"
                    />
                </View>
            </View>
            <DeleteModal modalVisible={deleteModal} closeModal={handleDeleteModalChange} handleDelete={deleteRecord} />

        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: ThemeConstant.BACKGROUND_COLOR,
        padding: ThemeConstant.MARGIN_HORIZONTAL
    },
    card: {
        marginHorizontal: ThemeConstant.MARGIN_HORIZONTAL,
        padding: 15,
        backgroundColor: ThemeConstant.cardBg,
        borderRadius: 10,
        marginVertical: 4,
    },
    issuer: {
        color: ThemeConstant.COLOR_BEIGE,
        fontSize: 18
    },
    account: {
        color: ThemeConstant.FONT_COLOR,
        fontSize: 12
    },
    otp: {
        color: ThemeConstant.COLOR_BEIGE,
        fontSize: 18,
    },
    otpContainer: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexDirection: "row",
        marginTop: 20
    },

    otpValue: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center"
    }
})