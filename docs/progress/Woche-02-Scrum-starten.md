# Woche 2 – Scrum starten
**Aufgabenblatt:** AB02 | **Datum:** KW 41, Oktober 2025 | **Blog-Deadline:** 14.10.2025 20:00 Uhr

---

## Was wurde gemacht?

### Scrum-Regeln festgelegt

| Scrum-Parameter | Entscheidung |
|----------------|-------------|
| Sprint-Länge | 2 Wochen |
| Sprint Change Meeting | Mittwoch 13:00–15:00 Uhr (Review + Retro + Planning) |
| Daily Frequenz | Alle 2 Tage (Montag + Mittwoch) |
| Daily-Zeit | Mittwoch 13:00 Uhr (kombiniert mit Sprint-Meeting) |

### Scrum-Plattform eingerichtet
- **Plattform:** _(Jira / YouTrack)_
- Stunden-Tracking konfiguriert für:
  - Zeit pro Person
  - Zeit pro Disziplin (Requirements, Analyse & Design, Implementierung, Test)
  - Zeit pro Phase (Requirements-Definition, Planung & Design, Implementierung)
  - Zeit pro Use Case

### Backlog erstellt

| ID | User Story | Schätzung (h) | Priorität | Definition of Done |
|----|-----------|---------------|-----------|-------------------|
| US-01 | Als Besucher möchte ich mich registrieren können | 8h | Hoch | Nutzer ist in DB gespeichert, Login funktioniert |
| US-02 | Als Besucher möchte ich mich einloggen können | 6h | Hoch | JWT-Token wird zurückgegeben, Frontend speichert ihn |
| US-03 | Als Nutzer möchte ich einen Post erstellen können | 8h | Hoch | Post erscheint im Feed |
| US-04 | Als Nutzer möchte ich den Feed sehen können | 6h | Hoch | Alle Posts werden chronologisch angezeigt |
| US-05 | Als Nutzer möchte ich einem anderen Nutzer folgen können | 10h | Mittel | Follower-Zahl aktualisiert sich |
| US-06 | Als Nutzer möchte ich einen Post liken können | 5h | Mittel | Like-Zahl aktualisiert sich, Like bleibt gespeichert |
| US-07 | Als Nutzer möchte ich einen Kommentar schreiben können | 6h | Mittel | Kommentar erscheint unter dem Post |
| US-08 | Als Nutzer möchte ich ein Profil anzeigen können | 6h | Mittel | Profilseite zeigt Posts und Follower-Statistiken |

### Sprint 1 geplant

**Sprint 1 Ziel:** Grundlegende Projektstruktur und Authentifizierung

| Aufgabe | Verantwortlich | Schätzung |
|---------|---------------|-----------|
| React + Vite Projekt aufsetzen | Frontend-Entwickler | 2h |
| Spring Boot Projekt aufsetzen | Backend-Entwickler | 2h |
| MongoDB + Docker konfigurieren | DevOps | 2h |
| User-Modell und Repository erstellen | Backend | 4h |
| JWT-Authentifizierung implementieren | Backend | 6h |
| Login/Register Frontend-Seiten | Frontend | 6h |

---

## Entscheidungen

> **Warum 2-Wochen-Sprints?**
> Wöchentliche Sprints wären zu kurz für sinnvolle Feature-Entwicklung. 2 Wochen geben genug Zeit für Implementierung + Testing + Dokumentation.

---

## Gelernt

- Scrum-Konzepte praktisch angewendet (Backlog, Sprint Planning, Estimation)
- User Stories korrekt formuliert ("Als ... möchte ich ... damit ...")
- Story Points / Zeitschätzungen erstmals für ein Softwareprojekt gemacht

---

## Screenshots (Kanban-Board)
_(Screenshot des Scrum-Boards hier einfügen)_

---

## Offene Punkte für nächste Woche
- [ ] SRS beginnen
- [ ] UI Mockups erstellen
- [ ] Use-Case-Diagramm zeichnen
