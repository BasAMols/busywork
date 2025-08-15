import { HTML } from "../../../../../element/element";

export class Icon extends HTML {
    constructor(text: string, size: number = 25, color: string = 'white') {
        super({
            text: text,
            classList: ['material-symbols-outlined'],
            style: {
                fontSize: size + 'px',
                color: color,
                pointerEvents: 'none',
            }
        });
    }

    changeIcon(text: string) {
        this.setText(text);
    }
}