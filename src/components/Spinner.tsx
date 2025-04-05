import React from "react";
import { ActivityIndicator, View } from "react-native";

// Theme
import {ThemeConstant} from "../theme/themeConstant";

export default function Spinner() {
    return (
        <View style={{flexDirection: "row", alignItems: "center", justifyContent: "center", flex: 1}}>
            <ActivityIndicator size="large" color={ThemeConstant.FONT_COLOR} />
        </View>
    )
}