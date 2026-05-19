# Woche 17 – Blog 14: Software-Metriken

*Veröffentlicht: 19.05.2026*

---

## Zusammenfassung der heute studierten Metriken

In der heutigen Vorlesungseinheit haben wir uns mit Metriken für das **Anforderungsmodell** beschäftigt. Eine Gruppe aus unserem Kurs hat die folgenden Metriken präsentiert:

### Größenmetriken

**Function Points (nach Albrecht, 1979)**  
Misst den funktionalen Umfang einer Software aus Benutzersicht – technologieunabhängig, nicht codebasiert. Fünf Funktionstypen werden gewichtet summiert:

| Funktionstyp | Einfach | Mittel | Komplex |
|---|---|---|---|
| ILF (interne Dateien) | 7 | 10 | 15 |
| EIF (externe Schnittstellen) | 5 | 7 | 10 |
| EI (externe Eingaben) | 3 | 4 | 6 |
| EO (externe Ausgaben) | 4 | 5 | 7 |
| EQ (externe Abfragen) | 3 | 4 | 6 |

**Formel:** `AFP = UFP × (0,65 + 0,01 × ΣC_i)`  
(UFP = Summe gewichteter Funktionstypen, C_i = 14 Einflussfaktoren je 0–5)

**Berechnung für DualNet:**

| Funktion | Typ | Kompl. | Gew. |
|---|---|---|---|
| Benutzerkonto | ILF | Einfach | 7 |
| Beitrag (Post + Likes) | ILF | Mittel | 10 |
| Kommentar | ILF | Einfach | 7 |
| Registrierung | EI | Mittel | 4 |
| Login / Logout | EI | Einfach | 3+3 |
| Beitrag erstellen | EI | Mittel | 4 |
| Beitrag liken/entliken | EI | Einfach | 3 |
| Kommentar schreiben | EI | Einfach | 3 |
| Beiträge laden | EO | Mittel | 5 |
| Benutzer abfragen | EQ | Einfach | 3 |

```
UFP = 31 (ILF) + 29 (EI) + 9 (EO) + 9 (EQ) = 78
VAF = 0,65 + 0,01 × 27 = 0,92
AFP = 78 × 0,92 ≈ 72 Function Points
```

---

### Qualitätsmetriken

**Mehrdeutigkeit**  
Zählt mehrdeutige Modifikatoren in Anforderungen (z. B. „viele", „groß", „benutzerfreundlich"). Ziel: 0 – jede Anforderung soll eindeutig formuliert sein.

**Vollständigkeit**  
Misst offene oder unentschiedene Punkte (TBD-Marker).  
`Grad = 1 − (offene Punkte / Gesamtanforderungen)`  
Ziel: Wert möglichst nahe 1,0.

**Unverständlichkeit**  
Anzahl der Abschnitte und Unterabschnitte im Anforderungsdokument. Empfehlung: max. 3–4 Gliederungsebenen.

---

### Stabilitätsmetriken

**Volatilität**  
Misst wie häufig Anforderungen geändert werden.  
`Volatilität = Summe aller Änderungen / Anzahl Anforderungen`  
Hohe Volatilität = instabile, risikobehaftete Anforderungen.

**Zeit pro Änderung**  
Aufwand (in Stunden) pro Aktivität bei einer beantragten Änderung – hilft Engpässe im Änderungsprozess zu erkennen.

---

### Prozessmetriken

**Rückverfolgbarkeit**  
`Trace = 1 − (nicht verfolgbare Anforderungen / Gesamtanforderungen)`  
Jede Anforderung muss bis zum Code zurückverfolgbar sein.

**Modellklarheit**  
Beschreibende Seiten pro UML-Modell. Zu viele Seiten = zu komplex, zu wenige = unvollständig.

**UML-Fehler**  
Anzahl syntaktischer und semantischer Fehler in UML-Diagrammen (fehlende Kardinalitäten, falsche Beziehungstypen etc.).

---

## Aufgabe 1a – Drei gewählte Metriken für DualNet

Zusätzlich zu den Softwaretestmetriken (Code Coverage, Anzahl Testfälle) messen wir für DualNet die folgenden drei Metriken aus den Vorlesungsfolien (Folie 6). Die Auswahl orientiert sich am Tipp der Aufgabe: „Welche Messwerte zeigen die Höhepunkte Ihres Projekts?"

---

### Metrik 1: Zyklomatische Komplexität (Cyclomatic Complexity, CC)

**Kategorie:** Codequalität → Komplexität (Vorlesungsfolien S. 6, Aufgabe 2)

**Zielsetzung:**  
Die zyklomatische Komplexität misst die Anzahl linear unabhängiger Pfade durch eine Methode. Sie zeigt, wie schwer eine Methode zu testen und zu verstehen ist. Je höher der Wert, desto mehr Testfälle sind nötig, um alle Verzweigungen abzudecken. Für DualNet zeigt diese Metrik besonders gut, dass unser IOSP-Refactoring (Integration-Operation Separation Principle) die Komplexität bewusst niedrig hält.

**Berechnung:**  
`CC = Anzahl der Entscheidungspunkte + 1`

Entscheidungspunkte: `if`, `else if`, `while`, `for`, `case`, `catch`, `&&`, `||`, ternärer Operator.

**Richtwerte:**
| CC | Bewertung |
|----|-----------|
| 1–5 | Einfach, gut testbar |
| 6–10 | Mäßig komplex |
| 11–20 | Komplex, schwer testbar |
| > 20 | Sehr komplex, Refactoring empfohlen |

**Berechnung am DualNet-Beispiel:**

```java
// PostService.java – addLikeIfMissing()
// Entscheidungspunkt: 1× if → CC = 2
private void addLikeIfMissing(Post post, String userId) {
    if (!post.getLikes().contains(userId)) {   // +1 Entscheidungspunkt
        post.getLikes().add(userId);
    }
}

// UserService.java – addFollowRelationship()
// Entscheidungspunkt: 1× if → CC = 2
private void addFollowRelationship(User target, User currentUser) {
    if (target.getFollowers().contains(currentUser.getId())) {  // +1 Entscheidungspunkt
        return;
    }
    target.getFollowers().add(currentUser.getId());
    currentUser.getFollowing().add(target.getId());
}

// UserService.java – ensureNotSelfFollow()
// Entscheidungspunkt: 1× if → CC = 2
private void ensureNotSelfFollow(String targetId, String currentUserId) {
    if (targetId.equals(currentUserId)) {   // +1 Entscheidungspunkt
        throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "...");
    }
}
```

**Warum CC = 1 hier kein Problem ist:**  
Die öffentlichen Integrationsmethoden haben bewusst CC = 1, da sie keine eigene Verzweigungslogik enthalten. Das ist ein Highlight unseres IOSP-Designs – keine Änderung erforderlich:

```java
// PostService.java – likePost()
// CC = 1: reine Integration, Logik liegt in addLikeIfMissing()
public PostResponse likePost(String postId, String currentUserId) {
    Post post = findPostOrThrow(postId);        // delegiert an private Op.
    addLikeIfMissing(post, currentUserId);      // delegiert an private Op.
    Post savedPost = postRepository.save(post);
    return toResponseWithAuthor(savedPost);
}
```

**Werkzeug:** PMD über `maven-pmd-plugin` – automatisch in der CI/CD-Pipeline

---

### Metrik 2: Prozent interne Kommentare

**Kategorie:** Codequalität → Unverständlichkeit (Vorlesungsfolien S. 6)

**Zielsetzung:**  
Misst wie gut der Code dokumentiert ist. Diese Metrik zeigt ein Highlight unseres Projekts: Wir kommentieren bewusst das *Warum* (Designentscheidungen, Refactoring-Gründe), nicht das *Was* – selbsterklärender Code braucht keine Kommentare.

**Berechnung:**  
`Kommentaranteil = (Anzahl Kommentarzeilen / Gesamtzeilen) × 100`

**Richtwert:** 10–30 % gelten als angemessen.

**Berechnung am DualNet-Beispiel (PostService.java, 95 Zeilen):**

```
Kommentarzeilen (// oder /* …): ca. 14
→ Kommentaranteil = 14 / 95 × 100 ≈ 14,7 %  ✓ im Zielbereich
```

Die Kommentare erläutern Designentscheidungen, nicht triviale Details:

```java
// Geschäftslogik für Posts: erstellen, laden, liken.
// Refactoring: Map<String,Object> durch PostResponse ersetzt; enrichPost in PostMapper ausgelagert.

// ===== Öffentliche Integration-Methoden =====

// Liefert alle Posts für den Feed (neueste zuerst)
// Fügt einen Like hinzu (idempotent – mehrfaches Liken ändert nichts)
```

**Warum 0 % Kommentare in manchen Methoden kein Problem ist:**  
Methoden wie `findPostOrThrow()` oder `ensureNotSelfFollow()` sind so benannt, dass ihr Name bereits alles erklärt. Fehlende Kommentare sind hier gutes Design, nicht ein Mangel.

**Werkzeug:** Shell-Skript mit `grep` und `wc` – automatisch in der CI/CD-Pipeline

---

### Metrik 3: Software Maturity Index (SMI)

**Kategorie:** Codequalität → Wartbarkeit (Vorlesungsfolien S. 6)

**Zielsetzung:**  
Der SMI misst die Reife und Stabilität eines Software-Releases. Er zeigt, wie viel des Codes sich gegenüber dem letzten Stand verändert hat. Ein SMI nahe 1,0 bedeutet stabiler, reifer Code.

**Berechnung:**  
```
SMI = (Mt − Fc − Fa − Fd) / Mt
```
| Variable | Bedeutung |
|---|---|
| `Mt` | Anzahl Java-Source-Dateien im aktuellen Release |
| `Fc` | Anzahl geänderter Dateien seit letztem Release |
| `Fa` | Anzahl neu hinzugefügter Dateien |
| `Fd` | Anzahl gelöschter Dateien |

**Richtwerte:**
| SMI | Bewertung |
|-----|-----------|
| > 0,95 | Reif, stabil |
| 0,85–0,95 | Akzeptabel |
| < 0,85 | Viele Änderungen – in aktiver Entwicklung normal |

**Berechnung am DualNet-Beispiel (Woche 16 → Woche 17):**

- `Mt` = 30 Java-Dateien (Hauptquellcode)
- `Fc` = 3 geänderte Dateien (pom.xml, CI-Workflow, application-test.properties)
- `Fa` = 7 neue Testdateien (AuthControllerTest, PostControllerTest, JwtUtilTest, …)
- `Fd` = 0 gelöschte Dateien

```
SMI_gesamt  = (30 − 3 − 7 − 0) / 30 = 20/30 ≈ 0,67
SMI_prod    = (30 − 3 − 0 − 0) / 30 = 27/30 = 0,90  ← nur Produktivcode
```

Der niedrige Gesamt-SMI von 0,67 ist erklärbar: Die 7 neuen Testdateien verbessern die Qualität, senken aber rechnerisch den SMI – eine bekannte Schwäche der Metrik, da sie nicht zwischen Produktiv- und Testcode unterscheidet. Für den Produktivcode allein ist der SMI mit 0,90 akzeptabel. Eine Änderung am Code ist daher nicht erforderlich.

**Werkzeug:** Git-Befehle (`git diff --name-status`) – automatisch in der CI/CD-Pipeline

---

## Aufgabe 1b – CI/CD-Konfiguration für Metriken

Alle drei Metriken werden automatisch in der CI/CD-Pipeline erzeugt und im GitHub Actions Log ausgegeben.

**Änderungen:**
- `backend/pom.xml` → `maven-pmd-plugin` mit `design.xml`-Regelwerk für CC-Analyse hinzugefügt
- `.github/workflows/backend-ci.yml` → drei neue Steps nach `mvn verify`:
  1. **Metrik 1:** PMD-Report parsen und CC-Verletzungen ausgeben
  2. **Metrik 2:** Kommentarzeilen mit `grep` + `wc` zählen, Prozentsatz berechnen
  3. **Metrik 3:** SMI via `git diff --name-status` berechnen und bewerten

Die Metriken erscheinen bei jedem Push direkt im Build-Log und sind damit für das gesamte Team sichtbar.
