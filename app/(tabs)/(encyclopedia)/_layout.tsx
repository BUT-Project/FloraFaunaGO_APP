import {Link, Stack} from "expo-router";
import { TouchableOpacity} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function Layout() {

    return (
        <Stack>
            <Stack.Screen name="encyclopedia" options={{
                headerShown: false}}/>
            <Stack.Screen name="[id]"
                          options={{
                              //animation:'slide_from_bottom',
                              //presentation: 'modal',
                              title: "",
                              headerBackTitleVisible: true}}

            />
        </Stack>
    )
}