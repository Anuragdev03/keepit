import { Image, SafeAreaView, StyleSheet, Text, View } from "react-native";
import { ThemeConstant } from "../theme/themeConstant";
import { useEffect } from "react";

export default function SplashScreen(props: any) {
    useEffect(()=> {
        const timeOut = setTimeout(() => {
            props.navigation.navigate("Login");
        }, 2000);

        return () => clearTimeout(timeOut);
    }, [])
    return (
        <SafeAreaView style={{ height: "100%", backgroundColor: ThemeConstant.BACKGROUND_COLOR }}>
            <View style={styles.wrapper}>
                <Image
                    source={require("../assets/logo.png")}
                    style={{ width: 200, height: 200, alignSelf: "center" }}
                />
                <Text style={styles.textStyle}>Open Source Password Manager and Authenticator</Text>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },
    textStyle: {
        color: ThemeConstant.SECONDARY_FONT,
        fontSize: 18,
        textAlign: "center",
        lineHeight: 30,
        fontWeight: "600"
    }
})