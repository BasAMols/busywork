import { Vector2 } from '../../../../math/vector2';
import { glob } from '../../../base';
import { TickerReturnData } from '../../../ticker';
import { TileGame } from '../tilegame';
import { Section } from '../util/section';

export class Gameover extends Section {

    public constructor(private parent: TileGame, gridParams: ConstructorParameters<typeof Section>[2]) {
        super(new Vector2(700, 20), {
            transition: 'width 0.8s ease-in-out, height 0.8s ease-in-out, opacity 0.8s ease-in-out',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '10px',
            boxSizing: 'border-box',
            backgroundColor: 'transparent',
            boxShadow: 'none',
            pointerEvents: 'none',
            background: '#3c5561',
            width: '100%',
            height: '100%',
            color: '#fff',
            fontSize: '90px',
            padding: '0 10px',
            overflow: 'hidden',
            fontFamily: 'Noto Sans',
            fontWeight: '500',
            textShadow: '0px 0px 10px black',

        }, gridParams);

        this.opacity = 0;
        this.setText('GAME OVER');
    }

    public trigger() {
        this.opacity = 0.8;
        glob.game.ticker.stop();
        this.parent.addState('atdesk', false);
        this.parent.addState('atcoffeemachine', false);
        this.parent.office.tired = 0;
        this.parent.updateGridSize(true);
    }

    public tick(obj: TickerReturnData) {
        
        if (this.parent.getState('gameover')) {
            this.trigger();
        }
    }

}
