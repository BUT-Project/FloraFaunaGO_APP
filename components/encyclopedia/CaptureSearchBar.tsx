import {StyleSheet, TextInput} from 'react-native';
import {ThemedView} from "@/components/ui/themed/ThemedView";
import {useState} from "react";
import Ionicons from "@expo/vector-icons/Ionicons";

type SearchBarProps={
    baseData:any[],
    setFilteredData:any,
    placeholder:string,
}

export default function CaptureSearchBar(props: SearchBarProps){
    const [searchText, setSearchText] = useState('');
    const searchFilterFunction = (text:string) => {
        if (text) {
            const newData = props.baseData.filter((item) => {
                const specieName = item.specie.name ? item.specie.name.toUpperCase() : ''.toUpperCase();
                const textData = text.toUpperCase();
                return specieName.indexOf(textData) > -1;
            });
            props.setFilteredData(newData);
            setSearchText(text);
        } else {
            props.setFilteredData(props.baseData);
            setSearchText(text);
        }

    }
    return (
        <ThemedView style={styles.searchBarContainer}>
            <TextInput
                style={styles.searchBar}
                value={searchText}
                placeholder={props.placeholder}
                onChangeText={(text) => searchFilterFunction(text)}
            />
            <Ionicons name={"search"} size={20}/>
        </ThemedView>
    )
}

const styles = StyleSheet.create({
    searchBarContainer: {
        borderRadius: 10,
        borderColor: '#ccc',
        borderWidth: 1,
        flexDirection:"row",
        justifyContent:"space-between",
        alignItems:"center",
        margin:5,
        paddingVertical: 3,
        paddingHorizontal:12,
    },
    searchBar: {
        height:35,
    },
})