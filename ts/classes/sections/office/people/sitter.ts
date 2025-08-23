import { Vector2 } from '../../../math/vector2';
import { TickerReturnData } from '../../../ticker';
import { Chair } from '../furniture';
import { Walker } from './walker';

export class Sitter extends Walker {
    data: { initialPosition: Vector2; initialRotation: number; };

    private _seated: boolean = false;
    public set seated(seated: boolean) {
        this._seated = seated;
        this.visible = seated;
        this.chair.setRotation(seated ? -1 : 70);
        this.chair.setPosition(seated ? new Vector2(240, 130) : new Vector2(240, 140));
        this.person.armPosition = [seated ? 1 : 0.5, seated ? 1 : 0.5];

    }
    public get seated() {
        return this._seated;
    }
    public interpolatedValue: number = 0;

    constructor(obj: { 
        initialPosition?: Vector2; 
        initialRotation?: number; 
        hair?: 'full' | 'half' | 'none'; 
        walkspeed?: number; 
        armPosition?: [number, number];
    } = {}, private chair?: Chair) {
        super({
            hair: obj.hair,
            walkspeed: obj.walkspeed,
            turnDuration: 0,
        });

        this.person.forceArmPosition = obj.armPosition || [1, 1];
        this.data = {
            initialPosition: obj.initialPosition || new Vector2(0, 0),
            initialRotation: obj.initialRotation || 0,
        };
        if (this.chair) {
            this.transform.setParent(this.chair.seat.transform);
        } else {
            this.transform.setPosition(this.data.initialPosition);
            this.transform.setRotation(this.data.initialRotation);
        }
        this.legCycle = 0.5;
        this.person.armTwist = [0.5, -0.5];
    }

    tick(obj: TickerReturnData) {
        super.tick(obj);

        if (this.chair) {
            this.interpolatedValue = this.interpolatedValue + Math.min(0.02, Number(this.seated) - this.interpolatedValue);
            this.chair.setPosition(this.seated ? new Vector2(240, 130) : new Vector2(240, 140));
            this.transform.setPosition(this.chair.seat.transform.absolute.position.add(this.data.initialPosition));
            this.turnAnimation.target = (this.chair.getRotation() + this.data.initialRotation)/ 360 ;
        }
    }
}