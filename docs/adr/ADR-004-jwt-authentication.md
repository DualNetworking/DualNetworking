# ADR-004: JWT für Authentifizierung

**Status:** Akzeptiert
**Datum:** 2025-10-01

## Kontext

Die REST-API muss wissen, welcher Nutzer eine Anfrage stellt, um Posts und Kommentare korrekt zuzuordnen.

## Entscheidung

Wir verwenden **JWT (JSON Web Token)** für zustandslose Authentifizierung.

## Begründung

- Stateless – der Server muss keine Sessions speichern
- Einfach in REST-APIs zu verwenden (Authorization-Header)
- Spring Security hat eingebaute Unterstützung
- Skalierbar – mehrere Server-Instanzen möglich ohne Session-Sharing

## Ablauf

1. Nutzer loggt sich ein → Backend gibt JWT zurück
2. Frontend speichert JWT im `localStorage`
3. Bei jeder Anfrage sendet das Frontend `Authorization: Bearer <token>`
4. Backend validiert den Token und liest die User-ID daraus

## Alternativen, die wir verworfen haben

- **Session-Cookies** – erfordern Session-Speicher auf dem Server
- **OAuth2** – zu komplex für dieses Projekt

## Konsequenzen

- Token läuft nach 24 Stunden ab (konfigurierbar)
- Passwörter werden mit BCrypt gehasht – niemals im Klartext gespeichert
- Kein CSRF-Schutz nötig, da kein Cookie verwendet wird
