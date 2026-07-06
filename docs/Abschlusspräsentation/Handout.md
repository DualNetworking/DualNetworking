# DualNetworking – Abschluss-Handout

**Kurs:** TINF24B4 · DHBW Karlsruhe · 2025/2026
**Team:** Max · Sebastiano · Ali · Johannes
**Präsentationsdatum:** > ⚠️ TODO: Datum eintragen (z.B. 11.07.2026)

---

## Projektübersicht

**DualNetworking (DualNet)** ist eine vollständig selbst entwickelte Social-Media-Plattform.
Zielgruppe sind Studierende und Hobbyentwickler, die eine einfache, übersichtliche Plattform suchen, um Posts zu veröffentlichen, anderen Nutzern zu folgen und sich über Kommentare auszutauschen.
Das Projekt entstand im Rahmen des Software-Engineering-Kurses an der DHBW Karlsruhe und umfasst ein React/TypeScript-Frontend, ein Java Spring Boot-Backend und eine MongoDB-Datenbank mit vollständiger CI/CD-Pipeline über GitHub Actions.

---

## Projektvision

> *Eine offene, minimalistische Social-Media-Plattform, die zeigt, dass ein vollständiger Technologie-Stack – von der Anforderungsanalyse bis zur automatisierten Pipeline – in einem Semester umgesetzt werden kann.*

---

## Statistiken

> ⚠️ TODO: Stunden aus dem Scrum-Board eintragen.
> Commit-Verteilung ermitteln mit: `git shortlog -sn`

### Stunden je Person

⚠️ TODO: Echte Stunden eintragen

| Person | Frontend | Backend | Doku | Tests | PM | **Gesamt** |
|--------|----------|---------|------|-------|----|-----------|
| Max | – | – | – | – | – | **–** |
| Sebastiano | – | – | – | – | – | **–** |
| Ali | – | – | – | – | – | **–** |
| Johannes | – | – | – | – | – | **–** |
| **Gesamt** | **–** | **–** | **–** | **–** | **–** | **–** |

### Stunden je Projektphase

⚠️ TODO: Echte Stunden eintragen

| Phase | Stunden | Anteil |
|-------|---------|--------|
| Planung & Anforderungen (Wo. 1–5) | – | –% |
| Erste Implementierung (Wo. 6–10) | – | –% |
| Qualitätssicherung (Wo. 11–17) | – | –% |
| Abschluss & Präsentation (Wo. 18–20) | – | –% |
| **Gesamt** | **–** | **100%** |

---

## Demo-Highlights

Die App läuft lokal mit `./start.sh` (Docker + Backend + Frontend in einem Befehl).

| Schritt | Aktion | Ergebnis |
|---------|--------|----------|
| 1 | Registrierung mit E-Mail + Passwort | Account erstellt, Weiterleitung zum Feed |
| 2 | Login | JWT-Token gespeichert, Feed geladen |
| 3 | Post erstellen (Text + optionales Bild) | Post erscheint sofort im globalen Feed |
| 4 | Like-Button klicken | Like-Counter aktualisiert sich in Echtzeit |
| 5 | Kommentar & Antwort schreiben | Nested-Reply erscheint unter dem Kommentar |
| 6 | Nutzer folgen + Following-Feed öffnen | Tab "Gefolgte" zeigt nur Posts des gefolgten Nutzers |

---

## Architektur-Übersicht

```
┌─────────────────────────────────────────────┐
│              DualNetworking                 │
│                                             │
│  ┌────────────────┐   REST API (JSON)        │
│  │   Frontend     │ ◄──────────────────►    │
│  │  React 18 / TS │   ┌─────────────────┐  │
│  │  Vite 5        │   │    Backend      │  │
│  │  Axios         │   │  Spring Boot 3  │  │
│  │  React Router  │   │  Java 21        │  │
│  └────────────────┘   │  JWT Auth       │  │
│                       └────────┬────────┘  │
│                                │           │
│                       ┌────────▼────────┐  │
│                       │    MongoDB 7    │  │
│                       │  (Docker)       │  │
│                       └─────────────────┘  │
└─────────────────────────────────────────────┘
```

**Schichtenarchitektur Backend:** Controller → Service → Repository → MongoDB

---

## Projekt-Highlights

| # | Bereich | Highlight |
|---|---------|-----------|
| 1 | **Architektur** | arc42-Dokumentation (12 Kapitel), 4 Architecture Decision Records (ADRs) |
| 2 | **Tools** | GitHub Actions CI/CD, Docker Compose, Maven PMD, Vitest, JUnit 5 |
| 3 | **Datenbankdesign** | 4 MongoDB Collections (users, posts, comments, replies), dokumentenbasiert ohne ORM |
| 4 | **Tests** | 47 Testfälle in 5 Kategorien (Unit BE, Unit FE, Integration, Smoke, Security) – alle Unit/IT-Tests bestanden |
| 5 | **Metriken** | PMD Cyclomatic Complexity via Maven, 6 Code Smells identifiziert & refaktorisiert |
| 6 | **CI/CD** | Zwei GitHub Actions Workflows (Frontend: Node 20 + Vitest + Vite Build; Backend: Java 21 + Maven + PMD) |
| 7 | **Vision** | Vollständiger SWE-Lifecycle: SRS → UML → Implementierung → Tests → Refactoring → Review → Retrospektive |

---

## Technologie-Übersicht

| Schicht | Technologie | Version |
|---------|-------------|---------|
| Frontend | React + TypeScript | 18.3 / 5.5 |
| Build-Tool | Vite | 5.4 |
| Backend | Java + Spring Boot | 21 / 3.3.4 |
| Auth | JWT (JJWT) | 0.12.6 |
| Datenbank | MongoDB | 7 |
| Infrastruktur | Docker Compose | – |
| CI/CD | GitHub Actions | – |
| FE-Tests | Vitest + React Testing Library | 1.6 / 16.0 |
| BE-Tests | JUnit 5 + Mockito + MockMvc | (Spring Boot Test) |
| Codequalität | Maven PMD Plugin | 3.23.0 |

---

## Links

| Ressource | Link |
|-----------|------|
| GitHub Repository | https://github.com/DualNetworking/DualNetworking |
| Scrum Board | ⚠️ TODO: Link eintragen |
| arc42 Dokumentation | `docs/arc42/arc42-architecture.md` |
| SRS | `docs/SoftwareRequirementsSpecification.md` |
| Testplan | `docs/Tests/Testplan.md` |
| Refactoring-Zusammenfassung | `docs/Refactoring-Zusammenfassung.md` |
