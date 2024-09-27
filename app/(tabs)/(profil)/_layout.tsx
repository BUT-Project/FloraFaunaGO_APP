import {Stack} from "expo-router";

export default function Layout() {
    return (
        <Stack>
            <Stack.Screen name="profil" options={{
                headerShown: false}}/>
            <Stack.Screen name="settings"
            options={{

                animation:'slide_from_bottom',
                presentation: 'modal',
            }}
            />
        </Stack>
    )
}