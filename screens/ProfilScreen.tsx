import {Dimensions, FlatList, Image, StyleSheet, TouchableOpacity, useColorScheme} from "react-native";
import React, {useEffect, useState} from "react";
import SucessListItemVertical from "@/components/SucessListItemVertical";
import {ThemedView,ThemedText,ThemedIcon} from "@/components/ui/themed";
import {Link} from 'expo-router';
import {AntDesign, FontAwesome5, FontAwesome6, Ionicons} from "@expo/vector-icons";
import {Success} from "@/model/domain/Success";
import StubData from "@/dal/StubLib/StubData";
import {PagedRequest} from "@/shared/PagedRequest";
import {useAuthStore} from "@/context/zustand/store/useAuthStore";
import { SafeView } from "@/components/ui/SafeView";
import { Colors } from "@/constants/Colors";
import * as ImagePicker from 'expo-image-picker';
import { useUserStore } from "@/context/zustand/store/useUserStore";

let ProfileImage: {};
ProfileImage = require("../assets/images/ProfileImage.jpeg");
const { width } = Dimensions.get('window');
export default function ProfilScreen() {
    const [Successes, setSuccesses] = useState<Success[]>([]);
    const {successRepository} = StubData.getInstance()
    const {successStateRepository} = StubData.getInstance()
    const [page, setPage] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [totalPages, setTotalPages] = useState(1);
    const colorScheme =  useColorScheme() ?? 'light';
    const theme = Colors[colorScheme];
    const [stepCount,setStepCount] = useState(1)
    const [imageUri, setImageUri] = useState<string | null | undefined>(null);
    const user = useAuthStore((state) => state.user);
    //modifier car les captures plus dans le modele (david)
    const species = useAuthStore((state) => new Set(state.user?.captures.map(c => c.specie.id)).size);
    const family = useAuthStore((state) => new Set(state.user?.captures.map(c => c.specie.family)).size);
    const dataUser = useUserStore()

    const fetchSuccesses = async (currentPage: number) => {
        setIsLoading(true);
        try {
            const PageRequest : PagedRequest = {
                index: currentPage-1,
                count: 9
            }
            const response = await successRepository?.getAll(PageRequest);
            const state = await successStateRepository?.getAll(PageRequest);

    if (state?.items) {
        console.log("state", state.items);
    const stateMap = new Map<string, number>();
    state.items.forEach(item => {
        //a modifier quand le user sera connecté
        //if (item.user?.mail === "test@test.fr") {
            stateMap.set(item.success.nom, item.state.percentSucces);
       // }
    });

    const mergedSuccesses = response!.items.map(success => {
        const progress = stateMap.get(success.nom);
        return {
            ...success,
            actualVal: progress,
        };
    });

    setSuccesses(mergedSuccesses);
    setTotalPages(Math.ceil(state.total / 9));
    }
    } catch (error) {
            console.error('Erreur lors de la récupération des succès :', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchSuccesses(page);
    }, [page]);

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes:ImagePicker.MediaTypeOptions.Images,
          quality: 1,
          base64: true,
          allowsEditing: true,
        });
    
        if (!result.canceled) {
          setImageUri(result.assets[0].uri);
          if(user && result.assets[0].base64) {
          user.image = result.assets[0].base64
          dataUser.updateUser(user.id,user)
          }
        }
      };
    const renderHeader = () => (
        <ThemedView>
            <Link href={"/(profil)/settings"}  style={{ alignSelf: "flex-end",}} asChild>
                <TouchableOpacity>
                    <ThemedIcon size={30} name="settings" style={styles.settings}/>
                </TouchableOpacity>
            </Link>
            <TouchableOpacity style={styles.imageContainer} onPress={pickImage}>
        <Image
          source={
            imageUri
              ? { uri: imageUri }
              : require('./../assets/images/ProfileImage.jpeg')
          }
          style={styles.image}
        />
      </TouchableOpacity>
            <ThemedView style={styles.userInfoContainer}>
                <ThemedText style={styles.username}>{user?.username || 'Username not available'}
                <Link href={"/(profil)/editprofile"} asChild>
            <TouchableOpacity>
            <Ionicons name="pencil" color={theme.text} size={20} />
            </TouchableOpacity>
            </Link></ThemedText>
                <ThemedText style={styles.email}>{user?.email || 'Email not available'}</ThemedText>
                
            </ThemedView>

            <ThemedView style={styles.lineContainer}>
                <ThemedView style={styles.line} />
                <ThemedText type={"title"} style={styles.title} >Statistiques</ThemedText><ThemedView style={styles.line} />
            </ThemedView>

            <ThemedView style={styles.container}>
                <FontAwesome5 size={32} name="walking" style={[styles.settings, {color: theme.text}]}/>
                <ThemedText style={styles.text}>  Distance marchées {stepCount} </ThemedText>
            </ThemedView>
            <ThemedView style={styles.container}>
                <FontAwesome6 size={30} name="circle-question" style={[styles.settings, {color: theme.text}]}/>
                <ThemedText style={styles.text}>Espèces découvertes : {species}</ThemedText>
            </ThemedView>
            <ThemedView style={styles.container}>
                <FontAwesome5 size={30} name="dna" style={[styles.settings, {color: theme.text}]}/>
                <ThemedText style={styles.text}> Familles complétées : {family}</ThemedText>
            </ThemedView>
            <ThemedView style={styles.container}>
                <AntDesign size={30} name="clockcircleo" style={[styles.settings, {color:theme.text}]}/>
                <ThemedText style={styles.text}>Date d'inscription : {user?.inscriptionDate &&
                        new Date(user.inscriptionDate).toLocaleString('fr-FR', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                        })}</ThemedText>
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
    imageContainer:{
        alignItems: 'center',
        marginTop: 50,
    },
    image: {
        width: 150,
        height: 150,
        borderRadius: 75,
      },
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

    },
    email: {
        fontSize: 16,
        color: '#666',
    },
    button:{
        borderRadius:30,
    }
});
