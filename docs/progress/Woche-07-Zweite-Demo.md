# Woche 7 – Zweite lauffähige Demo
**Aufgabenblatt:** AB07 | **Datum:** KW 46, November 2025 | **Blog-Deadline:** 18.11.2025 20:00 Uhr

---

## Was wurde gemacht?

### Demo: Posts erstellen und Feed anzeigen

Die zweite Demo erweitert die erste um die Kern-Funktionalität der Social-Media-Plattform:

**Neu implementierte Features:**
- ✅ `POST /api/posts` – Post erstellen (JWT erforderlich)
- ✅ `GET /api/posts` – Feed laden (öffentlich)
- ✅ `POST /api/posts/{id}/like` – Post liken
- ✅ `DELETE /api/posts/{id}/like` – Like entfernen
- ✅ `GET /api/posts/{id}/comments` – Kommentare laden
- ✅ `POST /api/posts/{id}/comments` – Kommentar schreiben
- ✅ FeedPage (React) – zeigt alle Posts
- ✅ PostCard-Komponente – zeigt einzelnen Post mit Likes und Kommentaren
- ✅ CreatePostPage – Formular zum Post-Erstellen
- ✅ CommentSection-Komponente

### Was ist neu gegenüber Demo 1?

| Demo 1 | Demo 2 (Erweiterung) |
|--------|---------------------|
| Login + Registrierung | + Posts erstellen, liken, kommentieren |
| JWT-Authentifizierung | + Öffentliche API-Endpunkte (Feed ohne Login) |
| Navbar vorhanden | + Links zu Feed und Post-Erstellen |
| – | + Zeichenzähler (500 max. beim Post) |

### Technische Details

**Post-Enrichment:**
```
// Backend gibt Post mit Autorendaten an (kein Extra-JOIN nötig)
{
  "id": "...",
  "content": "Hallo Welt!",
  "authorId": "...",
  "authorUsername": "max",     ← wird beim Laden hinzugefügt
  "likeCount": 3,
  "likes": ["userId1", ...],
  "createdAt": "2025-11-10T14:30:00"
}
```

**Like-System (optimistisch):**
```typescript
// Frontend aktualisiert Anzeige sofort, ohne auf Server zu warten
const handleLike = async () => {
  const updatedPost = isLiked
    ? await unlikePost(post.id)
    : await likePost(post.id)
  onUpdate?.(updatedPost) // Elternkomponente aktualisiert
}
```

### Hürden und Lösungen

| Problem | Lösung |
|---------|--------|
| Post-Rückgabe enthält keine Autorendaten | `enrichPost()`-Methode in PostService lädt Autor nach |
| CommentController und PostController beide auf `/api/posts` | Spring Boot kann das durch verschiedene Pfade trennen |
| Like doppelt klicken möglich während API lädt | `liking`-State verhindert Doppelklick |

### Screenshot
_(Screenshots von Feed und Post-Erstellen-Seite hier einfügen)_

---

## Beiträge im Team

| Person | Beitrag |
|--------|---------|
| _(Teammitglied 1)_ | PostService, PostController, CommentService |
| _(Teammitglied 2)_ | FeedPage, PostCard, CommentSection, CreatePostPage |
| _(Teammitglied 3)_ | PostRepository, CommentRepository, Dokumentation |
| _(Teammitglied 4)_ | API-Tests mit Postman, Bug-Fixes |

---

## Gelernt

- `enrichPost()` ist eine typische Aufgabe in Social-Media-Backends (Posts mit Nutzerdaten anreichern)
- Optimistische UI-Updates verbessern die gefühlte Performance
- Spring `@AuthenticationPrincipal` ist ein eleganter Weg, den eingeloggten Nutzer zu injizieren

---

## Offene Punkte für nächste Woche
- [ ] Architektonische Anforderungen analysieren (Quality Scenarios)
- [ ] Architecture Decision Records verfeinern
