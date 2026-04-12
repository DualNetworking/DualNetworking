# ADR-002: Java Spring Boot als Backend-Framework

**Status:** Akzeptiert
**Datum:** 2025-10-01

## Kontext

Das Projekt braucht ein Backend, das eine REST-API für das Frontend bereitstellt und mit MongoDB kommuniziert.

## Entscheidung

Wir verwenden **Java 21** mit **Spring Boot 3** und **Maven** als Build-Tool.

## Begründung

- **Spring Boot** bietet automatische Konfiguration – wenig Boilerplate-Code
- **Spring Data MongoDB** erlaubt einfache Datenbankabfragen ohne SQL
- **Spring Security** bietet eingebaute JWT-Unterstützung
- Java ist die Pflichtsprache im Studiengang
- Große Community und viele Tutorials verfügbar

## Alternativen, die wir verworfen haben

- **Node.js/Express** – wäre auch TypeScript, aber Java ist Pflicht
- **Quarkus** – moderner, aber unbekannter als Spring Boot
- **Jakarta EE** – zu viel Konfiguration notwendig

## Konsequenzen

- Klare Schichtenarchitektur: Controller → Service → Repository
- Spring Security übernimmt die JWT-Validierung automatisch
- Maven-Builds sind reproduzierbar und CI-freundlich
