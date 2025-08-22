import { HTML } from '../../element/element';
import { Tile } from '../../element/tile';
import { Ease } from '../../math/easings';
import { Utils } from '../../math/util';
import { Vector2 } from '../../math/vector2';
import { TickerReturnData } from '../../ticker';
import { BusyWork } from '../../tilegame';
import { Section } from '../../util/section';
import { Chair, getDesk } from './furniture';
import { Boss } from './people/boss';
import { Player } from './people/player';
import { Sitter } from './people/sitter';
import { Walker } from './people/walker';
import { getPlant, getCoffeeMachine } from './prop';




export class Office extends Section {
    walker: Walker;
    mouse: boolean = false;
    npc: Boss;
    sitter: Sitter;

    public readonly blockers: {
        size: Vector2;
        position: Vector2;
    }[] = [
            //walls
            {
                position: new Vector2(0, 0),
                size: new Vector2(20, 600),
            },
            {
                position: new Vector2(0, 0),
                size: new Vector2(700, 20),
            },
            {
                position: new Vector2(0, 580),
                size: new Vector2(700, 20),
            },
            {
                position: new Vector2(680, 0),
                size: new Vector2(20, 600),
            },
            // desks
            {
                position: new Vector2(0, 265),
                size: new Vector2(150, 310),
            },
            {
                position: new Vector2(140, 0),
                size: new Vector2(300, 130),
            },
            {
                position: new Vector2(560, 130),
                size: new Vector2(150, 300),
            },
            //chairs 
            {
                position: new Vector2(130, 400),
                size: new Vector2(55, 80),
            },
            {
                position: new Vector2(470, 200),
                size: new Vector2(100, 80),
            },
            // plants
            {
                position: new Vector2(30, 30),
                size: new Vector2(80, 80),
            },
            {
                position: new Vector2(590, 30),
                size: new Vector2(80, 80),
            },

        ];
    chair: Chair;
    overlay: HTML;

    public constructor(private game: BusyWork, gridParams: ConstructorParameters<typeof Section>[2]) {
        super(new Vector2(700, 600), {
            backgroundColor: '#354c59',
            width: '100%',
            height: '600px',
            overflow: 'hidden',
            display: 'flex',
            justifyContent: 'center',
        }, gridParams);

        const wrap = this.append(new HTML({
            style: {
                width: '700px',
                height: '600px',
                overflow: 'hidden',
            }
        }));

        const floor = wrap.append(new HTML({
            style: {
                width: '100%',
                height: '100%',
                backgroundColor: '#354c59',
                boxShadow: '0px 0px 200px #0000004a',
                overflow: 'hidden',
                borderRadius: '10px',
                border: '15px solid #3c5561',
                boxSizing: 'border-box',
            }
        }));

        floor.append(new Tile({
            tileSize: new Vector2(80, 120),
            transform: {
                position: new Vector2(150, -240),
                rotation: 30,
            },
            offsetRow: new Vector2(0, 0),
            offsetCol: new Vector2(0, 0),
            repeatX: 11,
            repeatY: 7,
            options: {
                style: {
                    width: '100px',
                    height: '80px',
                    border: '10px solid rgb(60, 85, 97)',
                    boxSizing: 'border-box',
                    backgroundColor: '#3c5561',
                    borderRadius: '20px',
                },
                transform: {
                    rotation: -30,
                }
            }
        }));


        wrap.append(this.chair = new Chair(new Vector2(240, 130), -1));

        wrap.append(getDesk(new Vector2(140, 15), -1, 1, {
        }));

        this.sitter = new Sitter({ initialPosition: new Vector2(35, 40), hair: 'none', armPosition: [0, 0] }, this.chair);
        wrap.append(this.sitter);



        wrap.append(new Chair(new Vector2(130, 390), 270, {
            filter: 'saturate(0.4)',
        }));

        this.walker = new Player(this);
        wrap.append(this.walker);


        const c = wrap.append(new Chair(new Vector2(480, 200), 120, {
            filter: 'saturate(0.4)',
        })) as Chair;

        wrap.append(getDesk(new Vector2(470, 220), 90, 1, {
            filter: 'saturate(0.4)',
        }));

        wrap.append(getDesk(new Vector2(-70, 360), 270, 2, {
            filter: 'saturate(0.4)',
        }));

        wrap.append(getPlant(new Vector2(30, 30), 0, 6, 80));
        wrap.append(getPlant(new Vector2(590, 30), 40, 7, 50));
        // wrap.append(getPlant(new Vector2(590, 490), 40, 9, 40));
        wrap.append(getCoffeeMachine(new Vector2(590, 490), 40, 9, 40));


        wrap.append(new Sitter({ initialPosition: new Vector2(520, 240), hair: 'full', initialRotation: 120, armPosition: [0, 0], }) as Sitter);
        wrap.append(new Sitter({ initialPosition: new Vector2(170, 430), hair: 'none', initialRotation: -90, armPosition: [1, 0] }) as Sitter);


        this.npc = new Boss(game, new Vector2(350, 700), 0, 'half');
        wrap.append(this.npc);

        this.overlay = this.append(new HTML({
            style: {
                width: '100%',
                height: '100%',
                cursor: 'pointer',
                pointerEvents: 'all',
            }
        }));
        this.overlay.dom.addEventListener('pointerdown', (e) => {
            this.mouse = true;
            this.walker.setDestination(new Vector2(e.offsetX, e.offsetY));
        });

        this.overlay.dom.addEventListener('pointerup', (e) => {
            this.mouse = false;
        });
        this.overlay.dom.addEventListener('pointerleave', (e) => {
            this.mouse = false;
        });

        this.overlay.dom.addEventListener('pointermove', (e) => {
            if (this.mouse) {
                this.walker.setDestination(new Vector2(e.offsetX, e.offsetY));
            } else {
                this.walker.lookAt(new Vector2(e.offsetX, e.offsetY));
            }
        });

        this.tired = 0.15;
    }

    public _tired: number = 0;
    public set tired(value: number) {
        this._tired = Utils.clamp(value, 0, 1);
        this.overlay.setStyle({
            boxShadow: `inset 0px 0px 290px ${(Ease.inOutCubic(this._tired) * 360) - 180}px  #00000080`,
        });
        if (this.tired >= 1) {
            this.game.addState('gameover', true);
        }
    }
    public get tired() {
        return this._tired;
    }

    public tick(obj: TickerReturnData) {
        super.tick(obj);

        this.tired += obj.interval * 0.000002;

        if (obj.frame % 5 === 0) {

            let t = (this.tired-0.5)*2;

            if (t > 0.25) {
                this.setStyle({
                    filter: `blur(${Ease.inOutCubic(Math.sin(obj.total * 0.0001 + 0.3) * Math.sin(obj.total * 0.001 + 0.3) * t) * 2}px)`,
                });
                this.overlay.setStyle({
                    backgroundColor: `rgba(0, 0, 0, ${Math.sin(obj.total * 0.0001) * Math.sin(obj.total * 0.001) * Ease.inOutCubic(t) * 0.3})`,
                });
            } else {
                this.setStyle({
                    filter: `blur(0px)`,
                });
                this.overlay.setStyle({
                    backgroundColor: `rgba(0, 0, 0, 0)`,
                });
            }
        }
    }

    updateGrid(gridParams: [number, number, number, number]) {
        super.updateGrid(gridParams);


        if (Utils.isMobile()) {
            this.dom.style.width = '100%';
            this.dom.style.height = '100%';
        } else {
            this.dom.style.width = '100%';
            this.dom.style.height = '600px';
        }

    }
}
