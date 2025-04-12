import React, { useCallback, useState } from "react";
import { View, Text, Pressable, StyleSheet, Animated, RefreshControl, SafeAreaView } from "react-native";

// icons
import MuiIcon from "react-native-vector-icons/MaterialIcons";

import Spinner from "../../components/Spinner";
import { ThemeConstant } from "../../theme/themeConstant";
import SearchField from "../../components/SearchField";
import { DBContext } from "../../modals";
import PasswordList from "./PasswordList";
import { useFocusEffect } from "@react-navigation/native";

import { FlashList } from "@shopify/flash-list";

export default function Password(props: any) {
    const navigation = props.navigation;
    const [credentials, setCredentials] = useState<any>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const [scaleAnimations] = useState(() =>
        new Animated.Value(1)
    );

    const { useRealm } = DBContext;
    const realm = useRealm()

    useFocusEffect(
        useCallback(() => {
            getCredentials()
        }, [])
    );

    async function getCredentials() {
        try {
            const data = realm.objects("PasswordRecord");
            setCredentials(data);

        } catch (err) {
            console.log(err)
        } finally {
            setLoading(false)
        }
    }

    function getSearchTerm(value: string) {
        handleSearch(value)
    }

    function handleSearch(searchTerm?: string) {
        try {
            const filteredData = realm
                .objects("PasswordRecord")
                .filtered(
                    'website CONTAINS[c] $0 OR user_name CONTAINS[c] $0',
                    searchTerm
                );

            if (filteredData) {
                setCredentials(filteredData);
            } else {
                setCredentials([]);
            }
            if (!searchTerm) {
                getCredentials()
            }

        } catch (err) {
            console.log(err)
        }
    }

    // Animation
    const onPressIn = () => {
        Animated.spring(scaleAnimations, {
            toValue: 0.9, // Shrinks button
            useNativeDriver: true,
        }).start();
    };

    const onPressOut = () => {
        Animated.spring(scaleAnimations, {
            toValue: 1, // Restores to normal size
            useNativeDriver: true,
        }).start();
    };


    return (
        <SafeAreaView style={{ height: "100%", backgroundColor: ThemeConstant.BACKGROUND_COLOR }}>
            {loading ? <Spinner /> :
                <>
                    <SearchField handleChange={getSearchTerm} showSearchButton={false} placeholder="Search Credentials"  />
                    {credentials?.length ? <Text style={styles.totalCount}>Total records: {credentials?.length}</Text> : ""}
                    <FlashList
                        data={credentials}
                        renderItem={({ item, index }: { item: any, index: number }) => (
                            <PasswordList data={item} index={index} navigation={navigation} />
                        )}
                        keyExtractor={(item, index) => `${item.user_name}_${index}`}
                        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={getCredentials} />}
                        estimatedItemSize={100}
                    />
                    {/* Add button */}
                    <Animated.View style={{ transform: [{ scale: scaleAnimations }] }}>

                        <Pressable onPressIn={onPressIn} onPressOut={onPressOut} style={({ pressed }) => [styles.add_button]} onPress={() => navigation.navigate("AddPassword")}>
                            <View style={{ flexDirection: "row", alignItems: "center" }}>
                                <MuiIcon name="add" size={20} color="#FFF" />
                                <Text style={{ color: ThemeConstant.COLOR_WHITE, fontSize: 14, paddingHorizontal: 5 }}>
                                    ADD
                                </Text>
                            </View>
                        </Pressable>
                    </Animated.View>
                </>
            }
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    card: {
        borderBottomColor: ThemeConstant.FONT_COLOR,
        padding: 10,
        marginHorizontal: ThemeConstant.MARGIN_HORIZONTAL,
    },
    add_button: {
        backgroundColor: ThemeConstant.PRIMARY_BUTTON,
        position: "absolute",
        right: 0,
        bottom: 0,
        opacity: 0.9,
        width: 100,
        height: 40,
        borderRadius: 20,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",

        margin: ThemeConstant.MARGIN_HORIZONTAL,
    },
    totalCount: {
        marginHorizontal: ThemeConstant.MARGIN_HORIZONTAL,
        color: ThemeConstant.PLACEHOLDER_COLOR,
        marginBottom: 8
    }
});