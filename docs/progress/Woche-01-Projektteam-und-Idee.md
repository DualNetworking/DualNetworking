# Woche 1 – Projektteam und Projektidee finden
**Aufgabenblatt:** AB01 | **Datum:** KW 40, Oktober 2025

---

## Was wurde gemacht?

### Team gebildet
Das Team für DualNetworking wurde zusammengestellt. Jedes Mitglied hat eine Hauptrolle übernommen:

| Name | Hauptrolle |
|------|-----------|
| _(Teammitglied 1)_ | Backend-Entwicklung (Java/Spring Boot) |
| _(Teammitglied 2)_ | Frontend-Entwicklung (React/TypeScript) |
| _(Teammitglied 3)_ | Dokumentation & Scrum Master |
| _(Teammitglied 4)_ | Datenbankdesign & DevOps |

### Projektidee: DualNetworking
Wir haben uns für eine **Social-Media-Plattform** entschieden. Der Name "DualNetworking" spiegelt wider, dass sowohl das digitale Netzwerken als auch die duale Studienstruktur (Theorie + Praxis) gemeint sind.

**Kernfunktionen (geplant):**
- Nutzerregistrierung und Login
- Posts erstellen und Feed anzeigen
- Nutzern folgen / entfolgen
- Posts liken und kommentieren

### Tech Stack Entscheidung
Nach Diskussion haben wir folgende Technologien gewählt:

| Bereich | Technologie | Begründung |
|---------|-------------|------------|
| Frontend | React + TypeScript | Weit verbreitet, Typsicherheit, schnelles Prototyping |
| Backend | Java 21 + Spring Boot 3 | Pflicht (Java), gute MongoDB-Integration |
| Datenbank | MongoDB | Flexibles Schema für Posts/Kommentare |
| Build Frontend | Vite | Schneller als Webpack, einfache Konfiguration |
| Build Backend | Maven | Standard in Java-Projekten |
| CI/CD | GitHub Actions | Kostenlos für GitHub-Repositories |

### Plattform-Setup
- **Projektmanagement:** _(z.B. Jira / YouTrack / Azure)_ → Scrum-Board eingerichtet
- **Repository:** GitHub → `github.com/[team]/DualNetworking`
- **Blog:** _(URL einfügen)_

---

## Entscheidungen

> **Warum Social Media?**
> Social-Media-Plattformen decken alle wichtigen Software-Engineering-Konzepte ab: Authentifizierung, CRUD-Operationen, Beziehungen zwischen Entitäten, REST-APIs. Das Thema ist außerdem motivierend weil alle Mitglieder solche Plattformen täglich nutzen.

> **Warum MongoDB statt PostgreSQL?**
> Posts und Kommentare sind dokumentartige Daten. MongoDB erlaubt flexibles Hinzufügen von Feldern ohne Migrations-Aufwand – ideal für ein agiles Projekt.

---

## Gelernt

- Git-Repository gemeinsam aufgesetzt (Branching-Strategie: `main` + `develop` + Feature-Branches)
- Scrum-Plattform kenngelernt und eingerichtet
- Grundlegende Projektstruktur besprochen

---

## Offene Punkte für nächste Woche
- [ ] Scrum-Board vollständig einrichten
- [ ] Ersten Sprint planen
- [ ] Backlog mit User Stories befüllen
