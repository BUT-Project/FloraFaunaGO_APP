import {Stack} from "expo-router";

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
                              headerShown: false}}

            />
        </Stack>
    )
}