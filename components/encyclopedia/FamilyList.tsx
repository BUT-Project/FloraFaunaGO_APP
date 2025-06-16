import React from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Dimensions } from 'react-native';
import { ThemedView, ThemedText } from '../ui/themed'; 
import SpecieListItem from './SpecieListItem'; 
import { useGetSpecieByFamily } from '@/hooks/viewModels/useGetSpecieByFamily';
import { Capture, Family } from '@/model/domain';

interface FamilyListProps {
    family:Family
    specieId?:string,
    userCaptures:Capture[]
}

const width = Dimensions.get('window').width;
const itemSize = (width / 3) - 10;

const FamilyList: React.FC<FamilyListProps> = ({family,specieId,userCaptures}) => {
    const {
            species,
            isLoading,
            fetchMoreData,
            error,
            isListEnd,
            isLoadingMore
    } = useGetSpecieByFamily(specieId);
        
    return(
    <>
        <ThemedText type={"infoTitle"}>Famille :</ThemedText>
        {error ? 
            <ThemedText>Erreur lors la récupération de la famille de l&apos;espèce.</ThemedText>
        :
        <>
            {isLoading ? (
                <ThemedView>
                    <ActivityIndicator size={'small'} />
                </ThemedView>
            ) : (
                <FlatList
                    data={species}
                    keyExtractor={(item) => `FamilyMember-${item.id}`}
                    renderItem={({ item }) => (
                        <SpecieListItem
                            specie={item}
                            captureId={
                                userCaptures?.find(captureIn => captureIn.specie.id === item.id)?.id ?? null
                            }
                        />
                    )}
                    ListEmptyComponent={() => (
                        <ThemedView style={styles.emptyFam}>
                            <ThemedText>Aucune espèce trouvée</ThemedText>
                        </ThemedView>
                    )}
                    ListFooterComponent={() =>
                        family.length > 0 && (
                            <ThemedView style={styles.footerFam}>
                                {isListEnd && (
                                    <ThemedText style={{ textAlign: "center" }}>
                                        Pas plus de capture pour le moment.
                                    </ThemedText>
                                )}
                                {isLoadingMore && <ActivityIndicator size={"small"} />}
                            </ThemedView>
                        )
                    }
                    onEndReached={fetchMoreData}
                    onEndReachedThreshold={0.5}
                    showsHorizontalScrollIndicator={false}
                    horizontal={true}
                />
            )}
            </>
        }
    </>
    );
};

const styles = StyleSheet.create({
    section: {
        // your styles here
    },
    emptyFam: {
        width: width,
        justifyContent: "center",
        alignItems: "center"
    },
    footerFam: {
        margin: 5,
        width: itemSize,
        height: itemSize,
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 1,
        borderRadius: 10,
    },
});

export default FamilyList;

