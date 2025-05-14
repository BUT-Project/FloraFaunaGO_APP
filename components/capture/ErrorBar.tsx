import React from 'react';
import { View, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface LivesIndicatorProps {
    lives: number;
    totalLives: number;
    style?: StyleProp<ViewStyle>;
};

const LivesIndicator: React.FC<LivesIndicatorProps> = ({ lives, totalLives, style }) => {
    return (
        <View style={[styles.livesContainer,style]}>
            {[...Array(totalLives)].map((_, index) => (
                <Ionicons
                    key={index}
                    name={index < lives ? 'heart' : 'heart-outline'}
                    size={28}
                    color="red"
                />
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    livesContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
});

export default LivesIndicator;