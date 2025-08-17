import { HTML } from '../element/element';
import { Screen } from '../element/screen';
import { Timer } from './events';
import { Ticker, TickerReturnData } from './ticker';
import { Debug } from './screens/main/sections/debug';

export var glob = new class {
    public game: Game;
    public ticker: TickerReturnData;
    public frame: number = 0;
    public timer: Timer;
    public debug: Debug;
};

export abstract class Game extends HTML {
    public ticker: Ticker;
    protected screens: Record<string, Screen> = {};

    public constructor() {
        super({ style: { width: '100%', height: '100%' } });
        glob.game = this;
        this.init();
    }


    init() {
        this.ticker = new Ticker(this);
        this.ticker.add(this.tick.bind(this));
        this.ticker.start();
        glob.timer = this.ticker.timer;
    }

    addScreen(screen: Screen): Screen {
        this.screens[screen.key] = screen;
        this.append(screen);
        return screen;
    }

    public tick(obj: TickerReturnData) {
        Object.values(this.screens).forEach(screen => {
            screen.tick(obj);
        });
    }

}


