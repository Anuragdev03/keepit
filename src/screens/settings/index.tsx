import { StyleSheet, Text, View, SafeAreaView, Pressable } from "react-native";
import { ThemeConstant } from "../../theme/themeConstant";
import RNFS from 'react-native-fs';
import { pick } from '@react-native-documents/picker';
import { DBContext } from "../../modals";
import Toast from "react-native-toast-message";
import { getCurrentDateTime } from "../../utils/helpers";
import RNRestart from 'react-native-restart';

export default function Settings() {

    const { useRealm } = DBContext;
    const realm = useRealm();


    const line = (
        <View style={styles.line} />
    )

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
    return (
        <SafeAreaView style={{ height: "100%", backgroundColor: ThemeConstant.BACKGROUND_COLOR }}>
            <View style={styles.container}>
                <View style={{ marginVertical: 16 }}>
                    <Pressable onPress={backupRealm}>
                        <Text style={styles.textStyle}>1. Backup Data</Text>
                    </Pressable>
                    {line}
                    <Pressable onPress={restoreRealm}>
                        <Text style={styles.textStyle}>2. Restore Data</Text>
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
    }
})