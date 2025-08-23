import { Animator } from '../animator';
import { HTML } from '../element/element';
import { Vector2 } from '../math/vector2';
import { glob } from '../tilegame';



export class Section extends HTML {
    animations: Animator[];

    public gridData: {
        size: Vector2;
        position: Vector2;
        index: number;
        sizer?: () => { size: Vector2, position: Vector2, index: number; };
    } = {
            size: new Vector2(0, 0),
            position: new Vector2(0, 0),
            index: 0,
        };
    name: string;

    public constructor(style: Partial<CSSStyleDeclaration>, gridData: Section['gridData'], name: string) {
        super({
            style: {
                overflow: 'hidden',
                borderRadius: '10px',
                ...style,
            },
            transform: {
                anchor: new Vector2(0.5, 0.5),
            }
        });

        this.absolute = true;

        this.gridData = gridData;
        this.name = name;
        this.dom.classList.add(`section-${name}`);

        this.animations = glob.bulkAnimations([{
            duration: 350,
            onChange: (value: number) => {
                this.transform.setSize(new Vector2(value * 1000, this.transform.size.y));
            }
        }, {
            duration: 350,
            onChange: (value: number) => {
                this.transform.setSize(new Vector2(this.transform.size.x, value * 1000));
            }
        }, {
            duration: 350,
            onChange: (value: number) => {
                this.transform.setPosition(new Vector2(value * 1000, this.transform.position.y));
            }
        }, {
            duration: 350,
            onChange: (value: number) => {
                this.transform.setPosition(new Vector2(this.transform.position.x, value * 1000));
            }
        }]);

    }

    updateGrid() {
        Object.assign(this.gridData, this.gridData.sizer?.());

        this.animations[0].target = this.gridData.size.x / 1000;
        this.animations[1].target = this.gridData.size.y / 1000;
        this.animations[2].target = this.gridData.position.x / 1000;
        this.animations[3].target = this.gridData.position.y / 1000;

        this.dom.style.zIndex = this.gridData.index.toString();
    }
}
