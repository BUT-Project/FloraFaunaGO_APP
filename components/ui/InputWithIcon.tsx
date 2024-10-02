import {TextInput, TextInputProps, View,StyleSheet} from "react-native";
import React from "react";
import {FontAwesome} from "@expo/vector-icons";
import normalize from "@/components/ui/responsive/Normalize";

interface InputWithIconProps extends TextInputProps {
    icon: React.ComponentProps<typeof FontAwesome>['name'];
}
export const InputWithIcon: React.FC<InputWithIconProps> = ({ icon, ...props }) => (
    <View style={styles.inputContainer}>
        <FontAwesome name={icon} style={styles.inputIcon} size={20} color="#AFEDEC"/>
        <TextInput
            style={styles.input}
            placeholderTextColor="#B8B4B8"
            {...props}
        />
    </View>
);

const styles =StyleSheet.create({
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
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
    }
});