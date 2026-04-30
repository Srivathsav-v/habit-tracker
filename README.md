# Vault — Habit Tracker

A minimal, premium-feeling habit tracker built with Expo and React Native. Runs on iOS, Android, and in any web browser.

---

## Preview (Web)

The web build renders a phone frame in your browser — no device needed.

---

## Prerequisites

| Tool | Version | Install |
|------|---------|---------|
| Node.js | 18 or 20 LTS | https://nodejs.org |
| npm | comes with Node | — |
| Expo CLI | latest | `npm install -g expo-cli` *(optional — npx works too)* |
| Expo Go app | latest | App Store / Google Play *(only needed for physical device)* |

---

## Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/Srivathsav-v/habit-tracker.git
cd habit-tracker
```

### 2. Install dependencies

```bash
npm install --legacy-peer-deps
```

> The `--legacy-peer-deps` flag is required because React Native's peer dependency tree has some version overlaps.

### 3. Run the app

**In a web browser (recommended for quick preview)**
```bash
npm run web
# or
npx expo start --web
```
Open [http://localhost:8081](http://localhost:8081) — you'll see a phone frame centred on the page.

**On a physical device (iOS or Android)**
```bash
npx expo start
```
Scan the QR code in the terminal with the **Expo Go** app.

**On an iOS simulator** *(Mac + Xcode required)*
```bash
npm run ios
```

**On an Android emulator** *(Android Studio required)*
```bash
npm run android
```

---

## Project Structure

```
habit-tracker/
├── App.js                        # Root — providers + phone-frame wrapper
├── app.json                      # Expo config
├── context/
│   ├── AppContext.js             # Theme & settings state (dark/light/system)
│   └── HabitContext.js           # Habit data & actions
├── constants/
│   ├── theme.js                  # DARK and LIGHT colour palettes
│   └── messages.js               # Rotating affirmation strings
├── utils/
│   ├── counts.js                 # today / week / month / year counters
│   └── storage.js                # AsyncStorage helpers
└── screens/
    ├── HomeScreen.js             # Habit card list + add/rename modal
    ├── HabitDetailScreen.js      # Medallion tap-to-log + affirmations
    ├── HabitDashboardScreen.js   # Press timeline + stat strip
    ├── GlobalDashboardScreen.js  # All habits at a glance
    └── SettingsScreen.js         # Theme, card style, count toggle, reorder
```

---

## Features

- **Track habits** — tap the medallion to log a press with a timestamp
- **Dark / Light / System theme** — toggle in Settings
- **Per-habit dashboard** — full press history grouped by date + Today / This Week / This Month / This Year stats
- **Global dashboard** — all habits side by side
- **Card customisation** — Rounded, Pill, or Square card style
- **Drag-to-reorder** — rearrange habits in Settings
- **Show / hide counts** on home cards
- **Share** your stats via the native share sheet
- **Persistent storage** — all data saved locally via AsyncStorage

---

## Troubleshooting

**Port 8081 already in use**
```bash
npx kill-port 8081
npm run web
```

**`npm install` fails with peer dep errors**

Make sure you include `--legacy-peer-deps`:
```bash
npm install --legacy-peer-deps
```

**Expo Go shows a blank screen**

Make sure your phone and computer are on the same Wi-Fi network.

---

## Tech Stack

- [Expo](https://expo.dev) SDK 52
- React Native 0.76 + React Native Web
- React Navigation 6 (native-stack)
- AsyncStorage for local persistence
