# Login Feature

## Feature Overview

### 1. **Authentification & Gestion de Profil Utilisateur**
- **Objectif Métier**: Gestion des comptes utilisateurs et personnalisation
- **Personas Utilisateurs**: Tous les utilisateurs de l'app (passionnés de nature, étudiants, chercheurs, explorateurs occasionnels)
- **Workflows Clés**:
  - Inscription utilisateur avec mail/nom d'utilisateur
  - Connexion avec fonctionnalité "se souvenir de moi"
  - Édition du profil et upload de photo
  - Récupération de mot de passe
- **Écrans**: LoginScreen, RegisterScreen, ProfilScreen, EditProfileScreen
- **Valeur Métier**: Personnalisation de l'expérience, fidélisation utilisateur

### Particularités Domain
- Si je mets un mot de passe incorrect et un mail correct, je dois voir écrit "Mot de passe ou mail incorrect" pour la sécurité.
- 
## Test Files

- `login-flow.yaml` - Complete login functionality E2E tests including:
  - ✅ Successful login flow
  - 🚧 Invalid credentials handling
  - 🟥 Email validation
  - 🟥 Navigation to register screen
---

### Test Cases

### 1. Successful Login Flow
- Fill in valid mail and password
- Toggle "remember me" option
- Submit form
- Verify navigation to main app

### 2. Invalid Login Flow
- Fill in invalid credentials
- Submit form
- Verify error message appears
- Verify user stays on login screen

### 3. Email Validation Flow
- Fill in invalid mail format
- Submit form
- Verify validation error
- Verify form doesn't submit

### 4. Navigation Flow
- Tap register link
- Verify navigation to register screen
