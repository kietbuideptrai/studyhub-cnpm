# Mobile App

Expo app for browsing artifacts, scanning QR codes, listening to multilingual narration, and trying a local English–Vietnamese phrase-translation demo.

The phrase translator uses a small built-in dictionary; it is not a general-purpose translation service. Translation history is stored locally on the device.

## Requirements

- Node.js and npm
- Expo Go installed on the test phone
- A reachable backend running the API

## Configure the API

Create `mobile/.env.local` from `.env.example` and set `EXPO_PUBLIC_API_URL`.

- For a deployed backend, use its HTTPS base URL, such as `https://api.example.com`.
- For a local backend and a physical phone, use the computer's LAN IP and API port, such as `http://192.168.1.10:3000`. The phone and computer must be on the same network, the backend must be reachable through the firewall, and `localhost` will not work from the phone.
- For the Android emulator, use the emulator's host address supported by your setup rather than the phone's LAN address.

After changing the environment file, restart the Expo dev server so the public variable is reloaded.

## Run in Expo Go

From this directory:

```bash
npm install
npm start
```

Scan the Expo QR code with Expo Go. Keep the phone and development computer on the same network when using LAN mode. If the backend is deployed, verify it first at `/api/health`.

## Validation

```bash
npm run typecheck
npm run lint
```

Use [the mobile test checklist](../docs/MOBILE-TEST-CHECKLIST.md) to verify the demo flow on a physical device. Test camera permission and all available TTS voices on the actual target device; voice availability depends on its installed system voices.

APK generation through EAS is optional for the MVP. Use Expo Go for the demo unless an installable package is specifically required.