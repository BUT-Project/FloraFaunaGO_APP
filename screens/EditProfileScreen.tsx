import {StyleSheet, useColorScheme, TouchableOpacity } from "react-native";
import { useAuthStore } from "@/context/zustand/store/useAuthStore";
import { useUserStore } from "@/context/zustand/store/useUserStore";
import { ThemedText, ThemedView } from "@/components/ui/themed";
import { Colors } from "@/constants/Colors";
import { useEffect, useState } from "react";
import { InputWithIcon } from "@/components/ui/InputWithIcon";
import { useRegisterViewModel } from "@/hooks/viewModels/auth/useRegisterViewModel";
import StubData from "@/dal/StubLib/StubData";
import { ScrollView } from "react-native-gesture-handler";
export default function UserEditScreen() {
    const user = useAuthStore((state) => state.user);
    const updateUser = useUserStore((state) => state.updateUser)
    const colorScheme =  useColorScheme() ?? 'light';
    const [newPassword, setNewPassword] = useState('');
    const [showPasswordFields, setShowPasswordFields] = useState(false);
    const [message, setMessage] = useState<string | null>(null);
    const [username,setUsername] = useState("")
    const {authService} = StubData.getInstance();
    //const dataUser = useUserStore();
    
    const {
      email,
      setEmail,
      password,
      setPassword
  } = useRegisterViewModel(authService);

  useEffect(()=> {
    setUsername(user?.username || '')
    setEmail(user?.email || '')
    
  },[user])
    const theme = Colors[colorScheme];

    async function handleSave() {
        user!.username = username;
        user!.email = email
        await updateUser(user!.id,user!)
    }

    async function handlePasswordChange() {
      try {
          await authService!.resetPassword(user!.email, password, newPassword);
          setMessage("Mot de passe mis à jour avec succès !");
          setShowPasswordFields(false);
          setPassword('');
          setNewPassword('');
      } catch (err: any) {
          setMessage(err.message || "Erreur lors de la mise à jour du mot de passe.");
      }
  }

  return (
    <ThemedView style={styles.container}>
      <ScrollView>
      <ThemedText style={styles.label}>Nom d'utilisateur</ThemedText>
        <InputWithIcon
        icon="user"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
        autoCorrect={false}
      />
      <ThemedText style={styles.label}>Email</ThemedText>
        <InputWithIcon
      icon="user"
      placeholder="Email"
      value={email}
      onChangeText={setEmail}
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
<TouchableOpacity
                style={[styles.butt, { backgroundColor: theme.tint }]}
                onPress={() => setShowPasswordFields(!showPasswordFields)}
            >
                <ThemedText style={{ textAlign: "center" }}>
                    {showPasswordFields ? "Annuler" : "Modifier le mot de passe"}
                </ThemedText>
            </TouchableOpacity>

            {showPasswordFields && (
                <>
                    <ThemedText style={styles.label}>Ancien mot de passe</ThemedText>
                    <InputWithIcon
                        icon="lock"
                        placeholder="Ancien mot de passe"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                    />
                    <ThemedText style={styles.label}>Nouveau mot de passe</ThemedText>
                    <InputWithIcon
                        icon="lock"
                        placeholder="Nouveau mot de passe"
                        value={newPassword}
                        onChangeText={setNewPassword}
                        secureTextEntry
                    />
                    <TouchableOpacity
                        style={[styles.butt, { backgroundColor: theme.tint }]}
                        onPress={handlePasswordChange}
                    >
                        <ThemedText style={{ textAlign: "center" }}>Valider</ThemedText>
                    </TouchableOpacity>
                </>
            )}

            {message && (
                <ThemedText style={{ marginTop: 10, textAlign: "center", color: theme.text }}>
                    {message}
                </ThemedText>
            )}
</ScrollView>
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
