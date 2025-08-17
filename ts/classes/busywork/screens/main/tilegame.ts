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
import { Utils } from '../../../math/util';

export class GridManager {

    private columns: number[] = [450, 700, 450];
    private rows: number[] = [0, 350, 230, 50];

    public constructor(private grid: Grid, columns: number[], rows: number[], private gap: number = 20) {
        this.columns = columns;
        this.rows = rows;
        this.updateGrid();
    }

    setColumn(index: number, width: number) {
        this.columns[index] = width;
    }

    setColumns(columns: number[]) {
        this.columns = columns;
    }

    setRow(index: number, height: number) {
        this.rows[index] = height;
    }

    setRows(rows: number[]) {
        this.rows = rows;
    }

    getColumns() {
        let columns: number[] = [];
        let leftColumn = false;
        this.columns.forEach((width, index) => {

            if (index > 0) {
                if (leftColumn && width !== 0) {
                    columns.push(this.gap);
                } else {
                    columns.push(0);
                }
            }

            if (width !== 0) {
                leftColumn = true;
            }

            columns.push(width);
        });
        return columns;
    }
    getRows() {
        let rows: number[] = [];
        let leftRow = false;
        this.rows.forEach((width, index) => {

            if (index > 0) {
                if (leftRow && width !== 0) {
                    rows.push(this.gap);
                } else {
                    rows.push(0);
                }
            }

            if (width !== 0) {
                leftRow = true;
            }

            rows.push(width);
        });
        return rows;
    }

    getSize() {
        return new Vector2(this.getColumns().reduce((a, b) => a + b, 0), this.getRows().reduce((a, b) => a + b, 0));
    }

    updateGrid() {
        this.grid.setTemplateColumns(this.getColumns().join('px ') + 'px');
        this.grid.setTemplateRows(this.getRows().join('px ') + 'px');
    }
}

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
    gridManager: GridManager;

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

        if (Utils.isMobile()) {
            this.gridManager.setColumn(0, this.state('atdesk') || this.state('atcoffeemachine') ? 450 : 700);
            this.gridManager.setRow(1, this.state('atdesk') ? 350 : 0);
            this.gridManager.setRow(2, this.state('atdesk') ? 230 : 0);
            this.gridManager.setRow(3, this.state('atdesk') || this.state('atcoffeemachine') ? 500 : 600);
            this.gridManager.setRow(5, this.state('atcoffeemachine') ? 600 : 0);
            this.gridManager.updateGrid();
        } else {
            this.gridManager.setColumn(0, this.state('atdesk') ? 450 : 0);
            this.gridManager.setColumn(1, 680);
            this.gridManager.setColumn(2, this.state('atcoffeemachine') ? 400 : 0);
            this.gridManager.updateGrid();
        }


        this.updateScale(this.gridManager.getSize().add(new Vector2(40, 40)));
    }

    updateScale(size: Vector2 = this.maxSize) {
        const windowSize = new Vector2(window.innerWidth, window.innerHeight);
        const xf = windowSize.x / size.x;
        const yf = windowSize.y / size.y;
        this.grid.transform.setScale(new Vector2(Math.min(xf, yf), Math.min(xf, yf)));
    }

    public constructor(private game: Busywork) {
        super('test');

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

        if (Utils.isMobile()) {
            this.grid.append(this.debug = new Debug(this, [1, 1, 1, 1]));
            this.grid.append(this.computer = new Computer(this, [1, 1, 3, 1]));
            this.grid.append(this.keyboard = new Keyboard(this, [1, 1, 5, 1]));
            this.grid.append(this.office = new Office([1, 1, 7, 1]), true);
            this.grid.append(this.coffee = new Coffee(this, [1, 1, 11, 1]));
            this.grid.append(this.statBar = new StatBar(this, [1, 1, 9, 1]));
            this.gridManager = new GridManager(this.grid, [700], [0, 350, 230, 600, 1, 600], 20);
        } else {
            this.grid.append(this.coffee = new Coffee(this, [5, 1, 3, 3]));
            this.grid.append(this.computer = new Computer(this, [1, 1, 3, 1]));
            this.grid.append(this.keyboard = new Keyboard(this, [1, 1, 5, 1]));
            this.grid.append(this.debug = new Debug(this, [1, 5, 1, 1]));
            this.grid.append(this.office = new Office([3, 1, 3, 3]), true);
            this.grid.append(this.statBar = new StatBar(this, [3, 1, 7, 1]));
            this.gridManager = new GridManager(this.grid, [450, 700, 450], [0, 350, 230, 1], 20);
        }


        glob.debug = this.debug;

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
            }
        );
        this.addState('bossinroom', false,
            () => {
                return this.office.npc.phase > 0 && this.office.npc.phase < 4;
            }
        );
        this.addState('bosslooking', false,
            () => {
                return this.office.npc.phase > 2 && this.office.npc.phase < 4;
            }
        );
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