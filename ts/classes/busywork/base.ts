import { HTML } from '../element/element';
import { Screen } from '../element/screen';
import { Ticker, TickerReturnData } from '../ticker';

export var glob = new class {
    public game: Game;
    public ticker: TickerReturnData;
    public frame: number = 0;
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
        this.ticker = new Ticker();
        this.ticker.add(this.tick.bind(this));
        this.ticker.start();

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


