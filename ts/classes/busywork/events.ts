import { Game } from './base';
import { TickerReturnData } from './ticker';

export class Timer {

    private events: {
        key: string;
        time: number;
        callback: (delta: number, ticker: TickerReturnData) => void;
    }[] = [];
    public currentTime: number = 0;

    constructor(private game: Game) {}

    public add(key: string, when: number, callback: (delta: number, ticker: TickerReturnData) => void) {

        const time = when + this.currentTime;
        const index = this.events.findIndex(event => event.time > time);
        if (index === -1) {
            this.events.push({
                key,
                time,
                callback
            });
        } else {
            this.events.splice(index, 0, {
                key,
                time,
                callback
            });
        }
    }

    public cancel(key: string) {
        this.events = this.events.filter(event => event.key !== key);
    }

    private call(event: (typeof this.events)[number], ticker: TickerReturnData) {
        this.events = this.events.filter(e => e.key !== event.key);
        event.callback(event.time - this.currentTime, ticker);
    }

    public tick(obj: TickerReturnData) {
        this.currentTime = obj.time;
        for (const event of this.events) {
            if (this.currentTime >= event.time) {
                this.call(event, obj);
            } 
            break;
        }
    }


}