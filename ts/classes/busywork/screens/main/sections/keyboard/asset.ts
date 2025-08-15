import { Button } from '../../../../../element/button';
import { HTML } from '../../../../../element/element';
import { Vector2 } from '../../../../../math/vector2';


export function getBigKeyboard(position: Vector2, rotation: number, onMouseDown: (key: 0 | 1 | 2) => void, onMouseUp: () => void) {
    const wrap = new HTML({
        style: {
            width: '450px',
            height: '140px',
            backgroundColor: '#a69d97',
            borderRadius: '10px',
            boxShadow: '1px 1.8px 0px #00000040',
            filter: 'drop-shadow(3px 4px 2px #00000020)',
        },
        transform: {
            position: position,
            rotation: rotation,
            anchor: new Vector2(0.5, 0.5)
        },
    });

    const buttons: Button[] = [];
    for (let i = 0; i < 3; i++) {
        let e: NodeJS.Timeout;
        const b = new Button({
            style: {
                width: '94px',
                height: '94px',
                backgroundColor: '#a59c96',
                borderRadius: '14px',
                boxShadow: '10px 10px 2px #00000030, inset 28px 28px 28px #00000020',
                cursor: 'pointer',
                padding: '0px',
                border: 'none',
                transition: 'box-shadow 0.04s ease-in-out',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '80px',
                fontWeight: 'bold',
                color: '#776b6bcc',
                fontFamily: 'monospace',
                
            },
            text: i.toString(),
            onMouseDown: () => {
                b.dom.style.boxShadow = '3px 3px 0px #00000040, inset 28px 28px 28px #00000020';
                onMouseDown(i as 0 | 1 | 2);
            },
            onMouseUp: () => {
                b.dom.style.boxShadow = '10px 10px 2px #00000030, inset 28px 28px 28px #00000020';
                onMouseUp();
            },
            transform: {
                position: new Vector2(50 + i * (18 * 7), 14),
                anchor: new Vector2(0.5, 0.5)
            }
        });
        wrap.append(buttons[i] = b);
    }



    return wrap;
}

