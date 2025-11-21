const { app, BrowserWindow } = require('electron');

const EXTRA_WINDOWS = 0; // Adjust this to change how many extra windows are created.

let mainWindow;
const extraWindows = [];

function createMainWindow() {
  const win = new BrowserWindow({
    width: 2000,
    height: 800,
    webPreferences: {
      // Keep animations running even when the window is not focused.
      backgroundThrottling: false
    }
  });

  win.loadFile('index.html');
 
  win.setPosition(800, 800);
 
  win.webContents.openDevTools();

  win.on('closed', () => {
    mainWindow = null;
  });

  return win;
}

function createExtraWindows(count) {
  for (let i = 0; i < count; i++) {
    const win = new BrowserWindow({
      width: 400,
      height: 300,
      useContentSize: true,
      webPreferences: {
        backgroundThrottling: false
      }
    });

    win.loadFile('simple.html');

    // Stagger window positions so they don't all stack exactly.
    const x = 60 + (i % 4) * 420;
    const y = 60 + Math.floor(i / 4) * 320;
    win.setPosition(x, y);

    win.on('closed', () => {
      const idx = extraWindows.indexOf(win);
      if (idx !== -1) {
        extraWindows.splice(idx, 1);
      }
    });

    extraWindows.push(win);
  }
}

app.whenReady().then(() => {
  mainWindow = createMainWindow();
  createExtraWindows(EXTRA_WINDOWS);
});

app.on('window-all-closed', () => {
  // Standard macOS behavior: keep app alive until Cmd+Q.
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    mainWindow = createMainWindow();
    createExtraWindows(EXTRA_WINDOWS);
  }
});