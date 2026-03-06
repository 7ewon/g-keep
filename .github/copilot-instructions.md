# G-Keep AI Coding Agent Instructions

## Project Overview
G-Keep is a React Native/Expo mobile app built with TypeScript that helps users find lost items and report found items via a map-based interface. The app uses a tab-based navigation structure with modal flows for reporting and tagging items.

**Key Tech Stack:**
- **Framework:** Expo 55 + React Native 0.83 + React 19
- **Routing:** Expo Router with file-based routing and typed routes
- **Styling:** Tailwind CSS + NativeWind for cross-platform styling
- **Build System:** Metro (configured via `metro.config.js`)

## Architecture & File Structure

### Core Navigation Layers
- **Root Layout** (`app/_layout.tsx`): Initializes fonts (Pretendard, SpaceMono), splash screen, and Root Stack navigation with slide animations (animation duration: 350ms)
- **Tab Layout** (`app/(tabs)/_layout.tsx`): Stack-based layout without headers; manages main flow screens and modal presentations
- **Routes:** File-based Expo Router with typed routes enabled (`experiments.typedRoutes: true`)

### Key Features
1. **Type Selection** (`app/(tabs)/index.tsx`): Initial flow asking if user is searching for lost items or reporting found items
2. **Tag System** (`app/(tabs)/tag.tsx`): Tagging interface for categorizing items
3. **Map View** (`app/(tabs)/map.tsx`): Map visualization of lost/found items
4. **Modal Preview** (`app/(tabs)/(modals)/preview.tsx`): Item preview modal with presentation mode

### Component Library
Located in `components/`:
- **`BoxCard.tsx`**: Square card with icon + label for selection flows (uses Feather icons)
- **`CardIcon.tsx`**: Large selection card with title/description and selection state
- **`CardNoIcon.tsx`**: Text-only variant of icon cards
- **`ButtonPrimary.tsx`**: Primary action button component
- **`Tag.tsx`**: Individual tag display component

## Styling & UI Conventions

### Tailwind + NativeWind Setup
- **Config:** `tailwind.config.js` defines `font-pretendard` and `font-pretendard-bold` custom font families
- **Global CSS:** `app/global.css` imports Tailwind directives and layers font family definitions
- **Babel:** Configured with `jsxImportSource: "nativewind"` for automatic class parsing
- **Metro:** Wrapped with `withNativeWind()` to process `app/global.css`

### Custom Font Loading
Fonts are preloaded in Root Layout and available as Tailwind classes:
- `font-pretendard-bold` → Pretendard-Bold (titles/headings)
- `font-pretendard` → Pretendard-Medium (body text)

### Animation Preferences
- Stack navigation: slide from right (iOS-style), 350ms duration
- Tab entry: fade animation for smooth appearance
- Avoid header flicker by keeping `headerShown: false` globally

## Development Workflows

### Run Commands
```bash
npm start          # Start development server
npm run ios        # Run on iOS simulator
npm run android    # Run on Android emulator
npm run web        # Run web build
```

### Type Safety
- **TypeScript strict mode enabled** in `tsconfig.json`
- **Path alias:** `@/*` maps to root directory for cleaner imports
- **Typed routes:** Expo Router will type-check route.push() calls

### Asset Import Pattern
- Icons: Use `expo-symbols` (platform-agnostic symbol library) or Feather icons
- Fonts: Preload via `useFonts()` in root layout before rendering UI
- Images: Place in `assets/images/`, referenced by relative path

## Critical Integration Points

### State Management Pattern
Component-level `useState` for local UI state (as seen in `index.tsx`). No central store detected—if adding shared state, consider Zustand, Redux, or React Context.

### Navigation Pattern
- Use `useRouter()` hook from `expo-router` for imperative navigation
- Modal screens use `options={{ presentation: 'modal' }}` in stack definition
- Avoid `headerShown: true` to maintain animation consistency

### Color Theming
`constants/Colors.ts` defines light/dark theme objects. React Navigation's `DefaultTheme` is used for theme application, but the app currently uses auto theme selection.

## Common Patterns & Conventions

### Component Props
- Use TypeScript type inference; destructure props inline (see `BoxCard.tsx`)
- Icon props typically accept icon names from icon libraries (Feather uses string keys)
- Selection states passed as booleans (e.g., `selected={selected === 'lost'}`)

### CSS Classes
- Prefer Tailwind shorthand: `flex-1`, `bg-gray-100`, `rounded-2xl` over inline styles
- Use `className` attribute (NativeWind converts to React Native styles)
- Custom fonts: Apply `font-pretendard` or `font-pretendard-bold` to Text components

### Responsive Layout
- Layout Flexbox with `flex-1`, `flex-col`, `px-8` (horizontal padding)
- Safe area handled by `react-native-safe-area-context` (installed dependency)

## Environment & Deployment

### EAS Configuration
- Project ID: `95a3520b-0202-49ca-aa62-94dc8831c220` (in `app.json`)
- iOS bundle: `com.yewonkim.g-keep`
- Android package: `com.yewonkim.gkeep`

### Platform-Specific Assets
- **iOS:** Icon in `ios/gkeep/Images.xcassets/`
- **Android:** Adaptive icon with foreground, background, and monochrome variants
- **Web:** Static bundler output with favicon

## Key Files Reference
- `app/_layout.tsx` — Font loading, splash screen, root navigation
- `tailwind.config.js` — Font customizations
- `app/global.css` — Tailwind imports and custom font layers
- `components/` — Reusable UI components (use as templates for new components)
- `constants/Colors.ts` — Theme color definitions
