import { AnimationParams, Animator } from './animator';
import { HTML } from './element/element';
import { Timer } from './events';
import { GridManager } from './gridManager';
import { Vector2 } from './math/vector2';
import { Coffee } from './sections/coffee/coffee';
import { Computer } from './sections/computer/computer';
import { Debug } from './sections/debug';
import { Gameover } from './sections/gameover';
import { Keyboard } from './sections/keyboard/keyboard';
import { Office } from './sections/office/office';
import { StatBar } from './sections/statbar';
import { TickerReturnData, Ticker } from './ticker';

export interface BusyworkParams {
    debug: boolean;
    boss: boolean;
    initialTired: number;
}

export var glob = new class {
    public game: BusyWork;
    public ticker: TickerReturnData;
    public frame: number = 0;
    public timer: Timer;
    public debug: Debug;
    public mobile: boolean = false;
    public params: BusyworkParams;
    addAnimation(params: AnimationParams) {
        return this.game.ticker.addAnimation(params);
    }
    bulkAnimations(params: AnimationParams[]) {
        const animations: Animator[] = [];
        for (const param of params) {
            animations.push(this.addAnimation(param));
        }
        return animations;
    }
};

export class BusyWork extends HTML {
    public ticker: Ticker;
    public params: BusyworkParams;
    public office: Office;
    public computer: Computer;
    public keyboard: Keyboard;
    public coffee: Coffee;
    public debug: Debug;
    public gameover: Gameover;
    private _mobile: boolean = false;
    public statBar: StatBar;
    public gridManager: GridManager;

    private stateData: {
        [key: string]: {
            value: boolean;
            condition?: () => boolean;
            onChange?: (value: boolean) => void;
        };
    } = {};
    animations: Animator[];

    public addState(state: string, initial: boolean, condition?: () => boolean, onChange?: (value: boolean) => void) {
        this.stateData[state] = {
            value: initial,
            condition: condition,
            onChange: onChange,
        };
        this.stateData[state].onChange?.(initial);
    }

    public getState(state: string) {
        return this.stateData[state]?.value;
    }

    private setupDocument() {

        if (location.hostname !== 'localhost') {
            const base = document.createElement('base');
            base.href = "https://basamols.github.io/busywork/dist/";
            document.head.appendChild(base);
        }

        document.body.appendChild(this.dom);

        window.oncontextmenu = function (event) {
            event.preventDefault();
            event.stopPropagation();
            return false;
        };

        window.addEventListener('resize', () => {
            glob.mobile = window.innerWidth < window.innerHeight;
        });


    }


    private setupParams() {
        const url = new URLSearchParams(location.search);
        glob.params = {
            debug: false,
            boss: true,
            initialTired: 0,
        };

        url.forEach((value: string, key: string) => {
            if (key in glob.params) {
                const key2 = key as keyof BusyworkParams;
                if (typeof glob.params[key2] === 'boolean') {
                    (glob.params as any)[key2] = value === 'true';
                }
                if (typeof glob.params[key2] === 'number') {
                    (glob.params as any)[key2] = Number(value);
                }
            }
        });

    }

    public setupGrid() {

        this.append(this.computer = new Computer(this));
        this.append(this.keyboard = new Keyboard(this));
        this.append(this.office = new Office(this), true);
        this.append(this.coffee = new Coffee(this));
        this.append(this.gameover = new Gameover(this));
        this.append(this.statBar = new StatBar(this));
        this.append(this.debug = new Debug(this));
        glob.debug = this.debug;
        this.gridManager = new GridManager(this, [this.computer, this.keyboard, this.office, this.coffee, this.gameover, this.statBar, this.debug]);

        this.ticker.start();


    }

    private setupTicker() {
        this.ticker = new Ticker(this);
        this.ticker.add(this.tick.bind(this));
        glob.timer = this.ticker.timer;
    }

    private setupStates() {
        this.addState('atdesk', false,
            () => {
                return this.office.walker.transform.position.distance(new Vector2(280, 165)) < 60 &&
                    (!this.office.walker.destination || this.office.walker.destination.distance(new Vector2(280, 165)) < 60);
            },
            (value) => {
                this.office.sitter.seated = value;
                this.office.walker.visible = !value;
                if (value) {
                    this.office.walker.setDestination(undefined);
                    this.office.walker.transform.setPosition(new Vector2(280, 160));
                }
            }
        );
        this.addState('atcoffeemachine', false, () => {
            return this.office.walker.transform.position.distance(new Vector2(650, 550)) < 200 &&
                (!this.office.walker.destination || this.office.walker.destination.distance(new Vector2(700, 600)) < 200);
        });
        this.addState('bossinroom', false, () => {
            return this.office.npc.phase > 0 && this.office.npc.phase < 5;
        });
        this.addState('bosslooking', false, () => {
            return this.office.npc.phase > 2 && this.office.npc.phase < 4;
        });
    }


    public constructor() {
        super({
            classList: ['screen'],
            transform: {
                size: new Vector2(700, 600),
                position: new Vector2(0, 0),
            }
        });

        glob.game = this;

        this.setupDocument();
        this.setupTicker();
        this.setupParams();
        this.setupGrid();
        this.setupStates();

    }

    public tick(obj: TickerReturnData) {
        super.tick(obj);
        Object.values(this.stateData).forEach(data => {
            const lastValue = data.value;
            if (data.condition) {
                data.value = data.condition();
            }
            if (data.onChange && lastValue !== data.value) {
                data.onChange(data.value);
            }
        });

        this.gridManager.tick();
        this.gameover.tick(obj);
    }

}