import { HTML } from '../../../../../../element/element';
import { Utils } from '../../../../../../math/util';
import { Vector2 } from '../../../../../../math/vector2';
import { TickerReturnData } from '../../../../../ticker';
import { Person } from './assets';

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
        super.tick(obj);
        const angle = this._lookAt ? this._lookAt.sub(this.transform.position).angle() : this.transform.rotation;

        if (this._destination && this.transform.position.distance(this._destination) > 10) {
            this.move(obj, this._destination.sub(this.transform.position).normalize(), this.walkspeed);
            this.transform.setRotation(this.transform.position.sub(this._destination).angle());
            this.person.lookAngle(Utils.clamp(angle - this.transform.rotation, -20, 20));
        } else {

            const angleDiff = this.getShortestAngleDifference(this.transform.rotation, angle);

            if (angleDiff > 40) {
                this.transform.setRotation(angle - 40);
            } else if (angleDiff < -40) {
                this.transform.setRotation(angle + 40);
            }

            this.idle();
        }
    }

    protected idle() {
        this.person.legCycle = 0.5;
        this.person.armPosition = this.person.armPosition;
        this.person.armTwist = this.person.armTwist;
    }

    protected walkCycle(speed: number) {
        this.person.legCycle += 0.011 * speed;
        const rightArm = Math.cos(this.person.legCycle * Math.PI);
        const leftArm = -rightArm;
        this.person.forceArmPosition = [leftArm * 0.8 * speed, rightArm * 0.8 * speed];
        this.person.forceArmTwist = [0,0];
    }

    move(obj: TickerReturnData, direction: Vector2, speed: number) {

        // glob.debug.setText(`${direction.x.toFixed(2)} ${direction.y.toFixed(2)} ${speed.toFixed(2)} ${obj.frameRate.toFixed(2)} ${obj.interval.toFixed(2)} ${obj.intervalS20.toFixed(2)}`);
        const normalisedSpeed = speed*obj.intervalS20*0.15;
        this.transform.setPosition(this.transform.position.add(direction.normalize().scale(normalisedSpeed)));
        this.walkCycle(normalisedSpeed);
    }
}