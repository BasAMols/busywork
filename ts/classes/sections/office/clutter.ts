import { HTML } from '../../element/element';
import { Vector2 } from '../../math/vector2';

1
export function getPaper(position: Vector2, rotation: number = 0, corner: boolean = false) {
    return new HTML({
        style: {
            width: '26px',
            height: '43px',
            backgroundColor: '#d0cdcd',
            filter: 'drop-shadow(0px 0px 2px #0000004a)',
            borderRadius: corner ? '6px 0 0 0' : '0px',
        },
        transform: {
            position: position,
            rotation: rotation,
            anchor: new Vector2(0.5, 0.5),
            size: new Vector2(26, 43),
        }
    });
}