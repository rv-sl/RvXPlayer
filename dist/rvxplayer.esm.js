// dist/rvxplayer.esm.js
// This file re-exports the player factory and also attaches window.RvXPlayer for global fallback.
// It imports local src modules (so ensure dist is served from repo root or adjust paths).

import EMBEDDED_CSS from '../src/css.js';
import { playerHTML } from '../src/html.js';
import { ensureLink, ensureScript, injectStyle, formatTime } from '../src/helpers.js';
import { parseSRT, convertToSeconds } from '../src/subtitles.js';
import { getDriveVideoURLs } from '../src/gdrive.js';
import { playM3u8 } from '../src/hls.js';

import PlayerFactory from '../src/player.js';

// Export default factory
const RvXPlayer = PlayerFactory;

// Global fallback
if (typeof window !== 'undefined') {
  window.RvXPlayer = window.RvXPlayer || RvXPlayer;
  try { window['RvXPlayer-V1'] = window.RvXPlayer; } catch (e) {}
}

export default RvXPlayer;
export { RvXPlayer };
