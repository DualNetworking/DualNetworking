# arc42 Architekturdokumentation
## DualNetworking (DualNet)

**Version:** 1.0 | **Datum:** 2026-04-12 | **Team:** TINF24B4

---

## Kapitel 1 – Einführung und Ziele

### 1.1 Anforderungsübersicht

DualNet ist eine Social-Media-Plattform, auf der Nutzer:
- Beiträge (Posts) veröffentlichen und eigene Posts löschen können
- Anderen Nutzern folgen können
- Posts liken und kommentieren können
- Auf Kommentare antworten können
- Ein Profilbild (Base64) hochladen und eine Bio hinterlegen können
- Den Feed nach "Für dich", "Gefolgte" oder "Meine Beiträge" filtern können

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
| `controller/` | Nimmt HTTP-Anfragen entgegen, gibt Antworten zurück (Auth, Post, User, Comment, Reply) |
| `service/` | Geschäftslogik (z.B. Passwort hashen, Post erstellen, Profilbild speichern) |
| `service/mapper/` | Entity → DTO-Konvertierung (PostMapper, UserMapper, CommentMapper) |
| `repository/` | Datenbankzugriff via Spring Data MongoDB |
| `model/` | Datenmodelle (User, Post, Comment, Reply) |
| `dto/` | Request/Response-Objekte (PostResponse, UserProfileResponse, ReplyResponse, …) |
| `security/` | JWT-Filter und Hilfsfunktionen |
| `config/` | Spring Security und CORS-Konfiguration |

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
└── MongoDB (localhost:27017) → Lokal installiert, verwaltet via MongoDB Compass
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

Vollständige Szenarien nach arc42-Format:

| ID | Qualitätsziel | Stimulus | Quelle | Umgebung | Artefakt | Reaktion | Messgröße |
|----|--------------|----------|--------|----------|----------|----------|-----------|
| QS-01 | Sicherheit | Nutzer gibt Passwort ein | Nutzer (Browser) | Normalbetrieb | `AuthService.register()` | Passwort wird mit BCrypt gehasht, Klartext nie gespeichert | Hash in MongoDB, kein Klartext in Logs oder DB |
| QS-02 | Sicherheit | Nicht-authentifizierter HTTP-Request auf geschützten Endpunkt (z.B. POST /api/posts) | Externer Aufrufer ohne JWT | Normalbetrieb | `JwtFilter` + Spring Security | HTTP 401 Unauthorized, kein Datenzugriff | Response-Code = 401 in < 50 ms |
| QS-03 | Sicherheit | HTTP-Request mit abgelaufenem oder manipuliertem JWT-Token | Externer Aufrufer | Normalbetrieb | `JwtUtil.isTokenValid()` + `JwtFilter` | HTTP 401 Unauthorized, Token wird abgelehnt | Response-Code = 401, keine Daten im Response-Body |
| QS-04 | Wartbarkeit | Entwickler fügt neuen REST-Endpunkt hinzu (z.B. Repost-Funktion) | Entwickler | Entwicklungsphase | Backend-Schichtenarchitektur | Nur Controller, Service und Repository für den neuen Endpunkt werden angelegt/geändert – kein anderer Code wird berührt | Anzahl betroffener Dateien außerhalb der neuen Schicht: 0 |
| QS-05 | Performance | Nutzer öffnet Feed (GET /api/posts) mit 50 vorhandenen Posts | Nutzer (Browser) | Normalbetrieb, lokale Entwicklungsumgebung | `PostController` → `PostService` → MongoDB | Alle Posts werden geladen und als JSON zurückgegeben | Antwortzeit < 2 Sekunden end-to-end im Browser |
| QS-06 | Zuverlässigkeit | Normaler Dauerbetrieb der App über mehrere Stunden | Mehrere gleichzeitige Nutzer | Normalbetrieb | Gesamtsystem (Frontend, Backend, MongoDB) | Keine unerwarteten Abstürze, keine Datenverluste | 0 unkontrollierte Prozessabbrüche, keine 5xx-Fehler ohne Ursache |

---

## Kapitel 11 – Risiken und technische Schulden

### 11.1 Identifizierte technische Schulden

| ID | Komponente | Befund | Schwere | Mitigation |
|----|-----------|--------|---------|------------|
| TS-01 | `PostService.toResponseWithAuthor()` | N+1-Problem: Für jeden Post wird einzeln `userRepository.findById()` aufgerufen. Bei großem Feed entstehen viele Einzelabfragen gegen MongoDB. | Mittel | Batch-Abfrage mit `userRepository.findAllById(authorIds)` implementieren; akzeptabel für MVP-Größe |
| TS-02 | `SecurityConfig.corsConfigurationSource()` | `allowedOrigins` enthält nur `localhost:5173`. Bei Deployment auf einem echten Server fehlt die Produktions-URL → CORS-Fehler. | Mittel | Origin als Umgebungsvariable auslagern (z.B. `CORS_ALLOWED_ORIGIN`); bei Deployment adressieren |
| TS-03 | `JwtUtil.getSigningKey()` | `secret.getBytes()` ohne Charset-Angabe – nutzt System-Default. Auf Systemen mit abweichendem Default-Charset könnte der Schlüssel differieren. | Niedrig | Explizit `StandardCharsets.UTF_8` verwenden |
| TS-04 | `PostController.createPost()` | Gibt HTTP 200 zurück statt REST-konformem HTTP 201 (Created). | Niedrig | `ResponseEntity.status(HttpStatus.CREATED).body(...)` verwenden |
| TS-05 | SRS / Datenmodell | Kein Pagination-Mechanismus: Alle Posts werden ungefiltert geladen. Bei wachsender Datenmenge skaliert dies nicht. | Mittel | Cursor-basiertes oder Offset-Pagination für `/api/posts` implementieren (Post-MVP) |

### 11.2 Identifizierte Projektrisiken

| ID | Risiko | Wahrscheinlichkeit | Auswirkung | Gegenmaßnahme |
|----|--------|-------------------|------------|----------------|
| PR-01 | JWT-Secret in `application.properties` im Repository | Mittel | Hoch | Secret über Umgebungsvariable (`JWT_SECRET`) einlesen, nicht hardcoded einchecken |
| PR-02 | MongoDB ohne Backup-Strategie | Niedrig | Hoch | Lokale MongoDB-Instanz; für Produktion: regelmäßige Dumps via `mongodump` empfohlen |
| PR-03 | Eingeschränkte Testabdeckung der Frontend-Komponenten | Mittel | Mittel | Kritische Komponenten (PostCard, LoginPage, CommentSection) mit Vitest abgedeckt; Ausbau geplant |
| PR-04 | MongoDB-Version veraltet auf Entwickler-Maschinen | Niedrig | Niedrig | MongoDB 7+ empfohlen; Version über MongoDB Compass prüfbar |
| PR-05 | Kein Rate-Limiting auf Auth-Endpunkten | Mittel | Mittel | Brute-Force-Schutz durch Spring Security; für Produktion: Rate-Limiter (z.B. Bucket4j) ergänzen |

---

## Kapitel 12 – Glossar

| Begriff | Bedeutung |
|---------|-----------|
| **Nutzer** | Registrierter Benutzer der DualNet-Plattform mit Konto, Profil und eigenem Feed |
| **Post** | Textbeitrag eines Nutzers (max. 500 Zeichen), optional mit Bild-URL; zentrale Dateneinheit |
| **Feed** | Chronologische Übersicht von Posts; in drei Varianten: Alle / Gefolgte / Eigene |
| **Kommentar** | Textantwort eines Nutzers auf einen Post |
| **Reply** | Verschachtelte Antwort auf einen Kommentar (eine Ebene Tiefe) |
| **JWT** | JSON Web Token – kompakter, URL-sicherer Token zur Authentifizierung; enthält Subject (User-ID), Ausstellungszeitpunkt und Ablaufzeit; wird im `Authorization: Bearer`-Header übertragen |
| **BCrypt** | Kryptographische Hashfunktion für Passwörter; mit Salt und Kostenfaktor; verhindert Rainbow-Table-Angriffe; verwendet in `AuthService` via Spring Security `PasswordEncoder` |
| **SPA** | Single Page Application – Web-App die komplett im Browser läuft; Seitenwechsel ohne Server-Reload; das React-Frontend ist eine SPA |
| **REST** | Representational State Transfer – Architekturstil für HTTP-APIs; zustandslos, ressourcenbasiert; das DualNet-Backend implementiert eine RESTful API |
| **CORS** | Cross-Origin Resource Sharing – Browser-Sicherheitsmechanismus; erlaubt oder blockiert HTTP-Anfragen von einer anderen Domain; konfiguriert in `SecurityConfig` |
| **DTO** | Data Transfer Object – einfaches Datenobjekt zum Transport zwischen Schichten; trennt interne Datenmodelle von der API-Schnittstelle (z.B. `PostResponse`, `UserProfileResponse`) |
| **Controller** | Spring-Komponente (`@RestController`), die HTTP-Anfragen entgegennimmt und delegiert; enthält keine Geschäftslogik |
| **Service** | Spring-Komponente (`@Service`), die Geschäftslogik enthält; orchestriert Repository-Aufrufe und Mapper |
| **Repository** | Spring-Komponente (`@Repository` / `MongoRepository`), die Datenbankzugriffe kapselt; direkte Schnittstelle zu MongoDB |
| **Mapper** | Hilfsklasse zur Konvertierung zwischen Entity und DTO (z.B. `PostMapper`, `UserMapper`) |
| **MongoDB Collection** | Äquivalent zu einer relationalen Datenbanktabelle in MongoDB; DualNet nutzt: `users`, `posts`, `comments`, `replies` |
| **MongoDB Compass** | Grafisches Verwaltungswerkzeug für MongoDB; wird im Projekt zur lokalen Datenbankadministration verwendet (Collections anzeigen, Queries testen, Verbindung prüfen) |
| **GitHub Actions** | CI/CD-Plattform von GitHub; führt bei jedem Push automatisch Build- und Test-Workflows aus |
| **Vite** | Moderner Frontend-Build-Server und Bundler; ersetzt Webpack; unterstützt Hot Module Replacement für schnelle Entwicklung |
| **Vitest** | Test-Framework für Vite-Projekte; API-kompatibel mit Jest; wird für Frontend-Unit-Tests verwendet |
| **MockMvc** | Spring-Test-Werkzeug zum Testen von REST-Controllern ohne echten HTTP-Server |
| **PMD** | Statisches Code-Analyse-Werkzeug; misst u.a. zyklomatische Komplexität; in Maven-Build integriert |
| **ADR** | Architecture Decision Record – kurzes Dokument, das eine wichtige Architekturentscheidung mit Kontext und Begründung festhält |
| **arc42** | Standardisiertes Template zur Dokumentation von Software-Architekturen; strukturiert in 12 Kapitel |
| **RMMM** | Risk Mitigation, Monitoring and Management – strukturierte Risikoverwaltung mit Eintrittswahrscheinlichkeit, Auswirkung und Gegenmaßnahmen |
