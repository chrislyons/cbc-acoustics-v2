# Firebase CLI Access for Gemini Sandbox

Firebase CLI v14.25.0 is installed locally as a dev dependency.

## Available Access Methods

### Method 1: NPM Scripts (Recommended for Gemini)
```bash
npm run firebase -- --version
npm run firebase:init
npm run firebase:deploy
npm run firebase:serve
```

### Method 2: Shell Wrapper
```bash
./scripts/firebase.sh --version
./scripts/firebase.sh init
./scripts/firebase.sh deploy
```

### Method 3: Direct npx
```bash
npx firebase --version
npx firebase init
npx firebase deploy
```

## Notes
- Firebase is NOT installed globally
- All methods execute from project workspace root
- Sandbox restrictions apply per .geminirc.json
