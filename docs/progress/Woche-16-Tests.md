# Woche 16 – Tests implementiert & CI/CD erweitert
**Aufgabenblatt:** AB16 | **Datum:** KW 20, Mai 2026 | **Blog-Deadline:** 11.05.2026 20:00 Uhr

---

## Was wurde gemacht?

### Tests implementiert

Alle geplanten automatisierten Tests aus dem Testplan (AB15) wurden implementiert. Insgesamt wurden **20 Testfälle** in Betrieb genommen:

| Testart | Anzahl | Framework | Status |
|--------|--------|----------|--------|
| Unit Tests – Backend | 13 | JUnit 5 + Mockito | Bestanden |
| Unit Tests – Frontend | 7 | Vitest + React Testing Library | Bestanden |
| API / Integrationstests | 8 | Spring Boot Test + MockMvc + Flapdoodle | Bestanden |

### Backend Unit Tests

Fünf Testklassen wurden unter `backend/src/test/java/com/dualnet/` angelegt:

- **`AuthServiceTest`** (UT-BE-01 bis 03): Registrierung mit doppeltem Benutzernamen wirft `ResponseStatusException(409)`, Login mit falschem Passwort wirft `ResponseStatusException(401)`, korrekter Login gibt JWT zurück.
- **`JwtUtilTest`** (UT-BE-04 bis 05): `generateToken` erzeugt Token mit korrekter User-ID als Subject; `isTokenValid` gibt `false` für abgelaufene Tokens zurück. Da `JwtUtil` `@Value`-Felder nutzt, wurden diese per `ReflectionTestUtils.setField()` injiziert.
- **`PostServiceTest`** (UT-BE-06 bis 08): Post erstellen, Feed laden, Like hinzufügen. Für den Like-Test wurde ein `ArgumentCaptor<Post>` eingesetzt, um zu prüfen, dass die `likes`-Liste nach dem Speichern den User enthält.
- **`CommentServiceTest`** (UT-BE-09 bis 10): Kommentar erstellen und Kommentarliste laden.
- **`UserServiceTest`** (UT-BE-11 bis 13): Profil laden, Follow und Unfollow – inklusive Überprüfung, dass beide User-Objekte gespeichert werden.

### Backend Integrationstests

Zwei Controller-Testklassen mit `@SpringBootTest` + `@AutoConfigureMockMvc` + Flapdoodle Embed Mongo:

- **`AuthControllerTest`** (IT-01 bis 04): Vollständiger HTTP-Roundtrip – Registrierung, doppelter Benutzername, Login, falsches Passwort.
- **`PostControllerTest`** (IT-05 bis 08): POST ohne Token → 403, GET Feed → 200, POST mit JWT → 200, Like → 200 mit `likeCount = 1`. Im `@BeforeEach` wird ein Testnutzer registriert und der JWT gespeichert, der dann in nachfolgenden Requests verwendet wird.

**Anpassung gegenüber Testplan:** IT-05 war ursprünglich als `GET /api/posts ohne Token → 403` geplant. Die SecurityConfig erlaubt diesen Endpoint jedoch ohne Authentifizierung (`permitAll()`). IT-05 testet stattdessen `POST /api/posts ohne Token → 403`, was den Schutzmechanismus sinnvoller abdeckt.

### Frontend Unit Tests

Vitest und React Testing Library wurden eingerichtet:

```bash
npm install --save-dev vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom
```

Die `vite.config.ts` wurde um den `test`-Block erweitert (globals, jsdom environment, setup file). Fünf Testdateien:

- **`LoginPage.test.tsx`** (UT-FE-01, 02): Formularfelder und Login-Button sichtbar.
- **`PostCard.test.tsx`** (UT-FE-03, 04): Post-Inhalt und Autor angezeigt, Like-Button vorhanden.
- **`CommentSection.test.tsx`** (UT-FE-05): Kommentare werden nach dem asynchronen Laden angezeigt (`waitFor`).
- **`FollowButton.test.tsx`** (UT-FE-06): Button zeigt "Entfolgen" wenn `initiallyFollowing = true`.
- **`Navbar.test.tsx`** (UT-FE-07): Logout-Button und Benutzername sichtbar.

Mock-Strategie: `vi.mock('../context/AuthContext', ...)` isoliert alle Komponenten vom echten Auth-State; API-Module werden per `vi.mock` mit Dummy-Implementierungen ersetzt; `MemoryRouter` umhüllt Komponenten mit `Link`/`useNavigate`.

### CI/CD-Pipeline erweitert

Beide GitHub Actions Workflows wurden um Test-Schritte ergänzt:

**`backend-ci.yml`:** Neuer Schritt `mvn test` vor dem Build. Flapdoodle startet automatisch im Test-Scope (kein MongoDB-Dienst in der CI nötig).

**`frontend-ci.yml`:** Neuer Schritt `npm test` nach `npm ci` und vor `npm run build`.

---

## Herausforderungen

**JwtUtil-Unit-Test:** Da `JwtUtil` die Werte für `secret` und `expiration` via `@Value` aus `application.properties` bezieht, sind sie im Unit-Test-Kontext ohne Spring-Kontext nicht injiziert. Die Lösung war `ReflectionTestUtils.setField()` aus dem Spring-Test-Modul – kein vollständiger Spring-Kontext, aber trotzdem korrekte Wert-Injektion.

**Abgelaufener JWT:** Für UT-BE-05 (abgelaufener Token) wurde `expiration = 0L` gesetzt. JJWT 0.12.x wirft in diesem Fall eine `ExpiredJwtException`, die von `isTokenValid()` abgefangen und als `false` zurückgegeben wird.

**IT-05 Anpassung:** Der Testplan enthielt einen Fehler: `GET /api/posts` ist laut SecurityConfig öffentlich, würde also auch ohne Token 200 zurückgeben. Nach Prüfung des Codes wurde IT-05 auf `POST /api/posts ohne Token → 403` umgestellt.

---

## Testabdeckung (aktuell)

| Bereich | Ziel | Aktuell |
|---------|------|---------|
| Backend Services (Unit) | ≥ 70% | Alle 5 Service-Klassen abgedeckt |
| Backend Endpoints (Integration) | ≥ 60% | Auth + Posts vollständig, Comments/Users geplant |
| Frontend Kernkomponenten | Kritische Komponenten | LoginPage, PostCard, CommentSection, FollowButton, Navbar |

---


