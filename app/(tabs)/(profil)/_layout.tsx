import {Link, Stack} from "expo-router";
import {TouchableOpacity} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";


export default function Layout() {

    return (
        <Stack>
            <Stack.Screen name="profil" options={{
                headerShown: false}}/>
            <Stack.Screen name="[id]"
                          options={{
                              title: "",
                              headerBackVisible: true}}

            />
            <Stack.Screen name="settings"
            options={{

                animation:'slide_from_bottom',
                presentation: 'modal',
                headerBackVisible: false,
                headerLeft : () =>(
                    <Link href="/(profil)/profil" asChild>
                        <TouchableOpacity>
                            <Ionicons
                                name="close"
                                size={25}
                                style={{ color:"#808080", marginRight:15 }}
                            />
                        </TouchableOpacity>
                    </Link>)

            }}
            />
        </Stack>
        
    )
}