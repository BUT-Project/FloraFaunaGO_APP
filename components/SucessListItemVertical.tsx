import {StyleSheet, TouchableOpacity} from 'react-native';
import {AnimatedCircularProgress} from "react-native-circular-progress";
import {useThemeColor} from "@/hooks/useThemeColor";
import {Success} from "@/model/domain/Success";
import {TabBarIcon} from "@/components/navigation/TabBarIcon";
import {ThemedView} from "@/components/ui/themed/ThemedView";
import {ThemedText} from "@/components/ui/themed/ThemedText";
import SuccessDetailScreen from "@/screens/SuccessDetailScreen";
import {useState} from "react";

type SucessListItemsProps = {
    items : Success;
}

export default function SucessListItemVertical(props:SucessListItemsProps){
    const tintColor = useThemeColor({ light: 'black', dark: 'white' }, 'background');
    const color = useThemeColor({ light: 'black', dark: 'white' }, 'background');
    const backgroundColor = useThemeColor({ light: 'black', dark: 'white' }, 'background');
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
                            tintColor="#2C9F54"
                            backgroundColor="#DADADA">
                            {
                                
                                () => (
                                    //@ts-ignore
                                    <TabBarIcon size={35} name={props.items.image} style={[styles.image,{color:tintColor}]}  />
                                )
                            }
                        </AnimatedCircularProgress>
                        <ThemedText style={[styles.text, {color}]}>{props.items.nom}</ThemedText>
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