import { HTML } from '../../../../element/element';

export class Icon extends HTML {
    constructor(text: string, size: number = 25, color: string = 'white', solid: boolean = false) {
        super({
            text: text,
            classList: solid ? ['material-symbols-outlined', 'solid'] : ['material-symbols-outlined'],
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