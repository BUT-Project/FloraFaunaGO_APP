import MapView from 'react-native-maps';
import {StyleProp, StyleSheet, ViewStyle} from 'react-native';

interface MapViewProps {
    style: StyleProp<ViewStyle>;
}

export default function MainMapView(props: MapViewProps) {
    const initialRegion = {
        latitude: 48.8566,
        longitude: 2.3522,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
    };

    const points = [
        {latitude: 48.8566, longitude: 2.3522},
        {latitude: 48.8566, longitude: 2.3522},
        {latitude: 48.8566, longitude: 2.3522},
    ];

    return (<MapView style={[styles.map, props.style]}/>);
}


const styles = StyleSheet.create({
    map: {
        flex: 1,
    },
});
