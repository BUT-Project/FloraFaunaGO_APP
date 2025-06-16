import {StyleSheet, TextInput, TextInputProps, TouchableOpacity, View} from "react-native";
import React from "react";
import {FontAwesome} from "@expo/vector-icons";
import normalize from "@/components/ui/responsive/Normalize";

interface InputWithIconProps extends TextInputProps {
    icon: React.ComponentProps<typeof FontAwesome>['name'];
    showToggle?: boolean;
    onToggle?: () => void;
    isVisible?: boolean;
}
export const InputWithIcon: React.FC<InputWithIconProps> = ({
                                                                icon,
                                                                showToggle = false,
                                                                onToggle,
                                                                isVisible = false,
                                                                ...props
                                                            }) => (
    <View style={styles.inputContainer}>
        <FontAwesome name={icon} style={styles.inputIcon} size={20} color="#AFEDEC"/>
        <TextInput
            style={styles.input}
            placeholderTextColor="#B8B4B8"
            {...props}
        />
        {showToggle && (
            <TouchableOpacity style={styles.toggleButton} onPress={onToggle}>
                <FontAwesome
                    name={isVisible ? "eye" : "eye-slash"}
                    size={20}
                    color="#AFEDEC"
                />
            </TouchableOpacity>
        )}
    </View>
);
const styles =StyleSheet.create({
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'grey',
        borderRadius: 30,
        marginBottom: 20,
        paddingHorizontal: 20,
        height: normalize(50),
        width: '100%',
    },
    inputIcon: {
        marginRight: 10,
    },
    input: {
        flex: 1,
        color: 'black',
        fontSize: normalize(16),
    },toggleButton: {
        padding: 10,
    },
});