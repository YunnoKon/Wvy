// Typing
export type EventOut = {
  event: string,
  id?: number,
  body?: string
};
export type IpcMessage = {
    channel: string,
    payload: string,
    id: number
}
export type Listener<T> = (event: T) => void;
export type IpcListener<T> = (event: T, windowsId: number) => void;