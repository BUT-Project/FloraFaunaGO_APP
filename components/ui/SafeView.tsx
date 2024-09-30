import { View, type ViewProps } from 'react-native';
import {useSafeAreaInsets} from "react-native-safe-area-context";

export type SafeViewProps= ViewProps & {

};

export function SafeView({ ...otherProps }: SafeViewProps) {
    const insets = useSafeAreaInsets();

    return <View style={{
        paddingTop:insets.top,
        paddingLeft:insets.left,
        paddingRight:insets.right,
        flex: 1,
        }} {...otherProps} />;
}