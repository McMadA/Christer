# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Christelijke Hitster is a digital music timeline game based on Christian music (psalms, hymns, Opwekking, Sela, modern worship). Players listen to song previews via Spotify and place cards in chronological order on their timeline.

## Development Commands

### Local Development
```bash
npm run dev        # Start Vite dev server on port 3000
npm run build      # Build for production (outputs to /dist)
npm run preview    # Preview production build locally
```

### Package Management
- Always use `npm ci` in CI/CD (package-lock.json is committed)
- Use `npm install` for local development

## Deployment

### Build Configuration
- **Base path**: `/christer/` - The app is deployed to a subpath, not root
  - All asset references use this base path (configured in vite.config.ts)
  - Change `base` in vite.config.ts if deploying elsewhere

### CI/CD Pipeline
- Auto-deploys to production on push to `main` branch
- GitHub Actions workflow: `.github/workflows/main.yml`
- Deploys built `/dist` folder via FTP to `domains/creationaltfix.nl/public_html/christer/`
- Uses `dangerous-clean-slate: true` to remove old files on server

## Architecture

### Core Game Flow
The game state is managed in `App.tsx` using React hooks:

1. **Game States**: `intro` → `playing` → `correct`/`wrong` → `gameover`
2. **Timeline Placement Logic** (App.tsx:44-91):
   - Players place cards between existing timeline cards
   - Validation checks if year fits chronologically
   - **Special case**: Wildcard category can be placed anywhere (always correct)
3. **Lives System**: Players start with 3 lives, lose one per wrong placement
4. **Scoring**: Score increments by 1 for each correct placement

### Data Model

**SongCard** (types.ts):
- `category`: 'Basis' | 'Periode' | 'Herkenning' | 'Inhoud' | 'Wildcard'
- `difficulty`: 'Groen' (easy) | 'Geel' (medium) | 'Rood' (hard)
- `spotifyPreviewUrl`: Audio preview link (currently using placeholder audio)
- `question`: Optional field for content/recognition cards

**GameState** (types.ts):
- `timeline`: Array of correctly placed cards (chronologically sorted)
- `currentCard`: Card player is currently placing
- `deck`: Remaining shuffled cards
- `status`: Current game phase

### Component Structure

**App.tsx** - Main game orchestrator
- Manages all game state and logic
- Renders different screens based on game status
- Contains `PlacementButton` component for timeline insertion points

**CardComponent.tsx** - Visual card representation
- Color-coded by difficulty (green/yellow/red) or purple for wildcards
- Shows/hides year based on `isRevealed` prop
- Category icons and badges
- Responsive design (sm: breakpoints for mobile)

**AudioPlayer.tsx** - Spotify preview player
- Simulated 30-second preview playback
- Progress bar and play/pause controls
- Spinning disc animation when playing
- Auto-pauses when card is placed (controlled by parent)

### Mock Data
`constants.ts` contains `MOCK_DECK` with 18 sample cards:
- Covers years 1529-2024 (wide historical range)
- Mix of categories: mostly Basis, one Wildcard, some Herkenning/Inhoud
- Placeholder audio URLs (SoundHelix demo tracks)
- **Production note**: Replace with real Spotify API integration

## Environment Variables

The app expects `GEMINI_API_KEY` environment variable (currently unused in code but configured in vite.config.ts). This appears to be for future AI integration for content questions.

Create a `.env` file:
```
GEMINI_API_KEY=your_api_key_here
```

## Path Aliasing

The project uses `@/` alias for imports:
- Maps to project root directory
- Configured in both `vite.config.ts` and `tsconfig.json`
- Example: `import { SongCard } from '@/types'`

## Styling

- **Tailwind CSS** (utility-first, no separate CSS files)
- **Responsive breakpoints**: Uses `sm:` prefix for mobile-first responsive design
- **Color scheme**:
  - Primary: Indigo/Purple gradient
  - Success: Emerald green
  - Error: Rose red
  - Wildcard: Purple
  - Difficulty colors: Emerald (easy), Amber (medium), Rose (hard)

## Key Implementation Details

### Wildcard Logic
Wildcard cards bypass chronological validation (App.tsx:54-56). They can be placed anywhere and always count as correct. The year is still revealed after placement, adding a new anchor point to the timeline.

### Audio State Management
- Audio playback state (`isPlaying`) is reset to `false` when:
  - Card is placed (App.tsx:90)
  - New turn starts (App.tsx:116)
- This prevents audio from continuing between rounds

### Placement Buttons
The `PlacementButton` component (App.tsx:273-298) appears between each card and at both ends of the timeline. It's only interactive when `status === 'playing'`, otherwise renders as a subtle spacer to maintain layout.

## Future Integration Notes

- **Spotify API**: Replace `MOCK_DECK` preview URLs with real Spotify track IDs and preview URLs
- **Backend**: Currently frontend-only; may need Supabase/Firebase for:
  - Multiplayer support
  - Score persistence
  - Extended card database
- **Content Questions**: The `question` field on cards is defined but not actively used in gameplay logic yet
