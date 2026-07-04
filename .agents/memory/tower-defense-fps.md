---
name: Tower Defense FPS
description: Architecture and gotchas for the Babylon.js FPS Tower Defense game in artifacts/tower-defense-fps
---

## Overview
- **Stack**: Babylon.js v9 (WebGPU primary → WebGL2 fallback), React (HUD overlay only), Zustand store
- **Artifact**: `artifacts/tower-defense-fps`, previewPath `/`, workflow `artifacts/tower-defense-fps: web`
- **GitHub**: https://github.com/debugmi530-del/tower-defense-fps (account: debugmi530-del)
- **Game data**: 40 units (6 eras), 100 enemies (10 tiers), 20 bosses (every 5th wave), 10 upgrade paths

## Key Architecture Decisions
- Babylon.js runs in a single `HTMLCanvasElement`; React mounts UI overlays in `position: absolute` divs on top
- All game state lives in `src/store/gameStore.ts` (Zustand); game systems read/write it via `useGameStore.getState()`
- Game loop is in `GameController.ts` → `engine.runRenderLoop()`; tick only runs when `phase === 'playing'`
- Menu input (Start/B for pause/resume) handled separately in `handleMenuInput()` so gamepad works in all phases

## WebGL in Replit Preview
**Why:** The Replit preview iframe uses a headless/sandboxed browser environment that blocks WebGL context creation.
**How to apply:** The game works correctly when opened in a real browser tab. The GamePage shows a graceful error with "Open in new tab" link when WebGL is unavailable. Do NOT try to remove this check.

## Known Game Loop Rules (from code review fixes)
- **Combat**: Always flush `updatedEnemies` to store each frame (non-lethal damage must persist); re-check `updatedEnemies[].isAlive` when targeting to prevent duplicate kills
- **Wave completion**: Re-read `useGameStore.getState()` (fresh snapshot) after spawning enemies to check completion
- **Wave start**: `completeWave()` schedules the next `startWave(n+1)` via setTimeout directly — no separate 'waveAnnounce' trigger needed in GameController
- **Scene flags**: Do NOT set `scene.useGeometryIdsMap`, `useMaterialMeshMap`, `useClonedMeshMap` — they are read-only in Babylon.js v9

## File Map
- `src/game/engine.ts` — WebGPU/WebGL engine init, arena geometry, post-processing (bloom, FXAA, vignette)
- `src/game/gamepad.ts` — `pollGamepad()`, `BTN` constants
- `src/game/GameController.ts` — main game loop, all system orchestration, player movement/shooting
- `src/game/systems/waveManager.ts` — wave config, enemy spawning, wave completion, boss triggers
- `src/game/systems/entityManager.ts` — mesh sync (instanced rendering), enemy/boss movement toward tower
- `src/game/systems/combatSystem.ts` — unit targeting, damage, AoE, player shoot, special ability
- `src/game/data/{units,enemies,bosses,upgrades}.ts` — static game data
- `src/store/gameStore.ts` — full Zustand store (player, tower, wave, units, enemies, gold, upgrades, stats)
- `src/pages/GamePage.tsx` — canvas mount, WebGL error handling, phase-based overlay routing
- `src/components/{HUD,MainMenu,UpgradeMenu,GameOver,PauseMenu,WaveAnnounce}.tsx` — React UI
