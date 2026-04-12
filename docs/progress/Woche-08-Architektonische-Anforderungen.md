# Woche 8 – Analyse der architektonischen Anforderungen
**Aufgabenblatt:** AB08 | **Datum:** KW 47, November 2025 | **Blog-Deadline:** 25.11.2025 20:00 Uhr

---

## Was wurde gemacht?

Wir haben die drei Schritte aus AB08 durchgeführt:

---

## Schritt 1: Qualitätsmerkmale klären (Quality Scenarios)

### Qualitätsbaum

```
Qualität (DualNet)
├── Sicherheit (Priorität: Hoch)
│   ├── S1: Passwort-Sicherheit
│   ├── S2: Zugriffsschutz auf Endpunkte
│   └── S3: Keine sensiblen Daten im JWT
├── Wartbarkeit (Priorität: Mittel)
│   ├── W1: Klare Schichtenarchitektur
│   └── W2: Verständlicher Code
├── Benutzbarkeit (Priorität: Mittel)
│   ├── B1: Ladezeit des Feeds
│   └── B2: Verständliche Fehlermeldungen
└── Zuverlässigkeit (Priorität: Mittel)
    └── Z1: Fehlerbehandlung (keine Abstürze)
```

### Quality Scenarios (mindestens 5)

| ID | Qualitätsmerkmal | Quelle | Auslöser | Artefakt | Umgebung | Reaktion | Maß |
|----|-----------------|--------|---------|---------|---------|---------|-----|
| S1 | Sicherheit | Nutzer | Registrierung mit Passwort | AuthService | Normal | Passwort wird mit BCrypt(10) gehasht | Klartext nie in DB |
| S2 | Sicherheit | Angreifer | POST /api/posts ohne Token | JwtFilter | Normal | HTTP 401 Unauthorized | Immer, keine Ausnahme |
| S3 | Sicherheit | Entwickler | JWT inspizieren (base64 decode) | JwtUtil | Normal | Nur userId im Token, kein Passwort | Keine sensiblen Daten |
| W1 | Wartbarkeit | Entwickler | Neuen API-Endpunkt hinzufügen | Controller/Service/Repository | Entwicklung | Nur 3 Klassen betroffen | Max. 3 Dateien |
| B1 | Benutzbarkeit | Nutzer | Feed öffnen (50 Posts) | FeedPage | Normal | Feed vollständig geladen | < 2 Sekunden |
| Z1 | Zuverlässigkeit | System | Ungültige User-ID im Token | JwtFilter | Normal | 403 Forbidden, kein Absturz | Exception sauber abgefangen |

---

## Schritt 2: Strategien diskutieren

**Fokus auf S1 (Sicherheit – Passwort) und B1 (Benutzbarkeit – Feed-Ladezeit):**

### Strategie für S1: BCrypt-Passwort-Hashing
- **Warum BCrypt?** Enthält automatisch einen Salt → gleiche Passwörter haben verschiedene Hashes
- **Stärke:** BCrypt-Faktor 10 → ausreichend sicher, aber nicht zu langsam
- **Implementierung:** Spring Security `BCryptPasswordEncoder` als Bean

### Strategie für B1: Feed-Performance
- **Keine Pagination im MVP:** Einfacher, für Demo ausreichend
- **Datenbankindex:** MongoDB-Index auf `createdAt` würde helfen (wenn nötig)
- **Zukunft:** Pagination mit `Pageable` in Spring Data wäre einfach hinzuzufügen

---

## Schritt 3: Architekturentscheidungen dokumentiert

Alle Architekturentscheidungen sind als ADRs dokumentiert:

| ADR | Entscheidung | Datei |
|-----|-------------|-------|
| ADR-001 | React + TypeScript als Frontend | [../adr/ADR-001-react-typescript-frontend.md](../adr/ADR-001-react-typescript-frontend.md) |
| ADR-002 | Spring Boot als Backend | [../adr/ADR-002-spring-boot-backend.md](../adr/ADR-002-spring-boot-backend.md) |
| ADR-003 | MongoDB als Datenbank | [../adr/ADR-003-mongodb-database.md](../adr/ADR-003-mongodb-database.md) |
| ADR-004 | JWT für Authentifizierung | [../adr/ADR-004-jwt-authentication.md](../adr/ADR-004-jwt-authentication.md) |

---

## Gelernt

- Quality Scenarios sind präziser als vage Anforderungen wie "soll schnell sein"
- Architecture Decision Records helfen beim späteren Nachvollziehen von Entscheidungen
- Sicherheit muss von Anfang an mitgedacht werden (BCrypt, JWT, CORS)

---

## Offene Punkte für nächste Woche
- [ ] CI/CD Pipeline mit GitHub Actions einrichten
- [ ] Build-Script für Frontend und Backend konfigurieren
