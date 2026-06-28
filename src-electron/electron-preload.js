import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("api", {
    saveTeams: async (teams) => {
        return ipcRenderer.invoke("teams:save", teams);
    },
    saveQuestions: async (questions) => {
        return ipcRenderer.invoke("questions:save", questions);
    },
    loadTeams: async () => {
        return ipcRenderer.invoke("teams:load");
    },
    loadQuestions: async () => {
        return ipcRenderer.invoke("questions:load");
    },
    saveMedia: async (file) => {
        return ipcRenderer.invoke("media:save", file);
    },
    quitApp: () => {
        return ipcRenderer.invoke("app:quit");
    },
});
