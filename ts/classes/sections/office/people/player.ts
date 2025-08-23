import { Vector2 } from '../../../math/vector2';
import { Office } from '../office';
import { Walker } from './walker';

export class Player extends Walker {
    public constructor(private office: Office) {
        super({
            initialPosition: new Vector2(300, 300), initialRotation: -1, hair: 'none', walkspeed: 1.2
        });
        this.idle();
    }

    public setDestination(destination: Vector2): void {
        const blockers = this.office.blockers;
        for (const blocker of blockers) {
            if (!destination ||
                (
                    destination.x > blocker.position.x && destination.x < blocker.position.x + blocker.size.x &&
                    destination.y > blocker.position.y && destination.y < blocker.position.y + blocker.size.y
                )) {
                return;
            }
        }
        super.setDestination(destination);
    }


}