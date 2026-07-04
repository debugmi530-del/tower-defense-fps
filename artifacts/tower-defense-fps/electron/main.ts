import { app, BrowserWindow, shell } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Disable sandbox for WebGL/WebGPU access
app.commandLine.appendSwitch('enable-features', 'Vulkan,UseSkiaRenderer');
app.commandLine.appendSwitch('enable-unsafe-webgpu');
app.commandLine.appendSwitch('ignore-gpu-blocklist');
app.commandLine.appendSwitch('enable-gpu-rasterization');
app.commandLine.appendSwitch('enable-zero-copy');

function createWindow(): void {
  const win = new BrowserWindow({
    width: 1280,
    height: 720,
    minWidth: 800,
    minHeight: 600,
    title: 'Tower Defense FPS',
    backgroundColor: '#050510',
    show: false,
    autoHideMenuBar: true,
    icon: path.join(__dirname, '../public/favicon.ico'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      // Allow WebGL
      offscreen: false,
    },
  });

  // Maximise on start for gaming experience
  win.maximize();
  win.setMenuBarVisibility(false);

  // Load the built renderer
  const rendererPath = path.join(__dirname, '../dist/renderer/index.html');
  win.loadFile(rendererPath);

  // Show window once ready (avoids white flash)
  win.once('ready-to-show', () => {
    win.show();
    win.focus();
  });

  // Open external links in system browser
  win.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });

  // Toggle fullscreen with F11
  win.webContents.on('before-input-event', (_event, input) => {
    if (input.key === 'F11' && input.type === 'keyDown') {
      win.setFullScreen(!win.isFullScreen());
    }
    if (input.key === 'Escape' && input.type === 'keyDown' && win.isFullScreen()) {
      win.setFullScreen(false);
    }
  });
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  app.quit();
});
