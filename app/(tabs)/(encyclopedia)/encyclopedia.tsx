import { SafeView } from "@/components/ui/SafeView";
import EncyclopediaScreen from "@/screens/EncyclopediaScreen";

export default function Encyclopedia() {
    return (
        <SafeView disableBottomInset>
             <EncyclopediaScreen/>
        </SafeView>
       
    );
}
