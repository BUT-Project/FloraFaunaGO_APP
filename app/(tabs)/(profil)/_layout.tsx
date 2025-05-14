import {Link, Stack} from "expo-router";
import { useTheme } from '@react-navigation/native';


export default function Layout() {
  const { colors } = useTheme();
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
                headerBackVisible: true,
                headerStyle: {
                    backgroundColor: colors.background, // change selon thème
                },
                 headerTintColor: colors.text,

                headerLeft : () =>(
                    <Link href="/(profil)/profil" asChild>
                    </Link>)

            }}
            />
        </Stack>
        
    )
}