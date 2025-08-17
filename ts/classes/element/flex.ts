import { HTML, HTMLOptions } from "./element";

export interface FlexOptions extends HTMLOptions {
    justifyContent?: 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around';
    alignItems?: 'flex-start' | 'flex-end' | 'center' | 'stretch' | 'baseline';
    alignContent?: 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around';
    flexWrap?: 'nowrap' | 'wrap' | 'wrap-reverse';
    flexDirection?: 'row' | 'row-reverse' | 'column' | 'column-reverse';
    gap?: number;
}

export class Flex extends HTML {
    public readonly options: FlexOptions;
    public constructor(options: FlexOptions) {
        super({ ...options, classList: [...(options.classList || []), '_flex'] });

        this.setStyle({
            flexDirection: options.flexDirection,
            justifyContent: options.justifyContent,
            alignItems: options.alignItems,
            alignContent: options.alignContent,
            flexWrap: options.flexWrap,
            gap: `${options.gap}px`,
        });
        this.setStyle(options.style || {});
    }

    public set visible(visible: boolean) {
        this._visible = visible;
        this.dom.style.display = visible ? 'flex' : 'none';
    }

    public get visible() {
        return this._visible;
    }
}