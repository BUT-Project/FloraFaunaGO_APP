import {Dimensions, FlatList, Image, StyleSheet, TouchableOpacity, useColorScheme} from "react-native";
import React, {useEffect, useState} from "react";
import SucessListItemVertical from "@/components/SucessListItemVertical";
import {ThemedView,ThemedText,ThemedIcon} from "@/components/ui/themed";
import {Link} from 'expo-router';
import {AntDesign, FontAwesome5, FontAwesome6} from "@expo/vector-icons";
import {Success} from "@/model/domain/Success";
import StubData from "@/dal/StubLib/StubData";
import {PagedRequest} from "@/shared/PagedRequest";
import {useAuthStore} from "@/context/zustand/store/useAuthStore";
import { SafeView } from "@/components/ui/SafeView";
import { Colors } from "@/constants/Colors";

let ProfileImage: {};
ProfileImage = require("../assets/images/ProfileImage.jpeg");
const { width } = Dimensions.get('window');
export default function ProfilScreen() {
    const [Successes, setSuccesses] = useState<Success[]>([]);
    const {successRepository} = StubData.getInstance()
    const [page, setPage] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [totalPages, setTotalPages] = useState(1);
    const stepCount = useAuthStore((state) => state.user?.stepCount);
    const colorScheme =  useColorScheme() ?? 'light';
    const theme = Colors[colorScheme];

    const user = useAuthStore((state)=>state.user);

    const fetchSuccesses = async (currentPage: number) => {
        setIsLoading(true);
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
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchSuccesses(page);
    }, [page]);


    const renderHeader = () => (
        <ThemedView>
            <Link href={"/(profil)/settings"}  style={{ alignSelf: "flex-end",}} asChild>
                <TouchableOpacity>
                    <ThemedIcon size={30} name="settings" style={styles.settings}/>
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
                <FontAwesome5 size={32} name="walking" style={[styles.settings, {color: theme.text}]}/>
                <ThemedText style={styles.text}>Distance marché <ThemedText type="defaultSemiBold">{stepCount} pas</ThemedText></ThemedText>
            </ThemedView>
            <ThemedView style={styles.container}>
                <FontAwesome6 size={30} name="circle-question" style={[styles.settings, {color: theme.text}]}/>
                <ThemedText style={styles.text}>Espèces découvertes</ThemedText>
            </ThemedView>
            <ThemedView style={styles.container}>
                <FontAwesome5 size={30} name="dna" style={[styles.settings, {color: theme.text}]}/>
                <ThemedText style={styles.text}> Familles complétées</ThemedText>
            </ThemedView>
            <ThemedView style={styles.container}>
                <AntDesign size={30} name="clockcircleo" style={[styles.settings, {color:theme.text}]}/>
                <ThemedText style={styles.text}>Date d'inscription</ThemedText>
            </ThemedView>
            <ThemedView style={styles.lineContainer}>
                <ThemedView style={styles.line} />
                <ThemedText type={"title"} style={styles.title} >Succès</ThemedText><ThemedView style={styles.line} />
            </ThemedView>
            <ThemedView style={styles.pagination}>
                <TouchableOpacity
                    onPress={() => setPage((prev) => Math.max(prev - 1, 1))}
                    disabled={page === 1}
                >
                    <ThemedIcon 
                        name="chevron-back-circle"
                        color={page === 1? theme.successBackground : theme.tint}
                        size={40}
                    />
                </TouchableOpacity>
                <ThemedText style={styles.pageInfo}>Page {page} sur {totalPages}</ThemedText>
                <TouchableOpacity
                    onPress={() => setPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={page === totalPages}
                >
                    <ThemedIcon 
                        name="chevron-forward-circle" 
                        color={page === totalPages ? theme.successBackground : theme.tint}
                        size={40}
                    />
                </TouchableOpacity>
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
                columnWrapperStyle={styles.listWrapper}
            />
        </SafeView>
    );
}

const styles = StyleSheet.create({
    listWrapper:{
        justifyContent: "center",
        marginBottom: 10
    },
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
    button:{
        borderRadius:30,
    }
});
