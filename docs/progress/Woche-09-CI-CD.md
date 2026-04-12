# Woche 9 – CI/CD Pipeline
**Aufgabenblatt:** AB09 | **Datum:** KW 48, Dezember 2025 | **Blog-Deadline:** 02.12.2025 20:00 Uhr

---

## Was wurde gemacht?

### CI/CD Plattform: GitHub Actions

**Entscheidung:** GitHub Actions, weil:
- Kostenlos für öffentliche Repositories
- Direkt in GitHub integriert (kein externes Tool nötig)
- YAML-Konfiguration ist einfach zu verstehen
- Große Community und viele fertige Actions

### Frontend CI/CD Pipeline

**Datei:** [../../.github/workflows/frontend-ci.yml](../../.github/workflows/frontend-ci.yml)

```yaml
name: Frontend CI
on:
  push:
    branches: [ "main", "develop" ]
    paths: ['frontend/**']

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '20' }
      - run: npm ci          # reproducible install
      - run: npm run build   # TypeScript + Vite bundle
```

**Was passiert beim Push:**
1. GitHub startet automatisch eine Ubuntu-VM
2. Node.js 20 wird installiert
3. `npm ci` installiert alle Abhängigkeiten (reproducible)
4. `tsc && vite build` kompiliert TypeScript und bündelt den Code
5. Build-Artefakt (`dist/`) wird 7 Tage gespeichert

### Backend CI/CD Pipeline

**Datei:** [../../.github/workflows/backend-ci.yml](../../.github/workflows/backend-ci.yml)

```yaml
name: Backend CI
on:
  push:
    branches: [ "main", "develop" ]
    paths: ['backend/**']

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-java@v4
        with: { java-version: '21', distribution: 'temurin' }
      - uses: actions/cache@v4   # Maven-Cache für schnellere Builds
        with:
          path: ~/.m2
          key: ${{ runner.os }}-m2-${{ hashFiles('**/pom.xml') }}
      - run: mvn clean package -DskipTests
```

**Was passiert beim Push:**
1. GitHub startet Ubuntu-VM
2. Java 21 (Temurin/OpenJDK) wird installiert
3. Maven-Cache wird geladen (spart Download-Zeit)
4. `mvn clean package -DskipTests` kompiliert und erstellt JAR
5. JAR-Datei wird als Artefakt 7 Tage gespeichert

**Warum `-DskipTests`?** Tests sind noch nicht implementiert (folgt im nächsten Semester laut AB09).

### Vorteile des CI/CD Systems

1. **Automatische Validierung:** Jeder Push triggert einen Build → Kompilierungsfehler sofort sichtbar
2. **Team-Safety:** Kaputte Commits werden sofort erkannt (nicht erst beim nächsten Deployment)
3. **Reproduzierbarkeit:** `npm ci` + Maven-Cache = identische Builds auf jedem Rechner
4. **Artefakt-Speicherung:** Gebaute JARs und dist-Ordner können direkt heruntergeladen werden

### Pipelines im Einsatz

```
git push origin develop
→ GitHub Actions startet
  → frontend-ci.yml: npm ci + npm run build ✅
  → backend-ci.yml: mvn clean package ✅
→ Build-Status in GitHub sichtbar (grüner Haken)
```

---

## Gelernt

- GitHub Actions Workflow-Syntax (on/jobs/steps)
- `npm ci` vs `npm install`: ci ist reproducible und schneller in CI-Umgebungen
- Maven-Cache in GitHub Actions: spart 1-2 Minuten pro Build
- `paths`-Filter: Pipeline läuft nur wenn relevante Dateien geändert wurden

---

## Offene Punkte für nächste Woche
- [ ] Halbzeitpräsentation vorbereiten
- [ ] Statistiken aus Scrum-Board auswerten
- [ ] SRS und arc42 für Abgabe vorbereiten
