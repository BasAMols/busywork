
import { HTML } from '../../../../../element/element';
import { Vector2 } from '../../../../../math/vector2';
import { getPaper } from './clutter';
import { getScreen, getKeyboard, getPhone } from './prop';

export function getDesk(position: Vector2, rotation: number, screens: 1 | 2 = 1, style: Partial<CSSStyleDeclaration> = {}) {
    const desk = new HTML({
        style: {
            width: '300px',
            height: '120px',
            backgroundColor: '#904639',
            filter: 'drop-shadow(rgba(0, 0, 0, 0.3) 0px 0px 9px)',
            borderRadius: '10px',
            ...style,
        },
        transform: {
            position: position,
            rotation: rotation,
            size: new Vector2(300, 120),
            anchor: new Vector2(0.5, 0.5),
        },
    });

    if (screens === 2) {

        desk.append(getScreen(new Vector2(55, -8), -8));
        desk.append(getScreen(new Vector2(135, -8), 8));
    } else {
        desk.append(getScreen(new Vector2(100, -8), 1));

    }
    desk.append(getKeyboard(new Vector2(105, 85), 0));

    if (Math.random() > 0.5) desk.append(getPaper(new Vector2(10, 30), 8, Math.random() > 0.3));
    if (Math.random() > 0.5) desk.append(getPaper(new Vector2(60, 70), 80, Math.random() > 0.3));
    if (Math.random() > 0.5) desk.append(getPaper(new Vector2(230, 40), -4, Math.random() > 0.3));
    if (Math.random() > 0.5) desk.append(getPaper(new Vector2(260, 38), 5, Math.random() > 0.3));
    desk.append(getPhone(new Vector2(220, 20), 4));

    return desk;
}


export class Chair extends HTML {
    seat: HTML;
    setRotation(rotation: number) {
        if (this.seat.transform.rotation !== rotation) {
            // this.seat.transform.setRotation(rotation);
        }
    }

    setPosition(position: Vector2) {
        this.transform.setPosition(position);
    }

    getPosition() {
        return this.seat.transform.absolute;
    }

    constructor(position: Vector2, rotation: number, style: Partial<CSSStyleDeclaration> = {}) {
        super({
            style: {
                width: '80px',
                height: '80px',
                transition: 'transform 0.8s ease-in-out',
                ...style,
            },
            transform: {
                position: position,
                rotation: rotation,
                anchor: new Vector2(0.5, 0.5),
                size: new Vector2(80, 80),
            },  
        });


        for (let i = 0; i < 5; i++) {
            //leg
            this.append(new HTML({
                style: {
                    width: '70px',
                    height: '10px',
                    backgroundColor: '#c4aeae',
                    filter: 'drop-shadow(3px 4px 2px #00000030)',
                    borderRadius: '10px',
                },
                transform: {
                    position: new Vector2(40, 30),
                    rotation: rotation + 20 + i * (360 / 5),
                    anchor: new Vector2(0, 0.5),
                    size: new Vector2(70, 10),
                },
            }));
        }
        this.seat = this.append(new HTML({
            style: {
                width: '70px',
                height: '80px',
                backgroundColor: '#646464',
                filter: 'drop-shadow(3px 4px 5px #00000040)',
                borderRadius: '10px',
                transition: 'transform 0.8s ease-in-out, left 0.8s ease-in-out, top 0.8s ease-in-out',
            },
            transform: {
                position: new Vector2(5, 0),
                anchor: new Vector2(0.5, 0.5),
                size: new Vector2(70, 80),  
            }
        }));

        this.seat.append(new HTML({
            style: {
                width: '80px',
                height: '25px',
                backgroundColor: '#3c3c3c',
                borderRadius: '10px 10px 5px 5px',
                marginTop: '55px',
            },
            transform: {
                position: new Vector2(-5, 0),
                anchor: new Vector2(0.5, 0.5),
                size: new Vector2(80, 25),
            }
        }));
    }
}