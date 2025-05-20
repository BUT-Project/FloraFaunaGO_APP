import {Stack} from 'expo-router';


export default function HomeLayout() {
    return (
        <Stack>
            <Stack.Screen name="index" options={{headerShown : false, title: "Capture "}}/>
            <Stack.Screen name="reveal" options={{headerShown : false, title: "Reveal"}}/>
        </Stack>);
}

