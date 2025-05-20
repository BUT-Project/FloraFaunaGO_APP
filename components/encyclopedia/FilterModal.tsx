import React, {useState} from 'react';
import {FlatList, Modal, StyleSheet, TouchableOpacity} from 'react-native';
import {ThemedView,ThemedText} from "@/components/ui/themed";
import Ionicons from "@expo/vector-icons/Ionicons";
import {Kingdom} from "@/model/domain/Kingdom";
import FilterChips from "./FilterChips";
import {Class} from "@/model/domain/Class";
import {Family} from "@/model/domain/Family";
import {Diet} from "@/model/domain/Diet";
import {useThemeColor} from "@/hooks/useThemeColor";
import Specie from "@/model/domain/Specie";

type SpeciesFilterProps={
    baseSpecies:Specie[],
    setFilteredSpecies:any;
}

export default function SpeciesFilterModal(props: SpeciesFilterProps){
    const color = useThemeColor({},'text');

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
            props.setFilteredSpecies(props.baseSpecies.filter((item) => item.kingdom === newKingdom))
        }
    }
    const onClassChange = (newClass:Class) => {
        if(bioClass==newClass){
            setBioClass(null);
            props.setFilteredSpecies(props.baseSpecies.filter(() => {return true;}))
        }
        else{
            setBioClass(newClass);
            props.setFilteredSpecies(props.baseSpecies.filter((item) => {return item.class == bioClass;}))
        }
    }
    const onFamilyChange = (newFamily:Family) => {
        if(family==newFamily){
            setFamily(null);
            props.setFilteredSpecies(props.baseSpecies.filter(() => {return true;}))
        }
        else{
            setFamily(newFamily);
            props.setFilteredSpecies(props.baseSpecies.filter((item) => {return item.family === family;}))
        }
    }

    const onDietChange = (newDiet:Diet) => {
        if(diet==newDiet){
            setDiet(null);
            props.setFilteredSpecies(props.baseSpecies.filter(() => {return true;}))
        }
        else{
            setDiet(newDiet);
            props.setFilteredSpecies(props.baseSpecies.filter((item) => {return item.diet === diet;}))
        }
    }
    const sortAscending = () => {
        props.setFilteredSpecies([...props.baseSpecies].sort((s1, s2) => s1.name.localeCompare(s2.name)));
    }
    const sortDescending = () => {
        props.setFilteredSpecies([...props.baseSpecies].sort((s1, s2) => s2.name.localeCompare(s1.name)));
    }

    return (
        <>
            <TouchableOpacity style={styles.filterButton} onPress={()=>setVisible(true)}>
                <Ionicons name={"filter"} color={color}  size={24}/>
            </TouchableOpacity>
            <Modal animationType="slide" transparent={true} visible={visible} onRequestClose={() =>setVisible(false)}>
                <TouchableOpacity style={styles.dismissButton} onPress={() => setVisible(false)}/>
                <ThemedView style={styles.modalContent}>
                   
                    <TouchableOpacity  style={styles.closeButton} onPress={()=>setVisible(false)}>
                        <Ionicons name={"close"} color={color} size={25}/>
                    </TouchableOpacity>
                    
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
                        <FlatList 
                            data={Object.values(Kingdom)} 
                            renderItem={(item) => (<FilterChips item={item.item} onFilterChange={onKingdomChange} selectedFilter={kingdom}/>)}
                            horizontal={true}
                            showsHorizontalScrollIndicator={false}
                        />
                    </ThemedView>
                    <ThemedView style={styles.filteringOptions}>
                        <ThemedText>Class :</ThemedText>
                        <FlatList 
                            data={Object.values(Class)} 
                            renderItem={(item) => (<FilterChips item={item.item} onFilterChange={onClassChange} selectedFilter={bioClass}/>)} 
                            showsHorizontalScrollIndicator={false}
                            horizontal={true}
                        />
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
        borderTopRightRadius: 20,
        borderTopLeftRadius: 20,
        paddingVertical:20,
        padding: 10,
        paddingBottom:0,
        position: 'absolute',
        alignItems:"center",
        bottom: 0,
        gap:5,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.5,
        shadowRadius: 4,
        elevation: 5,
    },
    closeButton: {
        position: 'absolute',
        top: 10,
        right: 10,
        borderRadius: 30,
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