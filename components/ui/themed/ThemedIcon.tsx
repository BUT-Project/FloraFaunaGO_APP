import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useThemeColor } from '@/hooks/useThemeColor';

type ThemedIconProps = React.ComponentProps<typeof Ionicons> & {
    lightColor?: string;
    darkColor?: string;
};

export function ThemedIcon({
    name,
    size = 24,
    color,
    lightColor,
    darkColor,
    ...otherProps
}: ThemedIconProps) {
    const themeColor = useThemeColor(
        { light: lightColor, dark: darkColor },
        'text'
    );

    return (
        <Ionicons
            name={name}
            size={size}
            color={color ?? themeColor}
            {...otherProps}
        />
    );
}