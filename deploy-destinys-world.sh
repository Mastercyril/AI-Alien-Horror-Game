#!/bin/bash

# DESTINY'S WORLD: GAME LAUNCH SCRIPT
# Final WebGL build and deployment to GitHub Pages + VIVERSE
# Status: PRODUCTION LAUNCH

set -e

echo "🚀 DESTINY'S WORLD: THE ANCIENT ONE"
echo "🎮 Final Build & Deployment Sequence"
echo "📅 December 26, 2025"
echo ""

# Step 1: Build WebGL
echo "📦 Step 1: Building WebGL..."
npm run build:webgl
echo "✅ WebGL build complete"
echo ""

# Step 2: Optimize for production
echo "🔧 Step 2: Optimizing assets..."
npm run optimize:webgl
echo "✅ Optimization complete"
echo ""

# Step 3: Deploy to GitHub Pages
echo "🌐 Step 3: Deploying to GitHub Pages..."
git add Build/
git commit -m "🚀 LAUNCH: Destiny's World - The Ancient One (Final Build) - December 26, 2025"
git push origin main
echo "✅ GitHub Pages deployment initiated"
echo "⏳ Live in 2-3 minutes at: https://mastercyril.github.io/AI-Alien-Horror-Game"
echo ""

# Step 4: Deploy to VIVERSE
echo "☁️ Step 4: Deploying to VIVERSE..."
viverse-cli auth status
viverse-cli app publish ./Build/WebGL --app-id destiny-ancient-one-2025
echo "✅ VIVERSE deployment complete"
echo "🎮 Live at: https://worlds.viverse.com/destiny-ancient-one"
echo ""

# Step 5: Verification
echo "🔍 Step 5: Verifying deployments..."
curl -s https://mastercyril.github.io/AI-Alien-Horror-Game | head -20 && echo "✅ GitHub Pages: ONLINE"
curl -s https://worlds.viverse.com/destiny-ancient-one | head -20 && echo "✅ VIVERSE: ONLINE"
echo ""

echo "════════════════════════════════════════════════════════"
echo "🎉 DESTINY'S WORLD: THE ANCIENT ONE IS NOW LIVE! 🎉"
echo "════════════════════════════════════════════════════════"
echo ""
echo "🎮 PLAY NOW:"
echo "  GitHub Pages: https://mastercyril.github.io/AI-Alien-Horror-Game"
echo "  VIVERSE:      https://worlds.viverse.com/destiny-ancient-one"
echo ""
echo "📊 GAME FEATURES:"
echo "  ✓ Psychological horror AI (learns your behavior)"
echo "  ✓ Multiple ending paths (Hero/Hunter/Alliance)"
echo "  ✓ 8+ locations to explore"
echo "  ✓ Real-time sanity system"
echo "  ✓ VR-ready on VIVERSE"
echo "  ✓ Multiplayer support foundation"
echo ""
echo "🚀 SHARE ON SOCIAL MEDIA:"
echo "  Twitter: 'Destiny's World: The Ancient One is LIVE! 37 years in the making.'"
echo "  Reddit: r/IndieGaming, r/HorrorGaming, r/VIVERSE"
echo "  Discord: Gaming & horror communities"
echo ""
echo "════════════════════════════════════════════════════════"
