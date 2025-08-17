import { Game as Base } from "./classes/busywork/base";
import { TileGame } from './classes/busywork/screens/main/tilegame';
import { Menu } from './classes/busywork/screens/menu';

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