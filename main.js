// 引入electron并创建一个Browserwindow
const { app, BrowserWindow } = require('electron');
const path = require('path');
const url = require('url');
const childProcess = require('child_process');

const log = require('electron-log');
const { autoUpdater } = require('electron-updater');

// 保持window对象的全局引用,避免JavaScript对象被垃圾回收时,窗口被自动关闭.
let mainWindow;
let pyProc = null;

const createPyProc = () => {
  const script = path.join(__dirname, 'pydist', 'api', 'api');
  pyProc = childProcess.execFile(script);
  if (pyProc) {
    /* eslint-disable-next-line */
    console.log('child process success');
  }
};

const createWindow = () => {
  let width = 1000;
  if (process.env.ENVIRONMENT === 'development') {
    width = 1550;
  }
  //创建浏览器窗口,宽高自定义具体大小你开心就好
  mainWindow = new BrowserWindow({
    width: width,
    height: 600,
    webPreferences: {
      nodeIntegration: false,
      preload: __dirname + '/preload.js',
    },
  });

  // 加载应用-----  electron-quick-start中默认的加载入口
  if (process.env.ENVIRONMENT === 'development') {
    mainWindow.loadURL('http://localhost:8080/');
    // 打开开发者工具，默认不打开
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadURL(url.format({
      pathname: path.join(__dirname, './build/index.html'),
      protocol: 'file:',
      slashes: true,
    }));
  }

  createPyProc();

  // 关闭window时触发下列事件.
  mainWindow.on('closed', function() {
    mainWindow = null;
  });
};

// 当 Electron 完成初始化并准备创建浏览器窗口时调用此方法
app.on('ready', createWindow);

// 所有窗口关闭时退出应用.
app.on('window-all-closed', function() {
  // macOS中除非用户按下 `Cmd + Q` 显式退出,否则应用与菜单栏始终处于活动状态.
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', function() {
  // macOS中点击Dock图标时没有已打开的其余应用窗口时,则通常在应用中重建一个窗口
  if (mainWindow === null) {
    createWindow();
  }
});

function sendStatusToWindow(text) {
  log.info(text);
  mainWindow.webContents.send('message', text);
}

autoUpdater.on('checking-for-update', () => {
  sendStatusToWindow('Checking for update...');
});
autoUpdater.on('update-available', (info) => {
  info.viewPo = 'Update available.';
  sendStatusToWindow(info);
});
autoUpdater.on('update-not-available', (info) => {
  info.viewPo = 'Update not available.';
  sendStatusToWindow(info);
});
autoUpdater.on('error', (err) => {
  err.viewPo = 'Error in auto-updater.';
  sendStatusToWindow(err);
});
autoUpdater.on('download-progress', (progressObj) => {
  let log_message = 'Download speed: ' + progressObj.bytesPerSecond;
  log_message = log_message + ' - Downloaded ' + progressObj.percent + '%';
  log_message = log_message + ' (' + progressObj.transferred + '/' + progressObj.total + ')';
  sendStatusToWindow(log_message);
});
autoUpdater.on('update-downloaded', (info) => {
  info.viewPo = 'Update downloaded.';
  sendStatusToWindow(info);
});

// 你可以在这个脚本中续写或者使用require引入独立的js文件.

app.on('ready', function() {
  autoUpdater.checkForUpdatesAndNotify();
});
