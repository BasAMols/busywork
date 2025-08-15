import { TransformOptions } from '../math/transform';
import { Vector2 } from '../math/vector2';
import { HTML, HTMLOptions } from "./element";

export type TileOptions = {
    tileSize: Vector2;
    transform: TransformOptions;
    options: HTMLOptions;
    offsetRow?: Vector2;
    offsetCol?: Vector2;
} & ({
    repeatX: number;
    repeatY: number;
} | {
    clip?: boolean;
    size: Vector2;
});

export class Tile extends HTML {
    private _options: TileOptions;
    public constructor(options: TileOptions) {
        super({
            transform: options.transform,
        });
        this._options = options;
        let repeatX, repeatY;
        if ('size' in options) {
            repeatX = Math.ceil(options.size.x / options.tileSize.x);
            repeatY = Math.ceil(options.size.y / options.tileSize.y);
            if (options.clip) {
                options.options.style.overflow = 'hidden';
            }
        } else {
            repeatX = options.repeatX ?? 1;
            repeatY = options.repeatY ?? 1;
        }

        options.offsetRow = options.offsetRow ?? new Vector2(0, 0);
        options.offsetCol = options.offsetCol ?? new Vector2(0, 0);

        for (let i = 0; i < repeatX; i++) {
            for (let j = 0; j < repeatY; j++) {
                const o = new Vector2(
                    i * options.tileSize.x + (i % 2 !== 0 ? options.offsetCol.x : 0) + (j % 2 !== 0 ? options.offsetRow.x : 0),
                    j * options.tileSize.y + (j % 2 !== 0 ? options.offsetCol.y : 0) + (i % 2 !== 0 ? options.offsetRow.y : 0)
                );
                this.append(new HTML({
                    ...options.options, ...{
                        transform: {
                            ...options.options.transform ?? {},
                            position: options.options.transform?.position?.add(
                                o
                            ) ?? o,
                        }
                    }
                }));
            }
        }

    }
}