import { Utils } from '../../../../../../math/util';
import { Vector2 } from '../../../../../../math/vector2';
import { TickerReturnData } from '../../../../../ticker';
import { Movement } from '../../../util/movement';
import { Walker } from './walker';

export class Boss extends Walker {

    private movement: Movement;
    private rotation: number = 0;
    private rotationTarget: number = 0;

    public constructor(position: Vector2, rotation: number, hair: 'full' | 'half' | 'none' = 'full') {
        super({ initialPosition: position, initialRotation: rotation, hair, walkspeed: 0.7 });

        this.movement = new Movement(this, 'boss', [
            { to: new Vector2(350, 550), speed: 0.7, time: 100 },
            { to: new Vector2(200, 500), speed: 0.7, time: 3000 },
            { to: new Vector2(450, 300), speed: 0.7, time: 3000 },
            { to: new Vector2(350, 220), speed: 0.7, time: 3000 },
            { to: new Vector2(350, 700), speed: 1, time: 20000 },
        ], (speed, velocity, state, time) => {
            if (state === 'walking') {
                this.rotationTarget = velocity.angle();
                this.walkCycle(speed);
            }
            if (state === 'waiting') {
                this.idle();
            }
        }, 0);
    }

    public tick(obj: TickerReturnData) {
        // super.tick(obj);
        this.movement.tick(obj);

        if (Math.abs(this.rotation - this.rotationTarget) > 1) {
            if (this.rotation - this.rotationTarget > 180) {
                this.rotationTarget = this.rotationTarget + 360;
            } else if (this.rotation - this.rotationTarget < -180) {
                this.rotationTarget = this.rotationTarget - 360;
            }

            this.rotation = Utils.lerp(this.rotation, this.rotationTarget, 0.05);
            this.transform.setRotation(this.rotation);
        }
    }
}