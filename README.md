# Wvy
**Wvy** is a pretty random project i made as experimenting stuff

It uses Rust for the native binary and uses Deno to communicate with the binary. Inside Rust, It uses wry to enable webview rendering, and using deno as main process to send message back to the frontend.

## Example API
The API should be familar for Electron user.
```ts
function createWindow(){
    const win = new WebviewWindow({
        width:800,
        height:600
    })

    win.loadFile('index.html')
}

app.on("init",() => {
  createWindow()
})

app.on("window-all-closed",() => {
  app.quit()
})
```

## Installation
Currently i am not satisfied by the architecture but thats the most i could do, so it is not published on jsr, but downloadable through github by downloading the whole repo.

To run it, Deno is required.

To inspect rust side code, [click here](https://github.com/YunnoKon/deno_wry)