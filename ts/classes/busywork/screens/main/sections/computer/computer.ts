import { HTML } from '../../../../../element/element';
import { Flex } from '../../../../../element/flex';
import { Ease } from '../../../../../math/easings';
import { Vector2 } from '../../../../../math/vector2';
import { TickerReturnData } from '../../../../../ticker';
import { TileGame } from '../../tilegame';
import { Section } from '../../util/section';

export class Computer extends Section {
    textElement: HTML;
    scanline: HTML;
    cursor: HTML;
    screen: HTML;
    textElement2: HTML;
    get sitter() {
        return this.parent.office.sitter
    };
    public constructor(private parent: TileGame, gridParams: ConstructorParameters<typeof Section>[2]) {
        super(new Vector2(450, 350), {
            backgroundColor: '#90857f',
            boxShadow: '0px 0px 200px #0000004a',
            transition: 'width 0.6s ease-in-out',
            width: '100%',
            height: '350px',
            justifyContent: 'flex-start',
        }, gridParams);


        this.screen = this.append(new HTML({
            style: {
                width: '440px',
                height: '330px',
                backgroundColor: '#222432',
                boxShadow: 'inset rgb(0 0 0) 6px 3px 200px 3px',
                borderRadius: '30px',
                overflow: 'hidden',
                cursor: 'none',
            },
            transform: {
                position: new Vector2(5, 10),
            },
            onMouseEnter: () => {
                this.cursor.visible = true;
            },
            onMouseMove: (e) => {
                this.cursor.transform.setPosition(new Vector2(e.offsetX, e.offsetY));
                this.sitter.person.armTwist = [0.5, 2];
            },
            onMouseLeave: () => {
                this.sitter.person.armTwist = [0.5, -0.5];
                this.cursor.visible = false;
            }
        }));

        this.textElement = this.screen.append(new Flex({
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            style: {
                width: '100%',
                height: '60%',
                fontSize: '100px',
                color: '#fff',
                fontWeight: 'bold',
                lineHeight: '90px',
                fontFamily: 'monospace',
                borderRadius: '30px',
                pointerEvents: 'none',
                filter: 'sepia(0.6) blur(1px)',
                letterSpacing: '4px',
                textAlign: 'center',
                marginTop: '20%',
            }
        }));
        this.textElement2 = this.screen.append(new Flex({
            flexDirection: 'column',
            text: 'completed',
            alignItems: 'center',
            justifyContent: 'center',
            style: {
                width: '100%',
                height: '40%',
                fontSize: '40px',
                color: '#fff',
                fontWeight: 'bold',
                lineHeight: '90px',
                fontFamily: 'monospace',
                borderRadius: '30px',
                pointerEvents: 'none',
                filter: 'sepia(0.6) blur(1px)',
                letterSpacing: '4px',
                textAlign: 'center',
            }
        }));

        this.cursor = this.screen.append(new HTML({
            style: {
                width: '16px',
                height: '40px',
                backgroundColor: '#fff',
                outline: '1px solid black',
                filter: 'drop-shadow(3px 6px 6px #000000ff) blur(3px)',
                pointerEvents: 'none',
            },
            transform: {
                position: new Vector2(30, 40),
                scale: new Vector2(0.3, 0.3),
                rotation: -20,
            }
        }));
        this.cursor.append(new HTML({
            style: {
                width: '60px',
                height: '80px',
                backgroundColor: '#fff',
                //triangle
                clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
            },
            transform: {
                position: new Vector2(-22, -70),
            }
        }));

        this.scanline = this.screen.append(new HTML({
            style: {
                width: '100%',
                height: '90px',
                backgroundColor: '#22243212',
                filter: 'drop-shadow(0px 0px 10px #ffffff40)  blur(2px)',
                pointerEvents: 'none',
            }
        }));

        this.cursor.visible = false;
        this.setCode('012');
        this.setTT('');
        this.completed = 0;
    }

    public _text: string = '';

    private _code: string | undefined = undefined;
    public setCode(code: string) {
        this._code = code;
    }

    private _completed: number = 0;
    public set completed(value: number) {
        this.textElement2.setText(value.toString().padStart(2, '0')+'/'+this.target.toString().padStart(2, '0'));
        this._completed = value;
    }

    public get completed() {
        return this._completed;
    }

    public target: number = 3;



    public setTT(text: string) {
        if (!this._code) return;
        if (text.length > this._code.length) return;
        this._text = text;

        this.textElement.setText(text
            .replaceAll('0', '#')
            .replaceAll('1', '$')
            .replaceAll('2', '&')
            .replaceAll('3', '!')
            .replaceAll('4', '@')
            .replaceAll('5', '=')
            .padEnd(this._code?.length || 4, '_'));

        if (this._text.indexOf('_') === -1) {
            if (this._text.substring(0, this._code.length) === this._code) {
                this.screen.setStyle({
                    backgroundColor: '#456c44',
                });

                this.setCode(undefined);
                this.completed++;

                setTimeout(() => {
                    const code = Array.from({ length: 5 }, () => Math.floor(Math.random() * 6).toString()).join('');
                    this.setCode(code);
                    this.setTT('_____');
                }, 1000);
            } else {
                this.screen.setStyle({
                    backgroundColor: '#6c4444',
                });
                setTimeout(() => {

                    let NC = ''
                    for (let i = 0; i < this._code.length; i++) {
                        if (this._code[i] === this._text[i]) {
                            NC += this._code[i];
                        } else {
                            NC += '_';
                        }
                    }

                    this.setTT(NC);
                }, 400);
            }
        } else {
            this.screen.setStyle({
                backgroundColor: '#222432',
            });
        }
    }

    public addTT(text: string) {
        const index = this._text.indexOf('_');
        if (index === -1) return;   
        this.setTT(this._text.substring(0, index) + text + this._text.substring(index + 1));
    }

    tick(obj: TickerReturnData) {
        super.tick(obj);
        this.scanline.transform.setPosition(new Vector2(0, (obj.total % 4000) / 4000 * 700 - 100));

        if (this.parent.office.tired > 0.25) {
            this.setStyle({
                filter: `blur(${Ease.inOutCubic(Math.sin(obj.total*0.0001 + 0.2)*Math.sin(obj.total*0.001 + 0.2)*this.parent.office.tired)*4}px)`,
            });
        } else {
            this.setStyle({
                filter: `blur(0px)`,
            });
        }
    }
}