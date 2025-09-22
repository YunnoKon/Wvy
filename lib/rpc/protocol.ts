import { encode, decode } from "@std/msgpack";
import { EventOut } from "../types.ts";

export function encodeMessage(msg: any) {
    const payload = encode(msg);
    const header = new Uint8Array(4);
    new DataView(header.buffer).setUint32(0, payload.length, true);
    const full = new Uint8Array(header.length + payload.length);
    full.set(header, 0);
    full.set(payload, header.length);
    return full;
}

export function decodeMessage(payload: Uint8Array): EventOut {
    return decode(payload) as EventOut;
}