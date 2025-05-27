<p align="center">
  <img src="https://codefirst.iut.uca.fr/git/FloraFauna_GO/FloraFauna_GO_App/raw/branch/master/assets/images/logo_FFGO.png"/>
</p>

# 🌿 Flora Fauna GO

> Une application mobile d’exploration de la biodiversité inspirée de Pokémon GO.

**Flora Fauna GO** permet aux utilisateurs de découvrir la nature qui les entoure en photographiant des organismes vivants (animaux, plantes, champignons, etc.). Grâce à une IA de reconnaissance, ils peuvent identifier ces espèces, les "capturer" via un mini-jeu, et enrichir leur propre encyclopédie.

---

## 📱 Fonctionnalités

- 📷 Capture d’image via l’appareil photo
- 🤖 Reconnaissance d’espèce via une API IA (<a href="https://codefirst.iut.uca.fr/git/FloraFauna_GO/FloraFauna_GO_API">Flora Fauna GO API</a>)
- ⏳ Affichage de l’état de reconnaissance en temps réel
- 🎮 Mini-jeu de capture en 3 étapes (chaque étape est validée uniquement en cas de bon choix)
- 📚 Ajout de l’espèce capturée à une encyclopédie personnelle

---

## ⚙️ Stack technique

- **React Native** (via [Expo](https://expo.dev))
- **TypeScript**
- **Zustand** pour la gestion d’état
- **React Query** pour les appels réseau (fetch / mutation)
- **React Navigation** pour la navigation entre écrans
- **Expo Camera** pour l'accès à l'appareil photo

---

## 🚀 Installation

### Prérequis
- Node.js >= 18
- Un émulateur Android/iOS ou l'application **Expo Go** sur votre smartphone

### Étapes

```bash
# 1. Cloner le dépôt
git clone https://codefirst.iut.uca.fr/git/FloraFauna_GO/FloraFauna_GO_App.git
cd FloraFauna_GO_App

# 2. Installer les dépendances
npm install

# 3. Lancer l'application
expo start
```


## 🧑‍💻 Participants

<a href = "https://codefirst.iut.uca.fr/git/david.d_almeidar">
<img src ="https://codefirst.iut.uca.fr/git/avatars/a16fa2dc52ceae18d8923c91121caa66?size=870" height="50px">
</a>
<a href="https://codefirst.iut.uca.fr/git/patrick.brugiere">
<img src = "https://codefirst.iut.uca.fr/git/avatars/a472163657f75280bf1f720cf49b702c?size=870" height="50px">
</a>
<a href = "https://codefirst.iut.uca.fr/git/yoan.brugiere">
<img src ="https://codefirst.iut.uca.fr/git/avatars/5408f837f14efca8b12f2aec56baac37?size=870" height="50px">
</a>