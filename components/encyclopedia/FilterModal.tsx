import React, {useState} from 'react';
import { Modal, StyleSheet, TouchableOpacity} from 'react-native';
import {ThemedView,ThemedText, ThemedIcon} from "@/components/ui/themed";
import {
    Kingdom,
    Class,
    Family,
    Diet,
    Specie,
} from "@/model/domain";
import { FilterEnumSelector } from './FilterSelector';
import { useThemeColor } from '@/hooks/useThemeColor';

type SpeciesFilterProps={
    baseSpecies:Specie[],
    setFilteredSpecies:any;
}

export default function SpeciesFilterModal(props: SpeciesFilterProps){

    const selectedBackground = useThemeColor({},"tint");

    const [visible,setVisible] = useState(false);
    const [kingdom,setKingdom] = useState<Kingdom | null>(null);
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
                <ThemedIcon name={"filter"} size={24} color={visible ? selectedBackground : undefined}/>
            </TouchableOpacity>
            <Modal animationType="slide" transparent={true} visible={visible} onRequestClose={() =>setVisible(false)}>
                    <TouchableOpacity style={styles.dismissButton} onPress={() => setVisible(false)}/>
                    <ThemedView style={styles.modalContent}>
                        <TouchableOpacity  style={styles.closeButton} onPress={()=>setVisible(false)}>
                            <ThemedIcon name={"close"} size={25}/>
                        </TouchableOpacity>
                        <ThemedView style={styles.sortContainer}>
                            <ThemedText>Trier :</ThemedText>
                            <TouchableOpacity onPress={sortAscending}>
                                <ThemedIcon name={"chevron-up-outline"} size={25}/>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={sortDescending}>
                                <ThemedIcon name={"chevron-down-outline"}  size={25}/>
                            </TouchableOpacity>
                        </ThemedView>
                        <FilterEnumSelector label='Reigne :' enumType={Kingdom} value={kingdom} selectedColor={selectedBackground} onFilterChange={setKingdom}  />
                        <FilterEnumSelector label='Diète :' enumType={Diet} value={diet} selectedColor={selectedBackground} onFilterChange={setDiet}/>
                        <FilterEnumSelector label='Classe :' enumType={Class} value={bioClass} selectedColor={selectedBackground} onFilterChange={setBioClass}/>
                        <FilterEnumSelector label='Famille :' enumType={Family} value={family} selectedColor={selectedBackground} onFilterChange={setFamily}/>
                    </ThemedView>
            </Modal>
        </>
    );
};

const styles = StyleSheet.create({
    filterButton:{
        borderRadius:15,
        padding:5,
        width:"10%"
    },
    dismissButton:{
        flex:1,
        width:"100%",
    },
    modalContent: {
        width: '100%',
        borderTopRightRadius: 20,
        borderTopLeftRadius: 20,
        paddingVertical:20,
        padding: 7,
        alignItems:"center",
        bottom: 0,
        gap:10,
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

})