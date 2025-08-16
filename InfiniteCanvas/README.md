# InfiniteCanvas - Social Media App

A revolutionary social media app that reimagines social interaction through an infinite spatial canvas where users can explore, create, and connect in a boundless digital space.

## Features

### 🎨 Infinite Canvas Navigation
- Pan and zoom through an infinite 2D space
- Place posts anywhere on the canvas
- Smooth gesture-based navigation
- Grid background for spatial orientation

### 📱 Core Social Features
- **Posts**: Share images, videos, and audio with spatial positioning
- **Stories**: 24-hour disappearing content with viewer tracking
- **Likes & Comments**: Engage with content through reactions
- **User Profiles**: Customizable profiles with post grids
- **Authentication**: Secure login and signup system

### 🎯 Media Support
- Photo capture and gallery selection
- Video recording and playback
- Audio recording (coming soon)
- Multiple media items per post

### 🎨 Modern UI/UX
- Dark theme optimized for OLED screens
- Smooth animations and transitions
- Instagram-style story viewer
- Bottom navigation bar
- Modal-based screens

## Tech Stack

- **React Native** with Expo
- **TypeScript** for type safety
- **Zustand** for state management
- **React Navigation** for routing
- **React Native Reanimated** for animations
- **Expo modules** for native functionality

## Getting Started

### Prerequisites

- Node.js 16+
- npm or yarn
- Expo CLI
- Android Studio (for Android development)
- Xcode (for iOS development, macOS only)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd InfiniteCanvas
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npx expo start
```

### Running on Device

#### Android
```bash
npx expo run:android
```

#### iOS
```bash
npx expo run:ios
```

## Building APK for Android

### Method 1: Using EAS Build (Recommended)

1. Install EAS CLI:
```bash
npm install -g eas-cli
```

2. Configure your Expo account:
```bash
eas login
```

3. Configure the project:
```bash
eas build:configure
```

4. Build APK:
```bash
eas build -p android --profile preview
```

### Method 2: Local Build

1. Install Expo CLI globally:
```bash
npm install -g expo-cli
```

2. Prebuild the project:
```bash
npx expo prebuild
```

3. Navigate to android folder:
```bash
cd android
```

4. Build APK:
```bash
./gradlew assembleRelease
```

The APK will be located at:
`android/app/build/outputs/apk/release/app-release.apk`

### Method 3: Using Expo (Deprecated but simpler)

```bash
expo build:android -t apk
```

## Project Structure

```
InfiniteCanvas/
├── src/
│   ├── components/     # Reusable UI components
│   ├── screens/        # Screen components
│   ├── navigation/     # Navigation configuration
│   ├── store/          # Zustand state management
│   ├── types/          # TypeScript type definitions
│   ├── services/       # API and external services
│   └── utils/          # Utility functions
├── assets/             # Images, fonts, etc.
├── App.tsx            # Root component
└── app.json           # Expo configuration
```

## Key Components

- **InfiniteCanvas**: Core canvas component with pan/zoom
- **PostNode**: Individual post display on canvas
- **CreatePostModal**: Multi-media post creation
- **StoriesBar**: Horizontal story display
- **StoryViewer**: Full-screen story viewer

## Permissions

The app requires the following permissions:
- Camera (for taking photos/videos)
- Media Library (for selecting photos/videos)
- Microphone (for audio recording)

## Future Enhancements

- [ ] Real-time messaging system
- [ ] Advanced search and discovery
- [ ] User following/followers system
- [ ] Push notifications
- [ ] Backend integration
- [ ] Social login (Google, Facebook)
- [ ] Video filters and effects
- [ ] AR features
- [ ] Location-based posts

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.