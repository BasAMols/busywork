import { HTML } from '../../../element/element';
import { Utils } from '../../../math/util';
import { Vector2 } from '../../../math/vector2';
import { glob } from '../../../tilegame';

export class Person extends HTML {
    torso: HTML;
    head: HTML;
    arms: HTML[] = [];
    legs: HTML[] = [];
    legCycleAnimation: import("../../../animator").Animator;
    animations: import("../../../animator").Animator[];

    set animationDuration(duration: number) {
        this.animations.forEach(animation => animation.duration = duration);
    }

    public constructor(hair: 'full' | 'half' | 'none' = 'full') {
        super({
            style: {
                width: '80px',
                height: '30px',
            },
            transform: {
                size: new Vector2(80, 30),
                position: new Vector2(-40, -15),
                anchor: new Vector2(0.5, 0.5),
            }
        });

        for (let i = 0; i < 2; i++) {
            const leg = this.append(new HTML({
                style: {
                    width: '25px',
                    height: '40px',
                    backgroundColor: '#62698e',
                    borderRadius: '20%',
                },
                transform: {
                    position: new Vector2(i * 30 + 10, -25),
                    anchor: new Vector2(0.5, 1),
                    size: new Vector2(25, 40),
                }
            }));
            this.legs.push(leg);
        }

        this.torso = this.append(new HTML({
            style: {
                width: '80px',
                height: '30px',
                backgroundColor: '#a69d97',
                borderRadius: '20px',
                filter: 'drop-shadow(3px 4px 3px #00000040)',

            },
            transform: {
                position: new Vector2(0, 0),
                anchor: new Vector2(0.5, 0.5),
                size: new Vector2(80, 30),
            }
        }));

        for (let i = 0; i < 2; i++) {
            const arm = this.torso.append(new HTML({
                style: {
                    width: '20px',
                    height: '60px',
                    backgroundColor: '#a69d97',
                    borderRadius: '20%',
                    filter: 'drop-shadow(3px 4px 5px #00000040)',

                },
                transform: {
                    position: new Vector2(i * 60, -45),
                    anchor: new Vector2(0.5, 0.9),
                    rotation: i ? -10 : 10,
                    size: new Vector2(20, 60),
                }
            }));
            const hand = arm.append(new HTML({
                style: {
                    width: '20px',
                    height: '20px',
                    backgroundColor: '#f9d9ba',
                    borderRadius: '50% 50% 2px 2px',
                },
                transform: {
                    size: new Vector2(20, 20),
                }
            }));
            this.arms.push(arm);
        }

        let hairShadow = {};
        if (hair === 'full') {
            hairShadow = {
                boxShadow: 'inset 0px -30px 2px rgba(60, 32, 34, 0.8)'
            };
        } else if (hair === 'half') {
            hairShadow = {
                boxShadow: 'inset 0px -15px 4px rgba(60, 32, 34, 0.8)'
            };
        }
        this.head = this.torso.append(new HTML({
            style: {
                width: '40px',
                height: '40px',
                backgroundColor: '#f9d9ba',
                borderRadius: '50%',
                filter: 'drop-shadow(1px 2px 5px #00000040)',
                ...hairShadow,
            },
            transform: {
                position: new Vector2(20, -5),
                anchor: new Vector2(0.5, 0.5),
                size: new Vector2(40, 40),
            }
        }));


        this.animations = glob.bulkAnimations([
            { // legs
                duration: 100,
                onChange: (value) => {
                    let left = value;
                    this.legs[0].transform.setScale(new Vector2(1, left * 2 - 1));
                    let right = 1-value;
                    this.legs[1].transform.setScale(new Vector2(1, right * 2 - 1));
                }
            },
            { // leftArm Swing
                duration: 200,
                onChange: (value) => {
                    let left = Utils.clamp(value, 0, 1);
                    this.arms[0].transform.setScale(new Vector2(1, left * 2 - 1));
                }
            },
            { // rightArm Swing
                duration: 200,
                onChange: (value) => {
                    let right = Utils.clamp(value, 0, 1);
                    this.arms[1].transform.setScale(new Vector2(1, right * 2 - 1));
                }
            },
            { // leftleg Swing
                duration: 200,
                onChange: (value) => {
                    let left = Utils.clamp(value, 0, 1);
                    this.legs[0].transform.setScale(new Vector2(1, left * 2 - 1));
                }
            },
            { // rightleg Swing
                duration: 200,
                onChange: (value) => {
                    let right = Utils.clamp(value, 0, 1);
                    this.legs[1].transform.setScale(new Vector2(1, right * 2 - 1));
                }
            },
        ]);

    }

    lookAngle(angle: number) {
        this.head.transform.setRotation(Utils.clamp(angle, -40, 40));
    }

    private _legPosition: [number, number] = [1, 1];
    set legPosition([l, r]: [number, number]) {
        this._legPosition = [Utils.clamp(l, 0, 1), Utils.clamp(r, 0, 1)];
        this.animations[3].target = l;
        this.animations[4].target = r;
    }
    set forcelegPosition([l, r]: [number, number]) {
        this._legPosition = [Utils.clamp(l, 0, 1), Utils.clamp(r, 0, 1)];
        this.animations[3].force = l;
        this.animations[4].force = r;
    }
    get legPosition() {
        return this._legPosition;
    }
    private _armPosition: [number, number] = [1, 1];
    set armPosition([l, r]: [number, number]) {
        this._armPosition = [Utils.clamp(l, 0, 1), Utils.clamp(r, 0, 1)];
        this.animations[1].target = l;
        this.animations[2].target = r;


    }
    set forceArmPosition([l, r]: [number, number]) {
        this._armPosition = [Utils.clamp(l, 0, 1), Utils.clamp(r, 0, 1)];
        this.animations[1].force = l;
        this.animations[2].force = r;
        this.animations[1].target = l;
        this.animations[2].target = r;
    }
    get armPosition() {
        return this._armPosition;
    }

    private _armTwist: [number, number] = [0, 0];
    set armTwist([l, r]: [number, number]) {
        this._armTwist = [Utils.clamp(l, -1, 1), Utils.clamp(r, -1, 1)];
        this.forceArmTwist = this._armTwist;
    }
    get armTwist() {
        return this._armTwist;
    }
    set forceArmTwist([l, r]: [number, number]) {
        let left = Utils.clamp(l, -1, 1);
        let right = Utils.clamp(r, -1, 1);
        this.arms[0].transform.setRotation(left * 20);
        this.arms[1].transform.setRotation(right * 20);
    }
}

