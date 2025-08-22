import { HTML } from '../../element/element';
import { Vector2 } from '../../math/vector2';


export function getPlant(position: Vector2, rotation: number = 0, leaves: number = 11, angle: number = 66) {
    const plant = new HTML({
        style: {
            width: '75px',
            height: '75px',
            backgroundColor: '#726553',
            borderRadius: '50%',
            boxShadow: 'inset 0px 0px 11px #2f2828, 3px 1px 4px #00000054',
        },
        transform: {    
            position: position,
            rotation: rotation,
            anchor: new Vector2(0.5, 0.5),
            size: new Vector2(75, 75),
        }
    });

    for (let i = 0; i < leaves; i++) {
        plant.append(getLeaf(new Vector2(40, 8), i * angle));
        const p = getLeaf(new Vector2(40, 8), i * angle);
        p.transform.setScale(new Vector2(p.transform.scale.x * 0.85, p.transform.scale.y * 0.8));
        plant.append(p);
    }

    return plant;
}

export function getLeaf(position: Vector2, rotation: number = 0) {
    const wrap = new HTML({
        style: {
            width: '60px',
            height: '60px',
            filter: 'drop-shadow(0px 0px 6px rgba(9, 48, 15, 0.9))',

        },
        transform: {
            position: position,
            rotation: rotation,
            scale: new Vector2(0.6 + Math.random() * 0.1, 0.25 + Math.random() * 0.1),
            anchor: new Vector2(0, 0.5),
            size: new Vector2(60, 60),
        }
    });
    wrap.append(new HTML({
        style: {
            width: '60px',
            height: '60px',
            borderRadius: '50% 50% 50% 4px',
            backgroundColor: '#3c8b49',
            boxShadow: 'inset 4px 4px 20px #295629',
        },
        transform: {
            rotation: 45,
            anchor: new Vector2(0.5, 0.9),
            size: new Vector2(60, 60),
        }
    }));

    return wrap;
}


export function getCoffeeMachine(position: Vector2, rotation: number = 0, leaves: number = 11, angle: number = 66) {
    const table = new HTML({
        style: {
            width: '75px',
            height: '90px',
            backgroundColor: '#674b47',
            borderRadius: '5px',
            border: '10px solid #664a46',
            boxSizing: 'border-box',
            boxShadow: 'inset 0px 0px 20px #79514b, 3px 1px 4px #00000054',
        },
        transform: {    
            position: position,
            rotation: rotation,
            anchor: new Vector2(0.5, 0.5),
            size: new Vector2(75, 75),
        }
    });

    table.append(new HTML({
        style: {
            width: '50px',
            height: '40px',
            backgroundColor: '#504f5a',
            borderRadius: '5px',
            boxShadow: 'inset 0px 0px 11px #2f2828, 3px 1px 4px #00000054',
        },
        transform: {
            position: new Vector2(0, 8),
            anchor: new Vector2(0.5, 0.5),
            size: new Vector2(50, 40),
        }
    }));

    table.append(getTopCup(new Vector2(27, 15), 14));
    table.append(getTopCup(new Vector2(27, 17), -10));
    table.append(getTopCup(new Vector2(30, 30), 180));
    table.append(getTopCup(new Vector2(30, 30), 4));
    table.append(getTopCup(new Vector2(16, 25), 170));

    return table;
}

export function getTopCup(position: Vector2, rotation: number) {
    const wrap = new HTML({
        style: {
            width: '12px',
            height: '12px',
            backgroundColor: '#e4e3e0',
            borderRadius: '100%',
            boxSizing: 'border-box',
            border: '2px solid #e4e3e0',
            boxShadow: 'inset 4px 0px 2px #00000020, 0px 0px 2px #00000090',

        },
        transform: {
            position: position,
            rotation: rotation,
            anchor: new Vector2(0.5, 0.5),
            size: new Vector2(12, 12),
        }
    });

    wrap.append(new HTML({
        style: {
            width: '4px',
            height: '4px',
            backgroundColor: '#e4e3e0',
            borderRadius: '1px',
            boxShadow: 'inset 10px 0px 4px #00000030, 0px 0px 1px #00000090',
            zIndex: '-1',

        },
        transform: {
            position: new Vector2(5, -3),
            anchor: new Vector2(0.5, 0.5),
            size: new Vector2(10, 2),
        }
    }));

    return wrap;
}

export function getPhone(position: Vector2, rotation: number) {
    const wrap = new HTML({
        style: {
            width: '40px',
            height: '45px',
            backgroundColor: '#a69d97',
            borderRadius: '4px',
            filter: 'drop-shadow(3px 4px 2px #00000040)',
        },
        transform: {
            position: position,
            rotation: rotation,
            anchor: new Vector2(0.5, 0.5),
            size: new Vector2(40, 45),
        },
    });

    wrap.append(new HTML({
        style: {
            width: '15px',
            height: '40px',
            backgroundColor: '#90857f',
            borderRadius: '4px',
            filter: 'drop-shadow(2px 1px 1px #00000040)',
        },
        transform: {
            position: new Vector2(2, 2),
            size: new Vector2(15, 40),
        }
    }));

    return wrap;
}


export function getKeyboard(position: Vector2, rotation: number) {
    const wrap = new HTML({
        style: {
            width: '60px',
            height: '20px',
            backgroundColor: '#a69d97',
            borderRadius: '2px',
            boxShadow: '1px 1.8px 0px #00000040',
            filter: 'drop-shadow(3px 4px 2px #00000020)',
        },
        transform: {
            position: position,
            rotation: rotation,
            anchor: new Vector2(0.5, 0.5),
            size: new Vector2(60, 20),
        },
    });

    // for (let i = 0; i < 3; i++) {
    //     let e: NodeJS.Timeout;
    //     const b = new HTML({
    //         style: {
    //             width: '14px',
    //             height: '14px',
    //             backgroundColor: '#a59c96',
    //             borderRadius: '2px',
    //             boxShadow: '1px 1.8px 1px #00000040, inset 2px 2px 3px #00000020',
    //             cursor: 'pointer',
    //             padding: '0px',
    //             border: 'none',
    //         },

    //         transform: {
    //             position: new Vector2(5 + i * 18, 2),
    //             anchor: new Vector2(0.5, 0.5),
    //             size: new Vector2(14, 14),
    //         }
    //     });
    //     wrap.append(b);
    // }

    wrap.append(new HTML({
        style: {
            width: '15px',
            height: '20px',
            backgroundColor: '#a69d97',
            borderRadius: '100%',
            boxShadow: '1px 1px 2px #00000040',
        },
        transform: {
            position: new Vector2(72, 4),
            anchor: new Vector2(0.5, 0.5),
            size: new Vector2(15, 20),
        }
    }));



    return wrap;
}


export function getScreen(position: Vector2, rotation: number) {
    const wrap = new HTML({
        style: {
            width: '70px',
            height: '60px',
            filter: 'drop-shadow(3px 4px 5px #00000040)',

        },
        transform: {
            position: position,
            rotation: rotation,
            anchor: new Vector2(0.5, 0.5),
            size: new Vector2(70, 60),
        },
    });

    wrap.append(new HTML({
        style: {
            width: '30px',
            height: '50px',
            backgroundColor: '#a69d97',
            borderRadius: '10px',

        },
        transform: {
            anchor: new Vector2(0.5, 0.5),
            size: new Vector2(30, 50),
            rotation: 30,
            position: new Vector2(8, 11)
        }
    }));
    wrap.append(new HTML({
        style: {
            width: '30px',
            height: '50px',
            backgroundColor: '#a69d97',
            borderRadius: '10px',

        },
        transform: {
            anchor: new Vector2(0.5, 0.5),
            size: new Vector2(30, 50),
            rotation: -30,
            position: new Vector2(32, 11)
        }
    }));
    wrap.append(new HTML({
        style: {
            width: '40px',
            height: '50px',
            backgroundColor: '#a69d97',
            borderRadius: '6px',

        },
        transform: {
            anchor: new Vector2(0.5, 0.5),
            size: new Vector2(40, 50),
            position: new Vector2(15, 5)
        }
    }));
    wrap.append(new HTML({
        style: {
            width: '70px',
            height: '20px',
            marginTop: '50px',
            backgroundColor: '#90857f',
            borderRadius: ' 0 0 10px 10px  ',
        },
        transform: {
            size: new Vector2(70, 20),
        }
    }));

    return wrap;
}