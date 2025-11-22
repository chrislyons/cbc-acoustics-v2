#!/bin/bash
# Gemini CLI Sandbox Wrapper for acoustics-dashboard-v2
#
# CRITICAL: This script ensures Gemini CLI can ONLY access ~/dev/acoustics-dashboard-v2
# and cannot see any other directories on the system.
#
# Usage:
#   ./gemini-sandbox.sh -p "Your prompt here"
#   ./gemini-sandbox.sh  # Interactive mode

set -euo pipefail

# Force change to acoustics-dashboard-v2 directory
PROJECT_DIR="$HOME/dev/acoustics-dashboard-v2"
cd "$PROJECT_DIR" || { echo "❌ Error: Cannot access acoustics-dashboard-v2 directory"; exit 1; }

# Verify we're in the correct directory (safety check)
if [[ "$(pwd)" != "$PROJECT_DIR" ]]; then
    echo "❌ Error: Not in correct directory. Expected: $PROJECT_DIR"
    exit 1
fi

# Enable sandboxing via environment variable
export GEMINI_SANDBOX=true

# Use macOS Seatbelt for lightweight sandboxing (built-in on macOS)
# This provides system-level isolation
export GEMINI_SANDBOX_METHOD=seatbelt

# Point to our sandboxing configuration
export GEMINI_CONFIG_PATH="$PROJECT_DIR/.geminirc.json"

# Enforce strict directory isolation
# Gemini will ONLY be able to access files within this directory
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🔒 GEMINI CLI SANDBOXED MODE - CBC Acoustics v2"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Allowed:  $(pwd)"
echo "🚫 Blocked:  All other directories on system"
echo "🔧 Method:   macOS Seatbelt"
echo "📋 Config:   .geminirc.json"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Run the locally-installed Gemini CLI with sandboxing
./node_modules/.bin/gemini --sandbox "$@"
