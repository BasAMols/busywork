import { HTML } from '../../../../../element/element';
import { Tile } from '../../../../../element/tile';
import { Vector2 } from '../../../../../math/vector2';
import { TickerReturnData } from '../../../../../ticker';
import { Section } from '../../../../util/section';
import { Chair, getDesk } from './furniture';
import { Boss } from './people/boss';
import { Player } from './people/player';
import { Sitter } from './people/sitter';
import { Walker } from './people/walker';
import { getPlant } from './prop';



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
        {
            position: new Vector2(590, 490),
            size: new Vector2(80, 80),
        },
        
    ];
    chair: Chair;

    public constructor() {
        super(new Vector2(700, 600), {
            backgroundColor: '#354c59',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'width 0.8s ease-in-out',
        });

        const wrap = this.append(new HTML({
            style: {
                width: '700px',
                height: '600px',
                position: 'relative',
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


        wrap.append(this.chair = new Chair(new Vector2(240, 120), -1));
        
        wrap.append(getDesk(new Vector2(140, 15), -1, 1, {
        }));
        
        this.sitter = new Sitter({ initialPosition: new Vector2(40, 20), hair: 'none' }, this.chair);
        wrap.append(this.sitter);
       
        wrap.append(new Chair(new Vector2(480, 200), 120, {
            filter: 'saturate(0.4)',
        }));

        wrap.append(new Chair(new Vector2(100, 400), 264, {
            filter: 'saturate(0.4)',
        }));

        this.walker = new Player(this);
        wrap.append(this.walker);


        wrap.append(getDesk(new Vector2(470, 220), 90, 1, {
            filter: 'saturate(0.4)',
        }));

        wrap.append(getDesk(new Vector2(-70, 360), 270, 2, {
            filter: 'saturate(0.4)',
        }));

        wrap.append(getPlant(new Vector2(30, 30), 0, 6, 80));
        wrap.append(getPlant(new Vector2(590, 30), 40, 7, 50));
        wrap.append(getPlant(new Vector2(590, 490), 40, 9, 40));

       
        this.npc = new Boss(new Vector2(350, 700), 0, 'half');
        wrap.append(this.npc);

        const overlay = this.append(new HTML({
            style: {
                width: '100%',
                height: '100%',
                cursor: 'pointer',
            }
        }));
        overlay.dom.addEventListener('mousedown', (e) => {
            this.mouse = true;
            this.walker.setDestination(new Vector2(e.offsetX, e.offsetY));
        });
        overlay.dom.addEventListener('mouseup', (e) => {
            this.mouse = false;
        });
        overlay.dom.addEventListener('mousemove', (e) => {
            if (this.mouse) {
                this.walker.setDestination(new Vector2(e.offsetX, e.offsetY));
            } else {
                this.walker.lookAt(new Vector2(e.offsetX, e.offsetY));
            }
        });
    }
    public tick(obj: TickerReturnData) {
        this.walker.tick(obj);
        this.npc.tick(obj);
        this.sitter.tick(obj);
    }
}
