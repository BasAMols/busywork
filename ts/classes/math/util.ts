import { glob } from '../tilegame';
import { Vector2 } from './vector2';

export class Utils {
    static clamp(value: Vector2, min: Vector2, max: Vector2): Vector2;
    static clamp(value: number, min: number, max: number): number;
    static clamp(value: number|Vector2, min: number|Vector2, max: number|Vector2): number|Vector2    {
        if (typeof value === 'number' && typeof min === 'number' && typeof max === 'number') {
            return Math.max(min, Math.min(value, max));
        } else if (value instanceof Vector2 && min instanceof Vector2 && max instanceof Vector2) {
            return new Vector2(Math.max(min.x, Math.min(value.x, max.x)), Math.max(min.y, Math.min(value.y, max.y)));
        }
    }

    static lerp(a: number, b: number, t: number): number {
        return a + (b - a) * t;
    }

    static isMobile(): boolean {
        return glob.mobile;
    }
    static mod(n: number, d: number): number {
        return ((n % d) + d) % d;
    }
}