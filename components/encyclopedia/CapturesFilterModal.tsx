import {FlatList, Modal, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {ThemedView} from "@/components/ui/themed/ThemedView";
import {ThemedText} from "@/components/ui/themed/ThemedText";
import {useState} from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import Capture from "@/model/Capture";
import {Kingdom} from "@/model/Kingdom";
import FilterChips from "@/components/encyclopedia/FilterChips";

type SpeciesFilterProps={
    baseSpecies:Capture[],
    setFilteredSpecies:any;
}

export default function CapturesFilterModal(props: SpeciesFilterProps){
    const [visible,setVisible] = useState(false)
    const sortAscending = () => {
        props.setFilteredSpecies([...props.baseSpecies].sort((s1, s2) => s1.specie.name.localeCompare(s2.specie.name)));
    }
    const sortDescending = () => {
        props.setFilteredSpecies([...props.baseSpecies].sort((s1, s2) => s2.specie.name.localeCompare(s1.specie.name)));
    }

    return (
        <>
            <TouchableOpacity style={styles.filterButton} onPress={()=>setVisible(true)}>
                <Ionicons name={"filter"} size={24}/>
            </TouchableOpacity>


            <Modal animationType={"slide"} transparent={true} visible={visible} onRequestClose={() =>setVisible(false)  }>
                <TouchableOpacity style={styles.dismissButton} onPress={() => setVisible(false)}/>
                <ThemedView style={styles.modalContent}>
                    <ThemedView style={styles.titleContainer}>
                        <ThemedText>Filter and sort the encyclopedia :</ThemedText>
                        <TouchableOpacity>
                            <Ionicons name={"close"} size={23} onPress={()=>setVisible(false)}/>
                        </TouchableOpacity>
                    </ThemedView>
                    <ThemedText>Sort :</ThemedText>
                    <ThemedView style={styles.sortContainer}>
                        <TouchableOpacity onPress={sortAscending}>
                            <Ionicons name={"chevron-up-outline"} size={25}/>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={sortDescending}>
                            <Ionicons name={"chevron-down-outline"} size={25}/>
                        </TouchableOpacity>
                    </ThemedView>
                    <ThemedText>Filter :</ThemedText>
                    <ThemedText>Kingdom :</ThemedText>
                    <FlatList data={Object.values(Kingdom)} renderItem={(item) => (<FilterChips name={item.item}/>)} horizontal={true}/>
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
    dismissButton:{
        height:'70%',
        width:"100%",
    },
    modalContent: {
        height: '30%',
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
        gap:5,
        padding:10
    }
})