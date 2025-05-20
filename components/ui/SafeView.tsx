import { useSafeAreaInsets } from 'react-native-safe-area-context';
import React from 'react';
import { ViewProps, StyleProp, ViewStyle } from 'react-native';
import { ThemedView } from './themed/ThemedView'; // adapte selon ton projet

export type SafeViewProps = ViewProps & {
  disableTopInset?: boolean;
  disableBottomInset?: boolean;
  disableLeftInset?: boolean;
  disableRightInset?: boolean;
  style?: StyleProp<ViewStyle>;
};

export function SafeView({
  disableTopInset,
  disableBottomInset,
  disableLeftInset,
  disableRightInset,
  style,
  ...otherProps
}: SafeViewProps) {
  const insets = useSafeAreaInsets();

  const paddingStyle: ViewStyle = {
    paddingTop: disableTopInset ? 0 : insets.top,
    paddingBottom: disableBottomInset ? 0 : insets.bottom,
    paddingLeft: disableLeftInset ? 0 : insets.left,
    paddingRight: disableRightInset ? 0 : insets.right,
    flex: 1,
  };

  return <ThemedView style={[paddingStyle, style]} {...otherProps} />;
}