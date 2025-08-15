import { HTML } from '../../../../../element/element';
import { Flex } from '../../../../../element/flex';
import { Vector2 } from '../../../../../math/vector2';
import { TickerReturnData } from '../../../../../ticker';
import { Section } from '../../../../util/section';
import { Walker } from '../office/people/walker';

export class Computer extends Section {
    textElement: HTML;
    scanline: HTML;
    cursor: HTML;
    screen: HTML;
    public constructor(sitter: Walker) {
        super(new Vector2(450, 440), {
            backgroundColor: '#90857f',
            boxShadow: '0px 0px 200px #0000004a',
            transition: 'width 0.6s ease-in-out',
        });

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
                position: new Vector2(5, 30),
            },
            onMouseEnter: () => {
                this.cursor.visible = true;
            },
            onMouseMove: (e) => {
                this.cursor.transform.setPosition(new Vector2(e.offsetX, e.offsetY));
                sitter.person.armTwist = [0.5, 2];
            },
            onMouseLeave: () => {
                sitter.person.armTwist = [0.5, -0.5];
                this.cursor.visible = false;
            }
        }));

        this.textElement = this.screen.append(new Flex({
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            style: {
                width: '100%',
                height: '100%',
                fontSize: '100px',
                color: '#fff',
                fontWeight: 'bold',
                lineHeight: '90px',
                fontFamily: 'monospace',
                borderRadius: '30px',
                boxShadow: 'inset rgb(0 0 0) 6px 3px 200px 3px',
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
                filter: 'drop-shadow(3px 6px 6px #000000ff) blur(1px)',
                pointerEvents: 'none',
            },
            transform: {
                position: new Vector2(30, 40),
                scale: new Vector2(0.25, 0.25),
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
        this.setCode('0121');
        this.setTT('');
    }

    public _text: string = '';

    private _code: string | undefined = undefined;
    public setCode(code: string) {
        this._code = code;
    }

    public setTT(text: string) {
        if (!this._code) return;
        if (text.length > this._code.length) return;
        this._text = text;

        this.textElement.setText(text.padEnd(this._code?.length || 4, '_'));

        if (this._text.length >= this._code?.length) {
            if (this._text.substring(0, this._code.length) === this._code) {
                this.screen.setStyle({
                    backgroundColor: '#456c44',
                });

                this.setCode(undefined);

                setTimeout(() => {
                    const code = Array.from({ length: 4 }, () => Math.floor(Math.random() * 3).toString()).join('');
                    this.setCode(code);
                    this.setTT('');
                }, 1000);
            } else {
                this.screen.setStyle({
                    backgroundColor: '#6c4444',
                });
                setTimeout(() => {
                    this.setTT('');
                }, 400);
            }
        } else {
            this.screen.setStyle({
                backgroundColor: '#222432',
            });
        }
    }

    public addTT(text: string) {
        this.setTT(this._text + text);
    }

    tick(obj: TickerReturnData) {
        this.scanline.transform.setPosition(new Vector2(0, (obj.total % 4000) / 4000 * 700 - 100));
    }
}