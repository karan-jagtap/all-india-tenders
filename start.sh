#!/usr/bin/env bash
# ==============================================================================
# All India Tenders — Unified Startup Script
# Starts FastAPI Backend (port 8000) & Vite React Frontend (port 3000)
# Zero database required (In-Memory RAM Streaming across 25 portals)
# ==============================================================================

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
export PATH="/Users/karan/.local/bin:/opt/homebrew/bin:$PATH"

# Color codes
GREEN='\033[0;32m'
ORANGE='\033[0;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${ORANGE}"
echo "======================================================================"
echo "    🇮🇳   ALL INDIA TENDERS — 1-STOP NATIONAL PROCUREMENT PLATFORM"
echo "======================================================================"
echo -e "${NC}"

# 1. Free ports 8000 & 3000
echo -e "${CYAN}[1/3] Checking ports 8000 and 3000...${NC}"
if lsof -t -i :8000 > /dev/null 2>&1; then
    echo "Stopping existing process on port 8000..."
    kill -9 $(lsof -t -i :8000) 2>/dev/null || true
fi

if lsof -t -i :3000 > /dev/null 2>&1; then
    echo "Stopping existing process on port 3000..."
    kill -9 $(lsof -t -i :3000) 2>/dev/null || true
fi

# 2. Check virtualenv for backend
echo -e "\n${CYAN}[2/3] Checking Backend Python Environment...${NC}"
VENV_UVICORN="/Users/karan/workspace/tender-rag/backend/.venv/bin/uvicorn"
if [ ! -f "$VENV_UVICORN" ]; then
    VENV_UVICORN="$(which uvicorn || true)"
fi

if [ -z "$VENV_UVICORN" ] || [ ! -x "$VENV_UVICORN" ]; then
    echo -e "${RED}Error: uvicorn not found! Please check python virtual environment.${NC}"
    exit 1
fi

# 3. Start Backend & Frontend
echo -e "\n${CYAN}[3/3] Launching FastAPI Backend & Vite Frontend...${NC}"

echo "Starting FastAPI backend on port 8000..."
(
    cd "$SCRIPT_DIR/backend"
    "$VENV_UVICORN" app.main:app --host 0.0.0.0 --port 8000
) &
BACKEND_PID=$!

sleep 2

echo "Starting Vite React frontend on port 3000..."
(
    cd "$SCRIPT_DIR/frontend"
    npm run dev
) &
FRONTEND_PID=$!

cleanup() {
    echo -e "\n\n${ORANGE}Shutting down All India Tenders services...${NC}"
    kill -TERM "$BACKEND_PID" 2>/dev/null || true
    kill -TERM "$FRONTEND_PID" 2>/dev/null || true
    wait "$BACKEND_PID" 2>/dev/null || true
    wait "$FRONTEND_PID" 2>/dev/null || true
    echo -e "${GREEN}All services cleanly stopped.${NC}"
    exit 0
}

trap cleanup SIGINT SIGTERM EXIT

sleep 2

# Open browser
if [[ "$OSTYPE" == "darwin"* ]]; then
    open "http://localhost:3000" || true
elif command -v xdg-open &> /dev/null; then
    xdg-open "http://localhost:3000" || true
fi

echo -e "\n${GREEN}======================================================================${NC}"
echo -e "${GREEN}  🚀 ALL INDIA TENDERS PLATFORM IS LIVE!${NC}"
echo -e "${GREEN}======================================================================${NC}"
echo -e "  🌐 ${BLUE}Frontend Web App:${NC}       http://localhost:3000"
echo -e "  📱 ${BLUE}Mobile / Network:${NC}       http://192.168.1.47:3000"
echo -e "  ⚙️  ${BLUE}Backend API Docs:${NC}       http://localhost:8000/docs"
echo -e "  🏛️  ${BLUE}Coverage:${NC}               25 Statutory Portals & 123 Executing Authorities"
echo -e "  📊 ${BLUE}Architecture:${NC}           100% In-Memory RAM Streaming (0 DB Overhead)"
echo -e "${GREEN}======================================================================${NC}"
echo -e "Press ${ORANGE}Ctrl + C${NC} anytime to stop.\n"

wait
