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
                    source={require("../assets/app_logo.png")}
                    style={{ width: 150, height: 150, alignSelf: "center" }}
                />
                <Text style={styles.logoText}>KEEP IT</Text>
                <Text style={styles.textStyle}>Your Privacy, Your Control</Text>
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
    logoText: {
        color: ThemeConstant.COLOR_BEIGE,
        fontSize: 22,
        textAlign: "center",
        lineHeight: 30,
        fontWeight: "600",
        letterSpacing: 2,
        marginBottom: 24
    },
    textStyle: {
        color: ThemeConstant.PLACEHOLDER_COLOR,
        fontSize: 18,
        textAlign: "center",
        lineHeight: 30,
        fontWeight: "600"
    }
})