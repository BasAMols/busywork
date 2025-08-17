import { HTML } from '../../../../../../element/element';
import { Ease } from '../../../../../../math/easings';
import { Utils } from '../../../../../../math/util';
import { Vector2 } from '../../../../../../math/vector2';


export class Person extends HTML {
    torso: HTML;
    head: HTML;
    arms: HTML[] = [];
    legs: HTML[] = [];
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
            }
        } else if (hair === 'half') {
            hairShadow = {
                boxShadow: 'inset 0px -15px 4px rgba(60, 32, 34, 0.8)'
            }
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

        this.legCycle = 2;
        this.armTwist = [0, 0];
    }

    lookAngle(angle: number) {
        this.head.transform.setRotation(Utils.clamp(angle, -40, 40));
    }

    private _legCycle: number = 0;
    get legCycle() {
        return this._legCycle;
    }

    set legCycle(v: number) {
        this._legCycle = v % 2;
        const value = Ease.inOutCirc(this._legCycle <= 1 ? this._legCycle : 2 - this._legCycle);
        this.legs[0].transform.setScale(new Vector2(1, 1 - (value * 2)));
        this.legs[1].transform.setScale(new Vector2(1, -1 + (value * 2)));
    }

    private _armPosition: [number, number] = [1, 1];
    set armPosition([l, r]: [number, number]) {
        this._armPosition = [Utils.clamp(l, -1, 1), Utils.clamp(r, -1, 1)];
        this.forceArmPosition = this._armPosition;
    }
    set forceArmPosition([l, r]: [number, number]) {
        let left = Utils.clamp(l, -1, 1);
        let right = Utils.clamp(r, -1, 1);
        this.arms[0].transform.setScale(new Vector2(1, left));
        this.arms[1].transform.setScale(new Vector2(1, right));
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


export function getPerson(position: Vector2, rotation: number, arms: boolean = true) {
    const wrap = new HTML({
        style: {
            width: '80px',
            height: '30px',
        },
        transform: {
            position: position,
            rotation: rotation,
            anchor: new Vector2(0.5, 0.5)
        },
    });

    for (let i = 0; i < 2; i++) {
        const leg = wrap.append(new HTML({
            style: {
                width: '25px',
                height: '60px',
                backgroundColor: '#62698e',
                borderRadius: '20%',
                filter: 'drop-shadow(3px 4px 5px #00000040)',
            },
            transform: {
                position: new Vector2(i * 45 + 5, -35),
                anchor: new Vector2(0.5, 0.5),
            }
        }));
    }

    //torso
    const torso = wrap.append(new HTML({
        style: {
            width: '80px',
            height: '30px',
            backgroundColor: '#a69d97',
            borderRadius: '20px',
        },
        transform: {
            position: new Vector2(0, 0),
            anchor: new Vector2(0.5, 0.5)
        }
    }));
    // head

    // arms
    if (arms) {
        for (let i = 0; i < 2; i++) {
            const arm = torso.append(new HTML({
                style: {
                    width: '20px',
                    height: '70px',
                    backgroundColor: '#a69d97',
                    borderRadius: '20%',
                    filter: 'drop-shadow(3px 4px 5px #00000040)',
                },
                transform: {
                    position: new Vector2(i * 50 + 5, -45),
                    anchor: new Vector2(0.5, 0.5),
                    rotation: i ? -10 : 10,
                }
            }));
            const hand = arm.append(new HTML({
                style: {
                    width: '20px',
                    height: '20px',
                    backgroundColor: '#f9d9ba',
                    borderRadius: '50% 50% 2px 2px',
                    zIndex: '-1',
                },
            }));
        }
    }
    // legs


    const head = torso.append(new HTML({
        style: {
            width: '40px',
            height: '40px',
            backgroundColor: '#f9d9ba',
            borderRadius: '50%',
            filter: 'drop-shadow(1px 2px 5px #00000040)',
            boxShadow: 'inset 0px -15px 6px rgba(60, 32, 34, 0.8)',
        },
        transform: {
            position: new Vector2(20, -5),
            anchor: new Vector2(0.5, 0.5)
        }
    }));

    return wrap;
}