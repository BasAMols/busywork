import { HTML, HTMLOptions } from "./element";

export class Button extends HTML {
    public constructor(options: HTMLOptions) {
        super({ ...options, classList: [...(options.classList || []), '_button'] });
        
        this.setText(this.options.text);
    }
}