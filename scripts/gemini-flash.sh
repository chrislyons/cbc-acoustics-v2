#!/bin/bash
# Gemini Flash Model Launcher (Fast, efficient)
# Model: gemini-2.0-flash-exp
# Best for: Quick analysis, code review, rapid prototyping

set -euo pipefail

PROJECT_DIR="$HOME/dev/cbc-acoustics-v2"
cd "$PROJECT_DIR" || exit 1

export GEMINI_SANDBOX=true
export GEMINI_SANDBOX_METHOD=seatbelt
export GEMINI_CONFIG_PATH="$PROJECT_DIR/.geminirc.json"
export GEMINI_MODEL="gemini-2.0-flash-exp"

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "⚡ GEMINI FLASH - Sandboxed Mode"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📦 Model:    gemini-2.0-flash-exp"
echo "✅ Allowed:  $(pwd)"
echo "🚫 Blocked:  All other directories"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

./node_modules/.bin/gemini --sandbox --model "$GEMINI_MODEL" "$@"
