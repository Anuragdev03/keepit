import {
    View,
    Text,
    SafeAreaView,
    StyleSheet,
    RefreshControl,
    Pressable,
    FlatList
} from "react-native";
import Spinner from "../../components/Spinner";
import { useCallback, useState } from "react";

import { ThemeConstant } from "../../theme/themeConstant";
import SearchField from "../../components/SearchField";
// icons
import MuiIcon from "react-native-vector-icons/MaterialIcons";
import { useFocusEffect } from "@react-navigation/native";

import { DBContext } from "../../modals";
import List from "./List";

export default function Twofa(props: any) {
    const [loading, setLoading] = useState(true);
    const [notesList, setNotesList] = useState<any>([])
    const navigation = props.navigation;
    const [refreshing] = useState(false);
    const [showOptions, setShowOptions] = useState(false);

    const { useRealm } = DBContext;
    const realm = useRealm()

    useFocusEffect(
        useCallback(() => {
            getList()
        }, [])
    );

    function getList() {
        try {
            const data = realm.objects("Authenticator");
            setNotesList(data);
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
                .objects("Authenticator")
                .filtered(
                    'issuer CONTAINS[c] $0 OR account CONTAINS[c] $0',
                    searchTerm
                );

            if (filteredData) {
                setNotesList(filteredData);
            } else {
                setNotesList([]);
            }
            if (!searchTerm) {
                getList()
            }

        } catch (err) {
            console.log(err)
        }
    }

    function showOptionsHandler() {
        setShowOptions(!showOptions)
    }

    const scanButton = (
        <Pressable
            style={({ pressed }) => [styles.scan_button]}
            onPress={() => navigation.navigate("ScanQR")}
        >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
                <MuiIcon name="qr-code-scanner" size={20} color="#FFF" />
                <Text
                    style={{
                        color: ThemeConstant.COLOR_WHITE,
                        fontSize: 18,
                        paddingHorizontal: 5,
                    }}
                >
                    Scan
                </Text>
            </View>
        </Pressable>
    )

    const addManuallyBtn = (
        <Pressable
            style={({ pressed }) => [styles.manually_button]}
            onPress={() => navigation.navigate("AddManually")}
        >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
                <MuiIcon name="keyboard" size={24} color="#FFF" />
                <Text
                    style={{
                        color: ThemeConstant.COLOR_WHITE,
                        fontSize: 18,
                        paddingHorizontal: 5,
                    }}
                >
                    Add Manually
                </Text>
            </View>
        </Pressable>
    )

    return (
        <SafeAreaView style={{ height: "100%", backgroundColor: ThemeConstant.BACKGROUND_COLOR }}>
            {loading ? (
                <Spinner />
            ) : (
                <>
                    <SearchField handleChange={getSearchTerm} showSearchButton={false} placeholder="Search" />
                    {notesList?.length ? <Text style={styles.totalCount}>Total records: {notesList?.length}</Text> : ""}
                    <FlatList
                        data={notesList}
                        keyExtractor={(item, index) => `${item.issuer}_${index}`}
                        renderItem={({ item, index }: { item: any, index: number }) => (
                            <List data={item} index={index} navigation={navigation} />
                        )}
                        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={getList} />}
                        initialNumToRender={10}
                        maxToRenderPerBatch={10}
                        windowSize={5}
                    />
                    
                    {/* Add button */}
                    <View>
                        {showOptions ? (
                            <View style={styles.popup}>
                                {scanButton}
                                {addManuallyBtn}
                            </View>
                        ) : null}
                        <Pressable
                            style={({ pressed }) => [styles.add_button]}
                            onPress={showOptionsHandler}
                        >
                            <View style={{ flexDirection: "row", alignItems: "center" }}>
                                <MuiIcon name={showOptions ? "close" : "add"} size={20} color="#FFF" />
                                <Text
                                    style={{
                                        color: ThemeConstant.COLOR_WHITE,
                                        fontSize: 14,
                                        paddingHorizontal: 5,
                                    }}
                                >
                                    {showOptions ? "Close" : "Add"}
                                </Text>
                            </View>
                        </Pressable>
                    </View>
                </>
            )}
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
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
    popup: {
        backgroundColor: 'transparent',
        borderRadius: 10,
        zIndex: 2,
        padding: 10,
    },

    scan_button: {
        backgroundColor: "transparent",
        position: "absolute",
        right: 0,
        bottom: 40,
        opacity: 0.9,
        width: 100,
        height: 40,
        borderRadius: 20,
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "flex-start",

        margin: ThemeConstant.MARGIN_HORIZONTAL,
    },
    manually_button: {
        backgroundColor: "transparent",
        position: "absolute",
        right: 0,
        bottom: 95,
        opacity: 0.9,
        width: 200,
        height: 40,
        borderRadius: 20,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    },
    totalCount: {
        marginHorizontal: ThemeConstant.MARGIN_HORIZONTAL,
        color: ThemeConstant.PLACEHOLDER_COLOR,
        marginBottom: 8
    }
});