import { HTML } from '../../../../../element/element';
import { Flex } from '../../../../../element/flex';
import { Vector2 } from '../../../../../math/vector2';
import { TickerReturnData } from '../../../../../ticker';
import { Icon } from '../../util/icon';

export class CoffeeMachine extends HTML {
    coffee1: HTML;
    coffee2: HTML;
    cupAsset: Cup;
    private _cup: boolean = false;
    screen: HTML;
    public get cup() {
        return this._cup;
    }
    public set cup(value: boolean) {
        this._cup = value;
        this.cupAsset.visible = value;
        this.cupAsset.steaming = false;

    }
    public click(element: HTML, validation?: () => boolean, add?: () => void) {
        if (!this.cup && (!validation || validation())) {
            this.cup = true;
            element.visible = false;
            add?.();
        }
    };
    public constructor(position: Vector2, onDrink: () => void) {
        super({
            style: {
                filter: 'drop-shadow(3px -9px 20px #00000020)',

            },
            transform: {
                position: position,
                anchor: new Vector2(0.5, 0.5),
                size: new Vector2(270, 300),
            },
        });

        let c1: boolean = false;
        let c2: boolean = false;

        this.append(new Cup({
            position: new Vector2(105 - 55, 60 - 200), rotation: 0, scale: new Vector2(1, 1), onClick: (e, element) => this.click(element, undefined, () => c1 = true),
        }));
        this.append(new Cup({
            position: new Vector2(100 - 55, 130 - 200), rotation: 0, scale: new Vector2(1, -1), onClick: (e, element) => this.click(element, () => c1),
        }));
        this.append(new Cup({
            position: new Vector2(215 - 55, 70 - 200), rotation: -10, scale: new Vector2(1, 1), onClick: (e, element) => this.click(element, undefined, () => c2 = true),
        }));
        this.append(new Cup({
            position: new Vector2(215 - 55, 130 - 200), rotation: 0, scale: new Vector2(-1, 1), onClick: (e, element) => this.click(element, () => c2),
        }));
        this.append(new Cup({
            position: new Vector2(150 - 55, 130 - 200), rotation: 0, scale: new Vector2(-1, 1), onClick: (e, element) => this.click(element)
        }));



        //back
        this.append(new HTML({
            style: {
                backgroundColor: '#646464',
                borderRadius: '20px 20px 5px 5px',

            },
            transform: {
                anchor: new Vector2(0.5, 0.5),
                size: new Vector2(230, 250),
                rotation: 0,
                position: new Vector2(20, 20)
            }
        }));


        // coffee
        this.append(this.coffee1 = new HTML({
            style: {
                backgroundColor: '#00000088',
            },
            transform: {
                anchor: new Vector2(0.5, 0.5),
                size: new Vector2(10, 80),
                position: new Vector2(115, 100)
            }
        }));
        this.append(this.coffee2 = new HTML({
            style: {
                backgroundColor: '#00000088',
            },
            transform: {
                anchor: new Vector2(0.5, 0.5),
                size: new Vector2(10, 80),
                position: new Vector2(135, 100)
            }
        }));


        // tube
        this.append(new HTML({
            style: {
                backgroundColor: '#e4e3e0',
                borderRadius: '0px 0px 10px 10px',
                filter: 'drop-shadow(3px 4px 6px #00000040)',
                boxShadow: 'inset 5px 0px 30px #00000040',
            },
            transform: {
                anchor: new Vector2(0.5, 0.5),
                size: new Vector2(10, 15),
                position: new Vector2(115, 135),
            },
        }));



        this.append(new HTML({
            style: {
                backgroundColor: '#e4e3e0',
                borderRadius: '0px 0px 10px 10px',
                filter: 'drop-shadow(3px 4px 6px #00000040)',
                boxShadow: 'inset 5px 0px 30px #00000040',
            },
            transform: {
                anchor: new Vector2(0.5, 0.5),
                size: new Vector2(10, 15),
                position: new Vector2(135, 135),
            },
        }));

        this.append(new HTML({
            style: {
                backgroundColor: '#e4e3e0',
                borderRadius: '0px 0px 10px 10px',
                filter: 'drop-shadow(3px 4px 6px #00000040)',
                boxShadow: 'inset 5px 0px 30px #00000040',
            },
            transform: {
                anchor: new Vector2(0.5, 0.5),
                size: new Vector2(60, 30),
                position: new Vector2(100, 110),
            },
        }));

        this.append(this.cupAsset = new Cup({
            position: new Vector2(90, 180), rotation: 0, scale: new Vector2(1, 1), onClick: () => {
                if (this.filled >= 1) {
                    this.filled = 0;
                    this.filling = false;
                    this.cup = false;
                    onDrink();
                }
            }
        }));


        // bottom
        this.append(new HTML({
            style: {
                backgroundColor: '#504f5a',
                borderRadius: '20px 20px 5px 5px',
                filter: 'drop-shadow(0px -4px 3px #00000040)',

            },
            transform: {
                anchor: new Vector2(0.5, 0.5),
                size: new Vector2(270, 50),
                rotation: 0,
                position: new Vector2(0, 250)
            }
        }));

        // top
        this.append(new HTML({
            style: {
                backgroundColor: '#504f5a',
                borderRadius: '10px 10px 30px 30px',
                filter: 'drop-shadow(0px 4px 3px #00000040)',

            },
            transform: {
                anchor: new Vector2(0.5, 0.5),
                size: new Vector2(270, 110),
                rotation: 0,
                position: new Vector2(0, 0)
            }
        }));
        this.screen = this.append(new HTML({
            style: {
                backgroundColor: 'rgb(34, 36, 50)',
                borderRadius: '7px',
                boxShadow: 'inset 6px 3px 50px 3px #00000088',
            },
            transform: {
                anchor: new Vector2(0.5, 0.5),
                size: new Vector2(128, 50),
                rotation: 0,
                position: new Vector2(65, 40)
            },
            children: [
                new HTML({ transform: { size: new Vector2(18, 40), position: new Vector2(10 + 1 - 2, 5), }, style: { transition: 'opacity 0.3s', backgroundColor: '#579557cc', borderRadius: '3px' } }),
                new HTML({ transform: { size: new Vector2(18, 40), position: new Vector2(32 + 2 - 2, 5), }, style: { transition: 'opacity 0.3s', backgroundColor: '#579557cc', borderRadius: '3px' } }),
                new HTML({ transform: { size: new Vector2(18, 40), position: new Vector2(54 + 3 - 2, 5), }, style: { transition: 'opacity 0.3s', backgroundColor: '#579557cc', borderRadius: '3px' } }),
                new HTML({ transform: { size: new Vector2(18, 40), position: new Vector2(76 + 4 - 2, 5), }, style: { transition: 'opacity 0.3s', backgroundColor: '#579557cc', borderRadius: '3px' } }),
                new HTML({ transform: { size: new Vector2(18, 40), position: new Vector2(98 + 5 - 2, 5), }, style: { transition: 'opacity 0.3s', backgroundColor: '#579557cc', borderRadius: '3px' } }),
            ]
        }));
        this.append(new Flex({
            justifyContent: 'center',
            alignItems: 'center',
            style: {
                backgroundColor: '#95bcff',
                borderRadius: '100%',
                boxShadow: '0px 0px 10px #00000088, 8px 4px 4px #00000050, inset 6px 3px 20px #00000088',
                cursor: 'pointer',
                transition: 'box-shadow 0.1s ease-in-out',
            },
            transform: {
                anchor: new Vector2(0.5, 0.5),
                size: new Vector2(40, 40),
                rotation: 0,
                position: new Vector2(205, 20)
            },
            onClick: () => {
                if (this.cup) {
                    this.filling = true;
                }
            },
            onMouseDown: (e, element) => {
                element.dom.style.boxShadow = '0px 0px 10px #00000088, 2px 2px 2px #00000088, inset 6px 3px 20px #00000088';
            },
            onMouseUp: (e, element) => {
                element.dom.style.boxShadow = '0px 0px 10px #00000088, 8px 4px 4px #00000050, inset 6px 3px 20px #00000088';
            },
            children: [
                new Icon('coffee', 30, 'black', true)
            ]
        }));

        this.filling = false;
        this.cup = false;

    }

    public filled: number = 0;
    private _filling: boolean = false;
    get filling() {
        return this._filling;
    }
    set filling(value: boolean) {
        this.coffee1.visible = value;
        this.coffee2.visible = value;
        this._filling = value;
    }

    tick(obj: TickerReturnData) {
        super.tick(obj);
        if (this.filling) {
            this.filled += obj.interval * 0.0001;

            if (this.filled > 1) {
                this.filling = false;
            }

            if (this.filled > 0.7) {
                this.cupAsset.steaming = true;
            }
        }
        this.screen.children.forEach((c, i) => {
            c.dom.style.opacity = this.filled > i * 0.2 + 0.1 ? '1' : '0.1';
        });
    }
};

export class Cup extends HTML {

    private steam: HTML[] = [];
    public constructor({ position = new Vector2(0, 0), rotation = 0, scale = new Vector2(1, 1), onClick }: { position?: Vector2; rotation?: number; scale?: Vector2; onClick?: (event: MouseEvent, element: HTML) => void; } = {}) {
        super({
            style: {
                filter: 'drop-shadow(3px 4px 6px #00000080)',
                cursor: 'pointer',
            },
            transform: {
                anchor: new Vector2(0.5, 0.5),
                size: new Vector2(80, 70),
                position: position,
                rotation: rotation,
            },
            onClick,
        });

        // steam
        this.steam.push(this.append(new HTML({
            style: {
                backgroundColor: '#4c201840',
                filter: 'blur(3px)',
                borderRadius: '20px',
                pointerEvents: 'none',
                transition: 'opacity 1s ease-in-out',
            },
            transform: {
                anchor: new Vector2(0.5, 0.5),
                size: new Vector2(10, 200),
                position: new Vector2(15, -100)
            }
        })));
        this.steam.push(this.append(new HTML({
            style: {
                backgroundColor: '#4c201840',
                filter: 'blur(3px)',
                borderRadius: '20px',
                pointerEvents: 'none',
                transition: 'opacity 1s ease-in-out',
            },
            transform: {
                anchor: new Vector2(0.5, 0.5),
                size: new Vector2(15, 200),
                position: new Vector2(35, -110)
            }
        })));
        this.steam.push(this.append(new HTML({
            style: {
                backgroundColor: '#4c201840',
                filter: 'blur(3px)',
                borderRadius: '20px',
                pointerEvents: 'none',
                transition: 'opacity 1s ease-in-out',
            },
            transform: {
                anchor: new Vector2(0.5, 0.5),
                size: new Vector2(10, 200),
                position: new Vector2(55, -90)
            }
        })));
        this.steam.push(this.append(new HTML({
            style: {
                backgroundColor: '#4c201820',
                filter: 'blur(3px)',
                borderRadius: '20px',
                pointerEvents: 'none',
                transition: 'opacity 1s ease-in-out',
            },
            transform: {
                anchor: new Vector2(0.5, 0.5),
                size: new Vector2(25, 80),
                position: new Vector2(30, -55)
            }
        })));

        const mug = this.append(new HTML({
            style: {
                backgroundColor: '#e4e3e0',
                borderRadius: '2px 2px 20px 20px',
                boxShadow: 'inset 10px 0px 40px #00000040',
            },
            transform: {
                size: new Vector2(80, 70),
                anchor: new Vector2(0.5, 0.5),
                scale: scale,
            },
        }));

        mug.append(new HTML({
            style: {
                borderRadius: '20px 0px 0px 20px',
                border: '10px solid #e4e3e0',
                boxSizing: 'border-box',
                borderRight: 'none',
            },
            transform: {
                anchor: new Vector2(0.5, 0.5),
                size: new Vector2(25, 40),
                position: new Vector2(-25, 0)
            }
        }));

        this.steaming = false;
    }

    private _steaming: boolean = false;
    set steaming(value: boolean) {
        this.steam.forEach(s => {
            s.dom.style.opacity = value ? '1' : '0';
        });
        this._steaming = value;
    }

    get steaming() {
        return this._steaming;
    }

    tick(obj: TickerReturnData) {
        super.tick(obj);
        if (this.steaming) {
            this.steam.forEach((s, i) => {
                s.dom.style.left = (Math.sin(obj.total * 0.0005 * (0.6 + (i + 1))) * 8) + 'px';
            });
        }
    }
}
