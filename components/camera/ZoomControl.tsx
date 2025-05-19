import React, { useState, useRef } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type ZoomControlProps = {
    zoom: number;
    setZoom: (value: number) => void;
};

const ZoomControl: React.FC<ZoomControlProps> = ({ zoom, setZoom }) => {
    const [isZoom, setIsZoom] = useState(false);
    const scaleAnim = useRef(new Animated.Value(0)).current;

    const handleZoomToggle = () => {
        if (!isZoom) {
            setIsZoom(true);
            Animated.spring(scaleAnim, {
                toValue: 1,
                useNativeDriver: true,
                friction: 6,
            }).start();
        } else {
            Animated.timing(scaleAnim, {
                toValue: 0,
                duration: 150,
                useNativeDriver: true,
            }).start(() => setIsZoom(false));
        }
    };

    return (
        <View>
            <TouchableOpacity style={styles.zoomButton} onPress={handleZoomToggle}>
                <Ionicons name={isZoom ? 'close' : 'search'} size={30} color="#fff" />
            </TouchableOpacity>
            {isZoom && (
                <Animated.View
                    style={[
                        styles.zoomControls,
                        { transform: [{ scale: scaleAnim }] },
                    ]}
                >
                    <TouchableOpacity
                        onPress={() => setZoom(Math.max(0, zoom - 0.1))}
                        onLongPress={() => setZoom(0)}
                    >
                        <Ionicons name="remove" size={30} color="#fff" />
                    </TouchableOpacity>
                    <Text style={styles.zoomText}>{zoom?.toFixed(1) ?? 0}</Text>
                    <TouchableOpacity
                        onPress={() => setZoom(Math.min(1, zoom + 0.1))}
                        onLongPress={() => setZoom(1)}
                    >
                        <Ionicons name="add" size={30} color="#fff" />
                    </TouchableOpacity>
                </Animated.View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    zoomButton: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.4)',
        padding: 12,
        borderRadius: 30,
    },
    zoomControls: {
        flexDirection: "column-reverse",
        position: 'absolute',
        bottom: '100%',
        marginBottom: 5,
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        padding: 5,
        borderRadius: 25,
        alignItems: 'center',
    },
    zoomText: {
        color: '#fff',
        fontSize: 16,
        marginHorizontal: 10,
    }
});

export default ZoomControl;