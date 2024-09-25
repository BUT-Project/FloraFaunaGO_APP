import {Modal, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {ThemedView} from "@/components/ui/themed/ThemedView";
import {ThemedText} from "@/components/ui/themed/ThemedText";
import {Specie} from "@/app/(tabs)/encyclopedia";
import {useState} from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import {ICONS} from "jest-util";

type SpeciesFilterProps={
    baseSpecies:Specie[],
    setFilteredSpecies:any
}

export default function SpeciesFilter(props: SpeciesFilterProps){
    const [visible,setVisible] = useState(false)

    return (
        <>
            <TouchableOpacity style={styles.filterButton} onPress={()=>setVisible(true)}>
                <Ionicons name={"filter"} size={24}/>
            </TouchableOpacity>
            <Modal animationType={"slide"} transparent={true} visible={visible}>
                <ThemedView style={styles.modalContent}>
                    <ThemedView style={styles.titleContainer}>
                        <ThemedText>Filter and sort the encyclopedia :</ThemedText>
                        <TouchableOpacity>
                            <Ionicons name={"close"} size={23} onPress={()=>setVisible(false)}/>
                        </TouchableOpacity>
                    </ThemedView>
                    <ThemedText>Sort :</ThemedText>
                    <ThemedView style={styles.sortContainer}>
                        <TouchableOpacity>
                            <Ionicons name={"link"}/>
                        </TouchableOpacity>
                        <TouchableOpacity>
                            <Ionicons name={"link"}/>
                        </TouchableOpacity>
                    </ThemedView>
                    <ThemedText>Filter :</ThemedText>
                </ThemedView>

            </Modal>
        </>

    )
}

const styles = StyleSheet.create({
    filterButton:{
        borderRadius:15,
        padding:5,
        width:"10%"
    },
    modalContent: {
        height: '25%',
        width: '100%',
        borderTopRightRadius: 15,
        borderTopLeftRadius: 15,
        position: 'absolute',
        alignItems:"center",
        bottom: 0,
    },
    titleContainer: {
        height: '20%',
        width:"100%",
        borderTopRightRadius: 10,
        borderTopLeftRadius: 10,
        paddingHorizontal: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    sortContainer:{
        flexDirection:"row",
        justifyContent:"space-between",
        alignItems:"center",

    }
})