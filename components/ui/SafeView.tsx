import {type ViewProps} from 'react-native';
import {useSafeAreaInsets} from "react-native-safe-area-context";
import {ThemedView} from './themed/ThemedView';

export type SafeViewProps= ViewProps & {

};

export function SafeView({ ...otherProps }: SafeViewProps) {
    const insets = useSafeAreaInsets();

    return <ThemedView style={{
        paddingTop:insets.top,
        paddingLeft:insets.left,
        paddingRight:insets.right,
        //paddingBottom:insets.bottom,
        flex: 1,
        }} {...otherProps} />;
}