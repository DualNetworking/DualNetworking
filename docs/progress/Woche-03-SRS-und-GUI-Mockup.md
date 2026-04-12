# Woche 3 – SRS und GUI Mockup
**Aufgabenblatt:** AB03 | **Datum:** KW 42, Oktober 2025 | **Blog-Deadline:** 21.10.2025 20:00 Uhr

---

## Was wurde gemacht?

### Software Requirements Specification (SRS) begonnen

Vollständige SRS: [../SoftwareRequirementsSpecification.md](../SoftwareRequirementsSpecification.md)

Die SRS folgt dem vorgegebenen Template und enthält:
- **Abschnitt 1:** Einführung, Projektumfang, Definitionen
- **Abschnitt 2:** Funktionale Anforderungen mit 8 User Stories und 5 Use Cases
- **Abschnitt 3:** Nicht-funktionale Anforderungen (6 Anforderungen)
- **Abschnitt 4:** Technische Einschränkungen

### Use-Case-Diagramm erstellt
Datei: [../uml/use-case-diagram.drawio](../uml/use-case-diagram.drawio)

Das Diagramm zeigt:
- 2 Akteure: **Besucher** (nicht eingeloggt) und **Nutzer** (eingeloggt, erbt von Besucher)
- 8 Use Cases: Registrieren, Einloggen, Feed anzeigen, Profil anzeigen, Post erstellen, Post liken, Kommentar schreiben, Nutzer folgen
- `<<include>>`-Beziehungen: Alle eingeloggten Aktionen inkludieren "Einloggen"

### UI Mockups erstellt

Folgende Seiten wurden als Mockups skizziert:

**Login-Seite:**
```
┌────────────────────────────┐
│         DualNet            │
│      Einloggen             │
│                            │
│  E-Mail: [____________]    │
│  Passwort: [__________]    │
│                            │
│     [Einloggen]            │
│  Noch kein Konto?          │
│  → Jetzt registrieren      │
└────────────────────────────┘
```

**Feed-Seite:**
```
┌────────────────────────────┐
│ DualNet   + Post  [User ▼] │
├────────────────────────────┤
│ ┌──────────────────────┐   │
│ │ Username    Datum     │   │
│ │ Post-Inhalt...        │   │
│ │ ❤️ 5    💬 3 Komm.   │   │
│ └──────────────────────┘   │
│ ┌──────────────────────┐   │
│ │ ...                   │   │
│ └──────────────────────┘   │
└────────────────────────────┘
```

**Profil-Seite:**
```
┌────────────────────────────┐
│ [Avatar] Username          │
│ Bio-Text...                │
│ 42 Follower  15 Follows    │
│             [Folgen]       │
├────────────────────────────┤
│ Posts von Username         │
│ ┌──────────────────────┐   │
│ │ Post-Inhalt...        │   │
│ └──────────────────────┘   │
└────────────────────────────┘
```

---

## Qualitätsprüfung der Anforderungen

Prüfliste aus AB03:
- [x] Nutzen überwiegt Entwicklungskosten
- [x] In klarer, konsistenter Notation ausgedrückt
- [x] Eindeutig (keine Doppeldeutigkeiten)
- [x] Logisch konsistent
- [x] Mit verfügbaren Ressourcen realistisch umsetzbar
- [x] Verifizierbar (messbare Kriterien)
- [x] Eindeutig identifizierbar (US-01 bis US-08)
- [x] Schränkt Systemdesign nicht unnötig ein

---

## Gelernt

- SRS-Struktur kenngelernt und angewendet
- Unterschied zwischen funktionalen und nicht-funktionalen Anforderungen
- Use-Case-Diagramm mit draw.io erstellt
- Mockups helfen beim frühen Erkennen von UI-Problemen

---

## Offene Punkte für nächste Woche
- [ ] Aktivitätsdiagramme erstellen (min. 3)
- [ ] Sequenzdiagramme erstellen (min. 2)
- [ ] SRS um Verhaltensdiagramme ergänzen
- [ ] Nicht-funktionale Anforderungen vervollständigen
