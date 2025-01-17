import {StyleSheet, TextInput} from 'react-native';
import {ThemedView} from "@/components/ui/themed/ThemedView";
import {useState} from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import {useThemeColor} from "@/hooks/useThemeColor";

type SearchBarProps={
    search:string;
    setSearch:any;
    placeholder:string,
}

export default function SpeciesSearchBar(props: SearchBarProps){
    const color = useThemeColor({ light: "#000", dark: "#fff" }, 'text');
   
    return (
        <ThemedView style={styles.searchBarContainer}>
            <TextInput
                style={[styles.searchBar,{color:color}]}
                value={props.search}
                placeholder={props.placeholder}
                onChangeText={(text) => props.setSearch(text)}
            />
            <Ionicons name={"search"} color={color} size={20}/>
        </ThemedView>
    );
};

const styles = StyleSheet.create({
    searchBarContainer: {
        borderRadius: 10,
        borderWidth: 1,
        flexDirection:"row",
        justifyContent:"space-between",
        alignItems:"center",
        margin:5,
        paddingVertical: 3,
        paddingHorizontal:12,
    },
    searchBar: {
        height:37,
        width:"90%",
    },
})