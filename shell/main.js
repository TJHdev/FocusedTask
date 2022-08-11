const { menubar } = require('menubar');
const electron = require('electron');
const url = require('url');
const path = require('path');
const settings = require('./utils/settings');
const autoUpdate = require('./utils/autoupdate');
const switchTask = require('./utils/switchTask');

const isDev = !!process.env.ELECTRON_START_URL;

const mb = menubar({
  index:
    process.env.ELECTRON_START_URL ||
    url.format({
      pathname: path.join(__dirname, './build/index.html'),
      protocol: 'file:',
      slashes: true,
    }),
  icon: path.join(__dirname, 'assets/MenuBarIconTemplate.png'),
  // preloadWindow: true,
  browserWindow: {
    width: 500,
    height: 600,
    minWidth: 300,
    maxHeight: 900,
    backgroundColor: '#FAFAFA',
    webPreferences: {
      nodeIntegration: true,
      scrollBounce: true,
    },
    alwaysOnTop: true,
  },
});

// setTimeout(() => {
//   mb.showWindow();
// }, 2000);

mb.on('after-create-window', () => {
  settings.trackWindowBounds(mb);
});

// mb.app.on('will-finish-launching', () => {
//   console.log('will-finish-launching');
//   mb.showWindow();
// });

mb.app.on('ready', () => {
  console.log('Ready');
  settings.setWindowBounds(mb);
  settings.setGlobalShortcut(mb);

  // mb.showWindow();

  const map = {};
  const attemptToShowWindow = () => {
    console.log('trying to open window');
    if (mb.showWindow) {
      mb.showWindow();
      clearInterval(map.interval);
    }
  };
  map.interval = setInterval(attemptToShowWindow, 200);

  setInterval(() => {
    // mb.showWindow();
  }, 2000);

  if (!isDev) {
    autoUpdate();
  }
});

mb.app.on('will-quit', () => {
  electron.globalShortcut.unregisterAll();
});

mb.app.allowRendererProcessReuse = false;

mb.app.on('web-contents-created', (e, contents) => {
  console.log('testzzz');
  const openExternal = (e, url) => {
    e.preventDefault();
    electron.shell.openExternal(url);
  };

  contents.on('new-window', openExternal);
  contents.on('will-navigate', (e, url) => {
    if (url !== contents.getURL()) {
      openExternal(e, url);
    }
  });
});

electron.ipcMain.on('resize', function (_e, width, height) {
  mb.window.setSize(width, height);
});

electron.ipcMain.on('show-window', () => {
  mb.showWindow();
});
electron.ipcMain.on('hide-window', () => {
  mb.hideWindow();
});

electron.ipcMain.on('updateGlobalShortcutKey', function (_e, key) {
  settings.updateGlobalShortcutKey(mb, key);
});

switchTask.register(mb);
