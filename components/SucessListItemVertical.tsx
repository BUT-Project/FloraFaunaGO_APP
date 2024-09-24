import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View, Image,Dimensions } from 'react-native';
import {AnimatedCircularProgress} from "react-native-circular-progress";
import {Circle} from "react-native-svg";
import {useThemeColor} from "@/hooks/useThemeColor";
import {Sucess} from "../screens/Sucess"
const AntIcon = require("../assets/images/ant.png")

type SucessListItemsProps = {
    items : Sucess;
}

export default function SucessListItemVertical(props:SucessListItemsProps){
    const tintColor = useThemeColor({ light: 'black', dark: 'white' }, 'background');
    const color = useThemeColor({ light: 'black', dark: 'white' }, 'background');

    return(
        <View style={styles.itemsContainer}>
            <View style={styles.itemContainer} >
            <AnimatedCircularProgress
                size={100}
                width={10}
                fill={props.items.avancement}
                tintColor="#00e0ff"
                backgroundColor="#3d5875"
                padding={10}

                renderCap={({ center }) => <Circle cx={center.x} cy={center.y} r="10" fill="blue" />}
            >
                {
                    (fill) => (
                        <Image style={styles.image} source={{uri:props.items.image}} />
                    )
                }
            </AnimatedCircularProgress>
                {/*
            <Text style={{ marginTop: 20, fontSize: 18 }}>
                {props.items.avancement}% Tache accomplie
            </Text>
                */}
            <Text style={[styles.text, {color}]}>{props.items.nom}</Text>

            </View>
        </View>
    );

}
const styles = StyleSheet.create({
    itemsContainer: {
        position: 'relative',
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 5,
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
        width : 30,
        height : 30,
        margin : 5,
        alignSelf : "center",


    }
});