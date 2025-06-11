import { SafeView } from "@/components/ui/SafeView";
import ErrorBoundary from "@/components/ErrorBoundary";
import EncyclopediaScreen from "@/screens/EncyclopediaScreen";

export default function Encyclopedia() {
    return (
        <ErrorBoundary page="Encyclopedie">
            <SafeView disableBottomInset>
                <EncyclopediaScreen/>
            </SafeView>
        </ErrorBoundary>
    );
}
