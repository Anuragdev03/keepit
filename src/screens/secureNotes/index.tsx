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

export default function SecureNotes(props: any) {
    const [loading, setLoading] = useState(true);
    const [notesList, setNotesList] = useState<any>([])
    const navigation = props.navigation;
    const [refreshing] = useState(false);

    const { useRealm } = DBContext;
    const realm = useRealm()

    useFocusEffect(
        useCallback(() => {
            getList()
        }, [])
    );

    function getList() {
        try {
            const data = realm.objects("SecureNotes");
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
                .objects("SecureNotes")
                .filtered(
                    'title CONTAINS[c] $0 OR content CONTAINS[c] $0',
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

    return (
        <SafeAreaView style={{ height: "100%", backgroundColor: ThemeConstant.BACKGROUND_COLOR, flex: 1 }}>
            {loading ? (
                <Spinner />
            ) : (
                <>
                    <SearchField handleChange={getSearchTerm} showSearchButton={false} placeholder="Search Notes" />
                    {notesList?.length ? <Text style={styles.totalCount}>Total records: {notesList?.length}</Text> : ""}
                    <FlatList
                        data={notesList}
                        keyExtractor={(item, index) => `${item.title}_${index}`}
                        renderItem={({ item, index }: { item: any, index: number }) => (
                            <List data={item} index={index} navigation={navigation} />
                        )}
                        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={getList} />}
                        initialNumToRender={10}
                        maxToRenderPerBatch={10}
                        windowSize={5}
                    />
                    {/* Add button */}
                    <Pressable
                        style={({ pressed }) => [styles.add_button]}
                        onPress={() => navigation.navigate("AddSecureNotes")}
                    >
                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                            <MuiIcon name="add" size={20} color="#FFF" />
                            <Text
                                style={{
                                    color: ThemeConstant.COLOR_WHITE,
                                    fontSize: 14,
                                    paddingHorizontal: 5,
                                }}
                            >
                                ADD
                            </Text>
                        </View>
                    </Pressable>
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
    totalCount: {
        marginHorizontal: ThemeConstant.MARGIN_HORIZONTAL,
        color: ThemeConstant.PLACEHOLDER_COLOR,
        marginBottom: 8
    }
});