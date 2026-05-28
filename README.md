# Event Manager

Event Manager is an Expo React Native mobile app for browsing events, registering for events, saving events to a watchlist, viewing joined events, and managing the current user profile.

Student number: `N11884347`

## Features

- Login and account registration
- Branded splash screen with a minimum 3 second display time
- Dashboard summary for joined events and events occurring this week
- Nearby events section that uses native device location to find events in the user's current state
- Available events list with search
- Event details with registration, leaving, sharing, and watchlist actions
- Location check before registration with warnings for out-of-state Australian events and overseas events
- Watchlist screen for saved events
- Profile screen with account details and logout
- Local notifications for event registration and cancellation
- Offline banner with cached fallback for available events, joined events, watchlist, event details, and profile
- Centralized backend error message: `Backend API not working`

## Tech Stack

- Expo SDK 54
- React Native 0.81
- React 19
- React Navigation
- React Native Paper
- Axios
- AsyncStorage
- Expo Location
- Expo Notifications
- Expo Sharing

## API

The app uses this backend base URL:

```text
https://jacaranda04.ifn666.com/assignment2/api
```

The API client is configured in:

```text
services/apiClient.js
```

Important endpoint groups:

- Auth: `/auth/login`, `/auth/register`
- Events: `/events`
- Registrations: `/event-registrations`
- Watchlist: `/event-watchlist`
- User profile: user service endpoints in `services/userService.js`

If the backend is offline, times out, or returns a server error, the app shows:

```text
Backend API not working
```

## Project Structure

```text
ASS3/
  App.js
  app.json
  assets/
  components/
  context/
  navigation/
  screens/
  services/
  utils/
```

Key folders:

- `screens/`: full app screens such as login, register, dashboard, events, details, watchlist, and profile
- `components/`: reusable UI components such as search, error, loading, sharing, and tab icons
- `navigation/`: auth and main app navigation setup
- `services/`: backend API wrappers
- `context/`: auth and network state providers
- `utils/`: date formatting, centralized offline cache helpers, storage, sharing, notifications, event location risk checks, and API error helpers

## Setup

Install dependencies:

```bash
npm install
```

If Expo asks for native dependency alignment, install the Expo-managed packages:

```bash
npx expo install expo-location expo-notifications expo-sharing
```

Start the Expo development server:

```bash
npm start
```

Run on Android:

```bash
npm run android
```

Run on iOS:

```bash
npm run ios
```

Run on web:

```bash
npm run web
```

## Notes

- The app requires the backend API to be available for login, registration, events, profile, watchlist, and registrations.
- Offline cache keys and cache access functions are centralized in `utils/offlineCache.js`.
- Available events, dashboard joined events, watchlist events, event details, registered events, and profile details are cached locally after successful loads.
- If the backend later becomes unavailable, cached read-only data is shown where it exists, alongside the centralized backend error message.
- Login, registration changes, leaving/cancelling events, watchlist updates, and any uncached data still require the backend API.
- Nearby events and registration location warnings require foreground location permission on native devices.
- Location-based features are not supported on web because `services/locationService.js` returns an unsupported platform result for web.
- Event location checks use event coordinates when available, otherwise they geocode event location text such as `location`, `address`, `venue`, and `city`.
- Expo Go may have limitations around push notifications; this app uses local notifications for registration feedback.
- The watchlist implementation expects the `/event-watchlist` endpoints.

## Verification

Useful quick check for syntax after edits:

```bash
node -e "const fs=require('fs'); const parser=require('@babel/parser'); ['App.js'].forEach((file)=>parser.parse(fs.readFileSync(file,'utf8'),{sourceType:'module',plugins:['jsx']})); console.log('Parse OK');"
```
