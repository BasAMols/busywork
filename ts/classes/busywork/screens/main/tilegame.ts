import { Screen } from "../../../element/screen";
import { TickerReturnData } from '../../ticker';
import { Busywork } from '../../../../game';
import { Computer } from './sections/computer/computer';
import { Keyboard } from './sections/keyboard/keyboard';
import { Office } from './sections/office/office';
import { Vector2 } from '../../../math/vector2';
import { StatBar } from './sections/stat/statbar';
import { Coffee } from './sections/coffee/coffee';
import { Debug } from './sections/debug';
import { Grid } from '../../../element/grid';
import { glob } from '../../base';


export class TileGame extends Screen {
    public office: Office;
    public computer: Computer;
    public keyboard: Keyboard;
    public coffee: Coffee;
    public debug: Debug;
    public maxSize: Vector2 = new Vector2(1170, 620);
    private stateData: {
        [key: string]: {
            value: boolean;
            condition?: () => boolean;
            onChange?: (value: boolean) => void;
        };
    } = {

        };
    statBar: StatBar;
    grid: Grid;

    addState(state: string, initial: boolean, condition?: () => boolean, onChange?: (value: boolean) => void) {
        this.stateData[state] = {
            value: initial,
            condition: condition,
            onChange: onChange,
        };
        this.stateData[state].onChange?.(initial);
    }

    public state(state: string) {
        return this.stateData[state]?.value;
    }

    updateGridSize() {

        let w1 = 680;
        let w2 = 0;
        this.maxSize = new Vector2(800, 620);
        if (this.state('atcoffeemachine')) {
            w2 = 400;
            this.maxSize = new Vector2(1170, 620);
        } else if (this.state('atdesk')) {
            w2 = 450;
            this.maxSize = new Vector2(1170, 620);
        }

        if (w2) {
            this.office.setStyle({
                width: this.state('atdesk') ? `${w1}px` : '100%',
                // marginLeft: '0px',
            });
        } else {
            this.office.setStyle({
                width: this.state('atdesk') ? `${w1}px` : 'calc(100% + 20px)',
                // marginLeft: this.state('atdesk') ? '0px' : '20px',
            });
        }
        this.computer.setStyle({
            width: this.state('atdesk') ? '450px' : '0%',
        });
        this.keyboard.setStyle({
            width: this.state('atdesk') ? '450px' : '0%',
        });
        this.coffee.setStyle({
            width: this.state('atcoffeemachine') ? '400px' : '0%',
        });

        this.grid.setTemplateColumns(`${w1}px ${w2}px`);
        this.updateScale();
    }

    updateScale() {
        const windowSize = new Vector2(window.innerWidth, window.innerHeight);
        const xf = windowSize.x / this.maxSize.x;
        const yf = windowSize.y / this.maxSize.y;
        this.grid.transform.setScale(new Vector2(Math.min(xf, yf), Math.min(xf, yf)));
    }

    public constructor(private game: Busywork) {
        super('test');

        this.append(this.grid = new Grid({
            columns: '700px 450px',
            rows: '0px 350px 230px 0px',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 20,
            style: {
                width: `${this.maxSize.x}px`,
                height: `${this.maxSize.y}px`,
                transition: 'grid-template-columns 1.2s ease-in-out, grid-template-rows 1.2s ease-in-out, transform 1.2s ease-in-out',
            },
            transform: {
                size: this.maxSize,
                anchor: new Vector2(0.5, 0.5),
            }
        }), true);
        this.grid.append(this.debug = new Debug(this, [1, 2, 1, 1]));
        glob.debug = this.debug;
        this.grid.append(this.office = new Office([1, 1, 2, 2]), true);
        this.grid.append(this.coffee = new Coffee(this, [2, 1, 2, 2]));
        this.grid.append(this.computer = new Computer(this, [2, 1, 2, 1]));
        this.grid.append(this.keyboard = new Keyboard(this, [2, 1, 3, 1]));
        this.grid.append(this.statBar = new StatBar(this, [1, 1, 4, 1]));

        window.addEventListener('resize', () => {
            this.updateScale();
        });

        this.updateScale();


        this.addState('atdesk', false,
            () => {
                return this.office.walker.transform.position.distance(new Vector2(280, 165)) < 60 &&
                    (!this.office.walker.destination || this.office.walker.destination.distance(new Vector2(280, 165)) < 60);
            },
            (value) => {
                // this.computerCol.dom.style.width = value ? '450px' : '0px';
                this.updateGridSize();
                this.office.sitter.seated = value;
                this.office.walker.visible = !value;
                if (value) {
                    this.office.walker.setDestination(undefined);
                    this.office.walker.transform.setPosition(new Vector2(280, 160));
                }
            }
        );
        this.addState('atcoffeemachine', false,
            () => {
                this.updateGridSize();
                return this.office.walker.transform.position.distance(new Vector2(650, 550)) < 200 &&
                    (!this.office.walker.destination || this.office.walker.destination.distance(new Vector2(700, 600)) < 200);
            },
            (value) => {
                this.coffee.dom.style.width = value ? '400px' : '0px';
            }
        );
        // this.addState('bossinroom', false,
        //     () => {
        //         return this.office.npc.time > 1500 && this.office.npc.time < 27000;
        //     }
        // );
        // this.addState('bosslooking', false,
        //     () => {
        //         return this.office.npc.time > 21000 && this.office.npc.time < 24000;
        //     }
        // );
    }


    public syncStates() {
        Object.values(this.stateData).forEach(data => {
            const lastValue = data.value;
            if (data.condition) {
                data.value = data.condition();
            }
            if (data.onChange && lastValue !== data.value) {
                data.onChange(data.value);
            }
        });
    }

    public tick(obj: TickerReturnData) {
        super.tick(obj);
        this.syncStates();
    }

}