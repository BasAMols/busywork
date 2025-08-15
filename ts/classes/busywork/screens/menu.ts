import { Busywork } from '../../../game';
import { Button } from '../../element/button';
import { Flex } from '../../element/flex';
import { Label } from '../../element/label';
import { Screen } from '../../element/screen';

export class Menu extends Screen {
    public constructor(private game: Busywork) {
        super('menu');
        const column = this.append(new Flex({
            flexDirection: 'column',
            gap: 20,
            alignItems: 'center',
            justifyContent: 'center',
            style: {
                width: '100%',
                height: '100%',
            }
        }));
        const row1 = column.append(new Flex({
            gap: 10,
            alignItems: 'center',
            justifyContent: 'center',
 
        }));
        const row2 = column.append(new Flex({
            gap: 10,
            alignItems: 'center',
            justifyContent: 'center',
        }));


        row1.append(new Label({ text: 'Busywork', size: 20, color: 'white', weight: 'bold', font: 'Arial, sans-serif' }));
        row2.append(new Button({ text: 'Click me', style: { backgroundColor: '#2198c9', color: 'white', borderRadius: '5px' }, onClick: () => {
            this.game.start();
        } }));
    }
}