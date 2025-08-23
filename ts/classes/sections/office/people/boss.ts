import { HTML } from '../../../element/element';
import { Vector2 } from '../../../math/vector2';
import { TickerReturnData } from '../../../ticker';
import { BusyWork, glob } from '../../../tilegame';
import { Movement } from '../../../util/movement';
import { getPaper } from '../clutter';
import { Walker } from './walker';


export class Boss extends Walker {

    private movement: Movement;

    public waitTime: number = 0;
    public waitTimeMax: number = 10000;
    public paper: HTML;
    public collected: number = 0;

    public constructor(game: BusyWork, position: Vector2, rotation: number, hair: 'full' | 'half' | 'none' = 'full') {
        super({ initialPosition: position, initialRotation: rotation, hair, walkspeed: 0.7 });

        this.movement = new Movement(this, 'boss', [
            { to: new Vector2(350, 550), speed: 0.7, condition: 1000 },
            { to: new Vector2(200, 500), speed: 0.7, condition: 1000 },
            { to: new Vector2(450, 300), speed: 0.7, condition: 1000 },
            { to: new Vector2(350, 220), speed: 0.7, condition: 500 },
            {
                to: new Vector2(350, 220), speed: 0.7, condition: () => {
                    if (game.computer.completed >= game.computer.target) {
                        game.computer.completed -= game.computer.target;
                        this.waitTime = 0;
                        this.hasPaper = true;
                        this.collected++;
                        return true;
                    }
                    this.waitTime += glob.ticker.interval;
                    if (this.waitTime > this.waitTimeMax) {
                        game.addState('gameover', true);
                    }
                    return false;
                }
            },
            { to: new Vector2(350, 700), speed: 1, condition: 20000 },
            {
                to: new Vector2(350, 700), speed: 1, condition: () => {
                    this.hasPaper = false;
                    return true;
                }
            },
        ], (speed, velocity, state, phase) => {
            this.phase = phase;
            if (state === 'walking') {
                this.turnAnimation.target = velocity.angle() / 360;
                // this.walkCycle(speed);
            }
            if (state === 'waiting') {
                this.idle();
            }
        }, 0);

        this.transform.setPosition(new Vector2(350, 1500));

        this.paper = getPaper(new Vector2(-2, -50), 7, true);
        this.paper.transform.setScale(new Vector2(1, 0.8));
        this.person.append(this.paper);

        this.hasPaper = false;
        this.idle();
    }

    private _hasPaper: boolean = true;
    public get hasPaper(): boolean {
        return this._hasPaper;
    }
    public set hasPaper(value: boolean) {
        this._hasPaper = value;
        this.paper.visible = value;
    }

    public phase: number = 0;

    public tick(obj: TickerReturnData) {
        // super.tick(obj);

        if (glob.params.boss) {
            this.movement.tick(obj);
        }

        if (this.hasPaper) {
            this.person.armPosition = [0.9, this.person.armPosition[1]];
        }
    }
}