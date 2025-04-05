import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Pressable, Animated, Modal } from "react-native";
import { ThemeConstant } from "../../theme/themeConstant";
import { SafeAreaView } from "react-native-safe-area-context";

import CustomButton from "../../components/CustomButton";

import { useAppDispatch } from "../../store/hook";

import { login } from "../../store/userSlice";
import Toast from "react-native-toast-message";
import { randomStringGenerator } from "../../utils/randomStringGenerator";
import MuiIcon from "react-native-vector-icons/MaterialIcons";
import EncryptedStorage from 'react-native-encrypted-storage';

import { NativeModules } from 'react-native';
const { ClipboardModule } = NativeModules;

export default function Login(props: any) {
    const PIC_CODE = [1, 2, 3, 4, 5, 6, 7, 8, 9, "Clear", 0, "Delete"];

    const [scaleAnimations] = useState(() =>
        PIC_CODE.map(() => new Animated.Value(1))
    );

    const navigation = props.navigation;
    //dispatch
    const dispatch = useAppDispatch();

    // States
    const [pin, setPin] = useState<Array<number | string>>([]);
    const [isAuthenticated, setIsAuthenticated] = useState(false); // if pin already set will become true
    const [isResetPin, setIsResetPin] = useState(false);
    // const [userPin, setUserPin] = useState("");
    const [modalVisible, setModalVisible] = useState(false);
    const [secureCode, setSecureCode] = useState("");

    useEffect(() => {
        getSavedPin();
    }, []);

    useEffect(() => {
        validatePin()
    }, [pin])

    const getSavedPin = async () => {
        const savedPin = await EncryptedStorage.getItem("pin");
        if (savedPin) {
            setIsAuthenticated(true);
            // setUserPin(savedPin)
        }
    }


    // Animation
    const onPressIn = (index: number) => {
        Animated.spring(scaleAnimations[index], {
            toValue: 0.9, // Shrinks button
            useNativeDriver: true,
        }).start();
    };

    const onPressOut = (index: number) => {
        Animated.spring(scaleAnimations[index], {
            toValue: 1, // Restores to normal size
            useNativeDriver: true,
        }).start();
    };

    function handlePinCode(value: number | string) {
        if (pin.length > 3) {
            return;
        }
        if (value != null && value !== undefined) {
            setPin([...pin, value])
        }
    }


    function handleClear() {
        setPin([]);
    }

    async function savePin() {
        try {
            if (pin.length < 4) {
                Toast.show({
                    type: "error",
                    text1: "PIN Must Be 4 Digits",
                    visibilityTime: 2000,
                });
                return;
            }
            const pinString = pin.join("")

            await EncryptedStorage.setItem("pin", pinString);

            const recoveryCode = randomStringGenerator(20);

            await EncryptedStorage.setItem("recovery_code", recoveryCode);


            setSecureCode(recoveryCode);

            setModalVisible(true)

            Toast.show({
                type: "success",
                text1: "PIN Saved",
                visibilityTime: 2000,
            });
        } catch (err) {
            console.log(err)
        }
    }


    async function validatePin() {
        const savedPin = await EncryptedStorage.getItem("pin");
        if (savedPin?.length !== 4) {
            return
        }
        if (pin.length !== 4) {
            return;
        }

        if (savedPin === pin.join("")) {
            dispatch(login({ status: true }))
            Toast.show({
                type: "success",
                text1: "Login Success",
                visibilityTime: 2000,
            });
            navigation.navigate("Main")
        }
    }

    function handleDelete() {
        if (!pin.length) return;

        let newPin = pin.slice(0, -1);
        setPin(newPin);
    }

    function closeModal() {
        setModalVisible(false);
    }

    function continueToLogin() {
        setIsAuthenticated(true);
        setPin([]);
        closeModal();
    }

    async function copyToClipboard(value: string) {
        ClipboardModule.copyToClipboard(value);
    }

    const goToResetPassword = () => navigation.navigate("ResetPassword")

    const showRecoveryCodeModal = (
        <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={closeModal}
        >
            <View style={styles.centeredView}>
                <View style={styles.modalView}>
                    <Text style={styles.modal_text}>
                        Save this code for PIN code recovery. If you forget your PIN code, you can use it to reset it.
                        If you lose the code, you may not be able to reset your PIN, and your data will be lost.
                    </Text>

                    <View style={{ display: "flex", flexDirection: "row" }}>
                        <Text style={{ margin: 4 }}>{secureCode}</Text>
                        <Pressable
                            // style={}
                            onPress={() => copyToClipboard(secureCode)}
                        >
                            <MuiIcon name="content-copy" size={24} color="#000" />
                        </Pressable>
                    </View>
                    <CustomButton text={"Continue to Login"} onPress={continueToLogin} />
                </View>
            </View>
        </Modal>
    )

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.wrapper}>
                {isAuthenticated === false ? <Text style={styles.header}>Create PIN</Text> : <Text style={styles.header}>Login with PIN</Text>}
                {isAuthenticated === false && isResetPin ? <Text style={styles.entered_pin}>{pin.join("")}</Text> : null}


                <View style={styles.dotsContainer}>
                    {Array.from({ length: 4 }).map((_, index) => {
                        return (
                            <Animated.View
                                key={index}
                                style={[
                                    styles.dot,
                                    { opacity: pin.length > index ? 1 : 0.3 } // Increase opacity when PIN is entered
                                ]}
                            />
                        );
                    })}
                </View>

                <View style={styles?.pinCode_wrapper}>
                    {PIC_CODE.map((val, i) => (
                        <Animated.View key={i} style={{ transform: [{ scale: scaleAnimations[i] }] }}>
                            <Pressable
                                style={styles.key_code}
                                onPressIn={() => onPressIn(i)}
                                onPressOut={() => onPressOut(i)}
                                onPress={() => {
                                    if (val === "Clear") {
                                        handleClear();
                                        return
                                    }
                                    if (val === "Delete") {
                                        handleDelete();
                                        return
                                    }

                                    handlePinCode(val)
                                }}
                            >
                                <Text>{val}</Text>
                            </Pressable>
                        </Animated.View>
                    ))}
                </View>

                {isAuthenticated === false ?
                    <View style={styles.save_btn}>
                        <CustomButton
                            text={"Save"}
                            onPress={savePin}
                        />
                    </View> : null}

                {isAuthenticated ? <Pressable onPress={goToResetPassword}>
                    <Text style={styles.forgot}>Forgot Pin?</Text>
                </Pressable> : null}

                {showRecoveryCodeModal}
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        backgroundColor: ThemeConstant.BACKGROUND_COLOR,
    },
    wrapper: {
        margin: 10,
    },
    header: {
        fontSize: ThemeConstant.FONT_SIZE_PAGETITLE,
        fontWeight: ThemeConstant.FONT_WEIGHT_TITLE,
        color: ThemeConstant.FONT_COLOR,
        marginBottom: 10,
        alignSelf: "center",
        paddingVertical: 20
    },
    pinCode_wrapper: {
        display: "flex",
        flexWrap: "wrap",
        flexDirection: "row",
        justifyContent: "center",
        maxWidth: 300,
        alignSelf: "center"
    },
    key_code: {
        backgroundColor: "#FAFAFA",
        width: 75,
        height: 75,
        borderRadius: 75,
        margin: 10,

        display: "flex",
        alignItems: "center",
        justifyContent: "center"
    },

    entered_pin: {
        color: ThemeConstant.COLOR_WHITE,
        textAlign: "center",
        borderBottomColor: ThemeConstant.COLOR_WHITE,
        fontSize: ThemeConstant.FONT_SIZE_TITLE,
        textDecorationLine: "underline"
    },

    save_btn: {
        width: 200,
        alignSelf: "center",
        marginTop: 20
    },


    dotsContainer: {
        flexDirection: "row",
        gap: 10,
        marginBottom: 20,
        alignSelf: "center"
    },
    dot: {
        width: 12,
        height: 12,
        backgroundColor: "white",
        borderRadius: 10,
        margin: 4
    },

    forgot: {
        color: ThemeConstant.COLOR_WHITE,
        alignSelf: "flex-end",
        marginRight: 55,
        marginTop: 20,
        textDecorationLine: "underline"
    },

    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22,
    },
    modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modal_text: {
        marginBottom: 20
    }
});