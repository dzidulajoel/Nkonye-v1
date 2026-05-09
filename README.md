# Nkonye-v1 -- Plateforme digitale des prénoms africains

## 1. Résumé / Description du projet

Nkonye est une application mobile et web dédiée à la valorisation, la
conservation et la diffusion des prénoms africains.
Elle permet aux utilisateurs de découvrir des prénoms issus de
différentes cultures africaines, d'en comprendre la signification et
l'origine, et de les partager à travers une expérience interactive et
moderne.

## 2. Problématique (problèmes identifiés)

- Manque de centralisation des prénoms africains
- Perte progressive de certaines identités culturelles et
    linguistiques
- Difficulté d'accès à des informations fiables
- Faible valorisation numérique des cultures africaines
- Absence de plateforme interactive dédiée

## 3. Objectifs du projet

- Centraliser une base de données riche
- Faciliter la recherche et la compréhension
- Promouvoir la culture africaine
- Offrir une expérience interactive
- Encourager le partage culturel

## 4. Utilité et impact du projet

- Aider au choix de prénoms significatifs
- Renforcer l'identité culturelle
- Créer une communauté
- Moderniser la transmission culturelle
- Valoriser la diversité africaine

## 5. Public cible

- Jeunes parents
- Diaspora africaine
- Passionnés de culture
- Étudiants et chercheurs
- Utilisateurs sociaux

## 6. Fonctionnalités clés (MVP)

- Recherche de prénoms
- Fiches détaillées
- Générateur aléatoire
- Système de favoris
- Authentification
- Partage simple
- Galerie utilisateur

## 7. Fonctionnalités avancées

- Génération d'images via IA
- Mini réseau social
- Profils utilisateurs enrichis
- Contenus culturels enrichis
- Recommandations intelligentes

## 8. Parcours utilisateur

1. Inscription / connexion
2. Accueil et suggestions
3. Recherche ou exploration
4. Consultation d'un prénom
5. Favori ou partage
6. Interaction sociale
7. Profil utilisateur

## 9. Technologies envisagées

- Frontend + Backend : Next.js (App Router)
- PWA : Service Worker + Manifest
- API : Routes API Next.js (/app/api)
- BDD : PostgreSQL + Prisma
- Auth : NextAuth ou JWT


# Nkonye v1 : Backend

Backend API construit avec  Next.js, MongoDB et JWT authentication.

## Features

- Utilisateur signup
- Utilisateur login
- Password hashing with bcrypt
- MongoDB Atlas connection

## Tech Stack

#### backend 
- Next.js
- TypeScript
- MongoDB
- Mongoose
- bcryptjs


## Installation

```bash
npm install
```

## lancer le projet :

```bash
npm run dev
```


## routes de l'api
 #### Authentification : 
- login : /api/login
- signup : /api/signup






## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```


