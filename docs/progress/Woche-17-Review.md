# Woche 17 – Code-Review: Post-Management & Sicherheitsschicht
**Aufgabenblatt:** AB18 | **Datum:** KW 22, Mai 2026 | **Blog-Deadline:** 28.05.2026 20:00 Uhr

---

## Was wurde gemacht?

### Code-Review durchgeführt

Gemäß AB18 wurde ein strukturiertes Review-Meeting für ausgewählte Teile des Backend-Quellcodes durchgeführt und protokolliert.

---

## Review-Protokoll

### Datum & Zeit

**Datum:** Dienstag, 27.05.2026
**Startzeit:** 14:00 Uhr
**Endzeit:** 15:20 Uhr
**Ort:** Discord (Videocall)

---

### Teilnehmende

| Name | Rolle im Meeting |
|------|-----------------|
| Max | Moderator, Entwickler (Backend-Autor) |
| Luca | Protokollführer, Entwickler (Frontend-Autor) |
| Jonas | Zeitwächter, externer Reviewer (Kommilitone aus anderem Team) |

---

### Ziel / Schwerpunkt des Reviews

**Reviewte Komponenten:**
- `PostService.java` – Geschäftslogik für Posts (Feed, erstellen, liken, unlike)
- `PostController.java` – REST-Endpoints für Post-Operationen
- `JwtUtil.java` – JWT-Erstellung und -Validierung
- `SecurityConfig.java` – Spring Security Konfiguration (CORS, Endpoint-Schutz)

**Warum dieser Teil?**

Die Post-Verwaltung ist die Kernfunktion der App – jeder Nutzer interagiert täglich damit. Gleichzeitig ist sie eng mit der Sicherheitsschicht verzahnt: Schreib-Operationen (erstellen, liken) erfordern einen gültigen JWT, während Leseoperationen (Feed) öffentlich zugänglich sind. Diese Kombination aus Business-Logik und sicherheitskritischem Code war der Hauptgrund für die Auswahl. Zusätzlich wurden für genau diese Klassen in Woche 16 Unit- und Integrationstests implementiert – der Review konnte direkt auf die Testerfahrungen aufbauen.

---

### Kriterien für den Review

| Kriterium | Beschreibung |
|-----------|-------------|
| **Codequalität** | Lesbarkeit, Namenskonventionen, Kommentare, Single-Responsibility-Prinzip |
| **Sicherheit** | JWT-Validierung korrekt, Passwort-Handling, CORS-Konfiguration, Endpoint-Schutz |
| **Korrektheit** | Logik stimmt mit Anforderungen überein, Edge Cases abgedeckt |
| **Wartbarkeit** | Abhängigkeiten sauber injiziert, keine Magic Strings, keine Redundanz |
| **Skalierbarkeit** | Datenbankabfragen effizient, N+1-Probleme erkannt |

---

### Review-Methodik

**Walkthrough** – Der Entwickler (Max) präsentiert den Code Schritt für Schritt, die anderen Reviewer kommentieren und stellen Fragen. Kein formales Defect-Tracking, sondern kollaborative Diskussion mit anschließender schriftlicher Zusammenfassung.

Ablauf:
1. Max erklärt Aufbau und Verantwortlichkeit jeder Klasse (5 Min. pro Klasse)
2. Reviewer stellen Fragen, nennen Auffälligkeiten
3. Protokollführer notiert Befunde live
4. Abschluss: Priorisierung und Aufgabenverteilung

---

### Ergebnisse der Sitzung

#### Positiv – Bewährte Praktiken

- **Idempotentes Like-System** (`addLikeIfMissing`): Mehrfaches Liken hat keine Nebenwirkungen → korrekte Umsetzung.
- **Single Responsibility** in `PostService`: Jede Methode hat genau eine Aufgabe; `toResponseWithAuthor`, `buildPost` und `findPostOrThrow` sind klar abgetrennt.
- **Einheitliche Fehlerbehandlung** via `ResponseStatusException` mit HTTP-Statuscodes → konsistente API-Antworten.
- **Passwort-Handling** in `AuthService` korrekt: Klartext wird nie gespeichert, BCrypt via `PasswordEncoder`.
- **Stateless JWT-Architektur**: Keine Sessions, CSRF deaktiviert – für REST API angemessen und korrekt begründet.

#### Befunde / Verbesserungspotenzial

| # | Komponente | Befund | Schwere | Verantwortlich | Frist |
|---|-----------|--------|---------|----------------|-------|
| R-01 | `PostService.toResponseWithAuthor` | N+1-Problem: Für jeden Post wird einzeln ein `userRepository.findById()` aufgerufen. Bei großem Feed → viele Einzelabfragen gegen MongoDB. | Mittel | Max | KW 23 |
| R-02 | `SecurityConfig.corsConfigurationSource` | `allowedOrigins` enthält nur `localhost:5173`. Bei Deployment auf einem echten Server fehlt die Produktions-URL → CORS-Fehler in Produktion. | Mittel | Max | Bei Deployment |
| R-03 | `JwtUtil.getSigningKey` | `secret.getBytes()` ohne Charset-Angabe (nutzt System-Default). Auf Systemen mit anderem Default-Charset könnte der Schlüssel abweichen. | Niedrig | Max | KW 23 |
| R-04 | `PostController` | Kein `@ResponseStatus(HttpStatus.CREATED)` auf `createPost` – gibt 200 statt 201 zurück. Entspricht nicht REST-Konvention. | Niedrig | Max | KW 23 |
| R-05 | `PostService.unlikePost` | Kein Check ob der Nutzer überhaupt geliked hat, bevor `remove()` aufgerufen wird. Aktuell idempotent, aber keine explizite Validierung → unklar ob gewollt. | Niedrig | Max | Optional |

#### Gelernte Lektionen

- Das N+1-Problem (R-01) ist ein klassischer Fallstrick bei MongoDB ohne ORM – wird in vielen ORM-Frameworks durch Lazy Loading automatisch gelöst, muss hier manuell mit Batch-Abfragen adressiert werden.
- CORS-Konfiguration ist entwicklungszeit-fokussiert und wird bei Deployment oft vergessen. Früh als Konfigurationsvariable auslagern.
- Ein externer Reviewer (Jonas) hat R-01 sofort erkannt – eigene Blindheit gegenüber selbst geschriebenem Code bestätigt den Wert des Reviews.

---

## Zusammenfassung des Review-Meetings

Das Review dauerte 80 Minuten und deckte vier zentrale Klassen der Backend-Sicherheits- und Business-Logik-Schicht ab. Die Qualität des Codes wurde insgesamt als gut bewertet: Klare Struktur, saubere Abhängigkeiten, korrekte Sicherheitsmechanismen. Die wichtigsten offenen Punkte sind das N+1-Problem beim Feed-Laden (R-01) und die hardcodierte CORS-Origin (R-02). Beide werden in KW 23 adressiert. Die Session hat gezeigt, dass ein externer Reviewer neue Perspektiven einbringt – vor allem Performanzprobleme, die dem Hauptentwickler nicht aufgefallen sind.

---

## Offene Punkte für nächste Woche

- [ ] N+1-Problem in `PostService.toResponseWithAuthor` mit Batch-Abfrage lösen (R-01)
- [ ] CORS-Origin als Umgebungsvariable / Konfigurationsproperty auslagern (R-02)
- [ ] `JwtUtil.getSigningKey` auf explizites `StandardCharsets.UTF_8` umstellen (R-03)
- [ ] `createPost` auf `ResponseEntity.status(201).body(...)` umstellen (R-04)
- [ ] Zwei andere Blogs kommentieren (bis 29.05.2026 20:00 Uhr)
