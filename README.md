# 🏴‍☠️ PirateRisks Management Lab

> **Sensibilisation cyber personnalisée et simulation de risques assistées par IA.**

PirateRisks Management Lab est un prototype interactif de sensibilisation à la cybersécurité.

L'application génère un parcours de **5 situations cyber personnalisées** à partir du contexte professionnel de l'utilisateur : fonction, secteur d'activité, outils utilisés et niveau de connaissances en cybersécurité.

L'objectif est de dépasser les quiz génériques en confrontant l'utilisateur à des situations proches de son environnement professionnel.

---

## 🎯 Objectif

PirateRisks Management Lab cherche à rendre la sensibilisation cyber :

- plus personnalisée ;
- plus interactive ;
- plus proche des situations professionnelles réelles ;
- orientée vers la compréhension du risque plutôt que vers la simple mémorisation de règles.

L'utilisateur ne répond donc pas uniquement à des questions techniques : il doit **prendre une décision face à une situation cyber contextualisée**.

---

## 🧭 Parcours utilisateur

### 1. Création du profil

L'utilisateur renseigne :

- sa fonction ;
- son secteur d'activité ;
- les outils numériques qu'il utilise ;
- son niveau en cybersécurité.

Aucune identité, adresse email ou entreprise n'est nécessaire pour générer le questionnaire.

### 2. Génération IA

PirateRisks Management Lab transmet le contexte professionnel au backend.

L'IA génère alors **5 situations cyber différentes et personnalisées**.

Lorsque plusieurs outils sont sélectionnés, le moteur cherche à diversifier les situations proposées.

### 3. Simulation

Pour chaque situation :

- un scénario professionnel est présenté ;
- quatre décisions sont proposées ;
- une seule réponse est considérée comme correcte ;
- l'utilisateur reçoit immédiatement un feedback pédagogique.

### 4. Scoring

Chaque bonne décision rapporte un point.

À la fin du parcours, l'utilisateur obtient :

- un score sur 5 ;
- un pourcentage ;
- une appréciation globale ;
- le nombre de situations maîtrisées et non maîtrisées.

### 5. Analyse de risque

Chaque scénario est également associé à une analyse simplifiée comprenant :

- l'actif concerné ;
- la menace ;
- le vecteur d'attaque ;
- la vulnérabilité humaine ou organisationnelle ;
- l'événement redouté ;
- l'impact potentiel ;
- la probabilité initiale ;
- l'impact initial ;
- la probabilité résiduelle ;
- le réflexe de sécurité à retenir.

### 6. Rapport

À la fin de la simulation, PirateRisks Management Lab construit un bilan personnalisé contenant le profil, le score, les cinq situations rencontrées, les risques associés et les réflexes prioritaires.

Le rapport peut être exporté en **PDF depuis le navigateur**.

---

## 🧠 Exemples de menaces couvertes

Selon le profil de l'utilisateur, les scénarios peuvent notamment porter sur :

- phishing ;
- spear phishing ;
- Business Email Compromise (BEC) ;
- fraude au président ;
- vol d'identifiants ;
- MFA fatigue ;
- ingénierie sociale ;
- fuite de données ;
- faux partage de document ;
- usurpation d'identité ;
- compromission de compte ;
- exposition de données cloud ;
- pièces jointes malveillantes ;
- faux portails d'authentification ;
- usage risqué de l'IA générative.

---

## ⚙️ Architecture

```text
Utilisateur
    │
    ▼
Profil professionnel
    │
    ▼
HTML / CSS / JavaScript
    │
    │ POST /api/generate-scenario
    ▼
Node.js + Express
    │
    ▼
OpenAI API
    │
    ▼
Structured Output / JSON
    │
    ▼
5 situations cyber personnalisées
    │
    ▼
QCM interactif
    │
    ▼
Scoring + analyse de risque
    │
    ▼
Rapport final
    │
    ▼
Export PDF
```

---

## 🛠️ Stack technique

### Frontend

- HTML5
- CSS3
- JavaScript

### Backend

- Node.js
- Express

### Intelligence artificielle

- OpenAI API
- Responses API
- Structured Outputs
- JSON Schema
---

---

## ⚠️ Limites

PirateRisks Management Lab est un outil pédagogique expérimental.

Les scénarios étant générés par une intelligence artificielle, leur pertinence et leur exactitude peuvent varier.

L'outil ne remplace pas :

- une analyse de risque formelle ;
- un audit de cybersécurité ;
- une politique de sécurité ;
- une formation professionnelle certifiée ;
- l'avis d'un professionnel de la cybersécurité.

---


---

## 👤 Auteur

Projet personnel autour de la **cybersécurité, de la sensibilisation, de l'analyse de risque, de l'automatisation et de l'intelligence artificielle générative** par pvulk. 

---

🏴‍☠️ **PirateRisks Management Lab — Understand the risk. Make the decision.**

