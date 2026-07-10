# DualNetworking (DualNet)

Eine Social-Media-Plattform als Hochschulprojekt (TINF24B4, DHBW Karlsruhe).

**Features:** Registrierung & Login · Posts erstellen · Feed anzeigen · Profil & Follower · Likes & Kommentare · Antworten auf Kommentare · Profilbild & Bio · Für-dich / Gefolgte / Eigene Beiträge Feed-Tabs

---

## Schnellstart (Ein Befehl)

```bash
./start.sh
```

Das Script startet automatisch:
1. Spring Boot Backend (Port 8080)
2. React Frontend (Port 5173)
3. Öffnet den Browser auf http://localhost:5173

> **Voraussetzung:** MongoDB läuft lokal auf Port 27017 (z.B. via MongoDB Compass gestartet), Java 21, Maven, Node.js 20+

---

## Manueller Start (Schritt für Schritt)

### 1. MongoDB starten
MongoDB lokal starten (z.B. über MongoDB Compass oder als lokalen Service).
Sicherstellen dass MongoDB auf `localhost:27017` erreichbar ist.

### 2. Backend starten
```bash
cd backend
mvn spring-boot:run
```
Backend läuft auf: **http://localhost:8080**

### 3. Frontend starten
```bash
cd frontend
npm install    # nur beim ersten Mal nötig
npm run dev
```
Frontend läuft auf: **http://localhost:5173**

### Alles stoppen
```bash
# Backend + Frontend: Strg+C in den jeweiligen Terminals
# MongoDB: läuft als lokaler Service weiter
```

---

## Tech Stack

| Schicht | Technologie | Version |
|---------|-------------|---------|
| Frontend | React + TypeScript | React 18, TS 5 |
| Build | Vite | 5 |
| Backend | Java + Spring Boot | Java 21, Spring 3.3 |
| Datenbank | MongoDB | 7 |
| DB-Tool | MongoDB Compass | – |
| CI/CD | GitHub Actions | – |

---

## Projektstruktur

```
DualNetworking/
├── start.sh                 ← Alles auf einmal starten
├── docker-compose.yml       ← (veraltet, nicht mehr in Verwendung)
│
├── docs/                    ← Alle Dokumente
│   ├── SoftwareRequirementsSpecification.md
│   ├── progress/            ← Wöchentliche Fortschrittsberichte (12 Wochen)
│   ├── adr/                 ← Architecture Decision Records (4 Stück)
│   ├── uml/                 ← UML-Diagramme (draw.io + PNG)
│   └── arc42/               ← arc42 Architekturdokumentation
│
├── frontend/                ← React + TypeScript
│   └── src/
│       ├── pages/           ← Login, Register, Feed, Profile, CreatePost
│       ├── components/      ← Navbar, PostCard, CommentSection, FollowButton
│       ├── api/             ← HTTP-Aufrufe (auth, posts, users, comments, replies)
│       ├── context/         ← AuthContext (JWT-Zustand)
│       └── types/           ← TypeScript-Typdefinitionen
│
├── backend/                 ← Java 21 + Spring Boot 3
│   └── src/main/java/com/dualnet/
│       ├── controller/      ← HTTP-Endpunkte (Auth, Post, User, Comment, Reply)
│       ├── service/         ← Geschäftslogik
│       ├── repository/      ← MongoDB-Abfragen (Spring Data)
│       ├── model/           ← Datenmodelle (User, Post, Comment, Reply)
│       ├── security/        ← JWT (JwtUtil, JwtFilter)
│       ├── config/          ← Spring Security, CORS
│       └── dto/             ← Request/Response-Objekte
│
└── .github/workflows/       ← CI/CD Pipelines
    ├── frontend-ci.yml      ← npm build bei jedem Push
    └── backend-ci.yml       ← mvn package bei jedem Push
```

---

## API Übersicht

### Authentifizierung
| Method | Endpunkt | Beschreibung |
|--------|----------|--------------|
| POST | `/api/auth/register` | Neuen Nutzer registrieren |
| POST | `/api/auth/login` | Einloggen → JWT zurück |

### Posts
| Method | Endpunkt | Auth | Beschreibung |
|--------|----------|------|--------------|
| GET | `/api/posts` | – | Feed laden (alle Posts) |
| GET | `/api/posts/following` | JWT | Feed der gefolgten Nutzer |
| POST | `/api/posts` | JWT | Post erstellen |
| DELETE | `/api/posts/{id}` | JWT | Eigenen Post löschen |
| POST | `/api/posts/{id}/like` | JWT | Post liken |
| DELETE | `/api/posts/{id}/like` | JWT | Like entfernen |

### Kommentare & Antworten
| Method | Endpunkt | Auth | Beschreibung |
|--------|----------|------|--------------|
| GET | `/api/posts/{postId}/comments` | – | Kommentare eines Posts laden |
| POST | `/api/posts/{postId}/comments` | JWT | Kommentar schreiben |
| DELETE | `/api/comments/{id}` | JWT | Eigenen Kommentar löschen |
| GET | `/api/comments/{id}/replies` | – | Antworten auf Kommentar laden |
| POST | `/api/comments/{id}/replies` | JWT | Auf Kommentar antworten |
| DELETE | `/api/comments/replies/{id}` | JWT | Eigene Antwort löschen |

### Nutzer
| Method | Endpunkt | Auth | Beschreibung |
|--------|----------|------|--------------|
| GET | `/api/users/{username}` | – | Profil anzeigen |
| GET | `/api/users/{username}/posts` | – | Posts eines Nutzers |
| PUT | `/api/users/me` | JWT | Eigenes Profil aktualisieren (Bio, Profilbild) |
| POST | `/api/users/{username}/follow` | JWT | Folgen |
| DELETE | `/api/users/{username}/follow` | JWT | Entfolgen |

---

## Dokumentations-Index

### Anforderungen & Architektur

| Dokument | Pfad |
|----------|------|
| Software Requirements Specification (SRS) | [docs/SoftwareRequirementsSpecification.md](docs/SoftwareRequirementsSpecification.md) |
| arc42 Architekturdokumentation | [docs/arc42/arc42-architecture.md](docs/arc42/arc42-architecture.md) |
| Architecture Decision Records (4 Stück) | [docs/adr/](docs/adr/) |
| UML Diagramme (draw.io + PNG) | [docs/uml/](docs/uml/) |

### Qualität & Tests

| Dokument | Pfad |
|----------|------|
| Testbericht (Testplan, Testfälle, Status) | [docs/Tests/Testplan.md](docs/Tests/Testplan.md) |
| Refactoring-Zusammenfassung (Clean Code) | [docs/Refactoring-Zusammenfassung.md](docs/Refactoring-Zusammenfassung.md) |
| Review-Protokoll | [docs/progress/Woche-17-Review.md](docs/progress/Woche-17-Review.md) |
| Software-Metriken (CC, Kommentaranteil, SMI) | [docs/progress/Woche-17-Metriken.md](docs/progress/Woche-17-Metriken.md) |

### Projektmanagement

| Dokument | Pfad |
|----------|------|
| Wöchentliche Fortschrittsberichte (Woche 1–17) | [docs/progress/](docs/progress/) |
| RMMM-Liste (Risikomanagement) | [Risikomanagement/Risikomanagement.xlsx](Risikomanagement/Risikomanagement.xlsx) |
| Projekt-Retrospektive (Screenshot) | [docs/Retroperspektive/RetroDiscussion.png](docs/Retroperspektive/RetroDiscussion.png) |

### Abschlusspräsentation

| Dokument | Pfad |
|----------|------|
| Präsentations-Handout | [docs/Abschlusspräsentation/Handout.md](docs/Abschlusspr%C3%A4sentation/Handout.md) |
| Präsentationsfolien (PPTX) | [docs/Abschlusspräsentation/DualNet-Abschlusspraesentation-v2.pptx](docs/Abschlusspr%C3%A4sentation/DualNet-Abschlusspraesentation-v2.pptx) |
| Demo-Screenshots | [docs/screenshots/](docs/screenshots/) |

### Externe Links

| Ressource | Link |
|-----------|------|
| GitHub Repository | https://github.com/DualNetworking/DualNetworking |
| Scrum-Board | TODO: https://github.com/MaximusMitSchuss/DualNet/discussions |

---

## Voraussetzungen

| Tool | Version | Download |
|------|---------|----------|
| MongoDB (lokal) | 7+ | https://www.mongodb.com/try/download/community |
| MongoDB Compass | Aktuell | https://www.mongodb.com/try/download/compass |
| Java JDK | 21+ | https://adoptium.net/ |
| Apache Maven | 3.9+ | https://maven.apache.org/download.cgi |
| Node.js | 20+ | https://nodejs.org/ |

---

## Häufige Fehler

| Fehler | Ursache | Lösung |
|--------|---------|--------|
| `Connection refused (27017)` | MongoDB läuft nicht | MongoDB Compass starten oder `mongod` lokal starten |
| `Port 8080 already in use` | Anderer Prozess belegt Port | `lsof -i :8080` dann `kill <PID>` |
| `Port 5173 already in use` | Anderer Prozess belegt Port | `lsof -i :5173` dann `kill <PID>` |
| Weiße Seite im Browser | Frontend-Build-Fehler | `cat frontend.log` prüfen |
| `401 Unauthorized` | Token abgelaufen | Erneut einloggen |
| npm install schlägt fehl | Node.js-Version zu alt | Node.js 20+ installieren |
