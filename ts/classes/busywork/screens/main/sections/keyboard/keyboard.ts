
import { Ease } from '../../../../../math/easings';
import { Vector2 } from '../../../../../math/vector2';
import { TickerReturnData } from '../../../../../ticker';
import { TileGame } from '../../tilegame';
import { Section } from '../../util/section';
import { getBigKeyboard } from './asset';


export class Keyboard extends Section {

    get sitter() {
        return this.parent.office.sitter
    };
    get computer() {
        return this.parent.computer
    };
    public constructor(private parent: TileGame) {
        super(new Vector2(450, 140), {

        });

        this.append(getBigKeyboard(new Vector2(0, 0), 0, (key) => {
            this.computer.addTT(key.toString());
            if (key === 0) {
                this.sitter.person.armTwist = [0.2, -0.5];
            } else if (key === 1) {
                this.sitter.person.armTwist = [1, -0.5];
            } else if (key === 2) {
                this.sitter.person.armTwist = [0.5, -0.8];
            }
        }, () => {
            this.sitter.person.armTwist = [0.5, -0.5];
        }));
    }

    tick(obj: TickerReturnData) {
        super.tick(obj);
        this.setStyle({
            filter: `blur(${Ease.inOutCubic(Math.sin(obj.total*0.0001 + 0.2)*Math.sin(obj.total*0.001 + 0.2)*this.parent.office.tired)*4}px)`,
        });
    }
}
