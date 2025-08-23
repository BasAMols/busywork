import { HTML } from '../../element/element';
import { Tile } from '../../element/tile';
import { Vector2 } from '../../math/vector2';
import { BusyWork } from '../../tilegame';
import { Section } from '../../util/section';
import { CoffeeMachine } from './assets';

export class Coffee extends Section {
    public constructor(private parent: BusyWork) {
        super({
            backgroundColor: '#354c59',
            justifyContent: 'flex-start',
            overflow: 'hidden',
            boxShadow: '0px 0px 10px 0px rgba(0, 0, 0, 0.5)',
        }, {
            size: new Vector2(0, 600),
            position: new Vector2(720, 0),
            scale: new Vector2(1, 1),
            index: 0,
            sizer: () => {
                return {
                    size: new Vector2(parent.getState('atcoffeemachine') ? 400 : 0, 600),
                    position: new Vector2(680, 200),
                    scale: new Vector2(0.75, 0.75),
                    index: 0,
                }
            }
        }, 'coffee');


        
        this.append(new Tile({
            tileSize: new Vector2(80, 120),
            transform: {
                position: new Vector2(0, -200),
                rotation: 30,
            },
            offsetRow: new Vector2(0, 0),
            offsetCol: new Vector2(0, 0),
            repeatX: 1,
            repeatY: 5,
            options: {
                style: {
                    width: '800px',
                    height: '80px',
                    border: '10px solid rgb(60, 85, 97)',
                    boxSizing: 'border-box',
                    backgroundColor: '#3c5561',
                    borderRadius: '20px',
                },
                transform: {
                }
            }
        }));

        const table = this.append(new HTML({
            style: {
                backgroundColor: '#674b47',
                filter: 'drop-shadow(0px -4px 30px #00000040)',
                padding: '30px solid #674b47',
                boxSizing: 'border-box',

            },
            transform: {
                anchor: new Vector2(0.5, 0.5),
                size: new Vector2(500, 110),
                rotation: 0,
                position: new Vector2(-50, 500)
            }
        }));
        table.append(new Tile({
            tileSize: new Vector2(45, 120),
            transform: {
                position: new Vector2(-15, 15),
            },
            offsetRow: new Vector2(0, 0),
            offsetCol: new Vector2(0, 0),
            repeatX: 20,
            repeatY: 1,
            options: {
                style: {
                    width: '35px',
                    height: '110px',
                    boxSizing: 'border-box',
                    backgroundColor: '#79514b',
                },
                transform: {
                }
            }
        }));
        this.append(new CoffeeMachine(new Vector2(55, 240), () => {
            this.parent.office.tired = 0;
        }));
    }

}