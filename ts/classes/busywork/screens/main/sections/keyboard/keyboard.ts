
import { Vector2 } from '../../../../../math/vector2';
import { Section } from '../../../../util/section';
import { Computer } from '../computer/computer';
import { Walker } from '../office/people/walker';
import { getBigKeyboard } from './asset';


export class Keyboard extends Section {
    public constructor(computer: Computer, sitter: Walker) {
        super(new Vector2(450, 140), {

        });

        this.append(getBigKeyboard(new Vector2(0, 0), 0, (key) => {
            computer.addTT(key.toString());
            if (key === 0) {
                sitter.person.armTwist = [0.2, -0.5];
            } else if (key === 1) {
                sitter.person.armTwist = [1, -0.5];
            } else if (key === 2) {
                sitter.person.armTwist = [0.5, -0.8];
            }
        }, () => {
            sitter.person.armTwist = [0.5, -0.5];
        }));
    }
}
