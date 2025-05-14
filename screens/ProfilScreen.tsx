import {ThemedText} from "@/components/ui/themed/ThemedText";
import {Button, Dimensions, FlatList, Image, StyleSheet, TouchableOpacity} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";
import {useThemeColor} from "@/hooks/useThemeColor";
import React, {useEffect, useState} from "react";
import SucessListItemVertical from "@/components/SucessListItemVertical";
import {ThemedView} from "@/components/ui/themed/ThemedView";
import {Link} from 'expo-router';
import {TabBarIcon} from "@/components/navigation/TabBarIcon";
import {AntDesign, FontAwesome5, FontAwesome6} from "@expo/vector-icons";
import {Success} from "@/model/domain/Success";
import StubData from "@/dal/StubLib/StubData";
import {PagedRequest} from "@/shared/PagedRequest";
import {useAuthStore} from "@/context/zustand/strore/useAuthStore";
import { SafeView } from "@/components/ui/SafeView";

let ProfileImage: {};
ProfileImage = require("../assets/images/ProfileImage.jpeg");
const { width } = Dimensions.get('window');
export default function ProfilScreen() {
    const [Successes, setSuccesses] = useState<Success[]>([]);
    const {successRepository} = StubData.getInstance()
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [totalPages, setTotalPages] = useState(1);

    const user = useAuthStore((state)=>state.user);


    const fetchSuccesses = async (currentPage: number) => {
        setLoading(true);
        try {
            const PageRequest : PagedRequest = {
                index: currentPage,
                count: 9
            }
            const response = await successRepository?.getAll(PageRequest);
            setSuccesses(response?.items ?? []);
            setTotalPages(Math.ceil(response!.total/ 9));
        } catch (error) {
            console.error('Erreur lors de la récupération des succès :', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSuccesses(page);
    }, [page]);


    const tintColor = useThemeColor({light: 'black', dark: 'white'}, 'background');

    const renderHeader = () => (
        <ThemedView>
            <Link href={"/(profil)/settings"}  style={{ alignSelf: "flex-end",}} asChild>
                <TouchableOpacity>
                    <TabBarIcon size={30} name="settings" style={[styles.settings, {color: tintColor}]}/>
                </TouchableOpacity>
            </Link>

            <Image source={ProfileImage} style={styles.profile}/>
            <ThemedView style={styles.userInfoContainer}>
                <ThemedText style={styles.username}>{user?.username || 'Username not available'}</ThemedText>
                <ThemedText style={styles.email}>{user?.email || 'Email not available'}</ThemedText>
            </ThemedView>

            <ThemedView style={styles.lineContainer}>
                <ThemedView style={styles.line} />
                <ThemedText type={"title"} style={styles.title} >Statistiques</ThemedText><ThemedView style={styles.line} />
            </ThemedView>

            <ThemedView style={styles.container}>
                <FontAwesome5 size={32} name="walking" style={[styles.settings, {color: tintColor}]}/>
                <ThemedText style={styles.text}>  Distance marchées </ThemedText>
            </ThemedView>
            <ThemedView style={styles.container}>
                <FontAwesome6 size={30} name="circle-question" style={[styles.settings, {color: tintColor}]}/>
                <ThemedText style={styles.text}>Espèces découvertes</ThemedText>
            </ThemedView>
            <ThemedView style={styles.container}>
                <FontAwesome5 size={30} name="dna" style={[styles.settings, {color: tintColor}]}/>
                <ThemedText style={styles.text}> Familles complétées</ThemedText>
            </ThemedView>
            <ThemedView style={styles.container}>
                <AntDesign size={30} name="clockcircleo" style={[styles.settings, {color:tintColor}]}/>
                <ThemedText style={styles.text}>Date d'inscription</ThemedText>
            </ThemedView>
            <ThemedView style={styles.lineContainer}>
                <ThemedView style={styles.line} />
                <ThemedText type={"title"} style={styles.title} >Succès</ThemedText><ThemedView style={styles.line} />
            </ThemedView>
            <ThemedView style={styles.pagination}>
                <Button
                    title="<"
                    onPress={() => setPage((prev) => Math.max(prev - 1, 1))}
                    disabled={page === 1}
                />
                <ThemedText style={styles.pageInfo}>Page {page} sur {totalPages}</ThemedText>
                <Button
                    title=">"
                    onPress={() => setPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={page === totalPages}
                />
            </ThemedView>
        </ThemedView>

    );

    return (
        <SafeView disableBottomInset>
                <FlatList
                    style={styles.list}
                    data={Successes?? []}
                    keyExtractor={(item) => item.nom}
                    renderItem={({item}) => <SucessListItemVertical items={item}/>}
                    numColumns={3}
                    ListHeaderComponent={renderHeader}
                    columnWrapperStyle={{ justifyContent: "center", marginBottom: 10 }}
                />
        </SafeView>
    );
}

const styles = StyleSheet.create({
    lineContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
    },
    line: {
        flex: 1,
        height: 4,
        backgroundColor: '#ccc',
    },
    list: {
        width: '100%',
        alignSelf : "center",
    },
    pagination: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,

    },
    pageInfo: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    loader: {
        marginVertical: 20,
    },
    container: {
        display:"flex",
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf : 'center',
        justifyContent: 'flex-start',
        height: 50,
        marginVertical: 5,
    },
    title : {
        margin:20,
        textAlign: "center"
    },
    text: {
        textAlignVertical:'center',
    },
    settings: {
        marginRight: 10,
        color: "white",
    },
    profile: {
        alignSelf: "center",
        width: width* 0.4,
        height: width* 0.4,
        margin: "10%",
        borderRadius: 500,
    },
    userInfoContainer: {
        alignItems: 'center',
        marginBottom: 20,
    },
    username: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    email: {
        fontSize: 16,
        color: '#666',
    },
});
