# Woche 17 – Blog 14: Software-Metriken

## Aufgabe 1a – Drei gewählte Metriken

Zusätzlich zu den Softwaretestmetriken (Code Coverage, Anzahl Testfälle) messen wir für DualNet die folgenden drei Metriken aus den Vorlesungsfolien (Folie 6):

---

### Metrik 1: Zyklomatische Komplexität (Cyclomatic Complexity, CC)

**Kategorie:** Codequalität → Komplexität (Vorlesungsfolien S. 6)

**Zielsetzung:**  
Die zyklomatische Komplexität misst die Anzahl linear unabhängiger Pfade durch eine Methode. Sie zeigt, wie schwer eine Methode zu testen und zu verstehen ist. Je höher der Wert, desto mehr Testfälle sind nötig, um alle Verzweigungen abzudecken.

**Berechnung:**  
`CC = Anzahl der Entscheidungspunkte + 1`

Entscheidungspunkte sind: `if`, `else if`, `while`, `for`, `case`, `catch`, `&&`, `||`, ternärer Operator.

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
// Entscheidungspunkt: 1x if → CC = 2
private void addLikeIfMissing(Post post, String userId) {
    if (!post.getLikes().contains(userId)) {   // +1 Entscheidungspunkt
        post.getLikes().add(userId);
    }
}
```

```java
// UserService.java – addFollowRelationship()
// Entscheidungspunkte: 1x if → CC = 2
private void addFollowRelationship(User target, User currentUser) {
    if (target.getFollowers().contains(currentUser.getId())) {  // +1 Entscheidungspunkt
        return;
    }
    target.getFollowers().add(currentUser.getId());
    currentUser.getFollowing().add(target.getId());
}
```

```java
// UserService.java – ensureNotSelfFollow()
// Entscheidungspunkte: 1x if → CC = 2
private void ensureNotSelfFollow(String targetId, String currentUserId) {
    if (targetId.equals(currentUserId)) {   // +1 Entscheidungspunkt
        throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "...");
    }
}
```

**Öffentliche Integrationsmethoden haben CC = 1**, da sie keine eigene Verzweigungslogik enthalten – das ist eine bewusste Designentscheidung (IOSP-Prinzip). Diese scheinbar „schlechte" Metrik (CC = 1 bedeutet nicht automatisch, dass die Methode trivial ist) erfordert daher keine Änderung:

```java
// PostService.java – likePost()
// CC = 1 (keine Verzweigung), trotzdem wichtige Integrationsmethode
public PostResponse likePost(String postId, String currentUserId) {
    Post post = findPostOrThrow(postId);
    addLikeIfMissing(post, currentUserId);
    Post savedPost = postRepository.save(post);
    return toResponseWithAuthor(savedPost);
}
```

**Werkzeug:** PMD über `maven-pmd-plugin` – automatisch in der CI/CD-Pipeline (siehe 1b)

---

### Metrik 2: Prozent interne Kommentare

**Kategorie:** Codequalität → Unverständlichkeit (Vorlesungsfolien S. 6)

**Zielsetzung:**  
Diese Metrik misst, wie gut der Code dokumentiert ist. Ein zu niedriger Wert deutet auf schlechte Lesbarkeit hin. Ein zu hoher Wert kann auf übermäßig komplexen Code hindeuten, der viele Erklärungen braucht.

**Berechnung:**  
`Kommentaranteil = (Anzahl Kommentarzeilen / Gesamtzeilen) × 100`

**Richtwert:** 10–30 % sind angemessen für professionellen Code.

**Berechnung am DualNet-Beispiel (PostService.java):**

```
Gesamtzeilen: 95
Kommentarzeilen (Zeilen die mit // oder /* beginnen): ca. 14
→ Kommentaranteil = 14/95 × 100 ≈ 14,7 %
```

Dies liegt im guten Bereich. Die Kommentare erläutern dabei bewusst das Design (z.B. IOSP-Refactoring) und nicht triviale Implementierungsdetails:

```java
// Liefert alle Posts für den Feed (neueste zuerst)
public List<PostResponse> getFeed() { ... }

// ===== Private Operationen (jeweils eine Aufgabe, eine Abstraktionsebene) =====

// Fügt einen Like hinzu (idempotent – mehrfaches Liken ändert nichts)
public PostResponse likePost(String postId, String currentUserId) { ... }
```

**Hinweis:** Methodennamen wie `findPostOrThrow()` oder `ensureNotSelfFollow()` sind bewusst so benannt, dass sie keinen Kommentar benötigen. Dort ist der Kommentaranteil 0 – das ist kein Mangel, sondern gutes Design (selbsterklärender Code).

**Werkzeug:** Shell-Skript in der CI/CD-Pipeline – zählt Kommentarzeilen mit `grep` (siehe 1b)

---

### Metrik 3: Software Maturity Index (SMI)

**Kategorie:** Codequalität → Wartbarkeit (Vorlesungsfolien S. 6)

**Zielsetzung:**  
Der SMI misst die Reife und Stabilität einer Software-Version. Er zeigt, wie viel des Codes verändert wurde – viele Änderungen deuten auf instabilen oder unreifen Code hin. Ein SMI nahe 1.0 ist ideal.

**Berechnung:**  
```
SMI = (Mt - Fc - Fa - Fd) / Mt
```
- `Mt` = Anzahl der Java-Source-Dateien im aktuellen Release  
- `Fc` = Anzahl geänderter Dateien seit letztem Release  
- `Fa` = Anzahl neu hinzugefügter Dateien  
- `Fd` = Anzahl gelöschter Dateien  

**Richtwerte:**
| SMI | Bewertung |
|-----|-----------|
| > 0,95 | Reif, stabil |
| 0,85–0,95 | Akzeptabel |
| < 0,85 | Unreif, viele Änderungen |

**Berechnung am DualNet-Beispiel (Woche 16 → Woche 17):**

In der letzten Sprint-Phase wurden im Backend folgende Änderungen vorgenommen:
- `Mt` = 30 Java-Source-Dateien (Hauptquellcode)
- `Fc` = 3 Dateien geändert (pom.xml, CI-Konfiguration, application-test.properties)
- `Fa` = 7 neue Testdateien (AuthControllerTest, PostControllerTest, etc.)
- `Fd` = 0 Dateien gelöscht

```
SMI = (30 - 3 - 7 - 0) / 30 = 20/30 ≈ 0,67
```

Dieser Wert erscheint niedrig, ist aber im Kontext erklärbar: Die vielen neu hinzugefügten Testdateien senken den SMI rechnerisch, obwohl sie die Softwarequalität verbessern. Das zeigt eine bekannte Schwäche des SMI – er unterscheidet nicht zwischen produktivem und Test-Code. Für den Produktivcode allein (ohne Tests) wäre:

```
SMI_prod = (30 - 3 - 0 - 0) / 30 = 27/30 = 0,90  → akzeptabel
```

**Werkzeug:** Git-Befehle (`git diff --name-status`) in der CI/CD-Pipeline (siehe 1b)

---

## Aufgabe 1b – CI/CD-Konfiguration für Metriken

Alle drei Metriken werden automatisch in der CI/CD-Pipeline erzeugt und ausgegeben.

**Backend (GitHub Actions + Maven):**
- Zyklomatische Komplexität → PMD-Plugin (`maven-pmd-plugin`)
- Prozent interne Kommentare → Shell-Skript mit `grep` und `wc`
- Software Maturity Index → Git-Befehle

**Ergebnis:** Die Metriken erscheinen direkt im GitHub Actions Log jedes Builds und sind somit bei jedem Push sichtbar.

→ Siehe geänderte Dateien: `backend/pom.xml`, `.github/workflows/backend-ci.yml`
