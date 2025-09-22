import { encodeMessage, decodeMessage } from "./protocol.ts";
import { BufferedReader } from "./reader.ts";
import { toKebabCase } from "@std/text";
import { Listener, EventOut } from "../types.ts";

export class RpcClient {
  private writer: WritableStreamDefaultWriter<Uint8Array>;
  private reader: BufferedReader;
  private listeners: Map<string, Listener<any>[]> = new Map();

  constructor(cmdPath: string) {
    const cmd = new Deno.Command(cmdPath, {
      stdin: "piped",
      stdout: "piped",
    });
    const child = cmd.spawn();
    this.writer = child.stdin.getWriter();
    this.reader = new BufferedReader(child.stdout.getReader());

    this.listenLoop();
  }

  async send(msg: any) {
    const encoded = encodeMessage(msg);
    await this.writer.write(encoded);
  }

  emit(eventName: string, ev?: EventOut){
    this.listeners.get(eventName)?.forEach(fn => fn(ev));
  }

  on<T = EventOut>(eventName: string, handler: Listener<T>){
    if(!this.listeners.has(eventName)){
      this.listeners.set(eventName,[]);
    }

    this.listeners.get(eventName)?.push(handler);
  }

  private async listenLoop() {
    while (true) {
      const frame = await this.reader.readFrame();
      if (!frame) break;
      const event = decodeMessage(frame) as EventOut;
      
      this.emit(toKebabCase(event.event), event);
    }
  }
}