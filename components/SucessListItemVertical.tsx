import React from 'react';
import {StyleSheet,Dimensions } from 'react-native';
import {AnimatedCircularProgress} from "react-native-circular-progress";
import {useThemeColor} from "@/hooks/useThemeColor";
import {Sucess} from "model/domain/Sucess"
import {TabBarIcon} from "@/components/navigation/TabBarIcon";
import {ThemedView} from "@/components/ui/themed/ThemedView";
import {ThemedText} from "@/components/ui/themed/ThemedText";



type SucessListItemsProps = {
    items : Sucess;
}

export default function SucessListItemVertical(props:SucessListItemsProps){
    const tintColor = useThemeColor({ light: 'black', dark: 'white' }, 'background');
    const color = useThemeColor({ light: 'black', dark: 'white' }, 'background');
    const backgroundColor = useThemeColor({ light: 'black', dark: 'white' }, 'background');

    return(
        <ThemedView style={styles.itemsContainer}>
            <ThemedView style={styles.itemContainer} >
            <AnimatedCircularProgress
                size={100}
                width={10}
                fill={props.items.avancement}
                tintColor="#2C9F54"
                backgroundColor="#DADADA"
                //padding={15}

                //renderCap={({ center }) => <Circle cx={center.x} cy={center.y} r="10" fill="blue" />}
            >
                {
                    (fill) => (
                        //@ts-ignore
                        <TabBarIcon size={35} name={props.items.image} style={[styles.image,{color:tintColor}]}  />
                    )
                }
            </AnimatedCircularProgress>
                {/*
            <Text style={{ marginTop: 20, fontSize: 18 }}>
                {props.items.avancement}% Tache accomplie
            </Text>
                */}
            <ThemedText style={[styles.text, {color}]}>{props.items.nom}</ThemedText>

            </ThemedView>
        </ThemedView>
    );

}
const styles = StyleSheet.create({
    itemsContainer: {
        position: 'relative',
        flexDirection: 'row',
        alignItems: 'center',
        margin: 4,
        width : Dimensions.get('window').width * 0.33
    },
    itemContainer:{
        flexDirection: 'column',
        alignItems: 'center',
    },
    text:{
        fontSize:12
    },
    image : {
        alignSelf : "center",
    }
});