# Gemini CLI Sandboxed Installation

## Overview

This directory contains a **sandboxed installation** of Google's Gemini CLI that is **strictly isolated** to the `~/dev/cbc-acoustics-v2` directory. Gemini CLI **cannot** access any other files or directories on your system.

## Security Features

- ✅ **Directory Isolation**: Gemini can only see `~/dev/cbc-acoustics-v2`
- ✅ **macOS Seatbelt**: Uses built-in macOS sandboxing (`sandbox-exec`)
- ✅ **Local Installation**: Not installed globally, only in this project
- ✅ **Configuration Locked**: `.geminirc.json` enforces restrictions
- 🚫 **Cannot Access**: `~/dev/cbc-schedule-sync`, `~/dev/hotbox`, or any other directory
- 🚫 **Cannot See**: Your home directory, system files, or other projects

## Files

| File | Purpose |
|------|---------|
| `.gemini-sandbox.sh` | Wrapper script that enforces sandboxing |
| `.geminirc.json` | Sandboxing configuration (workspace-only access) |
| `node_modules/@google/gemini-cli` | Local Gemini CLI installation (gitignored) |
| `package.json` | Node.js dependencies declaration (includes Gemini CLI) |

## Installation Verification

The following files confirm proper isolation:

```bash
# Check local installation
ls -la node_modules/.bin/gemini

# Verify sandboxing configuration
cat .geminirc.json

# View wrapper script
cat .gemini-sandbox.sh
```

## Usage

### Option 1: Wrapper Script (Recommended)

Always use the wrapper script to ensure sandboxing:

```bash
# Navigate to project directory
cd ~/dev/cbc-acoustics-v2

# Run sandboxed Gemini CLI
./gemini-sandbox.sh -p "Analyze the TypeScript code in src/"
```

### Option 2: Direct with Manual Sandbox

```bash
cd ~/dev/cbc-acoustics-v2
export GEMINI_SANDBOX=true
export GEMINI_SANDBOX_METHOD=seatbelt
./node_modules/.bin/gemini --sandbox -p "Your prompt here"
```

### Option 3: npm Script

```bash
cd ~/dev/cbc-acoustics-v2
npm run gemini
```

## Authentication Setup

Gemini CLI requires authentication. Choose one method:

### Method 1: API Key (Simplest)

```bash
# Set environment variable
export GEMINI_API_KEY=your_api_key_here

# Or add to .env file
echo "GEMINI_API_KEY=your_key" >> .env
```

Get your API key from: https://makersuite.google.com/app/apikey

### Method 2: Settings File

Create `~/.gemini/settings.json`:

```json
{
  "auth": {
    "method": "api-key",
    "apiKey": "your_api_key_here"
  }
}
```

### Method 3: Vertex AI

```bash
export GOOGLE_GENAI_USE_VERTEXAI=true
```

## Testing Isolation

To verify Gemini **cannot** access other directories:

```bash
cd ~/dev/cbc-acoustics-v2

# This should work (current directory)
./gemini-sandbox.sh -p "List files in current directory"

# This should FAIL or return empty (other directories blocked)
./gemini-sandbox.sh -p "List files in ~/dev/cbc-schedule-sync"

# This should FAIL (parent directory blocked)
./gemini-sandbox.sh -p "Read ~/Documents/secret.txt"
```

**Expected behavior**: Gemini will only respond with information from `~/dev/cbc-acoustics-v2`.

## Sandboxing Details

### macOS Seatbelt

The wrapper uses macOS's built-in `sandbox-exec` command, which provides:

- **File system isolation**: Read/write restricted to workspace
- **Process isolation**: Limited subprocess spawning
- **Network restrictions**: Configurable network access

### Configuration (.geminirc.json)

```json
{
  "sandbox": {
    "enabled": true,
    "method": "seatbelt",
    "workspaceRoot": "/Users/chrislyons/dev/cbc-acoustics-v2",
    "allowedPaths": [
      "/Users/chrislyons/dev/cbc-acoustics-v2"
    ],
    "deniedPaths": [
      "/Users/chrislyons/dev/*",
      "/Users/chrislyons/*"
    ]
  }
}
```

## Integration with Project

This Gemini CLI instance is specifically configured for the CBC Acoustics v2 project:

- **Tech Stack Aware**: Understands TypeScript, React, Vite, Three.js
- **Project Context**: Has access to acoustics visualization code
- **Isolated**: Cannot interfere with other projects or access their code

### Project-Specific Commands

```bash
# Analyze visualization components
./gemini-sandbox.sh -p "Review the 3D visualization code in src/visualizations/"

# Check TypeScript types
./gemini-sandbox.sh -p "Analyze type safety in the acoustics analysis module"

# Review test coverage
./gemini-sandbox.sh -p "Suggest additional test cases for frequency response calculations"
```

## Updating Gemini CLI

To update to the latest version:

```bash
cd ~/dev/cbc-acoustics-v2
npm update @google/gemini-cli
```

The sandboxing configuration will remain intact.

## Removal

To completely remove Gemini CLI:

```bash
cd ~/dev/cbc-acoustics-v2

# Remove from package.json dependencies
npm uninstall @google/gemini-cli

# Remove sandboxing files
rm .gemini-sandbox.sh .geminirc.json
```

## Why Local Installation?

- **Security**: Global installations can access your entire system
- **Isolation**: This project's Gemini cannot interfere with other projects
- **Per-Project Context**: Each project has its own Gemini instance with tailored knowledge
- **Version Control**: Dependencies are tracked in package.json

## Comparison with Other Installations

This is a **completely separate** Gemini CLI instance from:

- ❌ `~/dev/cbc-schedule-sync/.gemini-sandbox.sh` - Different project, different sandbox
- ❌ Any global installation (if present)
- ❌ Other project directories

Each installation is **fully isolated** and cannot access other projects.

## Additional Resources

- **Gemini CLI Docs**: https://github.com/google/generative-ai-cli
- **macOS Sandbox Guide**: `man sandbox-exec`
- **Project README**: See `README.md` for project overview
- **Architecture Docs**: See `docs/acu/` for sprint documentation

## Support

If sandboxing fails or Gemini accesses unauthorized directories:

1. **Check wrapper script**: Ensure `GEMINI_SANDBOX=true` is set
2. **Verify directory**: Confirm you're in `~/dev/cbc-acoustics-v2`
3. **Review logs**: Check output for sandbox initialization messages
4. **Report issue**: This is a security concern - stop using immediately

---

**Last Updated**: 2025-11-16
**Gemini CLI Version**: 0.15.3
**Sandbox Method**: macOS Seatbelt
**Project**: CBC Acoustics Dashboard v2
