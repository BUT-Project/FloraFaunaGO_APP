import Animated, {useAnimatedStyle, useSharedValue, withSpring} from "react-native-reanimated";
import {Image, Pressable, StyleSheet, View, ViewProps} from "react-native";
import {ThemedText} from "@/components/ui/themed/ThemedText";
import React, {forwardRef, useState} from "react";
import Specie from "@/model/domain/Specie";

interface SpecieCardProps extends ViewProps {
    specie: Specie;
}

const BORDER_RADIUS = 20;
const CARD_WIDTH = 250;
const COLLAPSED_HEIGHT = 450;
const EXPANDED_HEIGHT = 550;
const MAX_COLLAPSED_LINES = 2;

const SpecieCard = forwardRef<Animated.View, SpecieCardProps>(({specie, ...props}, ref) => {
    const { id, name, image, description, family } = specie;
    const formattedId = `#${id.toString().padStart(3, '0')}`;

    // State for tracking if description is expanded
    const [isExpanded, setIsExpanded] = useState(false);

    // Animation values
    const cardHeight = useSharedValue(COLLAPSED_HEIGHT);
    const descriptionHeight = useSharedValue(70);

    // Animated styles
    const animatedCardStyle = useAnimatedStyle(() => ({
        height: cardHeight.value,
    }));

    const animatedDescriptionStyle = useAnimatedStyle(() => ({
        height: descriptionHeight.value,
        overflow: 'hidden'
    }));

    // Handle description press
    const handleDescriptionPress = () => {
        setIsExpanded(!isExpanded);

        // Animate both card and description heights
        cardHeight.value = withSpring(
            isExpanded ? COLLAPSED_HEIGHT : EXPANDED_HEIGHT,
            {
                damping: 15,
                stiffness: 100
            }
        );

        descriptionHeight.value = withSpring(
            isExpanded ? 70 : 170,
            {
                damping: 15,
                stiffness: 100
            }
        );
    };

    return (
        <Animated.View {...props} ref={ref} style={[styles.container, animatedCardStyle, props.style]} >
            <View style={styles.cardContent}>
                <View style={styles.header}>
                    <ThemedText style={styles.name}>{name || 'Unknown'}</ThemedText>
                    <View style={styles.pvContainer}>
                        <ThemedText style={styles.pv}>PV {Math.floor(Math.random() * 100) + 50}</ThemedText>
                    </View>
                </View>
                <View style={styles.imageContainer}>
                    <Image
                        source={{uri: image || 'https://via.placeholder.com/200'}}
                        style={styles.image}
                        resizeMode="cover"
                    />
                </View>
                <View style={styles.typeContainer}>
                    <ThemedText style={styles.type}>{family || 'Unknown Type'}</ThemedText>
                </View>

                <Pressable onPress={handleDescriptionPress} style={styles.descriptionContainer}>
                    <Animated.View style={animatedDescriptionStyle}>
                        <ThemedText
                            style={styles.description}
                            numberOfLines={isExpanded ? undefined : MAX_COLLAPSED_LINES}
                        >
                            {description || 'No description available.'}
                        </ThemedText>
                    </Animated.View>
                </Pressable>

                <ThemedText style={styles.id}>ID: {formattedId}</ThemedText>
            </View>
        </Animated.View>
    );
})
const styles = StyleSheet.create({
    container: {
        width: CARD_WIDTH + 20,
        borderRadius: BORDER_RADIUS,
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        backgroundColor: 'white',
        overflow: 'hidden',
        justifyContent: 'center',
        alignItems: 'center',
    },
    cardContent: {
        flex: 1,
        width: '100%',
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 12,
        justifyContent: 'space-between',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    name: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
    },
    pvContainer: {
        backgroundColor: '#FF5252',
        borderRadius: 12,
        padding: 4,
    },
    pv: {
        color: 'white',
        fontWeight: 'bold',
    },
    imageContainer: {
        backgroundColor: '#F0F0F0',
        borderRadius: 8,
        padding: 8,
        aspectRatio: 1,
        marginBottom: 8,
    },
    image: {
        width: '100%',
        height: '100%',
    },
    typeContainer: {
        backgroundColor: '#3498DB',
        borderRadius: 12,
        paddingVertical: 4,
        paddingHorizontal: 8,
        alignSelf: 'flex-start',
        marginBottom: 8,
    },
    type: {
        color: 'white',
        fontWeight: 'bold',
    },
    descriptionContainer: {
        backgroundColor: '#F0F0F0',
        flex: 1,
        marginBottom: 8,
    },
    description: {
        fontSize: 14,
        fontStyle: 'italic',
        color: '#666',
        marginBottom: 4,
    },
    expandButton: {
        fontSize: 12,
        color: '#3498DB',
        textAlign: 'right',
        marginBottom: 4,
    },
    id: {
        fontSize: 12,
        color: '#999',
        textAlign: 'right',
    },
});

export default SpecieCard