// Minimal preload — game is pure client-side, no IPC needed
// contextBridge exposed here if inter-process communication is ever required

import { contextBridge } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
  platform: process.platform,
  version: process.versions.electron,
});
