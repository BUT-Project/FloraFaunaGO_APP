import { TextInput, Button, StyleSheet, useColorScheme, TouchableOpacity } from "react-native";
import { useAuthStore } from "@/context/zustand/store/useAuthStore";
import { useUserStore } from "@/context/zustand/store/useUserStore";
import { ThemedText, ThemedView } from "@/components/ui/themed";
import { Colors } from "@/constants/Colors";
import { useState } from "react";
import { BorderlessButton } from "react-native-gesture-handler";
import { center } from "@shopify/react-native-skia";
export default function UserEditScreen() {
    const user = useAuthStore((state) => state.user);
    const userStore = useUserStore();
    const colorScheme =  useColorScheme() ?? 'light';
    const [username, setUsername] = useState(user?.username || '');
    const [mail, setMail] = useState(user?.email || '');
    const [mdp, setMdp] = useState(user?.passwordHash || '');

    const theme = Colors[colorScheme];

    function handleSave() {
        user!.username = username;
        user!.email = mail
        user!.passwordHash = mdp
        userStore.updateUser(user!.id,user!)
    }
  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.label}>Nom d'utilisateur</ThemedText>
      <TextInput
    
        style={[styles.input, { color: theme.text }]}
        value={username}
        autoCapitalize="none"
        onChangeText={setUsername}
      />
      <ThemedText style={styles.label}>Email</ThemedText>
      <TextInput
        style={[styles.input, { color: theme.text }]}
        value={mail}
        keyboardType="email-address"
        autoCapitalize="none"
        onChangeText={setMail}

      />
    <ThemedText style={styles.label}>Nouveau mot de passe</ThemedText>
      <TextInput
        style={[styles.input, { color: theme.text }]}
        value={mdp}
        autoCapitalize="none"
        onChangeText={setMdp}

      />

<TouchableOpacity
  style={[styles.butt, { backgroundColor: theme.tint }]}
  onPress={handleSave}
>
  <ThemedText style={{textAlign:"center"}}>Enregistrer</ThemedText>
</TouchableOpacity>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
    butt:{
        margin:30,
        padding:10,
    },
  container: {
    padding: 16,
  },
  label: {
    fontWeight: "bold",
    marginTop: 12,
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    padding:10
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
