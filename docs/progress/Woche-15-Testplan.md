# Woche 15 – Testplan & Testumgebung
**Aufgabenblatt:** AB15 | **Datum:** KW 19, Mai 2026 | **Blog-Deadline:** 05.05.2026 20:00 Uhr

---

## Was wurde gemacht?

### Testplan erstellt

Ein vollständiger Testplan für das DualNetworking-Projekt wurde erarbeitet und dokumentiert:
→ [../Tests/Testplan.md](../Tests/Testplan.md)

Der Testplan umfasst **5 Testarten** mit insgesamt **46 definierten Testfällen**, die alle 8 User Stories aus dem SRS abdecken.

### Überblick Testarten

| Testart | Anzahl Testfälle | Werkzeug | Status |
|--------|-----------------|---------|--------|
| Unit Tests – Backend | 13 | JUnit 5 + Mockito | ⬜ Geplant |
| Unit Tests – Frontend | 7 | Vitest + React Testing Library | ⬜ Geplant |
| API / Integrationstests | 11 | Spring Boot Test + MockMvc | ⬜ Geplant |
| Smoke Tests (manuell) | 10 | Browser | ⬜ Geplant |
| Sicherheitstests | 5 | JUnit 5 + MockMvc | ⬜ Geplant |

### Testabdeckungsziele

| Bereich | Ziel |
|---------|------|
| Backend Services (Unit) | ≥ 70% Line Coverage |
| Backend Endpoints (Integration) | ≥ 60% Abdeckung |
| Frontend Kernkomponenten | PostCard, LoginPage, CommentSection |
| Smoke Tests | 100% Kernfunktionen |

### Testwerkzeuge evaluiert

**Backend:** JUnit 5 + Mockito sind bereits in der `pom.xml` als Abhängigkeit vorhanden (via `spring-boot-starter-test`). Es muss lediglich die Verzeichnisstruktur `backend/src/test/` angelegt werden.

**Frontend:** Derzeit kein Test-Framework konfiguriert. Entscheidung für **Vitest** (siehe unten).

---

## Entscheidungen

> **Warum Vitest für das Frontend?**
> Das Projekt verwendet Vite als Build-Tool. Vitest ist nativ auf Vite ausgelegt, teilt dessen Konfiguration und ist deutlich schneller als Jest in Vite-Projekten. Die API ist Jest-kompatibel, sodass kein großer Lernaufwand entsteht.

> **Warum JUnit 5 + Mockito für das Backend?**
> `spring-boot-starter-test` ist bereits in der `pom.xml` enthalten und bringt JUnit 5, Mockito und Spring Boot Test mit. Kein zusätzlicher Setup-Aufwand. MockMvc erlaubt das Testen der REST-Endpoints ohne einen echten Server zu starten.

> **Warum In-Memory-Datenbank für Integrationstests?**
> MongoDB direkt in CI-Pipelines zu betreiben ist komplex. Flapdoodle Embed Mongo startet eine echte MongoDB-Instanz im Speicher für die Dauer des Tests – isoliert, schnell, reproduzierbar.

---

## Gelernt

- Eine saubere Trennung von Unit- und Integrationstests ist entscheidend: Unit Tests mocken alles, Integrationstests testen die Zusammenarbeit
- Testrückverfolgbarkeit (welcher Test deckt welche User Story ab) ist wichtig für den Testbericht am Semesterende
- Das Backend hat mit `spring-boot-starter-test` bereits alles Nötige – der größte Aufwand liegt im Schreiben der Tests, nicht im Setup

---

## Offene Punkte für nächste Woche

- [ ] Vitest + React Testing Library in `frontend/package.json` einrichten
- [ ] `backend/src/test/` Verzeichnisstruktur mit Paketstruktur anlegen
- [ ] Flapdoodle Embed Mongo als Test-Abhängigkeit in `pom.xml` eintragen
- [ ] Erste Backend-Unit-Tests für `AuthService` implementieren (UT-BE-01 bis UT-BE-05)
- [ ] Erste Integrationstests für Auth-Endpoints (IT-01 bis IT-04)
- [ ] CI-Pipeline um Test-Schritt erweitern
