# Woche 6 – Erste lauffähige Demo
**Aufgabenblatt:** AB06 | **Datum:** KW 45, November 2025 | **Blog-Deadline:** 11.11.2025 20:00 Uhr

---

## Was wurde gemacht?

### Demo: Benutzerregistrierung und Login

Die erste Demo zeigt den kompletten Authentifizierungsfluss:

**Implementierte Features:**
- ✅ `POST /api/auth/register` – Nutzer registrieren
- ✅ `POST /api/auth/login` – Nutzer einloggen (JWT zurück)
- ✅ JWT-Filter für geschützte Endpunkte
- ✅ BCrypt-Passwort-Hashing
- ✅ Login-Seite (React)
- ✅ Registrierungs-Seite (React)
- ✅ Auth-Kontext (Token in localStorage, axios-Header gesetzt)

### Technische Details

**Backend – Authentifizierungsfluss:**
```
POST /api/auth/register
Body: { "username": "max", "email": "max@example.com", "password": "secret123" }
→ 200 OK: { "token": "eyJ...", "userId": "...", "username": "max" }

POST /api/auth/login
Body: { "email": "max@example.com", "password": "secret123" }
→ 200 OK: { "token": "eyJ...", "userId": "...", "username": "max" }
```

**Frontend – Ablauf:**
1. Nutzer füllt Registrierungsformular aus
2. `registerUser()` aus `api/auth.ts` wird aufgerufen
3. Bei Erfolg: `login(token, userId, username)` im AuthContext
4. Token in localStorage gespeichert, axios-Header gesetzt
5. Weiterleitung zu `/` (Feed)

### Erste Hürden und Lösungen

| Problem | Ursache | Lösung |
|---------|---------|--------|
| CORS-Fehler beim API-Aufruf | Backend blockierte Anfragen von localhost:5173 | `SecurityConfig.java` mit CORS-Konfiguration |
| JWT-Secret zu kurz | jjwt 0.12.x erfordert mindestens 256 Bit | Secret auf 64+ Zeichen verlängert |
| MongoDB verbindet nicht | Docker-Container nicht gestartet | `docker-compose up -d` vor dem Start |
| Spring Security blockiert alles | Standard: alle Endpunkte gesperrt | `SecurityConfig` mit `permitAll()` für Auth-Routen |

### Screenshot (Demo)
_(Screenshot der Login-Seite und erfolgreichen Registrierung hier einfügen)_

---

## Beiträge im Team

| Person | Beitrag |
|--------|---------|
| _(Teammitglied 1)_ | Backend: AuthService, JwtUtil, JwtFilter |
| _(Teammitglied 2)_ | Frontend: LoginPage, RegisterPage, AuthContext |
| _(Teammitglied 3)_ | SecurityConfig, application.properties, Dokumentation |
| _(Teammitglied 4)_ | Docker-Setup, pom.xml, Git-Struktur |

---

## Gelernt

- Spring Security ist mächtig aber die Konfiguration ist komplex → Zeit einplanen
- JWT-Bibliothek jjwt 0.12.x hat eine andere API als ältere Versionen
- CORS muss explizit konfiguriert werden wenn Frontend und Backend auf verschiedenen Ports laufen
- `localStorage` für JWT ist einfach, aber in Produktion sollte man Sicherheitsaspekte bedenken

---

## Offene Punkte für nächste Woche
- [ ] Posts erstellen und Feed anzeigen implementieren
- [ ] Profilseite implementieren
- [ ] Follow/Unfollow implementieren
