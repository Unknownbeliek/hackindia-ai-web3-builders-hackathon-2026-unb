# Anveshana Kisan App — Standalone React Native Mobile App

Mobile application for smallholder dairy farmers built with **React Native** and **Expo**, matching the Anveshana National Dairy Intelligence Platform design system.

---

## 📱 Features

- **Native Mobile Navigation**: Smooth bottom tab bar for Home, Pour Log Receipts, Cattle NDLM Tags, KCC Loan, and AMCU Hardware Sync.
- **Hindi Audio Assistance**: Integrated `expo-speech` for real-time voice narration of milk pour volume, Fat %, SNF %, payouts, and pre-approved loan amounts in Hindi.
- **Farm Purity Index Gauge**: Visual gauge displaying purity score (**87 - Grade A+**) linked to 15-digit NDLM ear tags.
- **Quick Milk Pour Logger**: Log morning/evening milk collection sessions directly into the AMCU queue.
- **NABARD Pre-Approved KCC Loan**: Apply for up to ₹1,60,000 credit line backed by FSSAI hardware lock.
- **AMCU Essae-SN8831 Hardware Sync**: Real-time scale & lactometer telemetry monitor with offline pour queue auto-sync.
- **Interactive Payout Calculator**: Compute milk price per liter and total payout based on Fat % & SNF %.

---

## 🚀 How to Run the App

### 1. Install Dependencies
```bash
cd farmer-mobile-app
npm install
```

### 2. Start Expo Development Server
```bash
npx expo start
```

- **Run on Physical Phone (Expo Go App)**: Scan the QR code displayed in terminal using the **Expo Go** app on iOS or Android.
- **Run on Android Emulator**: Press `a` in the terminal.
- **Run on iOS Simulator**: Press `i` in the terminal.
- **Run on Web Browser**: Press `w` in the terminal.

---

## 📦 Building Standalone APK / iOS App

To build a standalone `.apk` for Android physical devices:

```bash
# Install EAS CLI globally if not already installed
npm install -g eas-cli

# Build Android APK for direct installation
eas build -p android --profile preview
```
