#!/bin/bash
# Gemini Pro Model Launcher (Advanced reasoning)
# Model: gemini-1.5-pro
# Best for: Complex analysis, deep reasoning, large context

set -euo pipefail

PROJECT_DIR="$HOME/dev/cbc-acoustics-v2"
cd "$PROJECT_DIR" || exit 1

export GEMINI_SANDBOX=true
export GEMINI_SANDBOX_METHOD=seatbelt
export GEMINI_CONFIG_PATH="$PROJECT_DIR/.geminirc.json"
export GEMINI_MODEL="gemini-1.5-pro"

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🧠 GEMINI PRO - Sandboxed Mode"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📦 Model:    gemini-1.5-pro"
echo "✅ Allowed:  $(pwd)"
echo "🚫 Blocked:  All other directories"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

./node_modules/.bin/gemini --sandbox --model "$GEMINI_MODEL" "$@"
