import {StyleSheet, TextInput} from 'react-native';
import {ThemedView} from "@/components/ui/themed/ThemedView";
import Ionicons from "@expo/vector-icons/Ionicons";
import {useThemeColor} from "@/hooks/useThemeColor";

type SearchBarProps={
    search:string;
    setSearch:any;
    placeholder:string,
}

export default function SpeciesSearchBar({search,setSearch,placeholder}: SearchBarProps){
    const color = useThemeColor({}, 'text');
    const placeholderColor = useThemeColor({}, 'successBackground');
    return (
        <ThemedView style={styles.searchBarContainer}>
            <TextInput
                style={[styles.searchBar,{color:color}]}
                value={search}
                placeholder={placeholder}
                placeholderTextColor={placeholderColor}
                onChangeText={(text) => setSearch(text)}
            />
            {search ? 
                <Ionicons name={"close"} color={color} size={20} onPress={() => setSearch("")}/>
                :
                <Ionicons name={"search"} color={color} size={20}/>
            }
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
        width:"90%",
    },
})