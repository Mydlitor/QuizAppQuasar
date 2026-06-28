import { app, BrowserWindow, Menu, ipcMain, protocol, net } from "electron";
import path from "node:path";
import os from "node:os";
import { fileURLToPath } from "node:url";
import fs from "node:fs/promises";

const platform = process.platform || os.platform();

const currentDir = fileURLToPath(new URL(".", import.meta.url));

let mainWindow;

async function createWindow() {
    mainWindow = new BrowserWindow({
        icon: path.resolve(currentDir, "icons/icon.png"), // tray icon
        width: 1000,
        height: 600,
        useContentSize: true,
        autoHideMenuBar: true,
        kiosk: true,
        webPreferences: {
            contextIsolation: true,
            preload: path.resolve(
                currentDir,
                path.join(
                    process.env.QUASAR_ELECTRON_PRELOAD_FOLDER,
                    "electron-preload" + process.env.QUASAR_ELECTRON_PRELOAD_EXTENSION,
                ),
            ),
        },
    });

    Menu.setApplicationMenu(null);
    mainWindow.setMenuBarVisibility(false);

    if (process.env.DEV) {
        await mainWindow.loadURL(process.env.APP_URL);
    } else {
        await mainWindow.loadFile("index.html");
    }

    if (process.env.DEBUGGING) {
        mainWindow.webContents.openDevTools();
    } else {
        mainWindow.webContents.on("devtools-opened", () => {
            mainWindow.webContents.closeDevTools();
        });
    }

    mainWindow.on("closed", () => {
        mainWindow = null;
    });
}

function getTeamsFilePath() {
    return path.join(app.getPath("userData"), "QuizApp", "teams.json");
}

function getQuestionsFilePath() {
    return path.join(app.getPath("userData"), "QuizApp", "questions.json");
}

function getMediaFilePath(filename) {
    return path.join(app.getPath("userData"), "QuizApp", "media", filename);
}

async function saveTeamsToDiskAsync(filepath, data) {
    const dir = path.dirname(filepath);
    await fs.mkdir(dir, { recursive: true });
    const tmp = filepath + ".tmp";
    const json = JSON.stringify({ teams: data }, null, 2);
    await fs.writeFile(tmp, json, "utf8");
    await fs.rename(tmp, filepath);
}

async function saveQuestionsToDiskAsync(filepath, data) {
    const dir = path.dirname(filepath);
    await fs.mkdir(dir, { recursive: true });
    const tmp = filepath + ".tmp";
    const json = JSON.stringify(data, null, 2);
    await fs.writeFile(tmp, json, "utf8");
    await fs.rename(tmp, filepath);
}

async function loadTeamsFromDisk(filepath) {
    try {
        const txt = await fs.readFile(filepath, "utf8");
        return JSON.parse(txt);
    } catch {
        return null;
    }
}

async function loadQuestionsFromDisk(filepath) {
    try {
        const txt = await fs.readFile(filepath, "utf8");
        return JSON.parse(txt);
    } catch {
        return null;
    }
}

async function saveMediaFileAsync(filepath, file) {
    const dir = path.dirname(filepath);
    await fs.mkdir(dir, { recursive: true });
    const tmp = filepath + ".tmp";
    await fs.writeFile(tmp, file, "utf8");
    await fs.rename(tmp, filepath);
}

ipcMain.handle("app:quit", () => {
    app.quit();
});

ipcMain.handle("teams:save", async (event, teams) => {
    const file = getTeamsFilePath();
    await saveTeamsToDiskAsync(file, teams);
    return { ok: true };
});

ipcMain.handle("questions:save", async (event, questions) => {
    const file = getQuestionsFilePath();
    await saveQuestionsToDiskAsync(file, questions);
    return { ok: true };
});

ipcMain.handle("teams:load", async () => {
    const file = getTeamsFilePath();
    const data = await loadTeamsFromDisk(file);
    return data; // may be null
});

ipcMain.handle("questions:load", async () => {
    const file = getQuestionsFilePath();
    const data = await loadQuestionsFromDisk(file);
    return data; // may be null
});

ipcMain.handle("media:save", async (event, file) => {
    const filepath = getMediaFilePath(file.name);
    await saveMediaFileAsync(filepath, file.data);
    return { ok: true };
});

app.whenReady().then(() => {
    protocol.handle("media", (request) => {
        const url = request.url.replace("media://", "");
        const decodedUrl = decodeURIComponent(url);
        const filepath = getMediaFilePath(decodedUrl);
        return net.fetch("file://" + filepath);
    });
    createWindow();
});

app.on("window-all-closed", () => {
    if (platform !== "darwin") {
        app.quit();
    }
});

app.on("activate", () => {
    if (mainWindow === null) {
        createWindow();
    }
});
