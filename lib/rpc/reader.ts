export class BufferedReader {
    private buffer = new Uint8Array(0);

    constructor(private reader: ReadableStreamDefaultReader<Uint8Array>) {}

    private async ensure(size: number): Promise<boolean> {
        while(this.buffer.length < size){
            const { value, done } = await this.reader.read();
            if(done) return false;
            if(value){
                const tmp = new Uint8Array(this.buffer.length + value.length);
                tmp.set(this.buffer);
                tmp.set(value, this.buffer.length);
                this.buffer = tmp;
            }
        }
        return true;
    }

    async readFrame(): Promise<Uint8Array | null> {
        if(!(await this.ensure(4))) return null;
        const len = new DataView(this.buffer.buffer, this.buffer.byteOffset, 4).getUint32(0, true);
        this.buffer = this.buffer.slice(4)

        if(!(await this.ensure(len))) return null;
        const payload = this.buffer.slice(0, len);
        this.buffer = this.buffer.slice(len);
        return payload;
    }
}