import { HTML } from '../../../../../../element/element';
import { Utils } from '../../../../../../math/util';
import { Vector2 } from '../../../../../../math/vector2';
import { TickerReturnData } from '../../../../../../ticker';
import { Person } from './person';

export class Walker extends HTML {
    private _destination: Vector2;
    person: Person;
    walkspeed: number;
    public constructor({ initialPosition = new Vector2(0, 0), initialRotation = 0, hair = 'full', walkspeed = 0.8 }: { initialPosition?: Vector2; initialRotation?: number; hair?: 'full' | 'half' | 'none'; walkspeed?: number; } = {}) {
        super({
            transform: {
                position: initialPosition,
                rotation: initialRotation,
                anchor: new Vector2(0.5, 0.5),
                size: new Vector2(0, 0),
            },
            style: {
                width: '80px',
                height: '30px',
            }
        });

        this.append(this.person = new Person(hair));
        this.person.armPosition = [0, 0];
        this.walkspeed = walkspeed;
    }


    public setDestination(destination: Vector2) {
        this._destination = destination;
    }

    public get destination() {
        return this._destination;
    }

    private _lookAt: Vector2;

    lookAt(destination: Vector2) {
        this._lookAt = destination;
    }

    /**
     * Calculate the shortest angular distance between two angles
     * Returns a value between -180 and 180 degrees
     */
    private getShortestAngleDifference(currentAngle: number, targetAngle: number): number {
        let diff = targetAngle - currentAngle;

        // Normalize to [-180, 180] range
        while (diff > 180) diff -= 360;
        while (diff < -180) diff += 360;

        return diff;
    }

    public tick(obj: TickerReturnData) {
        const angle = this._lookAt ? this._lookAt.sub(this.transform.position).angle() : this.transform.rotation;

        if (this._destination && this.transform.position.distance(this._destination) > 10) {
            this.transform.setPosition(this.transform.position.add(this._destination.sub(this.transform.position).normalize().scale(this.walkspeed)));
            this.transform.setRotation(this._destination.sub(this.transform.position).angle());
            this.person.legCycle += 0.011 * this.walkspeed;

            const rightArm = Math.cos(this.person.legCycle * Math.PI);
            const leftArm = -rightArm;
            this.person.forceArmPosition = [leftArm * 0.8, rightArm * 0.8];
            this.person.forceArmTwist = [0,0];

            this.person.lookAngle(Utils.clamp(angle - this.transform.rotation, -20, 20));
        } else {

            const angleDiff = this.getShortestAngleDifference(this.transform.rotation, angle);

            if (angleDiff > 40) {
                this.transform.setRotation(angle - 40);
            } else if (angleDiff < -40) {
                this.transform.setRotation(angle + 40);
            }

            this.person.legCycle = 0.5;
            this.person.armPosition = this.person.armPosition;
            this.person.armTwist = this.person.armTwist;
            this.person.lookAngle(angle - this.transform.rotation);
        }
    }
}