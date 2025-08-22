import { Grid } from './element/grid';
import { Vector2 } from './math/vector2';

export class GridManager {

    private columns: number[] = [450, 700, 450];
    private rows: number[] = [0, 350, 230, 50];

    public constructor(private grid: Grid, columns: number[], rows: number[], private gap: number = 20) {
        this.columns = columns;
        this.rows = rows;
        this.updateGrid();
    }

    setColumnWidth(index: number, width: number) {
        this.columns[index] = width;
    }



    setColumns(columns: number[]) {
        this.columns = columns;
    }

    setRowHeight(index: number, height: number) {
        this.rows[index] = height;
    }

    setBulkRowHeight(height: number, except: number[] = []) {
        this.rows.forEach((row, index) => {
            this.setRowHeight(index, except.includes(index) ? row : height);
        });
    }

    setBulkColumnWidth(width: number, except: number[] = []) {
        this.columns.forEach((column, index) => {
            this.setColumnWidth(index, except.includes(index) ? column : width);
        });
    }

    setRows(rows: number[]) {
        this.rows = rows;
    }

    getColumns() {
        let columns: number[] = [];
        let leftColumn = false;
        this.columns.forEach((width, index) => {

            if (index > 0) {
                if (leftColumn && width !== 0) {
                    columns.push(this.gap);
                } else {
                    columns.push(0);
                }
            }

            if (width !== 0) {
                leftColumn = true;
            }

            columns.push(width);
        });
        return columns;
    }
    getRows() {
        let rows: number[] = [];
        let leftRow = false;
        this.rows.forEach((width, index) => {

            if (index > 0) {
                if (leftRow && width !== 0) {
                    rows.push(this.gap);
                } else {
                    rows.push(0);
                }
            }

            if (width !== 0) {
                leftRow = true;
            }

            rows.push(width);
        });
        return rows;
    }

    getSize() {
        return new Vector2(this.getColumns().reduce((a, b) => a + b, 0), this.getRows().reduce((a, b) => a + b, 0));
    }

    updateGrid() {
        this.grid.setTemplateColumns(this.getColumns().join('px ') + 'px');
        this.grid.setTemplateRows(this.getRows().join('px ') + 'px');
    }
}