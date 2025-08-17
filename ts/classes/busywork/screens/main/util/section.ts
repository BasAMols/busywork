import { HTML } from '../../../../element/element';
import { Vector2 } from '../../../../math/vector2';


export class Section extends HTML {
    public constructor(size: Vector2, style: Partial<CSSStyleDeclaration>, gridParams: [number, number, number, number] = [1, 1, 1, 1]) {
        super({
            style: {
                width: size.x + 'px',
                height: size.y + 'px',

                // boxShadow: '0px 0px 200px #0000004a',
                transition: 'width 1.2s ease-in-out, margin-left 1.2s ease-in-out',

                overflow: 'hidden',
                borderRadius: '10px',
                gridColumn: gridParams[0] + ' / span ' + gridParams[1],
                gridRow: gridParams[2] + ' / span ' + gridParams[3],
                ...style,
            },
            transform: {
                size: size,
            },
        });
    }
}
