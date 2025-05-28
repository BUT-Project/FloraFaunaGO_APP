import {StyleSheet, useColorScheme, TouchableOpacity } from "react-native";
import { useAuthStore } from "@/context/zustand/store/useAuthStore";
import { useUserStore } from "@/context/zustand/store/useUserStore";
import { ThemedText, ThemedView } from "@/components/ui/themed";
import { Colors } from "@/constants/Colors";
import { useState } from "react";
import { InputWithIcon } from "@/components/ui/InputWithIcon";
import { useRegisterViewModel } from "@/hooks/viewModels/auth/useRegisterViewModel";
import StubData from "@/dal/StubLib/StubData";
export default function UserEditScreen() {
    const user = useAuthStore((state) => state.user);
    const userStore = useUserStore();
    const colorScheme =  useColorScheme() ?? 'light';
    const [mail, setMail] = useState(user?.email || '');
    const [mdp, setMdp] = useState(user?.passwordHash || '');
    const {authService} = StubData.getInstance();

    const {
      username,
      setUsername,

  } = useRegisterViewModel(authService);
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
        <InputWithIcon
        icon="user"
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
        autoCorrect={false}
      />
      <ThemedText style={styles.label}>Email</ThemedText>
        <InputWithIcon
      icon="user"
      placeholder="Email"
      value={mail}
      onChangeText={setMail}
      keyboardType="email-address"
      autoCapitalize="none"
      autoComplete="email"
      autoCorrect={false}
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
