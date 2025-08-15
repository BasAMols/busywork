import { Transform, TransformOptions } from '../math/transform';
import { TickerReturnData as TRD } from '../ticker';

export interface HTMLOptions {
    type?: keyof HTMLElementTagNameMap;
    style?: Partial<CSSStyleDeclaration>;
    transform?: TransformOptions;
    classList?: string[];
    text?: string;
    onClick?: () => void;
    onMouseDown?: () => void;
    onMouseUp?: () => void;
    onMouseMove?: (e: MouseEvent) => void;
    onMouseEnter?: () => void;
    onMouseLeave?: () => void;
}

export class HTML {
    public readonly type: keyof HTMLElementTagNameMap;
    public readonly options: HTMLOptions;
    public readonly dom: HTMLElement;
    public readonly transform: Transform;
    public constructor(options: HTMLOptions = {}) {
        this.options = options;
        this.type = this.options.type || 'div';
        this.dom = document.createElement(this.type);
        this.dom.classList.add('_element', '_' + this.type);
        if (this.options.classList) {
            this.options.classList.forEach(className => {
                this.dom.classList.add(className);
            });
        }
        if (this.options.text) {
            this.setText(this.options.text);
        }
        this.setStyle(this.options.style);
        this.transform = new Transform(this.options.transform);
        this.transform.setResponder(({ matrix, position, scale, rotation }) => {
            // Set transform-origin to 0,0 to ensure CSS doesn't interfere with our mathematical anchor point handling
            this.dom.style.transformOrigin = '0 0';
            this.dom.style.transform = `matrix3d(${matrix.join(',')})`;
        });

        if (options.onMouseDown) {
            this.dom.addEventListener('mousedown', () => {
                this.options.onMouseDown();
            });
        }
        if (options.onMouseUp) {
            this.dom.addEventListener('mouseup', () => {
                this.options.onMouseUp();
            });
        }
        if (options.onClick) {
            this.dom.addEventListener('click', () => {
                this.options.onClick();
            });
        }
        if (options.onMouseMove) {
            this.dom.addEventListener('mousemove', (e) => {
                this.options.onMouseMove(e);
            });
        }
        if (options.onMouseEnter) {
            this.dom.addEventListener('mouseenter', () => {
                this.options.onMouseEnter();
            });
        }
        if (options.onMouseLeave) {
            this.dom.addEventListener('mouseleave', () => {
                this.options.onMouseLeave();
            });
        }
        this.setText(this.options.text);
    }

    public append(element: HTML, absolute: boolean = false): HTML {
        this.dom.appendChild(element.dom);
        if (!absolute) {
            element.transform.setParent(this.transform);
        }
        return element;
    }

    public remove() {
        this.dom.remove();
    }

    public setStyle(style: Partial<CSSStyleDeclaration>) {
        if (style) {
            Object.assign(this.dom.style, style);
        }
    }

    public setText(text: string) {
        this.dom.textContent = text;
    }

    public setHTML(html: string) {
        this.dom.innerHTML = html;
    }

    private _visible: boolean = true;

    public set visible(visible: boolean) {
        this._visible = visible;
        this.dom.style.display = visible ? 'block' : 'none';
    }

    public get visible() {
        return this._visible;
    }   

    public tick(obj: TRD) {
    }
}