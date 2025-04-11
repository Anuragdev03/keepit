import { StyleSheet, Text, View, SafeAreaView, Pressable, Linking } from "react-native";
import { ThemeConstant } from "../../theme/themeConstant";
import RNFS from 'react-native-fs';
import { pick } from '@react-native-documents/picker';
import { DBContext } from "../../modals";
import Toast from "react-native-toast-message";
import { getCurrentDateTime } from "../../utils/helpers";
import RNRestart from 'react-native-restart';
import MuiIcon from "react-native-vector-icons/MaterialIcons";
import { useState } from "react";

export default function Settings(props: any) {

    const { useRealm } = DBContext;
    const realm = useRealm();
    const [showBackupText, setShowBackupText] = useState(false);
    const [showRestoreText, setShowRestoreText] = useState(false);

    const line = (
        <View style={styles.line} />
    )

    const privacyPolicy = () => {
        Linking.openURL("https://keepit-auth.my.canva.site")
    }

    async function backupRealm() {
        try {
            // Source file (Realm file)
            const realmFilePath = realm.path;

            // Destination path (backup location)
            const backupFilePath = RNFS.DownloadDirectoryPath + `/backup_${getCurrentDateTime()}.realm`;

            // Copy the realm file to backup location
            await RNFS.copyFile(realmFilePath, backupFilePath);

            Toast.show({
                type: "success",
                text1: "Backup stored in the downloads folder"
            })

        } catch (error) {
            console.error("Error backing up realm file: ", error);
        }
    }

    async function restoreRealm() {
        try {

            const [file] = await pick();

            const backupPath = file.uri;
            const realmPath = realm.path;

            await RNFS.copyFile(backupPath, realmPath);

            Toast.show({
                type: "success",
                text1: "Restore successful. Please re-open the app"
            })
            RNRestart.Restart()
        } catch (err) {
            console.log(err)
        }
    }

    function handleBackupText() {
        setShowBackupText(!showBackupText);
    }

    function handleRestoreText() {
        setShowRestoreText(!showRestoreText);
    }

    function gotoAboutScreen() {
        props.navigation.navigate("About");
    }

    const backupDesc = `Your data is being securely backed up to your device storage.You can restore it later if needed. The backup file will be saved in the Download/ folder as backup_<current_date>_<time>.realm. Make sure not to delete it from your storage.`;
    const restoreDesc = `Restore your previously backed-up data from storage. This will overwrite your current data with the selected backup file.`;
    return (
        <SafeAreaView style={{ height: "100%", backgroundColor: ThemeConstant.BACKGROUND_COLOR }}>
            <View style={styles.container}>
                <View style={{ marginVertical: 16 }}>
                    {/* Backup */}
                    <Pressable onPress={handleBackupText} style={styles.row}>
                        <Text style={styles.textStyle}>1. Backup Data</Text>
                        <MuiIcon
                            name={showBackupText ? "keyboard-arrow-down" : "keyboard-arrow-right"}
                            size={24}
                            color={ThemeConstant.COLOR_BEIGE}
                        />
                    </Pressable>
                    {showBackupText ?
                        <View>
                            <Text style={styles.desc}>
                                {backupDesc}
                            </Text>
                            <Pressable onPress={backupRealm} style={styles.btn}>
                                <Text style={styles.btnText}>
                                    Click to Backup
                                </Text>
                            </Pressable>
                        </View> : null
                    }
                    {line}
                    {/* Restore */}
                    <Pressable onPress={handleRestoreText} style={styles.row}>
                        <Text style={styles.textStyle}>2. Restore Data</Text>
                        <MuiIcon
                            name={showRestoreText ? "keyboard-arrow-down" : "keyboard-arrow-right"}
                            size={24}
                            color={ThemeConstant.COLOR_BEIGE}
                        />
                    </Pressable>
                    {showRestoreText ?
                        <View>
                            <Text style={styles.desc}>
                                {restoreDesc}
                            </Text>
                            <Pressable onPress={restoreRealm} style={styles.btn}>
                                <Text style={styles.btnText}>Click to Restore</Text>
                            </Pressable>
                        </View> : null
                    }
                    {line}
                    {/* About */}
                    <Pressable onPress={gotoAboutScreen} style={styles.row}>
                        <Text style={styles.textStyle}>3. About</Text>
                        <MuiIcon
                            name={"keyboard-arrow-right"}
                            size={24}
                            color={ThemeConstant.COLOR_BEIGE}
                        />
                    </Pressable>
                    {line}

                    {/* Privacy policy */}

                    <Pressable onPress={privacyPolicy} style={styles.row}>
                        <Text style={styles.textStyle}>4. Privacy Policy</Text>
                        <MuiIcon
                            name={"link"}
                            size={24}
                            color={ThemeConstant.COLOR_BEIGE}
                        />
                    </Pressable>
                </View>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        marginHorizontal: ThemeConstant.MARGIN_HORIZONTAL
    },
    line: {
        borderWidth: 1,
        borderBottomColor: ThemeConstant.PLACEHOLDER_COLOR,
        opacity: .2,
        marginVertical: 8
    },
    textStyle: {
        color: ThemeConstant.FONT_COLOR,
        marginVertical: 10
    },
    row: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between"
    },
    desc: {
        color: ThemeConstant.PLACEHOLDER_COLOR,
        textAlign: "left",
        fontSize: 16
    },
    btn: {
        width: 130,

        padding: 8,
        marginVertical: 16,

        borderRadius: 5,
        backgroundColor: ThemeConstant.PRIMARY_BUTTON
    },
    btnText: {
        color: ThemeConstant.FONT_COLOR, fontWeight: 600, textAlign: "center"
    }
})