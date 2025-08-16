import { HTML, HTMLOptions } from "./element";

export interface GridOptions extends HTMLOptions {
    rows?: string;
    columns?: string;
    gap?: number;
    alignContent?: string;
    alignItems?: string;
    justifyContent?: string;
    justifyItems?: string;
}

export class Grid extends HTML {
    public readonly options: GridOptions;
    public constructor(options: GridOptions) {
        super({ ...options, classList: [...(options.classList || []), '_grid'] });

        this.setStyle({
            gridTemplateColumns: options.columns || '1fr',
            gridTemplateRows: options.rows || '1fr',
            gap: `${options.gap}px`,
            alignContent: options.alignContent || 'center',
            alignItems: options.alignItems || 'center',
            justifyContent: options.justifyContent || 'center',
            justifyItems: options.justifyItems || 'center',
        });
        this.setStyle(options.style || {});
    }

    public setTemplateColumns(columns: string) {
        this.setStyle({
            gridTemplateColumns: columns,
        });
    }

    public setTemplateRows(rows: string) {
        this.setStyle({
            gridTemplateRows: rows,
        });
    }
}