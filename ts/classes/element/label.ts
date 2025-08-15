import { HTML, HTMLOptions } from "./element";

export interface LabelOptions extends HTMLOptions {
    size?: number;
    color?: string;
    font?: string;
    weight?: string;
    align?: string;
    lineHeight?: string;
    letterSpacing?: string;
}

export class Label extends HTML {
    public constructor(options: LabelOptions) {
        super({ ...options, classList: [...(options.classList || []), '_label'] });
        this.setStyle({
            fontSize: `${options.size}px`,
            color: options.color,
            fontFamily: options.font,
            fontWeight: options.weight,
            textAlign: options.align,
            lineHeight: options.lineHeight,
            letterSpacing: options.letterSpacing,
        });
    }
}   