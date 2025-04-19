import { Image, Linking, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";
import { ThemeConstant } from "../../theme/themeConstant";
import MuiIcon from "react-native-vector-icons/MaterialIcons";


export default function About() {

    const line = (
        <View style={styles.line} />
    )

    function emailUs() {
        Linking.openURL("mailto:keepit22@myyahoo.com")
    }

    const openGitHub = () => {
        Linking.openURL('https://github.com/Anuragdev03/keepit');
    };

    const buyMeCoffee = () => {
        Linking.openURL("https://buymeacoffee.com/anuragdev03")
    }

    const openWebsite = () => {
        Linking.openURL("https://keepit123.netlify.app")
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.wrapper}>
                <ScrollView showsVerticalScrollIndicator={false} style={{ marginBottom: 80 }}>
                    <View style={styles.logoWrapper}>
                        <Image
                            style={styles.logo}
                            source={require("./logo.png")}
                        />
                        <Text style={{ color: ThemeConstant.SECONDARY_FONT }}>Version: 1.0.4</Text>
                    </View>
                    {line}

                    <View>
                        <Text style={styles.title}>Features</Text>
                        <Text style={styles.para}>KeepIt is a powerful and easy-to-use security app that combines a Password Manager, Secure Notes, and a 2FA Authenticator—all in one place.</Text>
                        <Text style={[styles.para, { marginVertical: 6 }]}><Text style={styles.textHighlight}>Password Manager:</Text> Safely store and manage all your passwords with strong encryption.</Text>
                        <Text style={[styles.para, { marginVertical: 6 }]}><Text style={styles.textHighlight}>Secure Notes:</Text> Keep your private thoughts, documents, and sensitive data fully protected.</Text>
                        <Text style={[styles.para, { marginVertical: 6 }]}><Text style={styles.textHighlight}>Authenticator:</Text>Authenticator: Generate time-based one-time passwords (TOTP) for two-factor authentication.</Text>
                    </View>
                    {line}

                    <View>
                        <Text style={styles.title}>Email Us</Text>
                        <Pressable onPress={emailUs}>
                            <Text style={[styles.para, { textDecorationLine: "underline" }]}>keepit22@myyahoo.com</Text>
                        </Pressable>
                    </View>
                    {line}

                    <View>
                        <Text style={styles.title}>Support the app ❤️</Text>
                        <Text style={styles.para}>💖 Love the app? Fuel it with a coffee and support future updates!</Text>
                        <Pressable style={styles.coffeeStyle} onPress={buyMeCoffee}>
                            <MuiIcon
                                name="coffee"
                                size={24}
                                color={"#fff"}
                                style={{ paddingHorizontal: 5 }}
                            />
                            <Text style={styles.coffeeBtnText}>Buy me a Coffee</Text>
                        </Pressable>
                    </View>
                    {line}

                    <View>
                        <Text style={styles.title}>Data Collection Policy</Text>
                        <Text style={styles.para}>KeepIt does not collect, store, or share any personal data.
                            All your passwords, notes, and authentication codes are stored securely on your device and never leave it.
                        </Text>
                    </View>
                    {line}

                    <View>
                        <Text style={styles.title}>We are OpenSource</Text>
                        <Pressable onPress={openGitHub}>
                            <Text style={styles.para}>Github Link</Text>
                        </Pressable>
                    </View>

                    <View>
                        <Text style={styles.title}>Website Link</Text>
                        <Pressable onPress={openWebsite}>
                            <Text style={styles.para}>Open website</Text>
                        </Pressable>
                    </View>
                </ScrollView>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        height: "100%",
        backgroundColor: ThemeConstant.BACKGROUND_COLOR,
    },
    logo: {
        width: 200,
        height: 150
    },
    wrapper: {
        flex: 1,
        marginHorizontal: ThemeConstant.MARGIN_HORIZONTAL
    },
    logoWrapper: {
        alignItems: "center"
    },
    line: {
        borderWidth: 1,
        borderBottomColor: ThemeConstant.PLACEHOLDER_COLOR,
        opacity: .2,
        marginVertical: 8
    },
    title: {
        fontWeight: "600",
        color: ThemeConstant.FONT_COLOR,
        marginBottom: 10,
        fontSize: 18,
        marginTop: 8
    },
    para: {
        color: ThemeConstant.SECONDARY_FONT,
        lineHeight: 22
    },
    textHighlight: {
        color: ThemeConstant.FONT_COLOR
    },
    coffeeStyle: {
        backgroundColor: "#FFDD00",
        width: 160,
        padding: 8,
        borderRadius: 8,
        marginVertical: 6,

        display: "flex",
        flexDirection: "row",
        alignItems: "center"
    },
    coffeeBtnText: {
        textAlign: "center",
        color: "#FFF",
        fontWeight: "600"
    }
})