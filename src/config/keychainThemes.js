// src/config/keychainThemes.js
//
// ═══════════════════════════════════════════════════════════════════
//  SCANOVA — KEYCHAIN THEME REGISTRY
//  Single source of truth for all keychain AR colors and targets.
//
//  TO ADD A NEW THEME:
//    1. Add your new target image to master-themes.mind in Cloudinary
//       (keep all existing images — just append the new one)
//    2. Note its index (0-based, in the order you compiled it)
//    3. Add a new entry below with the next sequential id
//    4. Run: npm run build
//    Done. No other files need touching.
//
//  TO CHANGE A COLOR:
//    Just edit bg/text below and redeploy. No DB migration needed.
//
//  RULES:
//    • id must match the exact index in master-themes.mind
//    • Never remove or reorder entries — printed keychains have
//      ids baked in permanently
//    • text should contrast clearly against bg (check WCAG AA)
//    • bg must be a valid CSS hex color
// ═══════════════════════════════════════════════════════════════════

export const KEYCHAIN_THEMES = [
  {
    id   : 0,
    name : 'Love',
    bg   : '#F472B6',   // Pink
    text : '#000000',
  },
  {
    id   : 1,
    name : 'Party',
    bg   : '#FDE047',   // Yellow
    text : '#000000',
  },
  {
    id   : 2,
    name : 'Memory',
    bg   : '#22D3EE',   // Cyan
    text : '#000000',
  },
  {
    id   : 3,
    name : 'Hype',
    bg   : '#9F7AEA',   // Purple
    text : '#FFFFFF',
  },
  {
    id   : 4,
    name : 'Mono',
    bg   : '#FFFFFF',   // White
    text : '#000000',
  },

  // ── ADD NEW THEMES BELOW THIS LINE ─────────────────────────────
  // Example:
  // {
  //   id   : 5,
  //   name : 'Forest',
  //   bg   : '#22C55E',
  //   text : '#000000',
  // },
];

// ── Derived helpers — import these instead of re-deriving elsewhere ──

/** Total number of themes. Matches the target count in master-themes.mind */
export const THEME_COUNT = KEYCHAIN_THEMES.length;

/**
 * Get a theme by its id (= MindAR target index).
 * Falls back to theme 0 if id is out of range or missing.
 */
export function getTheme(id) {
  return KEYCHAIN_THEMES.find((t) => t.id === id) ?? KEYCHAIN_THEMES[0];
}

/**
 * Resolve any raw value (Int, numeric string, or legacy string name)
 * to a valid theme id integer. Safe to call with untrusted DB data.
 */
export function resolveThemeId(raw) {
  if (typeof raw === 'number' && Number.isFinite(raw)) {
    const id = Math.round(raw);
    return KEYCHAIN_THEMES.some((t) => t.id === id) ? id : 0;
  }
  if (typeof raw === 'string') {
    // Try numeric string first ("3" → 3)
    const parsed = parseInt(raw, 10);
    if (!isNaN(parsed)) return resolveThemeId(parsed);
    // Try legacy string name ("love" → 0)
    const byName = KEYCHAIN_THEMES.find(
      (t) => t.name.toLowerCase() === raw.toLowerCase()
    );
    if (byName) return byName.id;
  }
  return 0;
}

/**
 * Valid id integers — use for API validation.
 * Auto-updates when you add new themes above.
 */
export const VALID_THEME_IDS = KEYCHAIN_THEMES.map((t) => t.id);