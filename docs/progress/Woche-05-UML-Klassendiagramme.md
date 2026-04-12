# Woche 5 – UML Klassendiagramme
**Aufgabenblatt:** AB05 | **Datum:** KW 44, November 2025 | **Blog-Deadline:** 04.11.2025 20:00 Uhr

---

## Was wurde gemacht?

### CRC-Karten Brainstorming

Wir haben zuerst mit CRC-Karten (Class-Responsibility-Collaborator) gearbeitet:

**Schritt 1: Alle Substantive aus den Anforderungen**
Nutzer, Beitrag (Post), Kommentar, Like, Profil, Feed, Token, Passwort, Follower, Benachrichtigung

**Schritt 2: Klassen identifizieren**
- `User` – hat Informationen, mehrere Attribute, ist essentiell
- `Post` – hat Informationen (Inhalt, Likes), mehrere Attribute
- `Comment` – hat Informationen, gehört zu einem Post

**Schritt 3: Verantwortlichkeiten**
- `User`: Kennt seine Follower/Following-Listen; Kennt seine eigenen Posts (über ID)
- `Post`: Kennt seinen Autor (AuthorId); Kennt seine Likes (Liste von User-IDs)
- `Comment`: Kennt seinen Post (PostId); Kennt seinen Autor (AuthorId)

### Klassendiagramm erstellt

Datei: [../uml/class-diagram.drawio](../uml/class-diagram.drawio)

Das Diagramm zeigt 3 Schichten:
1. **Model-Klassen** (Datenbankdokumente): User, Post, Comment
2. **Repository-Interfaces** (Spring Data): UserRepository, PostRepository, CommentRepository
3. **Service-Klassen** (Geschäftslogik): AuthService, PostService, UserService

**Beziehungen:**
- UserRepository verwaltet → User (1:n)
- PostRepository verwaltet → Post (1:n)
- CommentRepository verwaltet → Comment (1:n)
- PostService nutzt → PostRepository, UserRepository
- UserService nutzt → UserRepository, PostRepository, PostService

### Klassen in Spring Boot implementiert

Die Model-Klassen wurden direkt im Code umgesetzt:

```java
// Beispiel: User.java
@Document(collection = "users")
public class User {
    @Id private String id;
    @Indexed(unique = true) private String username;
    @Indexed(unique = true) private String email;
    private String passwordHash;
    private String bio;
    private List<String> following = new ArrayList<>();
    private List<String> followers = new ArrayList<>();
    private LocalDateTime createdAt = LocalDateTime.now();
}
```

### SOLID-Prinzip: Single Responsibility Principle (SRP)

**Angewendetes Prinzip:** Single Responsibility Principle (SRP)

> *"A class should have only one reason to change."* – Robert C. Martin

**Umsetzung in DualNet:**

| Klasse | Einzige Verantwortung |
|--------|----------------------|
| `User.java` | Repräsentiert Nutzerdaten in der Datenbank |
| `UserRepository.java` | Datenbankabfragen für User-Dokumente |
| `AuthService.java` | Logik für Registrierung und Login |
| `UserService.java` | Logik für Profile und Follow-Funktionen |
| `UserController.java` | HTTP-Anfragen entgegennehmen und weiterleiten |
| `JwtUtil.java` | JWT-Tokens erstellen und validieren |
| `JwtFilter.java` | JWT aus HTTP-Header lesen und Security Context setzen |

**Warum SRP?**
- Wenn die JWT-Logik sich ändert, wird nur `JwtUtil` angepasst
- Wenn das Datenbankschema sich ändert, wird nur das Model angepasst
- Jede Klasse ist einfacher zu testen (isoliert)

---

## Qualitätsprüfung

- [x] Klassendiagramm logisch konsistent?
- [x] Ändert sich eine Klasse, erfordert das Änderungen in anderen? → Nein (durch SRP vermieden)
- [x] Kann eine Klasse intern geändert werden ohne ihre Schnittstelle zu ändern? → Ja
- [x] Haben alle Methoden einer Klasse nur eine Abstraktion? → Ja
- [x] Sind Namenskonventionen konsistent? → Java: camelCase, PascalCase

---

## Gelernt

- CRC-Karten sind ein einfaches aber effektives Brainstorming-Tool
- SRP ist das fundamentalste SOLID-Prinzip
- Spring Data MongoDB generiert Repository-Methoden aus Methodennamen → weniger Code
- Lombok (`@Data`, `@RequiredArgsConstructor`) reduziert Boilerplate erheblich

---

## Offene Punkte für nächste Woche
- [ ] Erste lauffähige Demo implementieren
- [ ] Authentifizierung (Register + Login) fertigstellen
- [ ] Frontend-Backend-Verbindung testen
