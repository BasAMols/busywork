import { Game as Base } from "./ts/base";
import { TileGame } from './ts/classes/busywork/main';
import { Menu } from './ts/classes/busywork/screens/menu';

export class Busywork extends Base {
    private _menu: Menu;
    public constructor() {
        super();
        this.addScreen(new Menu(this));
        this.addScreen(new TileGame(this));
    }

    public run() {
        this.screens['menu'].visible = false;
        this.screens['test'].visible = true;
    }

    public start() {
        this.screens['menu'].visible = false;
        this.screens['test'].visible = true;
    }
}