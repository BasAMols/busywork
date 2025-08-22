import { Flex } from './element/flex';
import { Grid } from './element/grid';
import { Timer } from './events';
import { GridManager } from './gridManager';
import { Utils } from './math/util';
import { Vector2 } from './math/vector2';
import { Coffee } from './sections/coffee/coffee';
import { Computer } from './sections/computer/computer';
import { Debug } from './sections/debug';
import { Gameover } from './sections/gameover';
import { Keyboard } from './sections/keyboard/keyboard';
import { Office } from './sections/office/office';
import { StatBar } from './sections/stat/statbar';
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
};

export class BusyWork extends Flex {
    public ticker: Ticker;
    public params: BusyworkParams;
    public office: Office;
    public computer: Computer;
    public keyboard: Keyboard;
    public coffee: Coffee;
    public debug: Debug;
    public gameover: Gameover;
    private _mobile: boolean = false;
    public maxSize: Vector2 = new Vector2(1170, 620);
    public statBar: StatBar;
    public grid: Grid;
    public gridManager: GridManager;

    private stateData: {
        [key: string]: {
            value: boolean;
            condition?: () => boolean;
            onChange?: (value: boolean) => void;
        };
    } = {};

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

    public updateGridSize(force: boolean = false) {

        if (this._mobile !== Utils.isMobile() || force) {
            this._mobile = Utils.isMobile();
            if (this._mobile) {

                this.debug.updateGrid([1, 1, 1, 1]);
                this.computer.updateGrid([1, 1, 3, 1]);
                this.keyboard.updateGrid([1, 1, 5, 1]);
                this.office.updateGrid([1, 1, 7, 1]);
                this.gameover.updateGrid([1, 1, 7, 1]);
                this.coffee.updateGrid([1, 1, 11, 1]);
                this.statBar.updateGrid([1, 1, 9, 1]);
                this.gridManager.setColumns([700]);
                this.gridManager.setRows([0, 350, 230, 600, 1, 600]);

            } else {

                this.coffee.updateGrid([5, 1, 3, 3]);
                this.computer.updateGrid([1, 1, 3, 1]);
                this.keyboard.updateGrid([1, 1, 5, 1]);
                this.debug.updateGrid([1, 5, 1, 1]);
                this.office.updateGrid([3, 1, 3, 3]);
                this.gameover.updateGrid([3, 1, 3, 3]);
                this.statBar.updateGrid([3, 1, 7, 1]);
                this.gridManager.setColumns([450, 700, 450]);
                this.gridManager.setRows([0, 350, 230, 1]);
            }

        }


        if (this._mobile) {
            this.gridManager.setColumnWidth(0, this.getState('atdesk') || this.getState('atcoffeemachine') ? 450 : 700);
            this.gridManager.setRowHeight(1, this.getState('atdesk') ? 350 : 0);
            this.gridManager.setRowHeight(2, this.getState('atdesk') ? 230 : 0);
            this.gridManager.setRowHeight(3, this.getState('atdesk') || this.getState('atcoffeemachine') ? 500 : 600);
            this.gridManager.setRowHeight(5, this.getState('atcoffeemachine') ? 600 : 0);
            this.gridManager.updateGrid();
            this.updateScale(this.gridManager.getSize().add(new Vector2(40, 40)));

        } else {
            this.gridManager.setColumnWidth(0, this.getState('atdesk') ? 450 : 0);
            this.gridManager.setColumnWidth(1, 680);
            this.gridManager.setColumnWidth(2, this.getState('atcoffeemachine') ? 400 : 0);
            this.gridManager.updateGrid();
            this.updateScale(this.gridManager.getSize().add(new Vector2(20, 80)));
        }


    }

    private updateScale(size: Vector2 = this.maxSize) {
        const windowSize = new Vector2(window.innerWidth, window.innerHeight);
        const xf = windowSize.x / size.x;
        const yf = windowSize.y / size.y;
        this.grid.transform.setScale(new Vector2(Math.min(xf, yf), Math.min(xf, yf)));
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
            this.updateGridSize(true);
        });

    }

        
    private setupParams() {
        const url = new URLSearchParams(location.search);
        this.params = {
            debug: false,
            boss: true,
            initialTired: 0,
        };

        url.forEach((value: string, key: string) => {
            if (key in this.params) {
                const key2 = key as keyof BusyworkParams;
                if (typeof this.params[key2] === 'boolean') {
                    (this.params as any)[key2] = Boolean(value);
                }
                if (typeof this.params[key2] === 'number') {
                    (this.params as any)[key2] = Number(value);
                }
            }
        });
    }

    public setupGrid() {
        
        this.append(this.grid = new Grid({
            justifyContent: 'center',
            alignItems: 'center',
            gap: 0,
            style: {
                width: `${this.maxSize.x}px`,
                height: `${this.maxSize.y}px`,
                transition: 'grid-template-columns 1s cubic-bezier(0.4, 0, 0.2, 1), grid-template-rows 1s cubic-bezier(0.4, 0, 0.2, 1), transform 1s cubic-bezier(0.4, 0, 0.2, 1)',
            },
            transform: {
                size: this.maxSize,
                anchor: new Vector2(0.5, 0.5),
            }
        }), true);

        this.grid.append(this.debug = new Debug(this, [1, 1, 1, 1]));
        this.grid.append(this.computer = new Computer(this, [1, 1, 3, 1]));
        this.grid.append(this.keyboard = new Keyboard(this, [1, 1, 5, 1]));
        this.grid.append(this.office = new Office(this, [1, 1, 7, 1]), true);
        this.grid.append(this.coffee = new Coffee(this, [1, 1, 11, 1]));
        this.grid.append(this.gameover = new Gameover(this, [1, 1, 1, 1]));
        this.grid.append(this.statBar = new StatBar(this, [1, 1, 9, 1]));
        this.gridManager = new GridManager(this.grid, [450, 700, 450], [0, 350, 230, 1], 20);
        glob.debug = this.debug;

        this.updateGridSize(true);

    }

    private setupTicker() {
        this.ticker = new Ticker(this);
        this.ticker.add(this.tick.bind(this));
        this.ticker.start();
        glob.timer = this.ticker.timer;
    }

    private setupStates() {
        this.addState('atdesk', false,
            () => {
                return this.office.walker.transform.position.distance(new Vector2(280, 165)) < 60 &&
                    (!this.office.walker.destination || this.office.walker.destination.distance(new Vector2(280, 165)) < 60);
            },
            (value) => {
                this.updateGridSize();
                this.office.sitter.seated = value;
                this.office.walker.visible = !value;
                if (value) {
                    this.office.walker.setDestination(undefined);
                    this.office.walker.transform.setPosition(new Vector2(280, 160));
                }
            }
        );
        this.addState('atcoffeemachine', false, () => {
            this.updateGridSize();
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
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column',
            style: {
                width: '100%',
                height: '100%', backgroundColor: '#2a3e48',
                transition: 'transform 0.6s ease-in-out',
            }, classList: ['screen'],
        });

        glob.game = this;

        this.setupDocument();
        this.setupParams();
        this.setupGrid();
        this.setupTicker();
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

        this.gameover.tick(obj);
    }

}