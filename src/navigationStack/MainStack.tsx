
import { SafeAreaProvider } from "react-native-safe-area-context";
import { NavigationContainer } from "@react-navigation/native";


import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useAppSelector } from "../store/hook";

//Icons
import Ionicons from "react-native-vector-icons/Ionicons";
import MuiIcon from "react-native-vector-icons/MaterialIcons";

//Auth
import Login from "../screens/auth/Login";
import ResetPassword from "../screens/auth/ResetPassword";
import { ThemeConstant } from "../theme/themeConstant";
import { StyleSheet, Text, View, StatusBar as ReactNativeStatusBar } from "react-native";

// Password
import Password from "../screens/password";
import AddPassword from "../screens/password/AddPassword";
import EditPassword from "../screens/password/EditPassword";

// Secure Notes
import SecureNotes from "../screens/secureNotes";

//Navigators
const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// ScreenNames
const loginScreenName = "Login";
const resetPasswordName = "ResetPassword";
const mainScreen = "Main";
const passwordName = "Credentials";
const addPassword = "AddPassword";
const editCredentials = "EditCredentials";
const secureNotes = "SecureNotes";


const AppNavigator = () => {
    return (
        <Tab.Navigator
            initialRouteName={passwordName}
            // @ts-ignore
            sceneContainerStyle={{ backgroundColor: ThemeConstant.BACKGROUND_COLOR }}
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName: any;
                    let routeName = route.name;

                    if (routeName === passwordName) {
                        iconName = focused ? "key" : "key-outline";
                    } else if (routeName === secureNotes) {
                        iconName = focused ? "document-text" : "document-text-outline";
                    }

                    // else if (routeName === notesName) {
                    //   iconName = focused ? "document-text" : "document-text-outline";
                    // } else if (routeName === settingName) {
                    //   iconName = focused ? "settings" : "settings-outline";
                    // } 

                    return <Ionicons name={iconName} size={size} color={color} />;
                },
                tabBarActiveTintColor: ThemeConstant.COLOR_BEIGE,
                tabBarStyle: {
                    backgroundColor: ThemeConstant.BACKGROUND_COLOR,
                    paddingBottom: 5,
                    paddingTop: 5,
                },
                // header: ({ navigation, route, options }) => {
                //     let title = route.name;
                //     return <Header title={title} style={options.headerStyle} />;
                // },
                headerStyle: { backgroundColor: ThemeConstant.BACKGROUND_COLOR },
                headerTitleStyle: { color: ThemeConstant.FONT_COLOR },
            })}
        >
            {/* PasswordScreen */}
            <Tab.Screen name={passwordName} component={Password} />
            
            {/* Secure Notes */}
            <Tab.Screen name={secureNotes} component={SecureNotes} />

            {/* Notes screen */}
            {/* <Tab.Screen name={notesName} component={Notes} /> */}


            {/* Setting */}
            {/* <Tab.Screen name={settingName} component={SettingScreen} /> */}
        </Tab.Navigator>
    );
};


export default function MainStack() {
    let userReducer = useAppSelector(state => state.userReducer);

    return (
        <SafeAreaProvider>
            <NavigationContainer>
                <Stack.Navigator
                    initialRouteName={loginScreenName}
                    screenOptions={{
                        gestureDirection: "horizontal",
                        gestureEnabled: true,
                        animation: "fade_from_bottom",
                    }}
                >
                    {!userReducer?.isLoggedIn ? (
                        <>
                            <Stack.Screen
                                name={loginScreenName}
                                component={Login}
                                options={{ headerShown: false }}
                            />
                            <Stack.Screen
                                name={resetPasswordName}
                                component={ResetPassword}
                                options={{ headerShown: false }}
                            />
                            <Stack.Screen
                                name={mainScreen}
                                component={AppNavigator}
                                options={{ headerShown: false }}
                            />
                        </>
                    ) :
                        <>
                            <Stack.Screen
                                name={mainScreen}
                                component={AppNavigator}
                                options={{ headerShown: false }}
                            />
                            <Stack.Screen
                                name={addPassword}
                                component={AddPassword}
                                options={{
                                    header: ({ navigation }) => (
                                        <View style={styles.header}>
                                            <View
                                                style={{ flexDirection: "row", alignItems: "center" }}
                                            >
                                                <MuiIcon
                                                    name="arrow-back"
                                                    size={24}
                                                    color={ThemeConstant.FONT_COLOR}
                                                    style={{ paddingHorizontal: 5 }}
                                                    onPress={() => navigation.goBack()}
                                                />
                                                <Text style={styles.headerText}>Add Credentials</Text>
                                            </View>
                                        </View>
                                    ),
                                }}
                            />
                            <Stack.Screen
                                name={editCredentials}
                                component={EditPassword}
                                options={{
                                    header: ({ navigation }) => (
                                        <View style={styles.header}>
                                            <View
                                                style={{ flexDirection: "row", alignItems: "center" }}
                                            >
                                                <MuiIcon
                                                    name="arrow-back"
                                                    size={24}
                                                    color={ThemeConstant.FONT_COLOR}
                                                    style={{ paddingHorizontal: 5 }}
                                                    onPress={() => navigation.goBack()}
                                                />
                                                <Text style={styles.headerText}>Edit Credentials</Text>
                                            </View>
                                        </View>
                                    ),
                                }}
                            />
                        </>}
                </Stack.Navigator>
            </NavigationContainer>
            <ReactNativeStatusBar
                backgroundColor={ThemeConstant.BACKGROUND_COLOR}
                translucent={false}
                barStyle={"light-content"}
            />
        </SafeAreaProvider>
    )
}

const styles = StyleSheet.create({
    header: {
        // marginTop: ReactNativeStatusBar.currentHeight, 
        backgroundColor: ThemeConstant.BACKGROUND_COLOR,
        paddingVertical: 20,
    },
    headerText: {
        color: ThemeConstant.FONT_COLOR,
        fontSize: 18,
        fontWeight: "600",
    },
});