import { HTML } from '../../element/element';
import { Vector2 } from '../../math/vector2';

export class Section extends HTML {
    public constructor(size: Vector2, style: Partial<CSSStyleDeclaration>) {
        super({
            style: {
                width: size.x + 'px',
                height: size.y + 'px',

                boxShadow: '0px 0px 200px #0000004a',
                overflow: 'hidden',
                borderRadius: '10px',
                ...style
            },
            transform: {
                size: size,
            }
        });
    }
}
