import { HTML } from '../element/element';
import { Flex } from '../element/flex';
import { Screen } from "../element/screen";
import { TickerReturnData } from '../ticker';
import { Busywork } from '../../game';
import { Computer } from './screens/main/sections/computer/computer';
import { Keyboard } from './screens/main/sections/keyboard/keyboard';
import { Office } from './screens/main/sections/office/office';
import { Vector2 } from '../math/vector2';
import { StatBar } from './screens/main/sections/stat/statbar';


export class TileGame extends Screen {
    public office: Office;
    public computer: Computer;
    public keyboard: Keyboard;

    private stateData: {
        [key: string]: {
            value: boolean;
            condition?: () => boolean;
            onChange?: (value: boolean) => void;
        };
    } = {

        };
    statBar: StatBar;

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

    computerCol: HTML;

    private getCol(width: boolean = false, height: boolean = false, style: Partial<CSSStyleDeclaration> = {}) {
        return new Flex({
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 20,
            style: {
                overflow: 'hidden',
                width: width ? '100%' : 'auto',
                height: height ? '100%' : 'auto',
                ...style,
            }
        });
    }

    private getRow(width: boolean = false, height: boolean = false, style: Partial<CSSStyleDeclaration> = {}) {

        return new Flex({
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 20,
            style: {
                width: width ? '100%' : 'auto',
                height: height ? '100%' : 'auto',
                ...style,
            }
        });
    }

    public constructor(private game: Busywork) {
        super('test');

        const col = this.append(this.getCol(true, true));
        const row = col.append(this.getRow(false,false));
        row.append(this.office = new Office(), true);
        col.append(this.statBar = new StatBar(this));

        this.computerCol = row.append(this.getCol(false, false, {
            transition: 'width 0.8s ease-in-out',
        }));
        this.computerCol.append(this.computer = new Computer(this));
        this.computerCol.append(this.keyboard = new Keyboard(this));

        this.addState('atdesk', false,
            () => {
                return this.office.walker.transform.position.distance(new Vector2(280, 165)) < 30 &&
                    (!this.office.walker.destination || this.office.walker.destination.distance(new Vector2(280, 165)) < 30);
            },
            (value) => {
                this.computerCol.dom.style.width = value ? '450px' : '0px';
                this.computerCol.dom.style.marginLeft = value ? '0' : '-20px';
                this.office.dom.style.width = value ? '500px' : '700px';
                this.statBar.dom.style.width = value ? '500px' : '700px';
                this.office.sitter.seated = value;
                this.office.walker.visible = !value;
                if (value) {
                    this.office.walker.setDestination(undefined);
                    this.office.walker.transform.setPosition(new Vector2(280, 160));
                }
            });
        this.addState('bossinroom', false,
            () => {
                return this.office.npc.time > 1500 && this.office.npc.time < 27000;
            }, (value) => {
            }
        );
        this.addState('bosslooking', false,
            () => {
                return this.office.npc.time > 21000 && this.office.npc.time < 24000;
            }, (value) => {
            });
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
        this.office.tick(obj);
        this.computer.tick(obj);
        this.keyboard.tick(obj);
        this.statBar.tick(obj);
        this.syncStates();
    }

}