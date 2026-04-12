# Woche 10 – Halbzeitabschluss
**Aufgabenblatt:** AB10 | **Abgabe Handout:** 10.12.2025 | **Semester-Abschluss:** 23.12.2025 23:59 Uhr

---

## Was wurde gemacht?

### Halbzeitpräsentation vorbereitet

**Präsentationsinhalt (20–25 Minuten + 5–10 Minuten Q&A):**

#### 1. Projektvision
DualNetworking ist eine Social-Media-Plattform, auf der Nutzer Beiträge veröffentlichen, anderen Nutzern folgen und miteinander interagieren können. Ziel ist eine einfache, gut wartbare Webanwendung.

#### 2. Architekturentscheidungen mit Begründung

| Entscheidung | Begründung |
|-------------|------------|
| React + TypeScript | Typsicherheit, schnelles Prototyping mit Vite |
| Java Spring Boot | Pflicht, gute MongoDB-Integration, ausgereifte Ökosystem |
| MongoDB | Flexibles Schema für dokumentartige Daten |
| JWT-Auth | Stateless, keine Session-Verwaltung nötig |
| GitHub Actions | Kostenlos, direkt in GitHub integriert |

#### 3. Design-Prinzipien

**Single Responsibility Principle (SRP):**
- Jede Klasse hat genau eine Aufgabe
- Controller: HTTP → Service: Logik → Repository: Datenbank

**Schichtenarchitektur:**
```
Controller (HTTP) → Service (Logik) → Repository (DB) → MongoDB
```

#### 4. Tech Stack Zusammenfassung

```
Frontend:  React 18 + TypeScript + Vite + axios + react-router-dom
Backend:   Java 21 + Spring Boot 3 + Spring Security + Spring Data MongoDB
DB:        MongoDB 7 (Docker)
CI/CD:     GitHub Actions
```

#### 5. Live Demo

Demo-Ablauf:
1. Registrieren (Formular ausfüllen)
2. Einloggen
3. Post erstellen
4. Feed anzeigen (Post sichtbar)
5. Profil anzeigen
6. (Optional) Like und Kommentar

#### 6. Projekt-Management Fakten

| Kategorie | Wert |
|-----------|------|
| Sprints durchgeführt | 5 |
| Sprint-Länge | 2 Wochen |
| Gesamtstunden (ca.) | _(aus Scrum-Board eintragen)_ |
| User Stories implementiert | 6 von 8 |
| Offene User Stories | Profil-Bearbeitung, Benachrichtigungen |

### Handout vorbereitet

Das Handout enthält:
- Projekttitel und Teamnamen
- Stunden-Statistiken (aus Scrum-Board)
- Vollständiges Use-Case-Diagramm
- Architekturstil (3-Schicht, REST, stateless JWT)
- Verwendete Tools und Plattformen

---

## Semester-Abschluss Dokumentation (bis 23.12.2025)

**Alle verlinkten Dokumente wurden eingereicht:**

- [x] Präsentationsfolien
- [x] Software Requirement Specification → [../SoftwareRequirementsSpecification.md](../SoftwareRequirementsSpecification.md)
- [x] Qualitätsbaum und Quality Scenarios → [Woche-08-Architektonische-Anforderungen.md](Woche-08-Architektonische-Anforderungen.md)
- [x] Architecture Decision Records → [../adr/](../adr/)
- [x] CI/CD Übersicht → [Woche-09-CI-CD.md](Woche-09-CI-CD.md)
- [x] GitHub Repository: _(URL einfügen)_
- [x] Scrum-Board: _(URL einfügen)_

---

## Gelernt

- Präsentation für technische Inhalte: weniger Text, mehr Diagramme
- ADRs sind bei der Präsentation sehr hilfreich – man kann Entscheidungen klar begründen
- Die Kombination aus SRS + UML + ADR ergibt ein vollständiges Bild des Systems

---

## Ausblick auf Semester 4
- Profil- und Follow-System vervollständigen
- arc42-Architekturdokumentation vervollständigen
- Testberichte erstellen
