import React, {useEffect, useRef, useState} from 'react';
import {
    ActivityIndicator,
    Dimensions,
    Image,
    Keyboard,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    ViewStyle
} from 'react-native';
import MapView, {Marker} from 'react-native-maps';
import Animated, {
    Easing,
    Extrapolate,
    interpolate,
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withSequence,
    withSpring,
    withTiming,
} from 'react-native-reanimated';
import {Ionicons} from '@expo/vector-icons';
import {
    GestureHandlerRootView,
    State,
    TapGestureHandler,
    TapGestureHandlerStateChangeEvent
} from 'react-native-gesture-handler';
import Svg, {Circle, Defs, RadialGradient, Stop} from 'react-native-svg';
import * as LocationExpo from 'expo-location';
import {ThemedView} from "@/components/ui/themed/ThemedView";
import {Family} from '@/model/domain/Family';
import Specie from "@/model/domain/Specie";
import StubData from "@/dal/StubLib/StubData";
import {useInfiniteSpecies} from "@/hooks/useInfiniteSpecies";
import Location from "@/model/domain/Location";

const {width, height} = Dimensions.get('window');
const SEARCH_HANDLE_WIDTH = 50;
const BOTTOM_OFFSET = 20;
const SPACING = 16;
const families = Object.values(Family);
const Chip = ({label, isSelected, onPress}: { label: string; isSelected: boolean; onPress: () => void }) => (
    <TouchableOpacity
        style={[styles.chip, isSelected && styles.selectedChip]}
        onPress={onPress}
    >
        <Text style={[styles.chipText, isSelected && styles.selectedChipText]}>{label}</Text>
    </TouchableOpacity>
);

const AnimatedMarker = Animated.createAnimatedComponent(Marker);

const BlurredZone = ({color, size}
                     : { color: string; size: number }
) => (
    <Svg height={size} width={size} style={styles.blurredZone}>
        <Defs>
            <RadialGradient id="grad" cx="50%" cy="50%" rx="50%" ry="50%" fx="50%" fy="50%">
                <Stop offset="0%" stopColor={color} stopOpacity="0.7"/>
                <Stop offset="100%" stopColor={color} stopOpacity="0"/>
            </RadialGradient>
        </Defs>
        <Circle cx={size / 2} cy={size / 2} r={size / 2 - 10} fill="url(#grad)"/>
    </Svg>
);

export default function MapInterface(
    {location, style}: { location: LocationExpo.LocationObject | null, style: ViewStyle }
) {

    const {speciesRepository} = StubData.getInstance();

    const {
        items: species,
        isLoading,
        isFetching,
        filterByName,
        filterByFamily,
        fetchNextPage,
        hasNextPage,
        clearFilters,
    } = useInfiniteSpecies(speciesRepository, {
        pageSize: 20,
        enabled: true
    });

    const [selectedCategory, setSelectedCategory] = useState<Family | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearchActive, setIsSearchActive] = useState(false);
    const [keyboardHeight, setKeyboardHeight] = useState(0);
    const [selectedMarker, setSelectedMarker] = useState<Specie | null>(null);

    const pulseAnim = useSharedValue(0.5);


    const searchWidth = useSharedValue(SEARCH_HANDLE_WIDTH);
    const searchOpacity = useSharedValue(1);
    const chipOpacity = useSharedValue(1);
    const resultsHeight = useSharedValue(0);
    const resultsPadding = useSharedValue(0);
    const bottomContainerTranslateY = useSharedValue(0);
    const markerScale = useSharedValue(1);

    const mapRef = useRef<MapView>(null);

    useEffect(() => {
        if (location) {
            pulseAnim.value = withRepeat(
                withSequence(
                    withTiming(1, {duration: 1000, easing: Easing.inOut(Easing.ease)}),
                    withTiming(0.5, {duration: 1000, easing: Easing.inOut(Easing.ease)})
                ),
                -1,
                false
            );
        }
    }, [location]);


    useEffect(() => {
        const keyboardWillShowListener = Keyboard.addListener(
            'keyboardWillShow',
            (e) => {
                const newKeyboardHeight = e.endCoordinates.height;
                setKeyboardHeight(newKeyboardHeight);
                resultsPadding.value = withTiming(20, {duration: 300, easing: Easing.out(Easing.cubic)});

                bottomContainerTranslateY.value = withTiming(-newKeyboardHeight / 4 + BOTTOM_OFFSET - 100, {
                    duration: 250,
                    easing: Easing.out(Easing.cubic)
                });
            }
        );
        const keyboardWillHideListener = Keyboard.addListener(
            'keyboardWillHide',
            () => {
                setKeyboardHeight(0);
                bottomContainerTranslateY.value = withTiming(0, {duration: 250, easing: Easing.out(Easing.cubic)});
            }
        );

        return () => {
            keyboardWillShowListener.remove();
            keyboardWillHideListener.remove();
        };
    }, []);

    const bottomContainerStyle = useAnimatedStyle(() => ({
        transform: [{translateY: bottomContainerTranslateY.value}],
    }));

    const searchContainerStyle = useAnimatedStyle(() => ({
        width: searchWidth.value,
        height: SEARCH_HANDLE_WIDTH,
        borderRadius: SEARCH_HANDLE_WIDTH / 2,
        opacity: searchOpacity.value,
    }));

    const chipContainerStyle = useAnimatedStyle(() => ({
        opacity: chipOpacity.value,
        transform: [{translateY: interpolate(searchWidth.value, [keyboardHeight - SEARCH_HANDLE_WIDTH, width - 20], [0, SEARCH_HANDLE_WIDTH + SPACING], Extrapolate.CLAMP)}],
    }));

    const resultsCardStyle = useAnimatedStyle(() => ({
        height: resultsHeight.value,
        opacity: interpolate(resultsHeight.value, [0, 1], [0, 1]),
        marginTop: SPACING,
        padding: resultsPadding.value,
    }));

    const animatedMarkerStyle = useAnimatedStyle(() => ({
        transform: [{scale: withSpring(markerScale.value, {damping: 10, stiffness: 100})}],
    }));
    const animatedCircleStyle = useAnimatedStyle(() => {
        return {
            opacity: pulseAnim.value,
            transform: [{scale: pulseAnim.value}],
        };
    });

    const RandomColor = (seed: number) => {
        return `hsl(${Math.floor(seed * 137.508 + 360) % 360}, 100%, 50%)`;
    };

    const getSpeciesLocations = (species: Specie[]) => {
        return species.flatMap(specie =>
            specie.locations.map(loc => ({
                ...loc,
                specieId: specie.id,
                specieName: specie.name,
                specieFamily: specie.family,
                specieImage: specie.image,
                color: RandomColor(specie.id),
            }))
        );
    };

    // Updated map region calculation
    const calculateMapRegion = (locations: Location[]) => {
        if (locations.length === 0) return null;

        const lats = locations.map(l => l.latitude);
        const lngs = locations.map(l => l.longitude);

        const minLat = Math.min(...lats);
        const maxLat = Math.max(...lats);
        const minLng = Math.min(...lngs);
        const maxLng = Math.max(...lngs);

        return {
            latitude: (minLat + maxLat) / 2,
            longitude: (minLng + maxLng) / 2,
            latitudeDelta: (maxLat - minLat) * 1.5,
            longitudeDelta: (maxLng - minLng) * 1.5,
        };
    };

    // Updated chip handler
    const handleChipPress = (category: Family) => {
        setSelectedCategory(prev => prev === category ? null : category);
        if (category) {
            filterByFamily(category);
        } else {
            clearFilters();
        }

        if (mapRef.current) {
            const filteredSpecies = category
                ? species.filter(s => s.family === category)
                : species;
            const allLocations = getSpeciesLocations(filteredSpecies);
            const region = calculateMapRegion(allLocations);

            if (region) {
                mapRef.current.animateToRegion(region, 1000);
            }
        }
    };

    const handleSearchPress = () => {
        if (!isSearchActive) {
            setIsSearchActive(true);
            searchWidth.value = withTiming(width - 20, {duration: 300, easing: Easing.out(Easing.cubic)});
            chipOpacity.value = withTiming(0, {duration: 200});
        }
    };

    const handleSearchFocus = () => {
        if (searchQuery.length > 0) {
            resultsHeight.value = withTiming(Math.max(height / 2 - SEARCH_HANDLE_WIDTH - SPACING * 2, 100), {
                duration: 300,
                easing: Easing.out(Easing.cubic)
            });
        }
    };

    const handleSearchChange = (text: string) => {
        setSearchQuery(text);
        if (text.length > 0 || text.length === 0) {
            resultsHeight.value = withTiming(Math.max(height / 2 - SEARCH_HANDLE_WIDTH - SPACING * 2, 100), {
                duration: 300,
                easing: Easing.out(Easing.cubic)
            });
        } else {
            resultsHeight.value = withTiming(0, {duration: 300, easing: Easing.in(Easing.cubic)});
        }
    };

    const handleSearchBlur = () => {
    };

    const dismissSearch = () => {
        setIsSearchActive(false);
        setSearchQuery('');
        searchWidth.value = withTiming(SEARCH_HANDLE_WIDTH, {duration: 300, easing: Easing.out(Easing.cubic)});
        chipOpacity.value = withTiming(1, {duration: 200});
        dismissResults();
        resultsPadding.value = withTiming(0, {duration: 300, easing: Easing.out(Easing.cubic)});

    };

    const dismissResults = () => {
        if (searchQuery === '' || selectedMarker != null){
            resultsHeight.value = withTiming(0, {duration: 300, easing: Easing.in(Easing.cubic)});
        }
        Keyboard.dismiss();
    };


    const handleResultPress = (specie: Specie) => {
        setSelectedMarker(specie);
        if (mapRef.current && specie.locations.length > 0) {
            const region = calculateMapRegion(specie.locations);
            if (region) {
                mapRef.current.animateToRegion({
                    ...region,
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01,
                }, 1000);
            }
        }
        dismissSearch();
    };

    const handleOutsidePress = (event: TapGestureHandlerStateChangeEvent) => {
        if (event.nativeEvent.state === State.ACTIVE) {
            Keyboard.dismiss();
            if (isSearchActive) {
                dismissSearch();
            }
        }
    };

    const handleScroll = ({ nativeEvent }: any) => {
        if (hasNextPage && !isFetching) {
            const { layoutMeasurement, contentOffset, contentSize } = nativeEvent;
            const isEndReached = layoutMeasurement.height + contentOffset.y >= contentSize.height - 20;

            if (isEndReached) {
                fetchNextPage();
            }
        }
    };

    return (
        <GestureHandlerRootView style={[styles.container, style]}>
            <TapGestureHandler onHandlerStateChange={handleOutsidePress}>
                <View style={styles.container}>
                    <MapView
                        ref={mapRef}
                        style={styles.map}
                        initialRegion={
                            location
                                ? {
                                    latitude: location.coords.latitude,
                                    longitude: location.coords.longitude,
                                    latitudeDelta: 0.0922,
                                    longitudeDelta: 0.0421,
                                }
                                : {
                                    latitude: 45.7796,
                                    longitude: 3.0862,
                                    latitudeDelta: 0.0922,
                                    longitudeDelta: 0.0421,
                                }
                        }
                    >
                        {species.map((specie) => (
                            specie.locations.map((location, locationIndex) => (
                                <AnimatedMarker
                                    key={`${specie.id}-${locationIndex}`}
                                    coordinate={{
                                        latitude: location.latitude,
                                        longitude: location.longitude
                                    }}
                                    style={animatedMarkerStyle}
                                    onPress={() => handleResultPress(specie)}
                                >
                                    <View style={[styles.markerContainer, {
                                        width: location.radius * 2,
                                        height: location.radius * 2
                                    }]}>
                                        <BlurredZone color={RandomColor(specie.id)} size={location.radius * 2}/>
                                        <Image source={{ uri: specie.image }} style={styles.markerImage}/>
                                    </View>
                                </AnimatedMarker>
                            ))
                        ))}

                        {location && (
                            <Marker
                                coordinate={{
                                    latitude: location.coords.latitude,
                                    longitude: location.coords.longitude,
                                }}
                                title="My Location"
                            >
                                <Animated.View style={[styles.pulseCircle, animatedCircleStyle]}>
                                    <ThemedView style={styles.markerDot}/>
                                </Animated.View>
                            </Marker>
                        )}
                    </MapView>

                    {/* Rest of the UI components (search bar, chips, results list) remain the same... */}
                    <Animated.View style={[styles.bottomContainer, bottomContainerStyle]}>
                        {/* Search bar */}
                        <Animated.View style={[styles.searchBarContainer, searchContainerStyle]}>
                            <TouchableOpacity onPress={handleSearchPress} style={styles.searchIconContainer}>
                                <Ionicons name="search" size={24} color="white"/>
                            </TouchableOpacity>
                            {isSearchActive && (
                                <>
                                    <TextInput
                                        style={styles.searchInput}
                                        placeholder="Search..."
                                        placeholderTextColor="#999"
                                        value={searchQuery}
                                        onChangeText={handleSearchChange}
                                        onBlur={handleSearchBlur}
                                        onFocus={handleSearchFocus}
                                    />
                                    <TouchableOpacity onPress={dismissSearch} style={styles.closeIconContainer}>
                                        <Ionicons name="close" size={24} color="white"/>
                                    </TouchableOpacity>
                                </>
                            )}
                        </Animated.View>

                        {/* Results list */}
                        <Animated.View style={[styles.resultsCard, resultsCardStyle]}>
                            <ScrollView onScroll={handleScroll} scrollEventThrottle={16}>
                                {species.map((specie) => (
                                    <TouchableOpacity
                                        key={specie.id}
                                        style={styles.resultItem}
                                        onPress={() => handleResultPress(specie)}
                                    >
                                        <Text style={styles.resultItemText}>{specie.name}</Text>
                                        <Text style={styles.resultItemFamily}>
                                            {specie.family} • {specie.locations.length} location{specie.locations.length !== 1 ? 's' : ''}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                                {isFetching && (
                                    <View style={styles.loadingContainer}>
                                        <ActivityIndicator size="small" color="#000"/>
                                    </View>
                                )}
                            </ScrollView>
                        </Animated.View>

                        {/* Category chips */}
                        <Animated.View style={[styles.chipContainer, chipContainerStyle]}>
                            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                                {families.map((category) => (
                                    <Chip
                                        key={category}
                                        label={category}
                                        isSelected={selectedCategory === category}
                                        onPress={() => handleChipPress(category)}
                                    />
                                ))}
                            </ScrollView>
                        </Animated.View>
                    </Animated.View>
                </View>
            </TapGestureHandler>
        </GestureHandlerRootView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    map: {
        width: '100%',
        height: '100%',
    },
    bottomContainer: {
        position: 'absolute',
        bottom: BOTTOM_OFFSET + 10, // -100
        left: 10,
        right: 10,
    },
    searchBarContainer: {
        backgroundColor: 'black',
        flexDirection: 'row',
        alignItems: 'center',
        overflow: 'hidden',
    },
    searchIconContainer: {
        width: SEARCH_HANDLE_WIDTH,
        height: SEARCH_HANDLE_WIDTH,
        justifyContent: 'center',
        alignItems: 'center',
    },
    closeIconContainer: {
        width: SEARCH_HANDLE_WIDTH,
        height: SEARCH_HANDLE_WIDTH,
        justifyContent: 'center',
        alignItems: 'center',
    },
    searchInput: {
        flex: 1,
        height: SEARCH_HANDLE_WIDTH,
        color: 'white',
        fontSize: 16,
        paddingHorizontal: 10,
    },
    chipContainer: {
        paddingVertical: 5,
    },
    chip: {
        backgroundColor: 'white',
        borderRadius: 20,
        paddingHorizontal: 15,
        paddingVertical: 8,
        marginRight: 10,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    selectedChip: {
        backgroundColor: 'black',
    },
    chipText: {
        color: 'black',
        fontWeight: 'bold',
    },
    selectedChipText: {
        color: 'white',
    },
    resultsCard: {
        backgroundColor: 'white',
        borderRadius: 20,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: -2},
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        overflow: 'hidden',
    },
    resultItem: {
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    resultItemText: {
        fontSize: 16,
    },
    resultItemFamily: {
        fontSize: 14,
        color: '#666',
    },

    markerContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    markerImage: {
        width: 40,
        height: 40,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'white',
    },
    blurredZone: {
        position: 'absolute',
    },

    pulseCircle: {
        ...StyleSheet.absoluteFillObject,
        alignItems: 'center',
        justifyContent: 'center',
    },
    markerDot: {
        width: 24,
        height: 24,
        borderRadius: 100,
        backgroundColor: '#679BFF',
        borderWidth: 2,
        borderColor: 'white',
    },
    loadingContainer: {
        padding: 20,
        alignItems: 'center',
    },
});