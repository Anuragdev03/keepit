
import { SafeAreaProvider } from "react-native-safe-area-context";
import { NavigationContainer } from "@react-navigation/native";

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

//Auth
import Login from "../screens/auth/Login";
import ResetPassword from "../screens/auth/ResetPassword";
import { useAppSelector } from "../store/hook";

//Navigators
const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// ScreenNames
const loginScreenName = "Login";
const resetPasswordName = "ResetPassword";



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
                        animation: "slide_from_right",
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
                        </>
                    ) :
                        <>
                            <Stack.Screen
                                name={loginScreenName}
                                component={Login}
                                options={{ headerShown: false }}
                            />
                        </>}
                </Stack.Navigator>
            </NavigationContainer>
        </SafeAreaProvider>
    )
}