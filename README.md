# DualNetworking (DualNet)

Eine Social-Media-Plattform als Hochschulprojekt (TINF24B4, DHBW Karlsruhe).

**Features:** Registrierung & Login · Posts erstellen · Feed anzeigen · Profil & Follower · Likes & Kommentare

---

## Schnellstart (Ein Befehl)

```bash
./start.sh
```

Das Script startet automatisch:
1. MongoDB (via Docker)
2. Spring Boot Backend (Port 8080)
3. React Frontend (Port 5173)
4. Öffnet den Browser auf http://localhost:5173

> **Voraussetzungen:** Docker, Java 21, Maven, Node.js 20+

---

## Manueller Start (Schritt für Schritt)

### 1. MongoDB starten
```bash
docker-compose up -d
```

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

# MongoDB stoppen:
docker-compose stop
```

---

## Tech Stack

| Schicht | Technologie | Version |
|---------|-------------|---------|
| Frontend | React + TypeScript | React 18, TS 5 |
| Build | Vite | 5 |
| Backend | Java + Spring Boot | Java 21, Spring 3.3 |
| Datenbank | MongoDB | 7 |
| CI/CD | GitHub Actions | – |

---

## Projektstruktur

```
DualNetworking/
├── start.sh                 ← Alles auf einmal starten
├── docker-compose.yml       ← MongoDB starten
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
│       ├── api/             ← HTTP-Aufrufe (auth, posts, users, comments)
│       ├── context/         ← AuthContext (JWT-Zustand)
│       └── types/           ← TypeScript-Typdefinitionen
│
├── backend/                 ← Java 21 + Spring Boot 3
│   └── src/main/java/com/dualnet/
│       ├── controller/      ← HTTP-Endpunkte (Auth, Post, User, Comment)
│       ├── service/         ← Geschäftslogik
│       ├── repository/      ← MongoDB-Abfragen (Spring Data)
│       ├── model/           ← Datenmodelle (User, Post, Comment)
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
| POST | `/api/posts` | JWT | Post erstellen |
| POST | `/api/posts/{id}/like` | JWT | Post liken |
| DELETE | `/api/posts/{id}/like` | JWT | Like entfernen |
| GET | `/api/posts/{id}/comments` | – | Kommentare laden |
| POST | `/api/posts/{id}/comments` | JWT | Kommentar schreiben |

### Nutzer
| Method | Endpunkt | Auth | Beschreibung |
|--------|----------|------|--------------|
| GET | `/api/users/{username}` | – | Profil anzeigen |
| GET | `/api/users/{username}/posts` | – | Posts eines Nutzers |
| POST | `/api/users/{username}/follow` | JWT | Folgen |
| DELETE | `/api/users/{username}/follow` | JWT | Entfolgen |

---

## Dokumentation

| Dokument | Pfad |
|----------|------|
| Software Requirements Specification (SRS) | [docs/SoftwareRequirementsSpecification.md](docs/SoftwareRequirementsSpecification.md) |
| arc42 Architekturdokumentation | [docs/arc42/arc42-architecture.md](docs/arc42/arc42-architecture.md) |
| Architecture Decision Records | [docs/adr/](docs/adr/) |
| UML Diagramme | [docs/uml/](docs/uml/) |
| Wöchentliche Fortschrittsberichte | [docs/progress/](docs/progress/) |

---

## Voraussetzungen

| Tool | Version | Download |
|------|---------|----------|
| Docker Desktop | Aktuell | https://www.docker.com/products/docker-desktop |
| Java JDK | 21+ | https://adoptium.net/ |
| Apache Maven | 3.9+ | https://maven.apache.org/download.cgi |
| Node.js | 20+ | https://nodejs.org/ |

---

## Häufige Fehler

| Fehler | Ursache | Lösung |
|--------|---------|--------|
| `Connection refused (27017)` | MongoDB läuft nicht | `docker-compose up -d` |
| `Port 8080 already in use` | Anderer Prozess belegt Port | `lsof -i :8080` dann `kill <PID>` |
| `Port 5173 already in use` | Anderer Prozess belegt Port | `lsof -i :5173` dann `kill <PID>` |
| Weiße Seite im Browser | Frontend-Build-Fehler | `cat frontend.log` prüfen |
| `401 Unauthorized` | Token abgelaufen | Erneut einloggen |
| npm install schlägt fehl | Node.js-Version zu alt | Node.js 20+ installieren |
