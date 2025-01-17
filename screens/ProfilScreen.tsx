import {ThemedText} from "@/components/ui/themed/ThemedText";
import {FlatList, Image, StyleSheet, TouchableOpacity, Dimensions, ActivityIndicator, Button} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";
import {useThemeColor} from "@/hooks/useThemeColor";
import React, {useEffect, useState} from "react";
import SucessListItemVertical from "@/components/SucessListItemVertical";
import {ThemedView} from "@/components/ui/themed/ThemedView";
import {Link} from 'expo-router';
import {TabBarIcon} from "@/components/navigation/TabBarIcon";
import {AntDesign, FontAwesome5, FontAwesome6} from "@expo/vector-icons";
import {Sucess} from "@/model/Sucess";
import StubData from "@/dal/StubLib/StubData";

let ProfileImage: {};
ProfileImage = require("../assets/images/ProfileImage.jpeg");
const { width } = Dimensions.get('window');
export default function ProfilScreen() {
    const [Successes, setSuccesses] = useState<Sucess[]>([]);
    const {Sucess} = StubData.getInstance()
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [totalPages, setTotalPages] = useState(1);

    const fetchSuccesses = async (currentPage: number) => {
        setLoading(true);
        try {
            const response = await Sucess.getAll(currentPage,9);
            setSuccesses(response.items);
            setTotalPages(Math.ceil(response.total / 9));
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
            <ThemedText style={styles.title}>──── Statistiques ────</ThemedText>

            <ThemedView style={styles.container}>
                <FontAwesome5 size={32} name="walking" style={[styles.settings, {color: tintColor}]}/>
                <ThemedText style={styles.text}>  Distance marchées</ThemedText>
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
            <ThemedText style={styles.title}>────── Succès ──────</ThemedText>
            <ThemedView style={styles.pagination}>
                <Button
                    title="Précédent"
                    onPress={() => setPage((prev) => Math.max(prev - 1, 1))}
                    disabled={page === 1}
                />
                <ThemedText style={styles.pageInfo}>
                    Page {page} sur {totalPages}
                </ThemedText>
                <Button
                    title="Suivant"
                    onPress={() => setPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={page === totalPages}
                />
            </ThemedView>
        </ThemedView>

    );

    return (
        <ThemedView>
            <SafeAreaView>
                <FlatList
                    data={Successes?? []}
                    keyExtractor={(item) => item.nom}
                    renderItem={({item}) => <SucessListItemVertical items={item}/>}
                    numColumns={3}
                    ListHeaderComponent={renderHeader}
                    ListFooterComponent={loading ? <ActivityIndicator style={styles.loader} size="large" color={tintColor} /> : null}

                />
            </SafeAreaView>
        </ThemedView>
    );
}
const styles = StyleSheet.create({
    pagination: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        borderTopWidth: 1,
        borderTopColor: '#ccc',
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
    title: {
        textAlign: "center",
        fontWeight: "bold",
        margin: "8%",
        fontSize: width > 600 ? width * 0.04 : width * 0.06,
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
});
