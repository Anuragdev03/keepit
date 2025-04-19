import { Text, View, SafeAreaView, StyleSheet } from "react-native";
import { ThemeConstant } from "../../theme/themeConstant";
import CustomButton from "../../components/CustomButton";
import Toast from "react-native-toast-message";
import { DBContext } from "../../modals";
import EncryptedStorage from "react-native-encrypted-storage";
import CryptoJS from "react-native-crypto-js";
import { SALT } from "../../utils/constant";

export default function AddNewAccount(props: any) {
    const data = props?.route?.params;
    const { useRealm } = DBContext;
    const realm = useRealm()

    async function addData() {
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
                    type: data?.type,
                    issuer: data?.issuer,
                    account: data?.account,
                    algorithm: data?.algorithm,
                    digits: data?.digits,
                    period: data?.period
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
        <SafeAreaView style={{ height: "100%", backgroundColor: ThemeConstant.BACKGROUND_COLOR }}>
            <View style={styles.container}>
                <Text style={styles.textData}>
                    Account: {data?.account}
                </Text>

                <Text style={styles.textData}>
                    Issuer: {data?.issuer}
                </Text>

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
                            onPress={() => props?.navigation.navigate("Main", { screen: "Authenticator" })}
                        />
                    </View>
                    <View style={{ width: "45%" }}>
                        <CustomButton
                            text={"Save"}
                            type="PRIMARY"
                            onPress={addData}
                        />
                    </View>
                </View>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        marginTop: 20
    },
    textData: {
        color: ThemeConstant.FONT_COLOR,
        margin: ThemeConstant.MARGIN_HORIZONTAL
    }
})