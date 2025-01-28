import { ThemedView } from "@/components/ui/themed/ThemedView";
import { ThemedText } from "@/components/ui/themed/ThemedText";
import {Success} from "@/model/domain/Success";
import {StyleSheet} from "react-native";
import {ScrollView} from "react-native";

interface SucessDetailScreenProps {
 sucess : Success

}

export default function SuccessDetailScreen( props : SucessDetailScreenProps) {
    const { sucess } = props;

    return (
        <ScrollView>
            <ThemedView style={styles.container}>
                <ThemedText type="title" style={styles.title}>
                    {sucess.nom}
                </ThemedText>

                <ThemedText style={styles.description}>
                    {sucess.description}
                </ThemedText>

                <ThemedView style={styles.progressContainer}>
                    <ThemedText style={styles.progressText}>
                        Avancement : {sucess.avancement}%
                    </ThemedText>
                    <ThemedView style={styles.progressBar}>
                        <ThemedView
                            style={[
                                styles.progressFill,
                                { width: `${sucess.avancement}%` },
                            ]}
                        />
                    </ThemedView>
                </ThemedView>
            </ThemedView>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        alignItems: 'center',
    },
    image: {
        width: 200,
        height: 200,
        borderRadius: 100,
        marginBottom: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
        textAlign: 'center',
    },
    description: {
        fontSize: 16,
        marginBottom: 16,
        textAlign: 'justify',
    },
    progressContainer: {
        width: '100%',
        marginTop: 16,
    },
    progressText: {
        fontSize: 16,
        marginBottom: 8,
    },
    progressBar: {
        height: 10,
        backgroundColor: '#ddd',
        borderRadius: 5,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        backgroundColor: '#4caf50',
    },
});