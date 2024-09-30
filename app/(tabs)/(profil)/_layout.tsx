import {Link, Stack} from "expo-router";
import { Image, TouchableOpacity} from "react-native";

const croix = require("../../../assets/images/croix.png")

export default function Layout() {

    return (
        <Stack>
            <Stack.Screen name="profil" options={{
                headerShown: false}}/>
            <Stack.Screen name="settings"
            options={{

                animation:'slide_from_bottom',
                presentation: 'modal',
                headerBackTitleVisible: false,
                headerLeft : () =>(
                    <Link href="/(profil)/profil" asChild>
                        <TouchableOpacity>
                            <Image
                                source={croix}
                                style={{ tintColor:"#808080", width: 25, height: 25, marginRight:15 }} // Taille de l'image
                            />
                        </TouchableOpacity>
                    </Link>)

            }}
            />
        </Stack>
    )
}