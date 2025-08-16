import { HTML } from '../../../../../element/element';
import { Tile } from '../../../../../element/tile';
import { Vector2 } from '../../../../../math/vector2';
import { TileGame } from '../../tilegame';
import { Section } from '../../util/section';
import { CoffeeMachine } from './assets';

export class Coffee extends Section {
    public constructor(private parent: TileGame) {
        super(new Vector2(400, 600), {
            backgroundColor: '#354c59',
            boxShadow: '0px 0px 200px #0000004a',
            transition: 'width 0.6s ease-in-out',
        });
        
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