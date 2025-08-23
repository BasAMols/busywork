import { HTML } from '../element/element';
import { Vector2 } from '../math/vector2';
import { TickerReturnData } from '../ticker';
import { BusyWork, glob } from '../tilegame';
import { Section } from '../util/section';


export class Gameover extends Section {
    text1: HTML;
    text2: HTML;
    button: HTML;

    public constructor(private parent: BusyWork) {
        super({
            display: 'flex',
            flexDirection: 'column',
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
            padding: '50px',
            overflow: 'hidden',
        }, {
            size: new Vector2(700, 600),
            position: new Vector2(470, 0),
            index: 2,
            sizer: () => {
                return {
                    size:  new Vector2(700, 600),
                    position: new Vector2(0, 0),
                    index: parent.getState('gameover') ?2:-1,
                };
            },
        }, 'gameover');

        this.append(this.text1 = new HTML({
            style: {
                width: '100%',
                fontFamily: 'Noto Sans',
                fontWeight: '500',
                textShadow: '0px 0px 10px black',
                lineHeight: '100px',
                fontSize: '85px',
                color: '#fff',
                position: 'relative',
            },
            text: 'GAME OVER',
        }));
        this.append(this.text2 = new HTML({
            style: {
                width: '100%',
                fontFamily: 'Noto Sans',
                fontWeight: '500',
                textShadow: '0px 0px 10px black',
                fontSize: '40px',
                color: '#fff',
                position: 'relative',
                lineHeight: '50px',
                marginLeft: '20px',
            },
        }));
        this.append(this.button = new HTML({
            style: {
                width: '100%',
                fontFamily: 'Noto Sans',
                fontWeight: '500',
                textShadow: '0px 0px 10px black',
                fontSize: '20px',
                color: 'rgb(209 208 255)',
                position: 'relative',
                lineHeight: '30px',
                pointerEvents: 'none',
                marginLeft: '20px',
                cursor: 'pointer',
            },
            text: 'Retry?',
            onMouseDown: (e, element) => {
                window.location.reload();
            },
        }));

        this.opacity = 0;
        this.text1.setText('GAME OVER');

    }

    public trigger() {
        this.opacity = 0.8;
        glob.game.ticker.mode = 'animations';
        this.parent.addState('atdesk', false);
        this.parent.addState('atcoffeemachine', false);
        this.text2.setText(`${this.parent.office.npc.collected} report${this.parent.office.npc.collected === 1 ? '' : 's'} completed`);
        this.button.dom.style.pointerEvents = 'auto';
    }

    public tick(obj: TickerReturnData) {

        if (this.parent.getState('gameover')) {
            this.trigger();
        }
    }

}
