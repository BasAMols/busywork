import { Animator } from '../../../animator';
import { HTML } from '../../../element/element';
import { Vector2 } from '../../../math/vector2';
import { TickerReturnData } from '../../../ticker';
import { glob } from '../../../tilegame';
import { Person } from './assets';


export class Walker extends HTML {
    private _destination: Vector2;
    person: Person;
    walkspeed: number;
    turnAnimation: Animator;
    private _velocity: Vector2;
    legCycle: number;
    public get velocity(): Vector2 {
        return this._velocity;
    }
    public set velocity(value: Vector2) {
        this._velocity = value;
        // this.turnAnimation.target = this._velocity.angle() / 360;

    }
    public constructor({
        initialPosition = new Vector2(0, 0),
        initialRotation = 0,
        hair = 'full',
        walkspeed = 0.8,
        turnDuration = 100 }: {
            initialPosition?: Vector2;
            initialRotation?: number;
            hair?: 'full' | 'half' | 'none';
            walkspeed?: number;
            turnDuration?: number;
        } = {}) {
        super({
            transform: {
                position: initialPosition,
                rotation: initialRotation,
                anchor: new Vector2(0.5,
                    0.5),

                size: new Vector2(0, 0),
            },
            style: {
                width: '80px',
                height: '30px',
            }
        });

        this.append(this.person = new Person(hair));
        this.walkspeed = walkspeed;

        this.turnAnimation = glob.addAnimation({ duration: turnDuration, mode: 'wrap', onChange: (value) => {
            this.transform.setRotation(value * 360);
        } });
        this.turnAnimation.target = initialRotation / 360;

        this.idle();

    }


    public setDestination(destination: Vector2) {
        this._destination = destination;
        this.turnAnimation.target = this._destination.sub(this.transform.position).angle() / 360;
    }

    public get destination() {
        return this._destination;
    }

    public tick(obj: TickerReturnData) {
        super.tick(obj);
        if (this._destination && this.transform.position.distance(this._destination) > 10) {
            this.move(obj, this._destination.sub(this.transform.position).normalize(), this.walkspeed);
        } else {
            this.idle();
        }
    }

    protected idle() {
        this.legCycle = 0.25;
        this.person.animationDuration = 50;
        this.person.armPosition = [0.5, 0.5];
        this.person.legPosition = [0.5, 0.5];
        this.person.armTwist = [0, 0];
    }
    
    protected walkCycle(speed: number) {
        
        this.person.animationDuration = 200 - 50 * speed;
        this.legCycle += 0.015 * speed;
        const v = Math.cos(this.legCycle * Math.PI);
        this.person.legPosition = [v < 0 ? 0 : 1, v < 0 ? 1 : 0];
        this.person.armPosition = [v < 0 ? 1 : 0, v < 0 ? 0 : 1];
        this.person.armTwist = [0, 0];
    }

    move(obj: TickerReturnData, direction: Vector2, speed: number) {

        // glob.debug.setText(`${direction.x.toFixed(2)} ${direction.y.toFixed(2)} ${speed.toFixed(2)} ${obj.frameRate.toFixed(2)} ${obj.interval.toFixed(2)} ${obj.intervalS20.toFixed(2)}`);
        const normalisedSpeed = speed * obj.intervalS20 * 0.15;
        this.transform.setPosition(this.transform.position.add(direction.normalize().scale(normalisedSpeed)));
        this.walkCycle(normalisedSpeed);

    }
}