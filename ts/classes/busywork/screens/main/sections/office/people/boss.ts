import { Vector2 } from '../../../../../../math/vector2';
import { TickerReturnData } from '../../../../../../ticker';
import { Walker } from './walker';

export class Boss extends Walker {

    public time: number = 0;

    public constructor(position: Vector2, rotation: number, hair: 'full' | 'half' | 'none' = 'full') {
        super({ initialPosition: position, initialRotation: rotation, hair, walkspeed: 0.7 });
    }

    public tick(obj: TickerReturnData) {
        
        this.time = obj.total % 50000;
        if (this.time < 1000) {
            this.setDestination(new Vector2(350, 550));
            this.lookAt(new Vector2(350, 0));
        } else if (this.time < 10000) {
            this.setDestination(new Vector2(200, 500));
            this.lookAt(new Vector2(120, 400));
        } else if (this.time < 20000) {
            this.setDestination(new Vector2(450, 300));
            this.lookAt(new Vector2(480, 290));
        } else if (this.time < 24000) {
            this.setDestination(new Vector2(350, 220));
            this.lookAt(new Vector2(300, 150));
        } else {
            this.setDestination(new Vector2(350, 700));
            this.lookAt(new Vector2(350, 1000));
        }

        super.tick(obj);

    }
}