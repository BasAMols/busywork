import { Vector2 } from '../math/vector2';
import { BusyWork } from '../tilegame';
import { Section } from '../util/section';

export class Debug extends Section {

    public constructor(private parent: BusyWork, gridParams: ConstructorParameters<typeof Section>[2]) {
        super(new Vector2(700, 20), {
            transition: 'width 0.8s ease-in-out, height 0.8s ease-in-out',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '10px',
            boxSizing: 'border-box',
            backgroundColor: 'transparent',
            boxShadow: 'none',
            overflow: 'visible',
            pointerEvents: 'none',
            background: '#3c5561',
            width: '100%',
            height: '100%',
            color: '#fff',
            fontFamily: 'monospace',
            fontSize: '24px',
            padding: '0 10px',

        }, gridParams);
    }

}
