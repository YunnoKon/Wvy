import { IpcListener, IpcMessage } from "../types.ts";
import { RpcClient } from '../rpc/client.ts'
import { app } from "./App.ts";

class IpcMain {
    private listeners: Map<string, IpcListener<any>[]> = new Map();
    private client: RpcClient = app.client;

    constructor(){
        this.client.on('ipc-message',(e) => {
            const message: IpcMessage = JSON.parse(e.body!)
            this.emit(message.channel,message.payload,e.id!)
        })
    }

    on<T = any>(channel: string,handler: IpcListener<T>){
        if(!this.listeners.has(channel)){
            this.listeners.set(channel,[]);
        }

        this.listeners.get(channel)?.push(handler);
    }

    private emit(channel: string, ev: any, id: number){
        this.listeners.get(channel)?.forEach(fn => fn(ev,id));
    }

    sendTo(channel: string, payload: any, windowsId: number){
        this.client.send({
            method: "EmitToWebview",
            id: windowsId,
            channel,
            payload: JSON.stringify(payload)
        })
    }
}

export const ipcMain = new IpcMain();