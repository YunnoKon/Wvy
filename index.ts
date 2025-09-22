import { app, ipcMain, WebviewWindow } from "./lib/mod.ts";

function createWindow(){
    const win = new WebviewWindow({
        width:800,
        height:600,
        preload:'preload.js'
    })

    win.loadFile('renderer/index.html')
}

app.on("init",() => {
  createWindow()
})

app.on("window-all-closed",() => {
  app.quit()
})

ipcMain.on("pong",(e,id) => {
    ipcMain.sendTo("pang",e,id)
})