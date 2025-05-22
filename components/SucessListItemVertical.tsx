import {StyleSheet, TouchableOpacity, useColorScheme} from 'react-native';
import {AnimatedCircularProgress} from "react-native-circular-progress";
import {Success} from "@/model/domain/Success";
import {TabBarIcon} from "@/components/navigation/TabBarIcon";
import {ThemedView,ThemedText} from "@/components/ui/themed";
import SuccessDetailScreen from "@/screens/SuccessDetailScreen";
import {useState} from "react";
import { Colors } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';

type SucessListItemsProps = {
    items : Success;
}

export default function SucessListItemVertical(props:SucessListItemsProps){
    const colorScheme = useColorScheme()
    const theme = Colors[colorScheme ?? "light"]
    const [modalVisible, setModalVisible] = useState(false);

    return(
        <>
            <SuccessDetailScreen
                visible={modalVisible}
                onClose={() => setModalVisible(false)}
                sucess={props.items}
            />
            <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.itemsContainer}>
                <ThemedView style={styles.itemContainer} >
                    <AnimatedCircularProgress
                        size={100}
                        width={10}
                        fill={Number(((props.items.actualVal/props.items.objectif) * 100).toFixed(2))}
                        tintColor={theme.card}
                        backgroundColor={theme.successBackground}
                    >
                        {()=>
                            <TabBarIcon
                                size={35}
                                name={props.items.image as  keyof typeof Ionicons.glyphMap}
                                color={theme.text}
                                style={styles.image}
                            />
                        }
                    </AnimatedCircularProgress>
                    <ThemedText style={styles.text}>{props.items.nom}</ThemedText>
                </ThemedView>
            </TouchableOpacity>
        </>
    );

}
const styles = StyleSheet.create({
    itemsContainer: {
        position: 'relative',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        minWidth : "33%",
        maxWidth: "50%",
        
    },
    itemContainer:{
        flexDirection: 'column',
        alignItems: 'center',
        alignSelf:"center",
    },
    text:{
        flex:1,
        fontSize:11,
        lineHeight:15,
        height:30,
        textAlign : "center",
    },
    image : {
        alignSelf : "center",
    }
});