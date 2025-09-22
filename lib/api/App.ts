import { getHelperPath } from "../utils.ts";
import { RpcClient } from "../rpc/client.ts";
import { EventOut } from "../types.ts";

class App {
    client: RpcClient;
    windowCount: number = 0;

    constructor(client: RpcClient){
        this.client = client;

        this.client.on("window-closed",() => {
            this.windowCount--;
            if(this.windowCount==0) this.client.emit("window-all-closed")
        })
    }

    static async create(): Promise<App> {
        const helperPath = await getHelperPath(); // async download if missing
        const client = new RpcClient(helperPath);
        return new App(client);
    }

    /**
     * Listens event from the runtime process
     * ```
     * app.on("init",() => { 
     *     // do stuff here... 
     * })
     * ```
     *
     * @param {string} event - The event name to listen to
     * @param {Function} handler - Event handler to handle the event
    */
    on(event: string, handler: (event: EventOut) => void){
        this.client.on(event, handler);
    }

    /**
     * Quit the runtime process
     * ```
     * app.quit()
     * ```
    */
    quit(){
        this.client.send({
            method:"Exit"
        })
    }
}

export const app = await App.create();