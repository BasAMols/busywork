import { Ease } from '../../math/easings';
import { Vector2 } from '../../math/vector2';
import { TickerReturnData } from '../../ticker';
import { BusyWork } from '../../tilegame';
import { Section } from '../../util/section';
import { getBigKeyboard } from './asset';


export class Keyboard extends Section {

    get sitter() {
        return this.parent.office.sitter;
    };
    get computer() {
        return this.parent.computer;
    };
    public constructor(private parent: BusyWork) {
        super({
            width: '100%',
            height: '100%',
            justifyContent: 'flex-start',
            overflow: 'hidden',
        }, {
            size: new Vector2(0, 230),
            position: new Vector2(0, 370),
            index: 0,
            sizer: () => {
                return {
                    size: new Vector2(parent.getState('atdesk') ? 450 : 0, 230),
                    position: new Vector2(0, 370),
                    index: 0,
                }
            }
        }, 'keyboard');


        this.append(getBigKeyboard(new Vector2(0, 0), 0, (key) => {
            this.computer.addTT(key.toString());
            if (key === 0 || key === 3) {
                this.sitter.person.armTwist = [0.2, -0.5];
            } else if (key === 1 || key === 4) {
                this.sitter.person.armTwist = [1, -0.5];
            } else if (key === 2 || key === 5) {
                this.sitter.person.armTwist = [0.5, -0.8];
            }
        }, () => {
            this.sitter.person.armTwist = [0.5, -0.5];
        }));
    }

    tick(obj: TickerReturnData) {
        super.tick(obj);

        let t = (this.parent.office.tired-0.5)*2;
        if (t > 0.25) {
            this.setStyle({
                filter: `blur(${Ease.inOutCubic(Math.sin(obj.total * 0.0001 + 0.2) * Math.sin(obj.total * 0.001 + 0.2) * t) * 4}px)`,
            });
        } else {
            this.setStyle({
                filter: `blur(0px)`,
            });
        }
    }

}
