import { Transform, TransformOptions } from '../math/transform';
import { TickerReturnData as TRD } from '../busywork/ticker';

export interface HTMLOptions {
    type?: keyof HTMLElementTagNameMap;
    style?: Partial<CSSStyleDeclaration>;
    transform?: TransformOptions;
    classList?: string[];
    text?: string;
    onMouseDown?: (event: MouseEvent, element: HTML) => void;
    onMouseUp?: (event: MouseEvent, element: HTML) => void;
    onMouseMove?: (event: MouseEvent, element: HTML) => void;
    onMouseEnter?: (event: MouseEvent, element: HTML) => void;
    onMouseLeave?: (event: MouseEvent, element: HTML) => void;
    children?: HTML[];
}

export class HTML {
    public readonly type: keyof HTMLElementTagNameMap;
    public readonly options: HTMLOptions;
    public readonly dom: HTMLElement;
    public readonly transform: Transform;
    public children: HTML[] = [];
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
        if (this.options.transform?.size) {
            this.setStyle({
                width: this.options.transform.size.x + 'px',
                height: this.options.transform.size.y + 'px',
            });
        }
        this.setStyle(this.options.style);
        this.transform = new Transform(this.options.transform);
        this.transform.setResponder(({ matrix, position, scale, rotation }) => {
            // Set transform-origin to 0,0 to ensure CSS doesn't interfere with our mathematical anchor point handling
            this.dom.style.transformOrigin = '0 0';
            this.dom.style.transform = `matrix3d(${matrix.join(',')})`;
        });

        if (options.onMouseDown) {
            this.dom.addEventListener('pointerdown', (e) => {
                this.options.onMouseDown(e, this);
            });
        }
        if (options.onMouseUp) {
            this.dom.addEventListener('pointerup', (e) => {
                this.options.onMouseUp(e, this);
            });
        }

        if (options.onMouseMove) {
            this.dom.addEventListener('pointermove', (e) => {
                this.options.onMouseMove(e, this);
            });
        }
        if (options.onMouseEnter) {
            this.dom.addEventListener('pointerenter', (e) => {
                this.options.onMouseEnter(e, this);
            });
        }
        if (options.onMouseLeave) {
            this.dom.addEventListener('pointerleave', (e) => {
                this.options.onMouseLeave(e, this);
            });
        }
        this.setText(this.options.text);

        if (options.children) {
            options.children.forEach(child => {
                this.append(child);
            });
        }
    }

    public append(element: HTML, absolute: boolean = false): HTML {
        this.dom.appendChild(element.dom);
        if (!element.transform.hasParent() && !absolute) {
            element.transform.setParent(this.transform);
        }
        this.children.push(element);
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

    protected _visible: boolean = true;

    public set visible(visible: boolean) {
        this._visible = visible;
        this.dom.style.display = visible ? 'block' : 'none';
    }

    public get visible() {
        return this._visible;
    }   

    public tick(obj: TRD) {
        if (this.visible) {
            this.children.forEach(child => {
                child.tick(obj);
            });
        }
    }
}