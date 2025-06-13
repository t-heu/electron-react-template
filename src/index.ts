import { app, BrowserWindow, ipcMain, dialog } from 'electron';
import path from 'path';
import fs from 'fs';
import os from"os";

declare const MAIN_WINDOW_WEBPACK_ENTRY: string;
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string;

if (require('electron-squirrel-startup')) {
  app.quit();
}

const downloadsPath = process.env.NODE_ENV === 'development' ? __dirname : path.join(process.env.USERPROFILE, 'Downloads');

process.on("uncaughtException", (error) => logError("Error: ", error))

const createWindow = (): void => {
  const mainWindow = new BrowserWindow({
    height: 600,
    width: 800,
    icon: path.join(__dirname, 'assets', 'icons', 'icon.ico'),
    webPreferences: {
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
    },
  });

  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);
  mainWindow.setMenu(null);

  if (!app.isPackaged) {
    mainWindow.webContents.openDevTools();
  }  

  ipcMain.on('download-single-pdf', async () => {
    console.log(mainWindow, downloadsPath);
  });
};

const logError = async (title: string, error: Error | any) => {
  await dialog.showMessageBox({
    type: "error",
    title: "Erro ao Gerar PDF",
    message: `Ocorreu um erro durante a geração do PDF. Detalhes: ${error.message}`,
    buttons: ["OK"],
  });

  const logPath = path.join(app.getPath("userData"), "wmslabeler-error.log");

  const cpuUsage = process.getCPUUsage(); // Uso de CPU pelo processo Electron
  const memoryUsage = process.memoryUsage(); // Uso de memória detalhado

  // Criar um identificador único para cada erro
  const errorId = Math.random().toString(36).substring(2, 10);

  const systemInfo = `
    [Sistema Operacional] ${os.platform()} - ${os.release()}
    [Arquitetura] ${os.arch()}
    [CPU] ${os.cpus()[0].model}
    [Memória Total] ${(os.totalmem() / 1024 / 1024).toFixed(2)} MB
    [Memória Livre] ${(os.freemem() / 1024 / 1024).toFixed(2)} MB
    [Uso de CPU] ${(cpuUsage.percentCPUUsage * 100).toFixed(2)}%
    [Memória RSS] ${(memoryUsage.rss / 1024 / 1024).toFixed(2)} MB
    [Heap Total] ${(memoryUsage.heapTotal / 1024 / 1024).toFixed(2)} MB
    [Heap Usado] ${(memoryUsage.heapUsed / 1024 / 1024).toFixed(2)} MB
  `;

  const logContent = `
    [${new Date().toISOString()}] - Erro ID: ${errorId}
    [Título] ${title}
    [Erro] ${error.message}
    [Stacktrace] ${error.stack}

    [App Versão] ${app.getVersion()}
    [Caminho do App] ${app.getPath("exe")}
    ${systemInfo}
    ----------------------------
  `;

  try {
    fs.appendFileSync(logPath, logContent);
  } catch (logError) {
    console.error("Erro ao escrever no log:", logError);
  }
};

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
