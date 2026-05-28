import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("api", {
    saveTeams: async (teams) => {
        return ipcRenderer.invoke("teams:save", teams);
    },
    loadTeams: async () => {
        return ipcRenderer.invoke("teams:load");
    },
});
