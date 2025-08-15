import { Vector2 } from '../../../../../../math/vector2';
import { TickerReturnData } from '../../../../../../ticker';
import { Chair } from '../furniture';
import { Walker } from './walker';

export class Sitter extends Walker {
    data: { initialPosition: Vector2; initialRotation: number; };
    constructor(obj: { initialPosition?: Vector2; initialRotation?: number; hair?: 'full' | 'half' | 'none'; walkspeed?: number; } = {}, private chair: Chair) {
        super({
            hair: obj.hair,
            walkspeed: obj.walkspeed,
        });
        this.data = {
            initialPosition: obj.initialPosition || new Vector2(0, 0),
            initialRotation: obj.initialRotation || 0,
        }
        this.person.legCycle = 0.5;
        this.person.armPosition = [1, 1];
        this.person.armTwist = [0.5, -0.5];
        this.person.arms[0].setStyle({
            transition: 'transform 0.1s ease-in-out',
        });
        this.person.arms[1].setStyle({
            transition: 'transform 0.1s ease-in-out',
        });

        this.setStyle({
            transition: 'transform 0.8s ease-in-out',
        })
    }

    tick(obj: TickerReturnData) {
        super.tick(obj);
        console.log(this.chair.seat.transform.absolute.position);
        
        this.transform.setPosition(this.chair.seat.transform.absolute.position.add(this.data.initialPosition));
        this.transform.setRotation(this.chair.seat.transform.absolute.rotation + this.data.initialRotation);
    }
}