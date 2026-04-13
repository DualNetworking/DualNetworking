# arc42 Architekturdokumentation
## DualNetworking (DualNet)

**Version:** 1.0 | **Datum:** 2026-04-12 | **Team:** TINF24B4

---

## Kapitel 1 – Einführung und Ziele

### 1.1 Anforderungsübersicht

DualNet ist eine Social-Media-Plattform, auf der Nutzer:
- Beiträge (Posts) veröffentlichen können
- Anderen Nutzern folgen können
- Posts liken und kommentieren können

Vollständige Anforderungen: [../SoftwareRequirementsSpecification.md](../SoftwareRequirementsSpecification.md)

### 1.2 Qualitätsziele

| Priorität | Qualitätsmerkmal | Szenario |
|-----------|-----------------|----------|
| 1 | Sicherheit | Passwörter werden gehasht, Zugriff nur mit JWT |
| 2 | Wartbarkeit | Code ist in Schichten aufgeteilt (Controller/Service/Repository) |
| 3 | Benutzbarkeit | Fehlermeldungen sind verständlich, Seite lädt schnell |

### 1.3 Stakeholder

| Rolle | Interesse |
|-------|-----------|
| Studierende (Entwickler) | Bestehen der Prüfung, Lernen des Tech-Stacks |
| Dozent | Korrekte Anwendung von SWE-Konzepten |
| Endnutzer (fiktiv) | Einfache, funktionierende Social-Media-App |

---

## Kapitel 2 – Randbedingungen

### 2.1 Technische Randbedingungen

| Randbedingung | Hintergrund |
|---------------|-------------|
| Java 21 + Spring Boot | Pflicht im Studiengang |
| React + TypeScript | Entscheidung des Teams (ADR-001) |
| MongoDB | Entscheidung des Teams (ADR-003) |
| GitHub Actions | Kostenlose CI/CD für GitHub-Repositories |

### 2.2 Organisatorische Randbedingungen

- Hochschulprojekt mit festen Abgabeterminen
- Team aus 3-5 Studierenden
- Agile Entwicklung mit Scrum (1-Wochen-Sprints)

---

## Kapitel 3 – Systemabgrenzung und Kontext

```
[Browser / Nutzer]
       ↕ HTTP/HTTPS
[React Frontend :5173]
       ↕ REST API (JSON)
[Spring Boot Backend :8080]
       ↕ MongoDB Driver
[MongoDB :27017]
```

**Externe Schnittstellen:** Keine (kein E-Mail-Versand, kein OAuth, keine externen APIs im MVP)

---

## Kapitel 4 – Lösungsstrategie

- **Frontend/Backend-Trennung:** React als SPA, Spring Boot als reine REST-API
- **Stateless Auth:** JWT-Token im Authorization-Header (ADR-004)
- **Einfache Architektur:** Klassische 3-Schicht-Architektur (Controller/Service/Repository)
- **SOLID:** Single Responsibility Principle – jede Klasse hat genau eine Aufgabe

---

## Kapitel 5 – Bausteinsicht

### Ebene 1: Gesamtsystem

```
┌─────────────────────────────────────────────┐
│                  DualNet                    │
│                                             │
│  ┌────────────┐      ┌───────────────────┐  │
│  │  Frontend  │ REST │     Backend       │  │
│  │  (React/TS)│◄────►│  (Spring Boot)    │  │
│  └────────────┘      └────────┬──────────┘  │
│                               │             │
│                      ┌────────▼──────────┐  │
│                      │     MongoDB       │  │
│                      └───────────────────┘  │
└─────────────────────────────────────────────┘
```

### Ebene 2: Frontend-Bausteine

| Baustein | Beschreibung |
|----------|--------------|
| `pages/` | Seiten der App (Login, Feed, Profil, Post erstellen) |
| `components/` | Wiederverwendbare UI-Teile (PostCard, Navbar, ...) |
| `api/` | HTTP-Aufrufe zum Backend |
| `context/AuthContext` | Globaler Login-Zustand |
| `types/` | TypeScript-Typdefinitionen |

### Ebene 2: Backend-Bausteine

| Baustein | Beschreibung |
|----------|--------------|
| `controller/` | Nimmt HTTP-Anfragen entgegen, gibt Antworten zurück |
| `service/` | Geschäftslogik (z.B. Passwort hashen, Post erstellen) |
| `repository/` | Datenbankzugriff via Spring Data MongoDB |
| `model/` | Datenmodelle (User, Post, Comment) |
| `security/` | JWT-Filter und Hilfsfunktionen |
| `config/` | Spring Security und JWT-Konfiguration |

---

## Kapitel 6 – Laufzeitsicht

### Szenario: Login

```
Browser → POST /api/auth/login → AuthController
                                      ↓
                                 AuthService
                                 (prüft BCrypt-Hash)
                                      ↓
                                 JwtUtil.generateToken()
                                      ↓
                              ← AuthResponse (JWT-Token)
```

Sequenzdiagramm: [../uml/sequence-login.png](../uml/sequence-login.png)

### Szenario: Post erstellen

```
Browser → POST /api/posts (+ JWT) → JwtFilter (validiert Token)
                                          ↓
                                    PostController
                                          ↓
                                    PostService.createPost()
                                          ↓
                                    PostRepository.save()
                                          ↓
                                    MongoDB
```

Sequenzdiagramm: [../uml/sequence-create-post.png](../uml/sequence-create-post.png)

---

## Kapitel 7 – Verteilungssicht

### Lokale Entwicklung

```
Entwickler-PC
├── Browser (localhost:5173) → Vite Dev Server → React App
├── Backend (localhost:8080) → Spring Boot JAR
└── MongoDB (localhost:27017) → Docker Container
```

### CI/CD (GitHub Actions)

```
Git Push → GitHub Actions
├── frontend-ci.yml: npm ci + npm run build
└── backend-ci.yml: mvn clean package
```

---

## Kapitel 8 – Querschnittliche Konzepte

### Authentifizierung (JWT)

Jede geschützte Anfrage durchläuft den `JwtFilter`:
1. Header `Authorization: Bearer <token>` lesen
2. Token mit `JwtUtil.isTokenValid()` prüfen
3. User-ID aus Token extrahieren
4. Spring Security Context setzen

### Fehlerbehandlung

- Backend: HTTP-Statuscodes (400 Bad Request, 401 Unauthorized, 404 Not Found)
- Frontend: `try/catch` in API-Calls, Fehlermeldung im UI anzeigen

### CORS

Spring Security erlaubt Anfragen von `http://localhost:5173` (Vite Dev Server).

---

## Kapitel 9 – Architekturentscheidungen

- [ADR-001: React + TypeScript als Frontend](../adr/ADR-001-react-typescript-frontend.md)
- [ADR-002: Spring Boot als Backend](../adr/ADR-002-spring-boot-backend.md)
- [ADR-003: MongoDB als Datenbank](../adr/ADR-003-mongodb-database.md)
- [ADR-004: JWT für Authentifizierung](../adr/ADR-004-jwt-authentication.md)

---

## Kapitel 10 – Qualitätsanforderungen

### Qualitätsbaum

```
Qualität
├── Sicherheit
│   ├── S1: Passwörter gehasht (BCrypt)
│   ├── S2: Endpunkte durch JWT geschützt
│   └── S3: Keine sensiblen Daten im Token
├── Wartbarkeit
│   ├── W1: Klare Schichtenarchitektur
│   └── W2: Code kommentiert
├── Benutzbarkeit
│   ├── B1: Feed lädt unter 2 Sekunden
│   └── B2: Fehlermeldungen verständlich
└── Zuverlässigkeit
    └── Z1: App läuft stabil ohne Abstürze
```

### Qualitätsszenarien

| ID | Szenario | Messgröße |
|----|----------|-----------|
| S1 | Nutzer gibt Passwort ein → wird mit BCrypt gehasht | Hash in DB, Klartext nie gespeichert |
| S2 | Nicht-eingeloggter Nutzer ruft POST /api/posts auf | HTTP 401 zurück |
| W1 | Entwickler fügt neuen Endpunkt hinzu | Nur Controller + Service + Repository betroffen |
| B1 | Nutzer öffnet Feed mit 50 Posts | Ladezeit < 2 Sekunden |

---

## Kapitel 11 – Risiken und technische Schulden

*(Wird in einem späteren Aufgabenblatt ausgefüllt)*

---

## Kapitel 12 – Glossar

*(Wird in einem späteren Aufgabenblatt ausgefüllt)*
