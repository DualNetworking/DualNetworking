# Software Requirements Specification (SRS)
## DualNetworking (DualNet)

**Version:** 1.0
**Datum:** 2025-10-21
**Team:** TINF24B4

---

## 1. Einführung

### 1.1 Zweck
Dieses Dokument beschreibt die funktionalen und nicht-funktionalen Anforderungen der Social-Media-Plattform DualNet.

### 1.2 Projektumfang
DualNet ist eine Web-Applikation, auf der Nutzer Beiträge veröffentlichen, anderen Nutzern folgen und miteinander interagieren können.

### 1.3 Definitionen

| Begriff | Bedeutung |
|---------|-----------|
| Nutzer | Registrierter Benutzer der Plattform |
| Post | Textbeitrag eines Nutzers, optional mit Bild |
| Feed | Chronologische Übersicht aller Posts |
| JWT | JSON Web Token – wird für Authentifizierung verwendet |

---

## 2. Funktionale Anforderungen

### 2.1 Use-Case-Diagramm

Siehe: [docs/uml/use-case-diagram.png](uml/use-case-diagram.png)

### 2.2 User Stories

| ID | Als ... | möchte ich ... | damit ... | Priorität |
|----|---------|----------------|-----------|-----------|
| US-01 | Besucher | mich registrieren können | ich die Plattform nutzen kann | Hoch |
| US-02 | Besucher | mich einloggen können | ich auf mein Konto zugreifen kann | Hoch |
| US-03 | Nutzer | einen Post erstellen können | ich meine Gedanken teilen kann | Hoch |
| US-04 | Nutzer | den Feed sehen können | ich Posts anderer Nutzer lesen kann | Hoch |
| US-05 | Nutzer | einem anderen Nutzer folgen können | ich seinen Content verfolgen kann | Mittel |
| US-06 | Nutzer | einen Post liken können | ich Zustimmung zeigen kann | Mittel |
| US-07 | Nutzer | einen Kommentar schreiben können | ich auf Posts reagieren kann | Mittel |
| US-08 | Nutzer | ein Nutzerprofil anzeigen können | ich mehr über andere Nutzer erfahren kann | Mittel |

### 2.3 Use Cases (Detailbeschreibung)

#### UC-01: Registrierung
- **Akteur:** Besucher
- **Vorbedingung:** Nutzer hat noch kein Konto
- **Ablauf:**
  1. Nutzer öffnet Registrierungsseite
  2. Nutzer gibt Benutzername, E-Mail und Passwort ein
  3. System prüft, ob E-Mail und Benutzername noch frei sind
  4. System speichert Nutzer mit gehastem Passwort
  5. Nutzer wird zur Login-Seite weitergeleitet
- **Nachbedingung:** Nutzer kann sich einloggen
- **Fehlerfall:** E-Mail bereits vergeben → Fehlermeldung

Aktivitätsdiagramm: [docs/uml/activity-register.png](uml/activity-register.png)

#### UC-02: Login
- **Akteur:** Besucher mit Konto
- **Ablauf:**
  1. Nutzer gibt E-Mail und Passwort ein
  2. System prüft Passwort mit BCrypt
  3. System gibt JWT-Token zurück
  4. Frontend speichert Token im localStorage
  5. Nutzer wird zum Feed weitergeleitet

Sequenzdiagramm: [docs/uml/sequence-login.png](uml/sequence-login.png)

#### UC-03: Post erstellen
- **Akteur:** Eingeloggter Nutzer
- **Ablauf:**
  1. Nutzer öffnet "Post erstellen"-Seite
  2. Nutzer schreibt Text (max. 500 Zeichen)
  3. Nutzer kann optional eine Bild-URL angeben
  4. Nutzer klickt "Veröffentlichen"
  5. Backend speichert Post in MongoDB
  6. Nutzer wird zum Feed weitergeleitet

Aktivitätsdiagramm: [docs/uml/activity-create-post.png](uml/activity-create-post.png)
Sequenzdiagramm: [docs/uml/sequence-create-post.png](uml/sequence-create-post.png)

#### UC-04: Feed anzeigen
- **Akteur:** Jeder (auch nicht eingeloggt)
- **Ablauf:**
  1. Nutzer öffnet Startseite
  2. Frontend lädt alle Posts vom Backend
  3. Posts werden chronologisch (neueste zuerst) angezeigt

#### UC-05: Nutzer folgen/entfolgen
- **Akteur:** Eingeloggter Nutzer
- **Ablauf:**
  1. Nutzer öffnet Profil eines anderen Nutzers
  2. Nutzer klickt "Folgen" oder "Entfolgen"
  3. Backend aktualisiert Follower-Listen

Aktivitätsdiagramm: [docs/uml/activity-follow-user.png](uml/activity-follow-user.png)

---

## 3. Nicht-funktionale Anforderungen

| ID | Kategorie | Anforderung |
|----|-----------|-------------|
| NF-01 | Performance | Feed lädt in unter 2 Sekunden |
| NF-02 | Sicherheit | Passwörter werden mit BCrypt gehasht |
| NF-03 | Sicherheit | Alle geschützten Endpunkte erfordern JWT |
| NF-04 | Usability | Fehlermeldungen sind auf Deutsch verständlich |
| NF-05 | Wartbarkeit | Code ist in klar getrennte Schichten aufgeteilt |
| NF-06 | Portabilität | Läuft in jedem modernen Browser (Chrome, Firefox, Safari) |

---

## 4. Technische Einschränkungen

- Frontend: React + TypeScript, Build mit Vite
- Backend: Java 21 + Spring Boot 3
- Datenbank: MongoDB
- Authentifizierung: JWT (stateless, kein Session-State)
- Kein Pagination im MVP (alle Posts werden geladen)
