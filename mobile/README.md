# Mobile App

Expo app for browsing artifacts, scanning QR codes, listening to multilingual narration, and trying a local English–Vietnamese phrase-translation demo.

Demo mode uses eight built-in artifacts with draft narration in Vietnamese, English, Chinese, Japanese, and Korean, plus local images. The phrase translator uses a small built-in dictionary; it is not a general-purpose translation service. Translation history is stored locally on the device. Verify draft historical content with official sources before production use.

## Requirements

- Node.js and npm
- Expo Go installed on the test phone

## Run the demo without a backend

The `.env.example` file enables demo mode by default.

From this directory:

```bash
npm install
cp .env.example .env.local
npm start
```

The artifact list and details work with local demo data. Restart Expo after changing environment variables.

## Connect to the backend

Set `EXPO_PUBLIC_DEMO_MODE=false` and configure `EXPO_PUBLIC_API_URL` in `mobile/.env.local`.

- For a deployed backend, use its HTTPS base URL, such as `https://api.example.com`.
- For a local backend and a physical phone, use the computer's LAN IP and API port, such as `http://192.168.1.10:3000`. The phone and computer must be on the same network, the backend must be reachable through the firewall, and `localhost` will not work from the phone.
- For the Android emulator, use the emulator's host address supported by your setup rather than the phone's LAN address.

```bash
npm start
```

Scan the Expo QR code with Expo Go. Keep the phone and development computer on the same network when using LAN mode. Verify a deployed backend first at `/api/health`.

## Validation

```bash
npm run typecheck
npm run lint
```

Use [the mobile test checklist](../docs/MOBILE-TEST-CHECKLIST.md) to verify the demo flow on a physical device. Test camera permission and all available TTS voices on the actual target device; voice availability depends on its installed system voices.

APK generation through EAS is optional for the MVP. Use Expo Go for the demo unless an installable package is specifically required.