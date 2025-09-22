globalThis.myApi = {
    ping: () => globalThis.ipcRenderer.emit("pong",{ hello: "test" })
}