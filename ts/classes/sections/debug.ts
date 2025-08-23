import { Vector2 } from '../math/vector2';
import { BusyWork } from '../tilegame';
import { Section } from '../util/section';

export class Debug extends Section {

    public constructor(private parent: BusyWork) {
        super({
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
            color: '#fff',
            fontFamily: 'monospace',
            fontSize: '24px',
            padding: '0 10px',
        }, {
            size: new Vector2(0, 0),
            position: new Vector2(-50, -50),
            index: 0,
        }, 'debug');
    }

}
