# Woche 4 – UML Verhaltensdiagramme
**Aufgabenblatt:** AB04 | **Datum:** KW 43, Oktober 2025 | **Blog-Deadline:** 28.10.2025 20:00 Uhr

---

## Was wurde gemacht?

### Aktivitätsdiagramme erstellt (3 Stück)

#### 1. UC-01: Registrierung
Datei: [../uml/activity-register.drawio](../uml/activity-register.drawio)

Das Diagramm zeigt den vollständigen Registrierungsprozess in zwei Swimlanes (Nutzer / System):
- Nutzer füllt Formular aus → sendet ab
- System validiert Eingaben → prüft ob E-Mail/Name vergeben
- **Entscheidungsknoten:** Vergeben → Fehlermeldung (mit Rückschleife) | Nicht vergeben → BCrypt hashen → Speichern → JWT → Weiterleitung

#### 2. UC-03: Post erstellen
Datei: [../uml/activity-create-post.drawio](../uml/activity-create-post.drawio)

Zeigt den Post-Erstellungsprozess:
- **Entscheidungsknoten:** Eingeloggt? → Nein: Login-Weiterleitung | Ja: Formular öffnen
- JWT-Filter prüft Token → Validierung → Speichern → Weiterleitung zum Feed

#### 3. UC-05: Nutzer folgen/entfolgen
Datei: [../uml/activity-follow-user.drawio](../uml/activity-follow-user.drawio)

Zeigt den Follow/Unfollow-Prozess:
- System prüft ob es das eigene Profil ist → 400 Bad Request wenn ja
- System aktualisiert Follower-Listen beider Nutzer
- Frontend aktualisiert Anzeige optimistisch

### Sequenzdiagramme erstellt (2 Stück)

#### 1. Login-Sequenz
Datei: [../uml/sequence-login.drawio](../uml/sequence-login.drawio)

Teilnehmer: Nutzer → LoginPage (React) → AuthController → AuthService → MongoDB

Ablauf:
1. Nutzer gibt E-Mail + Passwort ein
2. POST /api/auth/login wird gesendet
3. AuthService.login() wird aufgerufen
4. UserRepository.findByEmail() → MongoDB
5. BCrypt-Hash-Vergleich (intern)
6. JWT-Token generieren
7. AuthResponse zurückgeben
8. Frontend speichert Token in localStorage

#### 2. Post-erstellen-Sequenz
Datei: [../uml/sequence-create-post.drawio](../uml/sequence-create-post.drawio)

Teilnehmer: Nutzer → CreatePostPage → JwtFilter → PostController → PostService → MongoDB

Ablauf:
1. Nutzer schreibt Text und klickt Absenden
2. POST /api/posts mit Authorization-Header
3. JwtFilter validiert Token und setzt Security Context
4. PostController delegiert an PostService
5. PostService speichert Post in MongoDB
6. Angereicherter PostResponse wird zurückgegeben
7. Frontend leitet zum Feed weiter

### SRS aktualisiert

Die Verhaltensdiagramme wurden in die SRS-Sektion 2 (Use Cases) integriert. Jeder Use Case verweist jetzt auf das zugehörige Aktivitäts- und/oder Sequenzdiagramm.

---

## UML-Qualitätsprüfung

- [x] Alle UML-Notationen korrekt verwendet?
  - Startknoten (●), Endknoten (⊙), Entscheidungsknoten (◆), Swimlanes
  - Sequenzdiagramm: Lifelines, Nachrichten (→), Antwortnachrichten (-->)
- [x] Sind alle Szenarien abgedeckt?
  - Fehlerfall bei Registrierung (E-Mail vergeben) ✓
  - Fehlerfall bei Login (falsches Passwort) ✓
  - Fehlerfall bei Follow (eigenes Profil) ✓
- [x] Logisch konsistent mit der SRS?

---

## Gelernt

- Aktivitätsdiagramme und Sequenzdiagramme zeigen verschiedene Perspektiven:
  - Aktivität: **Was passiert** (Prozessfluss, Entscheidungen)
  - Sequenz: **Wer kommuniziert mit wem** (Komponenten-Interaktionen)
- draw.io ist ein gutes Tool für UML ohne Lizenzkosten
- Swimlanes in Aktivitätsdiagrammen machen Verantwortlichkeiten sofort klar

---

## Offene Punkte für nächste Woche
- [ ] Klassendiagramm entwerfen
- [ ] CRC-Karten für Brainstorming nutzen
- [ ] SOLID-Prinzip auswählen und dokumentieren
- [ ] Klassen in Spring Boot implementieren
