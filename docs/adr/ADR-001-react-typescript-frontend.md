# ADR-001: React + TypeScript als Frontend-Framework

**Status:** Akzeptiert
**Datum:** 2025-10-01

## Kontext

Das Projekt braucht ein Frontend-Framework für die Web-Oberfläche der Social-Media-Plattform.

## Entscheidung

Wir verwenden **React 18** mit **TypeScript** und **Vite** als Build-Tool.

## Begründung

- **React** ist weit verbreitet, gut dokumentiert und einfach zu erlernen
- **TypeScript** gibt uns Typsicherheit und macht Fehler früh sichtbar
- **Vite** ist schnell beim Starten und Bauen, einfacher als Webpack
- Alle Teammitglieder haben grundlegende JavaScript-Kenntnisse

## Alternativen, die wir verworfen haben

- **Vue.js** – ähnlich gut, aber weniger Teammitglieder kennen es
- **Angular** – zu komplex für den Projektumfang
- **Svelte** – zu wenig bekannt im Team

## Konsequenzen

- Frontend-Code ist typsicher und besser wartbar
- Schnelle Entwicklung durch Hot Module Replacement (HMR) mit Vite
- Kein globaler State-Manager nötig – React Context reicht für Auth
