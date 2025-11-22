#!/bin/bash
# Gemini Thinking Model Launcher (Experimental reasoning)
# Model: gemini-2.5-flash-thinking-exp
# Best for: Complex problem-solving, step-by-step analysis

set -euo pipefail

PROJECT_DIR="$HOME/dev/acoustics-dashboard-v2"
cd "$PROJECT_DIR" || exit 1

export GEMINI_SANDBOX=true
export GEMINI_SANDBOX_METHOD=seatbelt
export GEMINI_CONFIG_PATH="$PROJECT_DIR/.geminirc.json"
export GEMINI_MODEL="gemini-2.5-flash-thinking-exp"

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🤔 GEMINI THINKING - Sandboxed Mode (Experimental)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📦 Model:    gemini-2.5-flash-thinking-exp"
echo "✅ Allowed:  $(pwd)"
echo "🚫 Blocked:  All other directories"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

./node_modules/.bin/gemini --sandbox --model "$GEMINI_MODEL" "$@"
