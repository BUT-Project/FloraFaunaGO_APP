import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
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
    withTiming,
} from 'react-native-reanimated';
import {Ionicons} from '@expo/vector-icons';
import {GestureHandlerRootView, State, TapGestureHandler, TapGestureHandlerStateChangeEvent} from 'react-native-gesture-handler';
import * as Location from 'expo-location';
import {ThemedView} from "@/components/ui/themed/ThemedView";

// Import your domain models
import {Class, Diet, Family, Kingdom, Specie} from "@/model/domain";
import {useInfiniteSpecies} from "@/hooks/viewModels/useInfiniteSpecies";
import {ISpeciesRepository} from "@/dal/repository/ISpeciesRepository";
import { PROVIDER_GOOGLE } from "react-native-maps";
import Loading from './ui/Loading';
const {width, height} = Dimensions.get('window');
const SEARCH_HANDLE_DIMENSION = 50;
const BOTTOM_OFFSET = 20;
const SPACING = 16;

// Filter categories including "All"
type FilterCategory = 'All' | Family | Kingdom | Class | Diet;

// Filter categories
const filterCategories: { label: string; value: FilterCategory; id: string }[] = [
    {label: 'All', value: 'All', id: 'all'},
    {label: 'Mammals', value: Class.MAMMALIA, id: 'class-mammals'},
    {label: 'Birds', value: Class.AVES, id: 'class-birds'},
    {label: 'Reptiles', value: Class.REPTILIA, id: 'class-reptiles'},
    {label: 'Insects', value: Class.INSECTA, id: 'class-insects'},
    {label: 'Fish', value: Class.ACTINOPTERYGII, id: 'class-fish'},
    {label: 'Flowering Plants', value: Class.MAGNOLIOPSIDA, id: 'class-angiosperms'},
    {label: 'Carnivores', value: Diet.CARNIVORA, id: 'diet-carnivores'},
    {label: 'Herbivores', value: Diet.HERBIVORA, id: 'diet-herbivores'},
    {label: 'Omnivores', value: Diet.OMNIVORA, id: 'diet-omnivores'},
    {label: 'Animals', value: Kingdom.ANIMALIA, id: 'kingdom-animal'},
    {label: 'Plant Kingdom', value: Kingdom.PLANTAE, id: 'kingdom-plant'},
];

const Chip = ({label, isSelected, onPress}: { label: string; isSelected: boolean; onPress: () => void }) => (
    <TouchableOpacity
        style={[styles.chip, isSelected && styles.selectedChip]}
        onPress={onPress}
    >
        <Text style={[styles.chipText, isSelected && styles.selectedChipText]}>{label}</Text>
    </TouchableOpacity>
);

const AnimatedMarker = Animated.createAnimatedComponent(Marker);

interface MapInterfaceProps {
    style: ViewStyle;
    repository: ISpeciesRepository;
}

export default function MapInterface({style, repository}: MapInterfaceProps) {
    console.log('[MapInterface] Component render triggered:', {
        timestamp: new Date().toISOString(),
        repositoryId: repository?.constructor.name || 'unknown'
    });
    const [selectedCategory, setSelectedCategory] = useState<FilterCategory>('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearchActive, setIsSearchActive] = useState(false);
    const [keyboardHeight, setKeyboardHeight] = useState(0);
    const [location, setLocation] = useState<Location.LocationObject | null>(null);
    useEffect(() => {
        (async () => {
            const {status} = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                console.log('Permission to access location was denied');
                return;
            }

            const location = await Location.getCurrentPositionAsync();
            setLocation(location);
        })();
    }, []);

    // 🔧 FIX: Load all species once and do client-side filtering for better UX
    const {
        items: allSpecies,
        isLoading,
        isError,
        error,
        hasNextPage,
        fetchNextPage,
    } = useInfiniteSpecies(repository, {
        pageSize: 6, // Same as encyclopedia for shared caching
        orderBy: 'name',
        enabled: true,
    });

    // 🔧 FIX: Handle all filtering client-side to prevent map reloading
    const displayedSpecies = useMemo(() => {
        let filtered = allSpecies;

        // Apply category filter
        if (selectedCategory !== 'All') {
            filtered = filtered.filter(specie => {
                if (Object.values(Family).includes(selectedCategory as Family)) {
                    return specie.family === selectedCategory;
                } else if (Object.values(Class).includes(selectedCategory as Class)) {
                    return specie.class === selectedCategory;
                } else if (Object.values(Kingdom).includes(selectedCategory as Kingdom)) {
                    return specie.kingdom === selectedCategory;
                } else if (Object.values(Diet).includes(selectedCategory as Diet)) {
                    return specie.diet === selectedCategory;
                }
                return true;
            });
        }

        // Apply search filter
        if (searchQuery.trim() !== '') {
            filtered = filtered.filter(specie =>
                specie.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                ( specie.scientificName && specie.scientificName.toLowerCase().includes(searchQuery.toLowerCase()))
            );
        }

        return filtered;
    }, [allSpecies, selectedCategory, searchQuery]);

    const pulseAnim = useSharedValue(0.5);
    const searchWidth = useSharedValue(SEARCH_HANDLE_DIMENSION);
    const searchOpacity = useSharedValue(1);
    const chipOpacity = useSharedValue(1);
    const resultsHeight = useSharedValue(0);
    const resultsPadding = useSharedValue(0);
    const bottomContainerTranslateY = useSharedValue(0);

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
        height: SEARCH_HANDLE_DIMENSION,
        borderRadius: SEARCH_HANDLE_DIMENSION / 2,
        opacity: searchOpacity.value,
    }));

    const chipContainerStyle = useAnimatedStyle(() => ({
        opacity: chipOpacity.value,
        transform: [{translateY: interpolate(searchWidth.value, [keyboardHeight - SEARCH_HANDLE_DIMENSION, width - 20], [0, SEARCH_HANDLE_DIMENSION + SPACING], Extrapolate.CLAMP)}],
    }));

    const resultsCardStyle = useAnimatedStyle(() => ({
        height: resultsHeight.value,
        opacity: interpolate(resultsHeight.value, [0, 1], [0, 1]),
        marginTop: SPACING,
        padding: resultsPadding.value,
    }));

    const animatedCircleStyle = useAnimatedStyle(() => {
        return {
            opacity: pulseAnim.value,
            transform: [{scale: pulseAnim.value}],
        };
    });

    // 🔧 FIX: Simple client-side filtering without hook interference
    const handleChipPress = (category: FilterCategory) => {
        setSelectedCategory(category);

        // Focus map on filtered results immediately
        // Use setTimeout to ensure displayedSpecies is updated
        setTimeout(() => {
            if (mapRef.current) {
                const speciesToShow = category === 'All' ? allSpecies : displayedSpecies;

                if (speciesToShow.length > 0) {
                    const coordinates = speciesToShow.flatMap(specie =>
                        (specie.locations ?? []).map(loc => ({
                            latitude: loc.latitude,
                            longitude: loc.longitude
                        }))
                    ).filter(coord => coord && typeof coord.latitude === 'number' && typeof coord.longitude === 'number');

                    if (coordinates.length > 0) {
                        const minLat = Math.min(...coordinates.map(c => c.latitude));
                        const maxLat = Math.max(...coordinates.map(c => c.latitude));
                        const minLng = Math.min(...coordinates.map(c => c.longitude));
                        const maxLng = Math.max(...coordinates.map(c => c.longitude));

                        const region = {
                            latitude: (minLat + maxLat) / 2,
                            longitude: (minLng + maxLng) / 2,
                            latitudeDelta: Math.max((maxLat - minLat) * 1.5, 0.01),
                            longitudeDelta: Math.max((maxLng - minLng) * 1.5, 0.01),
                        };

                        mapRef.current.animateToRegion(region, 1000);
                    }
                }
            }
        }, 100);
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
            resultsHeight.value = withTiming(Math.max(height / 2 - SEARCH_HANDLE_DIMENSION - SPACING * 2, 100), {
                duration: 300,
                easing: Easing.out(Easing.cubic)
            });
        }
    };

    // 🔧 FIX: Don't use hook's search method, keep it simple
    const handleSearchChange = (text: string) => {
        setSearchQuery(text);

        if (text.length > 0) {
            resultsHeight.value = withTiming(Math.max(height / 2 - SEARCH_HANDLE_DIMENSION - SPACING * 2, 100), {
                duration: 300,
                easing: Easing.out(Easing.cubic)
            });
        } else {
            resultsHeight.value = withTiming(0, {duration: 300, easing: Easing.in(Easing.cubic)});
        }
    };

    const handleSearchBlur = () => {
        // Keep it simple - no server-side search calls
    };

    const dismissSearch = () => {
        setIsSearchActive(false);
        setSearchQuery('');
        searchWidth.value = withTiming(SEARCH_HANDLE_DIMENSION, {duration: 300, easing: Easing.out(Easing.cubic)});
        chipOpacity.value = withTiming(1, {duration: 200});
        resultsHeight.value = withTiming(0, {duration: 300, easing: Easing.in(Easing.cubic)});

        resultsPadding.value = withTiming(0, {duration: 300, easing: Easing.out(Easing.cubic)});
        Keyboard.dismiss();
    };

    const handleResultPress = (specie: Specie) => {
        dismissSearch();

        if (mapRef.current && specie.locations &&  specie.locations.length > 0 ) {
            const firstLocation = specie.locations[0];
            mapRef.current.animateToRegion({
                latitude: firstLocation.latitude,
                longitude: firstLocation.longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
            }, 1000);
        }
    };
    const handleMarkerPress = useCallback((specieId: string, locationIndex: number) => {
        // Always resolve the current species by ID to avoid stale references
        const currentSpecie = displayedSpecies.find(s => s.id.toString() === specieId);
        if (currentSpecie && currentSpecie.locations && currentSpecie.locations[locationIndex]) {
            dismissSearch();

            const location = currentSpecie.locations[locationIndex];
            if (mapRef.current) {
                mapRef.current.animateToRegion({
                    latitude: location.latitude,
                    longitude: location.longitude,
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01,
                }, 1000);
            }
        }
    }, [displayedSpecies]);

    const handleOutsidePress = (event: TapGestureHandlerStateChangeEvent) => {
        if (event.nativeEvent.state === State.ACTIVE) {
            Keyboard.dismiss();
            if (isSearchActive) {
                dismissSearch();
            }
        }
    };

    // Load more data when scrolling near the bottom of search results
    const handleLoadMore = () => {
        if (hasNextPage && !isLoading) {
            fetchNextPage();
        }
    };

    // Show loading state for initial load
    if (isLoading && allSpecies.length === 0) {
        return (<Loading style={[styles.container,style]} text='CHargement des espèces ....'/>);
    }

    // Show error state
    if (isError) {
        return (
            <View style={[styles.container, styles.centerContent, style]}>
                <Ionicons name="alert-circle" size={48} color="#FF3B30"/>
                <Text style={styles.errorText}>Failed to load species data</Text>
                <Text style={styles.errorSubtext}>{error?.message || 'Please try again later'}</Text>
            </View>
        );
    }

    return (
        <GestureHandlerRootView style={[styles.container, style]}>
            <TapGestureHandler onHandlerStateChange={handleOutsidePress}>
                <View style={styles.container}>
                    <Animated.View style={styles.container}>
                        <MapView
                            testID='MainMapView'
                            provider={PROVIDER_GOOGLE}
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
                            {displayedSpecies.map((specie) =>
                                specie.locations?.map((specieLocation, locationIndex) => (
                                    <AnimatedMarker
                                        key={`marker-${specie.id}-${locationIndex}`}
                                        coordinate={{
                                            latitude: specieLocation.latitude,
                                            longitude: specieLocation.longitude
                                        }}
                                        onPress={() => handleMarkerPress(specie.id.toString(), locationIndex)}
                                    >
                                            <Image source={{uri: specie.image}} style={styles.markerImage}/>
                                    </AnimatedMarker>
                                ))
                            )}

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

                        <Animated.View style={[styles.bottomContainer, bottomContainerStyle]}>
                            <TapGestureHandler onHandlerStateChange={() => {
                            }}>
                                <Animated.View>
                                    <Animated.View style={[styles.searchBarContainer, searchContainerStyle]}>
                                        <TouchableOpacity onPress={handleSearchPress}
                                                          style={styles.searchIconContainer}>
                                            <Ionicons name="search" size={24} color="white"/>
                                        </TouchableOpacity>
                                        {isSearchActive && (
                                            <TextInput
                                                style={styles.searchInput}
                                                placeholder="Rechercher une espèce..."
                                                placeholderTextColor="#999"
                                                value={searchQuery}
                                                onChangeText={handleSearchChange}
                                                onBlur={handleSearchBlur}
                                                onFocus={handleSearchFocus}
                                                autoFocus
                                            />
                                        )}
                                        {isSearchActive && (
                                            <TouchableOpacity onPress={dismissSearch} style={styles.closeIconContainer}>
                                                <Ionicons name="close" size={24} color="white"/>
                                            </TouchableOpacity>
                                        )}
                                    </Animated.View>

                                    <Animated.View style={[styles.resultsCard, resultsCardStyle]}>
                                        <ScrollView
                                            style={{padding: 8}}
                                            onScroll={({nativeEvent}) => {
                                                const {layoutMeasurement, contentOffset, contentSize} = nativeEvent;
                                                const paddingToBottom = 20;
                                                if (layoutMeasurement.height + contentOffset.y >= contentSize.height - paddingToBottom) {
                                                    handleLoadMore();
                                                }
                                            }}
                                            scrollEventThrottle={400}
                                        >
                                            {displayedSpecies.map((specie) => (
                                                <TouchableOpacity
                                                    key={specie.id}
                                                    style={styles.resultItem}
                                                    onPress={() => handleResultPress(specie)}
                                                >
                                                    <Text style={styles.resultItemText}>{specie.name}</Text>
                                                    <Text
                                                        style={styles.resultItemScientific}>{specie.scientificName}</Text>
                                                    <Text
                                                        style={styles.resultItemFamily}>{specie.family} • {specie.class}</Text>
                                                    <Text style={styles.resultItemHabitat}>{specie.habitat?.zone ?? "UNKNOWN"}</Text>
                                                </TouchableOpacity>
                                            ))}
                                            {isLoading && (
                                                <View style={styles.loadingMore}>
                                                    <ActivityIndicator size="small" color="#007AFF"/>
                                                    <Text style={styles.loadingMoreText}>Loading more...</Text>
                                                </View>
                                            )}
                                        </ScrollView>
                                    </Animated.View>

                                    <Animated.View style={[styles.chipContainer, chipContainerStyle]}>
                                        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                                            {filterCategories.map((category) => (
                                                <Chip
                                                    key={category.id}
                                                    label={category.label}
                                                    isSelected={selectedCategory === category.value}
                                                    onPress={() => handleChipPress(category.value)}
                                                />
                                            ))}
                                        </ScrollView>
                                    </Animated.View>
                                </Animated.View>
                            </TapGestureHandler>
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
    centerContent: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    loadingText: {
        marginTop: 16,
        fontSize: 16,
        color: '#666',
    },
    errorText: {
        marginTop: 16,
        fontSize: 18,
        fontWeight: '600',
        color: '#FF3B30',
        textAlign: 'center',
    },
    errorSubtext: {
        marginTop: 8,
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
    },
    loadingMore: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
    },
    loadingMoreText: {
        marginLeft: 8,
        fontSize: 14,
        color: '#666',
    },
    map: {
        width: '100%',
        height: '100%',
    },
    bottomContainer: {
        position: 'absolute',
        bottom: BOTTOM_OFFSET + 10,
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
        width: SEARCH_HANDLE_DIMENSION,
        height: SEARCH_HANDLE_DIMENSION,
        justifyContent: 'center',
        alignItems: 'center',
    },
    closeIconContainer: {
        width: SEARCH_HANDLE_DIMENSION,
        height: SEARCH_HANDLE_DIMENSION,
        justifyContent: 'center',
        alignItems: 'center',
    },
    searchInput: {
        flex: 1,
        height: SEARCH_HANDLE_DIMENSION,
        color: 'white',
        fontSize: 16,
        paddingHorizontal: 10,
    },
    chipContainer: {
        left: -10,
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
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    resultItemText: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 2,
    },
    resultItemScientific: {
        fontSize: 14,
        fontStyle: 'italic',
        color: '#555',
        marginBottom: 2,
    },
    resultItemFamily: {
        fontSize: 13,
        color: '#666',
        marginBottom: 2,
    },
    resultItemHabitat: {
        fontSize: 12,
        color: '#888',
    },
    markerContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius : 100,
        borderColor : 'grey',
        borderWidth: 1,
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
        backgroundColor: '#6DCB6D',
        borderWidth: 2,
        borderColor: 'white',
    },
});