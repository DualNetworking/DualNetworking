# ADR-003: MongoDB als Datenbank

**Status:** Akzeptiert
**Datum:** 2025-10-01

## Kontext

Das Projekt braucht eine Datenbank zum Speichern von Nutzern, Posts und Kommentaren.

## Entscheidung

Wir verwenden **MongoDB** als Dokumentendatenbank.

## Begründung

- Posts und Kommentare sind dokumentartige Daten ohne festes Schema
- **Spring Data MongoDB** bietet einfache Repository-Interfaces
- Kein Schema-Migration nötig bei Erweiterungen
- Einfaches Setup mit Docker

## Alternativen, die wir verworfen haben

- **PostgreSQL** – relational, mehr Konfiguration, JOINs nötig
- **MySQL** – ähnlich wie PostgreSQL, weniger flexibel beim Schema
- **H2 (In-Memory)** – nur für Tests geeignet, keine Persistenz

## Konsequenzen

- Flexible Datenstruktur – neue Felder können einfach hinzugefügt werden
- Drei Collections: `users`, `posts`, `comments`
- Kein ORM nötig, Spring Data generiert Queries automatisch aus Methodennamen
