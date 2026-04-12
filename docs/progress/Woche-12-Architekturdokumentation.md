# Woche 12 – Architekturdokumentation (arc42)
**Aufgabenblatt:** AB12 | **Datum:** KW 15, April 2026 | **Blog-Deadline:** 14.04.2026 20:00 Uhr

---

## Was wurde gemacht?

### arc42-Dokumentation vervollständigt

Die vollständige arc42-Dokumentation ist hier zu finden:
→ [../arc42/arc42-architecture.md](../arc42/arc42-architecture.md)

Laut AB12 wurden Kapitel 1-10 bearbeitet. Kapitel 11 und 12 werden in späteren Aufgaben ergänzt.

### Kapitel-Übersicht

| Kapitel | Inhalt | Status |
|---------|--------|--------|
| 1 Einführung und Ziele | Projektvision, Qualitätsziele, Stakeholder | ✅ |
| 2 Randbedingungen | Technische + organisatorische Einschränkungen | ✅ |
| 3 Systemabgrenzung | Kontext-Diagramm (Frontend/Backend/DB) | ✅ |
| 4 Lösungsstrategie | 3-Schicht, JWT, SRP | ✅ |
| 5 Bausteinsicht | Komponenten-Übersicht Frontend + Backend | ✅ |
| 6 Laufzeitsicht | Login-Sequenz, Post-erstellen-Sequenz | ✅ |
| 7 Verteilungssicht | Lokale Entwicklung + CI/CD | ✅ |
| 8 Querschnittliche Konzepte | JWT-Flow, CORS, Fehlerbehandlung | ✅ |
| 9 Architekturentscheidungen | Links zu allen 4 ADRs | ✅ |
| 10 Qualitätsanforderungen | Qualitätsbaum + 6 Szenarien | ✅ |
| 11 Risiken | _(folgt später)_ | 🔄 |
| 12 Glossar | _(folgt später)_ | 🔄 |

### Neue UML-Modelle

Für arc42 Kapitel 5 und 6 wurden folgende Diagramme verwendet:

- **Kapitel 5 (Bausteinsicht):** Klassendiagramm → [../uml/class-diagram.drawio](../uml/class-diagram.drawio)
- **Kapitel 6 (Laufzeitsicht):**
  - Login-Sequenz → [../uml/sequence-login.drawio](../uml/sequence-login.drawio)
  - Post-erstellen-Sequenz → [../uml/sequence-create-post.drawio](../uml/sequence-create-post.drawio)

### Feedback aus Semester 3 eingearbeitet

| Feedback-Punkt | Maßnahme |
|---------------|---------|
| arc42 Kapitel 1 zu lang | → auf das Wesentliche gekürzt |
| Quality Goals konkreter | → messbare Szenarien (< 2s Ladezeit) hinzugefügt |
| Technical Constraints fehlen | → Kapitel 2.1 mit Java 21, React, MongoDB ergänzt |

---

## Architekturübersicht (zusammengefasst)

```
┌─────────────────────────────────────────────────────┐
│                    DualNetworking                   │
│                                                     │
│  React Frontend (Port 5173)                         │
│  ├── Pages: Login, Register, Feed, Profile, Create  │
│  ├── Components: Navbar, PostCard, Comments, Follow  │
│  ├── API-Layer: auth.ts, posts.ts, users.ts         │
│  └── AuthContext (JWT gespeichert)                  │
│          │ HTTP REST (JSON)                         │
│  Spring Boot Backend (Port 8080)                    │
│  ├── Controller: Auth, Post, User, Comment          │
│  ├── Service: Auth, Post, User, Comment             │
│  ├── Repository: User, Post, Comment (Spring Data)   │
│  └── Security: JwtFilter + SecurityConfig           │
│          │ MongoDB Driver                           │
│  MongoDB (Port 27017)                               │
│  ├── Collection: users                              │
│  ├── Collection: posts                              │
│  └── Collection: comments                           │
└─────────────────────────────────────────────────────┘
```

---

## Gelernt

- arc42 ist ein bewährtes Template – Kapitel 1-4 sollen wirklich kurz bleiben
- Die Laufzeitsicht (Kapitel 6) ist das wichtigste Kapitel für Reviewer
- UML-Diagramme in Git haben den großen Vorteil, dass sie versioniert sind

---

## Gesamtrückblick Projekt

| Kategorie | Ergebnis |
|-----------|---------|
| Implementierte Features | Registrierung, Login, Posts, Feed, Likes, Kommentare, Profile, Follow |
| Implementierte User Stories | 8 von 8 |
| Technische Schulden | Keine Pagination, kein Bild-Upload, keine Passwort-Änderung |
| Dokumentation | SRS, arc42, 4 ADRs, 12 Wochenberichte, 7 UML-Diagramme |
| CI/CD | Frontend + Backend Pipelines laufen auf GitHub Actions |
| Tests | Noch nicht implementiert (für finales Semester geplant) |
