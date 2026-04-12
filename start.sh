#!/bin/bash
# =============================================================
# DualNetworking – Start-Script
# Startet MongoDB, Backend und Frontend mit einem Befehl.
# Verwendung: ./start.sh
# =============================================================

# Farben für die Ausgabe (damit man sieht was passiert)
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
BOLD='\033[1m'
NC='\033[0m' # No Color (zurücksetzen)

# Verzeichnis des Scripts ermitteln (damit das Script von überall ausführbar ist)
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo ""
echo -e "${BLUE}${BOLD}======================================${NC}"
echo -e "${BLUE}${BOLD}   DualNetworking – Start-Script      ${NC}"
echo -e "${BLUE}${BOLD}======================================${NC}"
echo ""

# -------------------------------------------------------
# Funktion: Prüft ob ein Befehl vorhanden ist
# -------------------------------------------------------
check_command() {
    if ! command -v "$1" &> /dev/null; then
        echo -e "${RED}❌ '$1' ist nicht installiert oder nicht im PATH.${NC}"
        echo -e "   Bitte installiere es und versuche es erneut."
        exit 1
    fi
}

# -------------------------------------------------------
# Voraussetzungen prüfen
# -------------------------------------------------------
echo -e "${YELLOW}🔍 Voraussetzungen prüfen...${NC}"

check_command "docker"
check_command "docker-compose"
check_command "mvn"
check_command "node"
check_command "npm"

echo -e "${GREEN}✅ Alle Voraussetzungen erfüllt.${NC}"
echo ""

# -------------------------------------------------------
# Schritt 1: MongoDB starten (via Docker)
# -------------------------------------------------------
echo -e "${YELLOW}🗄️  Schritt 1: MongoDB starten...${NC}"

cd "$SCRIPT_DIR"

# Prüfen ob Docker läuft
if ! docker info &> /dev/null; then
    echo -e "${RED}❌ Docker läuft nicht. Bitte Docker Desktop starten.${NC}"
    exit 1
fi

# MongoDB Container starten (falls noch nicht laufend)
if docker ps | grep -q "dualnet-mongodb"; then
    echo -e "${GREEN}✅ MongoDB läuft bereits.${NC}"
else
    docker-compose up -d
    echo -e "${GREEN}✅ MongoDB gestartet (Port 27017).${NC}"
    # Kurz warten damit MongoDB hochfahren kann
    sleep 2
fi

echo ""

# -------------------------------------------------------
# Schritt 2: Backend starten (Spring Boot)
# -------------------------------------------------------
echo -e "${YELLOW}☕ Schritt 2: Backend starten (Spring Boot)...${NC}"
echo -e "   Port: ${BOLD}8080${NC}"

cd "$SCRIPT_DIR/backend"

# Backend im Hintergrund starten und Logs in Datei schreiben
mvn spring-boot:run > "$SCRIPT_DIR/backend.log" 2>&1 &
BACKEND_PID=$!

echo -e "${GREEN}✅ Backend gestartet (PID: $BACKEND_PID)${NC}"
echo -e "   Logs: ${SCRIPT_DIR}/backend.log"

# Warten bis Backend erreichbar ist (max. 30 Sekunden)
echo -e "   Warte auf Backend..."
for i in {1..30}; do
    if curl -s "http://localhost:8080/api/auth/login" -X POST \
       -H "Content-Type: application/json" \
       -d '{}' > /dev/null 2>&1; then
        echo -e "${GREEN}✅ Backend ist bereit!${NC}"
        break
    fi
    # Auch akzeptieren wenn wir einen 400/401/422 bekommen (Backend läuft, lehnt nur ab)
    HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "http://localhost:8080/api/auth/login" \
                -X POST -H "Content-Type: application/json" -d '{}' 2>/dev/null)
    if [[ "$HTTP_CODE" -ge 400 ]] && [[ "$HTTP_CODE" -lt 500 ]]; then
        echo -e "${GREEN}✅ Backend ist bereit! (HTTP $HTTP_CODE)${NC}"
        break
    fi
    if [ $i -eq 30 ]; then
        echo -e "${YELLOW}⚠️  Backend braucht länger. Logs prüfen: cat backend.log${NC}"
    fi
    sleep 1
    printf "."
done

echo ""

# -------------------------------------------------------
# Schritt 3: Frontend starten (React + Vite)
# -------------------------------------------------------
echo -e "${YELLOW}⚛️  Schritt 3: Frontend starten (React)...${NC}"
echo -e "   Port: ${BOLD}5173${NC}"

cd "$SCRIPT_DIR/frontend"

# node_modules installieren falls noch nicht vorhanden
if [ ! -d "node_modules" ]; then
    echo -e "   node_modules nicht gefunden – npm install wird ausgeführt..."
    npm install --silent
    echo -e "${GREEN}✅ Abhängigkeiten installiert.${NC}"
fi

# Frontend im Hintergrund starten
npm run dev > "$SCRIPT_DIR/frontend.log" 2>&1 &
FRONTEND_PID=$!

echo -e "${GREEN}✅ Frontend gestartet (PID: $FRONTEND_PID)${NC}"
echo -e "   Logs: ${SCRIPT_DIR}/frontend.log"

# Kurz warten
sleep 2

# -------------------------------------------------------
# Fertig! Zusammenfassung
# -------------------------------------------------------
echo ""
echo -e "${GREEN}${BOLD}======================================${NC}"
echo -e "${GREEN}${BOLD}   ✅ DualNetworking läuft!           ${NC}"
echo -e "${GREEN}${BOLD}======================================${NC}"
echo ""
echo -e "  📱 Frontend:  ${BOLD}http://localhost:5173${NC}"
echo -e "  🔧 Backend:   ${BOLD}http://localhost:8080${NC}"
echo -e "  🗄️  MongoDB:   ${BOLD}localhost:27017${NC}"
echo ""
echo -e "  Logs:"
echo -e "    Backend:   ${SCRIPT_DIR}/backend.log"
echo -e "    Frontend:  ${SCRIPT_DIR}/frontend.log"
echo ""
echo -e "  ${YELLOW}Zum Beenden: Strg+C drücken${NC}"
echo ""

# PIDs speichern damit stop.sh sie beenden kann
echo "$BACKEND_PID" > "$SCRIPT_DIR/.backend.pid"
echo "$FRONTEND_PID" > "$SCRIPT_DIR/.frontend.pid"

# Browser öffnen (macOS)
if command -v open &> /dev/null; then
    sleep 2
    open "http://localhost:5173"
fi

# Warten bis der Nutzer Strg+C drückt
# Beim Beenden werden Backend und Frontend gestoppt
trap cleanup INT TERM
cleanup() {
    echo ""
    echo -e "${YELLOW}🛑 DualNetworking wird beendet...${NC}"

    # Backend stoppen
    if [ -n "$BACKEND_PID" ] && kill -0 "$BACKEND_PID" 2>/dev/null; then
        kill "$BACKEND_PID"
        echo -e "${GREEN}✅ Backend gestoppt.${NC}"
    fi

    # Frontend stoppen
    if [ -n "$FRONTEND_PID" ] && kill -0 "$FRONTEND_PID" 2>/dev/null; then
        kill "$FRONTEND_PID"
        echo -e "${GREEN}✅ Frontend gestoppt.${NC}"
    fi

    # MongoDB läuft weiter (mit docker-compose stop beenden falls gewünscht)
    echo -e "${YELLOW}💡 MongoDB läuft noch. Zum Stoppen: docker-compose stop${NC}"
    echo ""

    # PID-Dateien löschen
    rm -f "$SCRIPT_DIR/.backend.pid" "$SCRIPT_DIR/.frontend.pid"

    exit 0
}

# Warten bis Strg+C gedrückt wird
wait
