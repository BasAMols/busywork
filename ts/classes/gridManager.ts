import { Animator } from './animator';
import { Vector2 } from './math/vector2';
import { BusyWork, glob } from './tilegame';
import { Section } from './util/section';

export class GridManager {
    animations: Animator[];

    public constructor(
        private parent: BusyWork,
        private sections: Section[] = []

    ) {

        this.animations = glob.bulkAnimations([{
            duration: 0,
            scale: 10000,

            onChange: (value: number) => {
                this.parent.transform.setSize(new Vector2(value, this.parent.transform.size.y));
            }
        }, {
            duration: 0,
            scale: 10000,

            onChange: (value: number) => {
                this.parent.transform.setSize(new Vector2(this.parent.transform.size.x, value));
            }
        }, {
            duration: 350,
            scale: 10000,

            onChange: (value: number) => {
                this.parent.transform.setPosition(new Vector2(value, this.parent.transform.position.y));
            }
        }, {
            duration: 350,
            scale: 10000,
            onChange: (value: number) => {
                this.parent.transform.setPosition(new Vector2(this.parent.transform.position.x, value));
            }
        }, {
            duration: 350,
            scale: 10,
            onChange: (value: number) => {
                this.parent.transform.setScale(new Vector2(value, value));
            }
        }]);

        this.tick(false);


    }


    tick(force: boolean = false) {
        let left: number, right: number, top: number, bottom: number;

        this.sections.forEach((section) => {
            section.updateGrid();

            if (section.gridData.size.x === 0 || section.gridData.size.y === 0) {
                return;
            }

            let width = section.gridData.size.x * section.gridData.scale.x;
            let height = section.gridData.size.y * section.gridData.scale.y;

            left = left === undefined ? section.gridData.position.x : Math.min(left, section.gridData.position.x);
            right = right === undefined ? section.gridData.position.x + width : Math.max(right, section.gridData.position.x + width);
            top = top === undefined ? section.gridData.position.y : Math.min(top, section.gridData.position.y);
            bottom = bottom === undefined ? section.gridData.position.y + height : Math.max(bottom, section.gridData.position.y + height);
        });

        const size = new Vector2(right - left, bottom - top);

        const windowSize = new Vector2(window.innerWidth, window.innerHeight);
        const scale = Math.min(windowSize.x / (size.x + 60), windowSize.y / (size.y + 60));
        // const scale = 1;
        const position = windowSize.sub(size.scale(scale)).div(2);

        this.animations[0][force ? 'force' : 'target'] = size.x;
        this.animations[1][force ? 'force' : 'target'] = size.y;
        this.animations[2][force ? 'force' : 'target'] = position.x + (left < 0 ? -left * scale : 0);
        this.animations[3][force ? 'force' : 'target'] = position.y + (top < 0 ? -top * scale : 0);
        this.animations[4][force ? 'force' : 'target'] = scale;
    }
}