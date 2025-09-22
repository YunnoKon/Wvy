import { RpcClient } from '../rpc/client.ts'
import { app } from "./App.ts";

interface WindowOptions {
    title?: string,
    width?: number,
    height?: number,
    maximized?: boolean,
    resizable?: boolean,
    preload?: string
}

export class WebviewWindow {
    private options: WindowOptions = {
        title: "Wvy",
        width: 800,
        height: 600,
        maximized: false,
        resizable: true
    };
    id: number;
    private client: RpcClient = app.client;

    /**
     * Creates a WebView window.
     *
     * @param {WindowOptions} options - Option to adjust window properties.
    */
    constructor(opt: WindowOptions){
        this.options = { ...this.options, ...opt }
        this.id = app.windowCount;

        if(this.options.preload) this.options.preload = Deno.realPathSync(this.options.preload);

        app.windowCount++;
        this.client.send({
            method: "CreateWindow",
            id: this.id,
            options: this.options
        });
    }

    /**
     * Loads external website and custom app protocol URL.
     * ```
     * win.loadURL("https://deno.com")
     * ```
     *
     * @param {string} URL - The link of external website/app protocol
    */
    loadURL(url: string){
        this.client.send({
            method: "LoadUrl",
            id: this.id,
            url
        });
    }

    /**
     * Loads HTML file with custom app protocol.
     * ```
     * win.loadFile("index.html")
     * ```
     *
     * @param {string} filePath - The file path of the html file
    */
    loadFile(filePath: string){
        const resolved = Deno.realPathSync(filePath);
        this.client.send({
            method: "LoadUrl",
            id: this.id,
            url:`https://app.localhost/${resolved}`
        });
    }

    /**
     * Loads html string, to note it doesn't load external file.\
     * To load external file such as CSS, use loadFile instead.
     * ```
     * win.loadHtml("<h1>Hello World!</h1>")
     * ```
     *
     * @param {string} html - the html content to load
    */
    loadHtml(html: string){
        this.client.send({
            method: "LoadHtml",
            id:this.id,
            html
        })
    }
}