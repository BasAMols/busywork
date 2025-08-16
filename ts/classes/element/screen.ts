import { HTML } from "./element";

export class Screen extends HTML {
    public constructor(public readonly key: string) {
        super({ type: 'div', style: { width: '100%', height: '100%', backgroundColor: '#2a3e48' }, classList: ['screen'] });
    }
}
