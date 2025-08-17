
import { HTML } from '../../../../../element/element';
import { Flex } from '../../../../../element/flex';
import { Vector2 } from '../../../../../math/vector2';
import { TickerReturnData } from '../../../../ticker';
import { TileGame } from '../../tilegame';
import { Icon } from '../../util/icon';
import { Section } from '../../util/section';


export class StatBar extends Section {

    private stats: {
        value: number;
        element: HTML;
        getter: () => number;
        setter: (element: HTML, value: number) => void;
    }[] = [];
    public constructor(private parent: TileGame, gridParams: ConstructorParameters<typeof Section>[2]) {
        super(new Vector2(700, 1), {
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '10px',
            boxSizing: 'border-box',
            backgroundColor: 'transparent',
            boxShadow: 'none',
            overflow: 'visible',
            gap: '20px',
            pointerEvents: 'none',
            width: '100%',
            height: '100%',
            bottom: '20px',
        }, gridParams);

        this.addStat(StatBar.getStatBlock('person_apron', 50), 0, () => {
            return Number(!this.parent.state('bossinroom'));
        });

        this.addStat(StatBar.getStatBlock('battery_android_frame_bolt', 50), 0, () => {
            return 1 - this.parent.office.tired;
        }, (element, value) => {
            element.setStyle({ backgroundColor: `rgb(${Math.round(153 + (74 - 153) * value)} ${Math.round(60 + (114 - 60) * value)} ${Math.round(60 + (160 - 60) * value)})`, });
            element.children[0]?.setText(['battery_android_bolt', 'battery_android_frame_3', 'battery_android_frame_5', 'battery_android_frame_full'][Math.floor((value * 3.9))]);
        });
    }

    static getStatBlock(icon: string, size: number = 40) {
        return new Flex({
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            style: {
                width: '90px',
                height: '90px',
                backgroundColor: 'rgb(74 114 160)',
                borderRadius: '50%',
                boxSizing: 'border-box',
                fontSize: '25px',
                color: '#fff',
                textAlign: 'center',
                whiteSpace: 'wrap',
                boxShadow: 'inset 3px -10px 30px #0000004f, 1px -3px 7px #0000004f',
                transition: 'margin-top 0.5s ease-in-out, opacity 0.5s ease-in-out, width 0.5s 0.5s ease-in-out',
                position: 'relative',
                overflow: 'hidden',
            },
            children: [
                new Icon(icon, size),
            ],
        });
    }

    addStat(element: HTML, value: number, getter: () => number, setter?: (element: HTML, value: number) => void) {
        this.append(element);
        this.stats.push({
            value: value,
            element: element,
            getter: getter,
            setter: setter,
        });
    }

    tick(obj: TickerReturnData) {
        super.tick(obj);
        if (obj.frame % 10 === 0) {
            this.stats.sort((a, b) => a.value - b.value).forEach((stat, index) => {
                stat.value = stat.getter();
                stat.setter?.(stat.element, stat.value);
                stat.element.setStyle({
                    // order: index.toString(),
                    width: stat.value < 0.5 ? '90px' : '0px',
                    transition: stat.value < 0.5 ? 'margin-top 0.5s 0.5s ease-in-out, width 0.5s ease-in-out, opacity 0.5s 0.5s ease-in-out' : 'margin-top 0.5s ease-in-out, width 0.5s 0.5s ease-in-out, opacity 0.5s ease-in-out',
                });
                stat.element.setStyle({
                    marginTop: stat.value < 0.5 ? '0px' : '20px',
                    opacity: stat.value < 0.5 ? '1' : '0',
                    width: stat.value < 0.5 ? '90px' : '0px',
                });
            });
        };
    }

}
