import {FlatList, Modal, StyleSheet, TouchableOpacity} from 'react-native';
import {ThemedView} from "@/components/ui/themed/ThemedView";
import {ThemedText} from "@/components/ui/themed/ThemedText";
import {useState} from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import Capture from "@/model/Capture";
import {Kingdom} from "@/model/Kingdom";
import FilterChips from "@/components/encyclopedia/FilterChips";
import {Class} from "@/model/Class";
import {Family} from "@/model/Family";
import {Diet} from "@/model/Diet";
import {SafeView} from "@/components/ui/SafeView";
import {useThemeColor} from "@/hooks/useThemeColor";

type SpeciesFilterProps={
    baseSpecies:Capture[],
    setFilteredSpecies:any;
}

export default function SpeciesFilterModal(props: SpeciesFilterProps){
    const color = useThemeColor({ light: "#000", dark: "#fff" }, 'text');

    const [visible,setVisible] = useState(false);
    const [kingdom,setKingdom] = useState<Kingdom | null>();
    const [bioClass,setBioClass] = useState<Class | null>(null);
    const [family,setFamily] = useState<Family | null>(null);
    const [diet,setDiet] = useState<Diet | null>(null);

    const onKingdomChange = (newKingdom:Kingdom) => {
        if(kingdom==newKingdom){
            setKingdom(null);
            props.setFilteredSpecies(props.baseSpecies.filter(() => {return true;}))
        }
        else{
            setKingdom(newKingdom);
            props.setFilteredSpecies(props.baseSpecies.filter((item) => { item.specie.kingdom === newKingdom}))
        }
    }
    const onClassChange = (newClass:Class) => {
        if(bioClass==newClass){
            setBioClass(null);
            props.setFilteredSpecies(props.baseSpecies.filter(() => {return true;}))
        }
        else{
            setBioClass(newClass);
            props.setFilteredSpecies(props.baseSpecies.filter((item) => {return item.specie.class == bioClass;}))
        }
    }
    const onFamilyChange = (newFamily:Family) => {
        if(family==newFamily){
            setFamily(null);
            props.setFilteredSpecies(props.baseSpecies.filter(() => {return true;}))
        }
        else{
            setFamily(newFamily);
            props.setFilteredSpecies(props.baseSpecies.filter((item) => {return item.specie.family === family;}))
        }
    }

    const onDietChange = (newDiet:Diet) => {
        if(diet==newDiet){
            setDiet(null);
            props.setFilteredSpecies(props.baseSpecies.filter(() => {return true;}))
        }
        else{
            setDiet(newDiet);
            props.setFilteredSpecies(props.baseSpecies.filter((item) => {return item.specie.diet === diet;}))
        }
    }
    const sortAscending = () => {
        props.setFilteredSpecies([...props.baseSpecies].sort((s1, s2) => s1.specie.name.localeCompare(s2.specie.name)));
    }
    const sortDescending = () => {
        props.setFilteredSpecies([...props.baseSpecies].sort((s1, s2) => s2.specie.name.localeCompare(s1.specie.name)));
    }

    return (
        <>
            <TouchableOpacity style={styles.filterButton} onPress={()=>setVisible(true)}>
                <Ionicons name={"filter"} color={color}  size={24}/>
            </TouchableOpacity>
            <Modal animationType={"slide"} transparent={true} visible={visible} onRequestClose={() =>setVisible(false)  }>
                <SafeView>

                </SafeView>
                <TouchableOpacity style={styles.dismissButton} onPress={() => setVisible(false)}/>
                <ThemedView style={styles.modalContent}>
                    <ThemedView style={styles.titleContainer}>
                        <ThemedText>Filter and sort the encyclopedia :</ThemedText>
                        <TouchableOpacity>
                            <Ionicons name={"close"} size={23} onPress={()=>setVisible(false)}/>
                        </TouchableOpacity>
                    </ThemedView>
                    <ThemedView style={styles.sortContainer}>
                        <ThemedText>Sort :</ThemedText>
                        <TouchableOpacity onPress={sortAscending}>
                            <Ionicons name={"chevron-up-outline"} color={color} size={25}/>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={sortDescending}>
                            <Ionicons name={"chevron-down-outline"} color={color} size={25}/>
                        </TouchableOpacity>
                    </ThemedView>
                    <ThemedView style={styles.filteringOptions}>
                        <ThemedText>Kingdom :</ThemedText>
                        <FlatList data={Object.values(Kingdom)} renderItem={(item) => (<FilterChips item={item.item} onFilterChange={onKingdomChange} selectedFilter={kingdom}/>)} horizontal={true}/>
                    </ThemedView>
                    <ThemedView style={styles.filteringOptions}>
                        <ThemedText>Class :</ThemedText>
                        <FlatList data={Object.values(Class)} renderItem={(item) => (<FilterChips item={item.item} onFilterChange={onClassChange} selectedFilter={bioClass}/>)} horizontal={true}/>
                    </ThemedView>
                    <ThemedView style={styles.filteringOptions}>
                        <ThemedText>Family :</ThemedText>
                        <FlatList data={Object.values(Family)} renderItem={(item) => (<FilterChips item={item.item} onFilterChange={onFamilyChange} selectedFilter={family}/>)} horizontal={true}/>
                    </ThemedView>
                    <ThemedView style={styles.filteringOptions}>
                        <ThemedText>Diet :</ThemedText>
                        <FlatList data={Object.values(Diet)} renderItem={(item) => (<FilterChips item={item.item} onFilterChange={onDietChange} selectedFilter={diet}/>)} horizontal={true}/>
                    </ThemedView>
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
        height:'65%',
        width:"100%",
    },
    modalContent: {
        height: '35%',
        width: '100%',
        borderTopRightRadius: 15,
        borderTopLeftRadius: 15,
        paddingHorizontal: 10,
        paddingBottom:10,
        position: 'absolute',
        alignItems:"center",
        bottom: 0,
        gap:5,
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
    },
    filteringOptions:{
        flexDirection:"row",
        width:"100%",
        gap:7,
        alignItems:"center"
    }
})