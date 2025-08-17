import { Game, glob } from './base';
import { Timer } from './events';

export type TickerReturnData = {
    interval: number, intervalS3: number, intervalS10: number, intervalS20: number, total: number, frameRate: number, frame: number, maxRate: number, time: number; 
};
export type TickerCallback = (obj: TickerReturnData) => void;
export class Ticker {
    private _running: boolean = false;
    private started: boolean = false;
    private pauzedTime: number = 0;
    private intervalKeeper:number[] = []
    private id: number;
    private maxRate: number = 0; 
    public timer: Timer;
    public get running(): boolean {
        return this._running;
    }
    public set running(value: boolean) {
        this._running = value;
        
        if (value) {
            this.pTime = performance.now() - this.pauzedTime;
            this.id = window.requestAnimationFrame(this.frame.bind(this));
        } else {
            window.cancelAnimationFrame(this.id);
            this.pauzedTime = performance.now() - this.pTime
            
        }
    }
    constructor(game: Game) {
        document.addEventListener("visibilitychange", () => {
            if (this.started) {
                this.running = !document.hidden;
            }
        });

        this.timer = new Timer(game);
    }
    private callbacks: TickerCallback[] = [];
    private sTime: number;
    public get startTime() {
        return this.sTime;
    }
    private get eTime() {
        return performance.now() - this.sTime;
    }
    // public get elapsed() {
    //     return this.eTime;
    // }
    private pTime: number;
    private frameN: number = 0;

    private averagedInterval(count: number, interval: number){
        const average = this.intervalKeeper.slice(0,count).reduce((partialSum, a) => partialSum + a, 0) / count;
        return Math.abs(interval - average) > 20?interval: average;
    }

    private frame(timeStamp: number) {

        if (this.running) {
            const interval = timeStamp - this.pTime;
            this.intervalKeeper = this.intervalKeeper.slice(1,20);
            this.intervalKeeper.push(interval);
            while(this.intervalKeeper.length<20){
                this.intervalKeeper.push(interval);
            }
            
            this.pTime = timeStamp;
            this.frameN++;
            this.maxRate = Math.max(this.maxRate, 1000 / interval);
            glob.frame = this.frameN;
            const o = {
                interval,
                total: this.eTime,
                frameRate: 1000 / interval,
                frame: this.frameN,
                intervalS3: this.averagedInterval(3, interval),
                intervalS10: this.averagedInterval(10, interval),
                intervalS20: this.averagedInterval(20, interval),
                maxRate: this.maxRate,
                time: timeStamp
            };
            glob.ticker = o;

            this.timer.tick(o);

            this.callbacks.forEach((c) => {
                c(o);
            });

            this.id = window.requestAnimationFrame(this.frame.bind(this));
        }
    }

    public start() {
        this.started = true;
        this._running = true;
        this.sTime = performance.now();
        this.pTime = performance.now();
        this.id = window.requestAnimationFrame(this.frame.bind(this));
    }

    public add(callback: TickerCallback) {
        this.callbacks.push(callback);
    }
}
