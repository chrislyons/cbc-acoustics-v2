#!/bin/bash
# Firebase CLI wrapper for Gemini sandbox
# Usage: ./scripts/firebase.sh [firebase commands...]

cd "$(dirname "$0")/.." || exit 1
npx firebase "$@"
