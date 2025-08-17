import { Vector2 } from '../../../../math/vector2';
import { glob } from '../../../base';
import { TickerReturnData } from '../../../ticker';
import { Walker } from '../sections/office/people/walker';

export class Movement {

    private state: 'walking' | 'waiting' = 'walking';
    private index: number = 0;
    private condition: () => boolean = undefined;

    public constructor(private actor: Walker, private key: string, private cycle: {
        to: Vector2;
        speed: number;
        condition: number | (() => boolean);
    }[], private callback: (speed: number, velocity: Vector2, state: 'walking' | 'waiting', cycle: number) => void, state: number = 0) {
        this.index = state;
    }

    public tick(obj: TickerReturnData) {
        const cycle = this.cycle[this.index];

        console.log(this.state);
        
        if (this.state === 'walking') {
            this.move(cycle, obj);
        }

        if (this.state === 'waiting') {
            this.wait(cycle);
        }
    }

    private wait(cycle: typeof this.cycle[number]) {

        if (this.condition) {
            if (this.condition()) {
                this.condition = undefined;
                this.next();
            }
        } else {
            this.callback(0, new Vector2(0, 0), 'waiting', this.index);
        }
    }


    private move(cycle: typeof this.cycle[number], obj: TickerReturnData) {
        const velocity = cycle.to.sub(this.actor.transform.position).normalize().scale(cycle.speed);
        // this.actor.transform.setPosition(this.actor.transform.position.add(velocity));

        this.actor.move(obj, velocity, cycle.speed);

        this.callback(cycle.speed, velocity, 'walking', this.index);


        if (this.actor.transform.position.distance(cycle.to) < 1) {
            this.state = 'waiting';

            if (typeof cycle.condition === 'function') {
                if (cycle.condition()) {
                    this.next();
                } else {
                    this.condition = cycle.condition;
                }
            } else {
                if (cycle.condition < 1) {
                    this.next();
                } else {
                    glob.timer.add(`${this.key}-walk`, cycle.condition, () => {
                        this.next();
                    });
                }
            }
        }


    }

    private next() {
        this.index++;
        if (this.index >= this.cycle.length) {
            this.index = 0;
        }
        this.state = 'walking';
    }
}