# Refactoring-Zusammenfassung – Clean Code


---

## 1. Ausgangslage

Im Rahmen von Aufgabenblatt 14 wurde der Backend-Quellcode des DualNet-Projekts auf Basis der Clean Code Prinzipien aus der Vorlesung refaktorisiert.

> Refactoring (Refaktorisierung) bezeichnet die Überarbeitung von Quelltexten unter Beibehaltung des beobachtbaren Programmverhaltens. Ziel ist es, Lesbarkeit, Verständlichkeit, Wartbarkeit und Erweiterbarkeit zu verbessern – damit der Aufwand für Fehleranalyse und funktionale Erweiterungen sinkt.

Die in der Vorlesung behandelten Themen waren:
**Aussagekräftige Namen**, **Funktionen**, **Kommentare**, **Formatierung**, **Fehlerbehandlung**, **Unit-Tests**, **Emergenz**, **Code Smells**.
Zusätzlich wurden Prinzipien aus dem clean-code-developer-Wertesystem angewendet: **DRY**, **SRP**, **IOSP**, **SLA**, **Boy Scout Rule**.

---

## 2. Identifizierte Code Smells

Vor dem Refactoring wurden im Backend folgende Probleme gefunden:

### Smell 1 – Schwach typisierte Rückgabewerte (`Map<String, Object>`)
Die Services gaben `Map<String, Object>` an die Controller zurück. Beispiel aus dem Original:

```java
// PostService.enrichPost (vorher)
return Map.of(
    "id", post.getId(),
    "content", post.getContent(),
    "imageUrl", post.getImageUrl() != null ? post.getImageUrl() : "",
    "authorId", post.getAuthorId(),
    "authorUsername", authorUsername,
    "likeCount", post.getLikes().size(),
    ...
);
```

Probleme:
- Magische Strings ("authorId", "content", …) – Tippfehler werden erst zur Laufzeit bemerkt
- Keine Compile-Zeit-Sicherheit für API-Felder
- Verletzung **SRP**: Der Service macht Geschäftslogik UND Datenformatierung

### Smell 2 – Duplizierung der „Anreicherungs"-Logik (DRY-Verletzung)
`PostService.enrichPost()` und `CommentService.enrichComment()` enthielten beide nahezu identische Logik: „Lade Autor anhand `authorId`, nimm seinen Username, fall through auf 'Unbekannt'".

### Smell 3 – Gebrochene Kapselung (package-private Methode)
`PostService.enrichPost()` war bewusst package-private (kein modifier), damit `UserService` darauf zugreifen konnte:

```java
// PostService.java (vorher) – schlechtes Zeichen!
// package-private damit UserService diese Methode nutzen kann
Map<String, Object> enrichPost(Post post) { ... }
```

Wenn man Sichtbarkeit absenken muss, damit eine andere Klasse zugreifen kann, ist das ein deutliches Signal, dass die Methode am falschen Ort liegt.

### Smell 4 – IOSP-Verletzung in `UserService.followUser()`
Die Methode mischte **Integration** (Aufrufe an Repository/eigene Helper) und **Operation** (Listen-Manipulation, Geschäftsregel-Prüfung) auf einer Methodenebene:

```java
// UserService.followUser (vorher)
public void followUser(String targetUsername, String currentUserId) {
    User target = findUserOrThrow(targetUsername);                              // Integration
    User currentUser = userRepository.findById(currentUserId).orElseThrow(...); // Integration
    if (target.getId().equals(currentUserId)) { throw ... }                     // Operation (Regel)
    if (!target.getFollowers().contains(currentUserId)) {                       // Operation (Logik)
        target.getFollowers().add(currentUserId);                               // Operation
        currentUser.getFollowing().add(target.getId());                         // Operation
        userRepository.save(target);                                            // Integration
        userRepository.save(currentUser);                                       // Integration
    }
}
```

Das ist außerdem eine **SLA-Verletzung** (Single Level of Abstraction): Hochlevel-Aufrufe und Low-Level-Listenoperationen in derselben Methode.

### Smell 5 – Funktion mit zu vielen Aufgaben (`JwtFilter.doFilterInternal`)
Eine Methode erledigte: Header lesen, „Bearer "-Präfix entfernen, Token validieren, User aus DB laden, Authentication-Objekt bauen, in `SecurityContext` setzen, Magic String "Bearer " ohne Konstante. Verletzt **SRP** und **SLA**.

### Smell 6 – Toter Code
`CommentService.deleteComment()` existierte, wurde aber von keinem Controller-Endpunkt aufgerufen. Klassisches Code-Smell aus den Folien („Funktionen die nie aufgerufen werden").

### Smell 7 – Tippfehler & Formatierung
- Kommentar in `JwtUtil`: „Hilfklasse" statt „Hilfsklasse"
- `Comment.java`: zwei überflüssige Leerzeilen am Dateiende

---

## 3. Durchgeführte Refaktorisierungen

### Refactoring 1 – Response DTOs einführen
**Adressiert:** Smell 1 | **Prinzip:** SRP, Type Safety, „Ausdrucksstarker Code" (Emergenz)

Drei neue DTOs unter `com.dualnet.dto` ersetzen die `Map<String, Object>`:

| DTO | Zweck |
|-----|-------|
| `PostResponse` | Post + Autor-Username + Like-Anzahl |
| `CommentResponse` | Kommentar + Autor-Username |
| `UserProfileResponse` | Profilinfos ohne Passwort-Hash |

Vorteile: Compile-Zeit-Sicherheit, keine Magic Strings, klare API-Schnittstelle. Das JSON-Format bleibt identisch (Lombok `@Data` serialisiert die Felder mit denselben Namen wie die Map-Keys), daher ist die Frontend-API unverändert.

### Refactoring 2 – Mapper-Klassen extrahieren
**Adressiert:** Smell 2 + 3 | **Prinzip:** DRY, SRP

Neues Paket `com.dualnet.service.mapper` mit drei Mappern:

```java
@Component
public class PostMapper {
    public PostResponse toResponse(Post post, User author) { ... }
}
```

Die zentrale „Lade Autor und nimm Username, sonst 'Unbekannt'"-Logik existiert nun nur noch in den Mappern – nicht mehr verteilt in zwei Services. Außerdem entfällt die package-private Hintertür: `UserService` ruft jetzt eine saubere öffentliche Methode `postService.getPostsByAuthor(authorId)` auf, die intern den `PostMapper` nutzt.

### Refactoring 3 – IOSP in `UserService` anwenden
**Adressiert:** Smell 4 | **Prinzip:** IOSP, SLA

`followUser()` und `unfollowUser()` wurden in **Integration** (öffentliche Methoden, die nur andere Methoden aufrufen) und **Operation** (private Methoden mit der eigentlichen Logik) zerlegt:

```java
// Integration – ruft nur andere Methoden, keine Logik
public void followUser(String targetUsername, String currentUserId) {
    User target = findUserByUsernameOrThrow(targetUsername);
    User currentUser = findUserByIdOrThrow(currentUserId);
    ensureNotSelfFollow(target.getId(), currentUserId);
    addFollowRelationship(target, currentUser);
    persistBoth(target, currentUser);
}

// Operation – reine Listen-Manipulation
private void addFollowRelationship(User target, User currentUser) {
    if (target.getFollowers().contains(currentUser.getId())) return;
    target.getFollowers().add(currentUser.getId());
    currentUser.getFollowing().add(target.getId());
}
```

Jede Methode arbeitet jetzt auf genau einer Abstraktionsebene und hat genau eine Aufgabe.

### Refactoring 4 – `JwtFilter` zerlegen
**Adressiert:** Smell 5 | **Prinzip:** SRP, SLA, „Eine Funktion sollte klein sein"

Aufteilung in drei klare Methoden:

| Methode | Aufgabe |
|---------|---------|
| `doFilterInternal` | Orchestriert (Integration) |
| `extractBearerToken` | Liest und säubert den Header |
| `authenticateUser` | Setzt Spring-Security-Context |

Magic String "Bearer " als private Konstante `BEARER_PREFIX` extrahiert.

### Refactoring 5 – Toten Code entfernen
**Adressiert:** Smell 6 | **Prinzip:** Code Smell „Funktionen die nie aufgerufen werden"

`CommentService.deleteComment()` ersatzlos gestrichen. Sollte die Funktion später benötigt werden, kann sie sauber neu implementiert werden – mit eigenem Controller-Endpunkt und Test.

### Refactoring 6 – Boy Scout Rule
**Adressiert:** Smell 7 | **Prinzip:** „Hinterlasse den Code besser als du ihn vorgefunden hast"

- Tippfehler „Hilfklasse" → „Hilfsklasse" in `JwtUtil`
- Überflüssige Leerzeilen am Dateiende von `Comment.java` entfernt
- Konsistente JavaDoc-Kommentare an den neuen/geänderten Methoden

---

## 4. Beibehaltung des beobachtbaren Verhaltens

Alle Refaktorisierungen wurden so durchgeführt, dass das **beobachtbare Programmverhalten unverändert** bleibt:

- Die HTTP-Endpunkte liefern dieselben JSON-Felder mit denselben Namen zurück (DTOs serialisieren identisch zu den vorherigen Maps)
- Das Frontend funktioniert ohne jede Änderung weiter (kein Code im `frontend/`-Ordner musste angefasst werden)
- Die Datenbankstruktur in MongoDB bleibt unverändert
- Alle Validierungen, Fehlercodes und Statuscodes sind identisch

Das ist genau der Kerngedanke von Refactoring laut Aufgabenblatt: Verbesserung der internen Qualität ohne Änderung des äußeren Verhaltens.

---

## 5. Vorher / Nachher – Beispiel `PostService`

**Vorher** (Mischung aus Logik und Datenformatierung):
```java
public Map<String, Object> likePost(String postId, String currentUserId) {
    Post post = findPostOrThrow(postId);
    if (!post.getLikes().contains(currentUserId)) {
        post.getLikes().add(currentUserId);
        postRepository.save(post);
    }
    return enrichPost(post);
}

Map<String, Object> enrichPost(Post post) {  // package-private!
    User author = userRepository.findById(post.getAuthorId()).orElse(null);
    String authorUsername = author != null ? author.getUsername() : "Unbekannt";
    return Map.of("id", post.getId(), /* ...8 weitere Magic Strings... */);
}
```

**Nachher** (klare Trennung, Type Safety):
```java
public PostResponse likePost(String postId, String currentUserId) {
    Post post = findPostOrThrow(postId);
    addLikeIfMissing(post, currentUserId);
    Post savedPost = postRepository.save(post);
    return toResponseWithAuthor(savedPost);
}

private void addLikeIfMissing(Post post, String userId) {
    if (!post.getLikes().contains(userId)) {
        post.getLikes().add(userId);
    }
}

private PostResponse toResponseWithAuthor(Post post) {
    User author = userRepository.findById(post.getAuthorId()).orElse(null);
    return postMapper.toResponse(post, author);
}
```

`likePost` ist nun eine **Integration**: Sie ruft drei klar benannte Methoden auf einer Abstraktionsebene auf. Die Operationen (`addLikeIfMissing`, `toResponseWithAuthor`) sind kurz und tun jeweils genau eine Sache.

---

## 6. Aufgewandte Stunden

| Person | Tätigkeit | Disziplin | Phase | h |
|--------|-----------|-----------|-------|---|
| Backend-Lead | Code-Smell-Analyse | Analyse & Design | Implementierung | 1.0 |
| Backend-Lead | DTOs + Mapper anlegen | Implementierung | Implementierung | 2.5 |
| Backend-Lead | UserService IOSP | Implementierung | Implementierung | 1.5 |
| Backend-Lead | JwtFilter zerlegen | Implementierung | Implementierung | 0.5 |
| Backend-Lead | Boy Scout Aufräumen | Implementierung | Implementierung | 0.5 |
| Doku-Lead | Refactoring-Zusammenfassung | Doku | Implementierung | 1.0 |
| **Gesamt** | | | | **7.0** |

Stunden wurden im Scrum-Board mit Phase „Implementierung" und passender Disziplin eingetragen.

---

## 7. Fazit

Das Refactoring hat die Wartbarkeit deutlich verbessert: Wo vorher generische Maps mit magischen String-Schlüsseln genutzt wurden, gibt es jetzt typsichere DTOs. Doppelte Logik ist in zentralen Mappern zusammengefasst. Komplexe Methoden sind in kleinere, klar benannte Methoden auf einer Abstraktionsebene aufgeteilt.

Der wichtigste Punkt: Das Frontend musste nicht angefasst werden. Damit zeigt das Refactoring praktisch, was die Vorlesung theoretisch sagt – sauberer Code ist eine Investition in die Zukunft, ohne dass die Gegenwart darunter leidet.

> Bezug zur Vorlesung: Die Refaktorisierungen adressieren konkret die Folien-Themen *Funktionen* (klein, eine Aufgabe, eine Abstraktionsebene), *Aussagekräftige Namen* (z.B. `addFollowRelationship` statt verschachtelte Listen-Operationen), *Code Smells* (toter Code, Duplizierung) sowie aus dem clean-code-developer-Set die Prinzipien **DRY**, **SRP**, **IOSP**, **SLA** und die Praktik **Boy Scout Rule**.
