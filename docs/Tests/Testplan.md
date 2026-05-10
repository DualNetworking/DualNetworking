# Testplan – DualNetworking

**Projekt:** DualNetworking | **Team:** TINF24B4 | **Datum:** Mai 2026
**Aufgabenblatt:** AB15 | **Version:** 1.0

---

## 1. Übersicht

DualNetworking ist eine Social-Media-Webanwendung bestehend aus einem React/TypeScript-Frontend und einem Java Spring Boot-Backend mit MongoDB. Dieser Testplan beschreibt die Teststrategie, Testarten, Werkzeuge, Abdeckungsziele und die Verwaltung der Testfälle.

---

## 2. Testarten

### 2.1 Unit Tests – Backend

**Ziel:** Isolierte Überprüfung der Service-Logik ohne Datenbankzugriff.
**Framework:** JUnit 5 + Mockito (bereits in `pom.xml` vorhanden via `spring-boot-starter-test`)
**Zu testende Klassen:** `AuthService`, `PostService`, `CommentService`, `UserService`, `JwtUtil`

**Beispiel-Testfälle:**

| Test-ID | Klasse | Beschreibung | Vorbedingung | Erwartetes Ergebnis |
|---------|--------|-------------|--------------|---------------------|
| UT-BE-01 | AuthService | Registrierung mit bereits vorhandenem Username | User existiert in DB (gemockt) | Exception wird geworfen |
| UT-BE-02 | AuthService | Login mit falschem Passwort | User existiert, Passwort falsch | `BadCredentialsException` |
| UT-BE-03 | AuthService | Login mit korrekten Daten | User existiert, Passwort korrekt | JWT-Token wird zurückgegeben |
| UT-BE-04 | JwtUtil | Token-Generierung | Gültiger Username | Token enthält korrekten Subject |
| UT-BE-05 | JwtUtil | Token-Validierung mit abgelaufenem Token | Abgelaufener Token | `false` wird zurückgegeben |
| UT-BE-06 | PostService | Post erstellen | Gültiger User + Content | Post wird in DB gespeichert |
| UT-BE-07 | PostService | Feed laden | Posts existieren | Liste aller Posts wird zurückgegeben |
| UT-BE-08 | PostService | Like hinzufügen | Post + User existieren | Like-Count erhöht sich um 1 |
| UT-BE-09 | CommentService | Kommentar erstellen | Post + User existieren | Kommentar wird gespeichert |
| UT-BE-10 | CommentService | Kommentare eines Posts laden | Post mit Kommentaren | Liste der Kommentare wird zurückgegeben |
| UT-BE-11 | UserService | Profil laden | User existiert | `UserProfileResponse` wird zurückgegeben |
| UT-BE-12 | UserService | Follow-Funktion | Zwei User existieren | Follower-Liste aktualisiert |
| UT-BE-13 | UserService | Unfollow-Funktion | User folgt bereits | Follower-Liste bereinigt |

---

### 2.2 Unit Tests – Frontend

**Ziel:** Überprüfung der React-Komponenten auf korrektes Rendering und Benutzerinteraktion.
**Framework:** Vitest + React Testing Library (neu einzurichten, kompatibel mit Vite)
**Setup:** `npm install --save-dev vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom`

**Zu testende Komponenten:** `PostCard`, `CommentSection`, `Navbar`, `FollowButton`, `LoginPage`

| Test-ID | Komponente | Beschreibung | Vorbedingung | Erwartetes Ergebnis |
|---------|-----------|-------------|--------------|---------------------|
| UT-FE-01 | LoginPage | Login-Formular rendert korrekt | – | Username- und Passwort-Felder sichtbar |
| UT-FE-02 | LoginPage | Submit mit leerem Formular | – | Kein API-Call ausgelöst |
| UT-FE-03 | PostCard | Rendert Post-Inhalt | Post-Objekt als Prop | Content, Username, Datum sichtbar |
| UT-FE-04 | PostCard | Like-Button-Klick | Gemockter API-Call | Like-Counter erhöht sich |
| UT-FE-05 | CommentSection | Kommentare werden angezeigt | Kommentar-Array als Prop | Alle Kommentare sichtbar |
| UT-FE-06 | FollowButton | Zeigt korrekten Status | `isFollowing: true` | Button zeigt "Unfollow" |
| UT-FE-07 | Navbar | Zeigt Logout bei eingeloggtem User | AuthContext mit User | Logout-Button sichtbar |

---

### 2.3 API / Integrationstests – Backend

**Ziel:** Überprüfung der REST-Endpoints mit simulierten HTTP-Anfragen.
**Framework:** Spring Boot Test mit `MockMvc` und `@SpringBootTest`
**Besonderheit:** MongoDB wird mit einer In-Memory-Datenbank (`de.flapdoodle.embed.mongo`) gemockt.

| Test-ID | Endpoint | HTTP-Methode | Beschreibung | Erwartetes Ergebnis |
|---------|----------|-------------|-------------|---------------------|
| IT-01 | `/api/auth/register` | POST | Registrierung mit validen Daten | HTTP 200, JWT im Response |
| IT-02 | `/api/auth/register` | POST | Registrierung mit doppeltem Username | HTTP 400/409 |
| IT-03 | `/api/auth/login` | POST | Login mit korrekten Daten | HTTP 200, JWT-Token |
| IT-04 | `/api/auth/login` | POST | Login mit falschem Passwort | HTTP 401 |
| IT-05 | `/api/posts` | GET | Feed laden ohne Token | HTTP 403 |
| IT-06 | `/api/posts` | GET | Feed laden mit gültigem Token | HTTP 200, Liste |
| IT-07 | `/api/posts` | POST | Post erstellen mit Token | HTTP 200/201, Post im Response |
| IT-08 | `/api/posts/{id}/like` | POST | Like hinzufügen | HTTP 200, Like-Count erhöht |
| IT-09 | `/api/comments/{postId}` | POST | Kommentar erstellen | HTTP 200, Kommentar im Response |
| IT-10 | `/api/users/{username}` | GET | Profil laden | HTTP 200, `UserProfileResponse` |
| IT-11 | `/api/users/{username}/follow` | POST | Follow-Aktion | HTTP 200 |

---

### 2.4 Smoke Tests (Manuell)

**Ziel:** Schnelle Überprüfung der Kernfunktionen nach jedem Deployment.
**Ausführung:** Manuell im Browser nach `./start.sh`

| Test-ID | Beschreibung | Erwartetes Ergebnis |
|---------|-------------|---------------------|
| SM-01 | App startet (http://localhost:5173) | Login-Seite lädt |
| SM-02 | Registrierung mit neuem User | Weiterleitung zum Feed |
| SM-03 | Login mit bestehendem User | Feed wird angezeigt |
| SM-04 | Post erstellen | Post erscheint im Feed |
| SM-05 | Kommentar schreiben | Kommentar erscheint |
| SM-06 | Like-Button klicken | Like-Count ändert sich |
| SM-07 | Profil eines anderen Users aufrufen | Profil wird geladen |
| SM-08 | Follow-Button klicken | Status wechselt zu "Unfollow" |
| SM-09 | Logout | Weiterleitung zur Login-Seite |
| SM-10 | Direktaufruf geschützter Route ohne Login | Weiterleitung zur Login-Seite |

---

### 2.5 Sicherheitstests

**Ziel:** Überprüfung der JWT-Authentifizierung und Zugriffsschutz.

| Test-ID | Beschreibung | Erwartetes Ergebnis |
|---------|-------------|---------------------|
| SEC-01 | API-Aufruf ohne JWT-Token | HTTP 403 Forbidden |
| SEC-02 | API-Aufruf mit abgelaufenem Token | HTTP 401 Unauthorized |
| SEC-03 | API-Aufruf mit manipuliertem Token | HTTP 401 Unauthorized |
| SEC-04 | Registrierung mit zu kurzem Passwort | HTTP 400 Bad Request |
| SEC-05 | SQL/NoSQL-Injection im Username-Feld | Kein Datenbankfehler, Eingabe wird escaped |

---

## 3. Testabdeckung (Ziele)

| Bereich | Ziel | Priorisierung |
|---------|------|--------------|
| Backend Services (Unit) | ≥ 70% Line Coverage | Hoch |
| Backend Controller (Integration) | ≥ 60% Endpoint-Abdeckung | Hoch |
| Frontend Komponenten (Unit) | Kritische Komponenten (PostCard, LoginPage, CommentSection) | Mittel |
| Smoke Tests | 100% Kernfunktionen | Hoch |
| Sicherheitstests | Alle Auth-Endpoints | Hoch |

---

## 4. Testwerkzeuge

| Werkzeug | Einsatzbereich | Status |
|---------|---------------|--------|
| JUnit 5 | Backend Unit Tests | Verfügbar (in pom.xml) |
| Mockito | Backend Mocking | Verfügbar (in pom.xml) |
| Spring Boot Test / MockMvc | API Integrationstests | Verfügbar (in pom.xml) |
| Flapdoodle Embed Mongo | MongoDB In-Memory für Tests | Einzurichten |
| Vitest | Frontend Unit Tests | Einzurichten |
| React Testing Library | Frontend Komponenten-Tests | Einzurichten |
| GitHub Actions | CI – automatische Testausführung | Vorhanden |

---

## 5. Testverwaltung & Rückverfolgbarkeit

### 5.1 Testfall-Tabelle (Statusverwaltung)

Alle Testfälle werden in dieser Datei mit Status gepflegt:

| Status | Bedeutung |
|--------|-----------|
| Geplant | Testfall definiert, noch nicht implementiert |
| In Arbeit | Testfall wird gerade implementiert |
| Bestanden | Test läuft und schlägt nicht fehl |
| Fehlgeschlagen | Test schlägt fehl – Bug offen |
| Übersprungen | Bewusst deaktiviert (mit Begründung) |

### 5.2 Aktueller Teststatus

| Test-ID | Status | Implementiert in |
|---------|--------|-----------------|
| UT-BE-01 | Bestanden | `service/AuthServiceTest.java` |
| UT-BE-02 | Bestanden | `service/AuthServiceTest.java` |
| UT-BE-03 | Bestanden | `service/AuthServiceTest.java` |
| UT-BE-04 | Bestanden | `security/JwtUtilTest.java` |
| UT-BE-05 | Bestanden | `security/JwtUtilTest.java` |
| UT-BE-06 | Bestanden | `service/PostServiceTest.java` |
| UT-BE-07 | Bestanden | `service/PostServiceTest.java` |
| UT-BE-08 | Bestanden | `service/PostServiceTest.java` |
| UT-BE-09 | Bestanden | `service/CommentServiceTest.java` |
| UT-BE-10 | Bestanden | `service/CommentServiceTest.java` |
| UT-BE-11 | Bestanden | `service/UserServiceTest.java` |
| UT-BE-12 | Bestanden | `service/UserServiceTest.java` |
| UT-BE-13 | Bestanden | `service/UserServiceTest.java` |
| UT-FE-01 | Bestanden | `pages/LoginPage.test.tsx` |
| UT-FE-02 | Bestanden | `pages/LoginPage.test.tsx` |
| UT-FE-03 | Bestanden | `components/PostCard.test.tsx` |
| UT-FE-04 | Bestanden | `components/PostCard.test.tsx` |
| UT-FE-05 | Bestanden | `components/CommentSection.test.tsx` |
| UT-FE-06 | Bestanden | `components/FollowButton.test.tsx` |
| UT-FE-07 | Bestanden | `components/Navbar.test.tsx` |
| IT-01 | Bestanden | `controller/AuthControllerTest.java` |
| IT-02 | Bestanden | `controller/AuthControllerTest.java` |
| IT-03 | Bestanden | `controller/AuthControllerTest.java` |
| IT-04 | Bestanden | `controller/AuthControllerTest.java` |
| IT-05 | Bestanden | `controller/PostControllerTest.java` |
| IT-06 | Bestanden | `controller/PostControllerTest.java` |
| IT-07 | Bestanden | `controller/PostControllerTest.java` |
| IT-08 | Bestanden | `controller/PostControllerTest.java` |
| IT-09 bis IT-11 | Geplant | – |
| SM-01 bis SM-10 | Geplant | – |
| SEC-01 bis SEC-05 | Geplant | – |

### 5.3 Rückverfolgbarkeit zu User Stories

| User Story (aus SRS) | Relevante Tests |
|---------------------|----------------|
| US-01: Registrierung | UT-BE-01, IT-01, IT-02, SM-02 |
| US-02: Login | UT-BE-02, UT-BE-03, IT-03, IT-04, SM-03, SEC-01–03 |
| US-03: Post erstellen | UT-BE-06, IT-07, SM-04 |
| US-04: Feed anzeigen | UT-BE-07, IT-05, IT-06, SM-04 |
| US-05: Kommentare | UT-BE-09, UT-BE-10, IT-09, SM-05 |
| US-06: Likes | UT-BE-08, IT-08, SM-06, UT-FE-04 |
| US-07: Profil | UT-BE-11, IT-10, SM-07 |
| US-08: Follow/Unfollow | UT-BE-12, UT-BE-13, IT-11, SM-08 |

---

## 6. Testumgebung

| Komponente | Entwicklung | CI (GitHub Actions) |
|-----------|-------------|---------------------|
| Backend | Java 21, Maven | Java 21, Maven (ubuntu-latest) |
| Frontend | Node 20, Vite | Node 20 |
| Datenbank | MongoDB lokal (Port 27017) | Flapdoodle Embed Mongo (In-Memory) |
| Start | `./start.sh` | Separate Backend/Frontend Jobs |

---

## 7. Nächste Schritte

- [ ] Vitest + React Testing Library in `frontend/package.json` einrichten
- [ ] `backend/src/test/` Verzeichnisstruktur anlegen
- [ ] Flapdoodle Embed Mongo zu `pom.xml` hinzufügen (test scope)
- [ ] Unit Tests für `AuthService` implementieren (UT-BE-01 bis UT-BE-05)
- [ ] Unit Tests für `JwtUtil` implementieren
- [ ] Integrationstests für Auth-Endpoints (IT-01 bis IT-04)
- [ ] CI-Pipeline um Test-Schritt erweitern
