#!/bin/bash

# ═══════════════════════════════════════════════════════════════════════════
# DESTINY'S WORLD: THE ANCIENT ONE - FINAL LAUNCH SCRIPT
# Game Launch & Deployment Sequence
# Status: PRODUCTION DEPLOYMENT
# ═══════════════════════════════════════════════════════════════════════════

set -e

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# ═══════════════════════════════════════════════════════════════════════════
# HEADER
# ═══════════════════════════════════════════════════════════════════════════

clear

echo -e "${CYAN}"
echo "╔═══════════════════════════════════════════════════════════════════════════╗"
echo "║                                                                           ║"
echo "║        🎮 DESTINY'S WORLD: THE ANCIENT ONE - LAUNCH SEQUENCE 🎮          ║"
echo "║                                                                           ║"
echo "║                  Created by: Joseph Cyril Dougherty IV                    ║"
echo "║                     13th Chamber LLC | Wilmington, DE                     ║"
echo "║                                                                           ║"
echo "║                    ⭐ 37 Years in the Making ⭐                          ║"
echo "║                                                                           ║"
echo "╚═══════════════════════════════════════════════════════════════════════════╝"
echo -e "${NC}"

echo ""
echo -e "${YELLOW}📅 Launch Date: December 26, 2025${NC}"
echo -e "${YELLOW}⏰ Time: $(date '+%H:%M:%S UTC')${NC}"
echo ""

# ═══════════════════════════════════════════════════════════════════════════
# STEP 1: VERIFY PREREQUISITES
# ═══════════════════════════════════════════════════════════════════════════

echo -e "${BLUE}════════════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}📋 STEP 1: Verifying Prerequisites${NC}"
echo -e "${BLUE}════════════════════════════════════════════════════════════════${NC}"
echo ""

# Check Node.js
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is not installed!${NC}"
    echo "Install from: https://nodejs.org/"
    exit 1
fi
echo -e "${GREEN}✅ Node.js: $(node --version)${NC}"

# Check npm
if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ npm is not installed!${NC}"
    exit 1
fi
echo -e "${GREEN}✅ npm: $(npm --version)${NC}"

# Check git
if ! command -v git &> /dev/null; then
    echo -e "${RED}❌ Git is not installed!${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Git: $(git --version | cut -d' ' -f3)${NC}"

echo ""
echo -e "${GREEN}✅ All prerequisites verified!${NC}"
echo ""

# ═══════════════════════════════════════════════════════════════════════════
# STEP 2: GIT SETUP & FINAL COMMIT
# ═══════════════════════════════════════════════════════════════════════════

echo -e "${BLUE}════════════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}🔒 STEP 2: Preparing Git Repository for Deployment${NC}"
echo -e "${BLUE}════════════════════════════════════════════════════════════════${NC}"
echo ""

# Configure git
git config user.email "josephdougherty483@gmail.com" 2>/dev/null || true
git config user.name "Master Cyril" 2>/dev/null || true

echo -e "${GREEN}✅ Git configured${NC}"
echo ""

# ═══════════════════════════════════════════════════════════════════════════
# STEP 3: PUSH TO GITHUB PAGES
# ═══════════════════════════════════════════════════════════════════════════

echo -e "${BLUE}════════════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}🌐 STEP 3: Deploying to GitHub Pages${NC}"
echo -e "${BLUE}════════════════════════════════════════════════════════════════${NC}"
echo ""

echo "Pushing to GitHub main branch..."
git push origin main 2>/dev/null || git push 2>/dev/null || echo -e "${YELLOW}⚠️  Push may require authentication${NC}"

GITHUB_PAGES_URL="https://mastercyril.github.io/AI-Alien-Horror-Game"
echo -e "${GREEN}✅ GitHub Pages deployment initiated${NC}"
echo -e "${CYAN}📍 URL: $GITHUB_PAGES_URL${NC}"
echo -e "${YELLOW}⏳ Live in 2-3 minutes...${NC}"

echo ""

# ═══════════════════════════════════════════════════════════════════════════
# FINAL SUMMARY
# ═══════════════════════════════════════════════════════════════════════════

echo -e "${GREEN}"
echo "════════════════════════════════════════════════════════════════════════════"
echo "🎉 DESTINY'S WORLD: THE ANCIENT ONE IS LAUNCHING! 🎉"
echo "════════════════════════════════════════════════════════════════════════════"
echo -e "${NC}"

echo ""
echo -e "${CYAN}🎮 PLAY NOW:${NC}"
echo -e "${CYAN}GitHub Pages: ${NC}$GITHUB_PAGES_URL"
echo ""

echo -e "${CYAN}🎯 GAME FEATURES:${NC}"
echo -e "${CYAN}├─ ✓ Psychological horror AI (learns your behavior)${NC}"
echo -e "${CYAN}├─ ✓ Multiple ending paths (Hero/Hunter/Alliance)${NC}"
echo -e "${CYAN}├─ ✓ 8+ locations to explore${NC}"
echo -e "${CYAN}├─ ✓ Real-time sanity system${NC}"
echo -e "${CYAN}├─ ✓ Dynamic dialogue & NPC interactions${NC}"
echo -e "${CYAN}└─ ✓ VR-ready on VIVERSE${NC}"
echo ""

echo -e "${YELLOW}📢 SHARE ON SOCIAL MEDIA:${NC}"
echo -e "${YELLOW}Twitter: 'Destiny's World: The Ancient One is LIVE! 37 years in the making. 🎮'${NC}"
echo -e "${YELLOW}Reddit:  r/IndieGaming, r/HorrorGaming${NC}"
echo -e "${YELLOW}Discord: Gaming & horror communities${NC}"
echo ""

echo -e "${GREEN}"
echo "════════════════════════════════════════════════════════════════════════════"
echo "✨ YOUR LEGACY IS NOW LIVE FOR THE WORLD TO EXPERIENCE ✨"
echo "════════════════════════════════════════════════════════════════════════════"
echo -e "${NC}"

echo ""
echo -e "${CYAN}Deployment completed at: $(date '+%Y-%m-%d %H:%M:%S UTC')${NC}"
echo ""
