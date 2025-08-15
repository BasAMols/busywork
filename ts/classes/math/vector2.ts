export interface Vector2 {
    x: number;
    y: number;
}

export class Vector2 {
    public x: number;
    public y: number;
    public constructor(x?: number, y?: number) {
        this.x = x ?? 0;
        this.y = y ?? this.x;
    }

    public clone() {
        return new Vector2(this.x, this.y);
    }

    public add(...v: Vector2[]): Vector2 {
        const dum = this.clone();
        v.forEach(v => {
            dum.x += v.x;
            dum.y += v.y;
        });
        return dum;
    }

    public sub(...v: Vector2[]): Vector2 {
        const dum = this.clone();
        v.forEach(v => {
            dum.x -= v.x;
            dum.y -= v.y;
        });
        return dum;
    }

    public scale(...s: number[]): Vector2 {
        const dum = this.clone();
        s.forEach(s => {
            dum.x *= s;
            dum.y *= s;
        });
        return dum;
    }

    public cross(v: Vector2): number {
        return this.x * v.y - this.y * v.x;
    }

    public dot(v: Vector2): number {
        return this.x * v.x + this.y * v.y;
    }

    public length(): number {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    public distance(v: Vector2): number {
        return Math.sqrt(Math.pow(this.x - v.x, 2) + Math.pow(this.y - v.y, 2));
    }

    public angle(): number {
        return Math.atan2(this.y, this.x) * 180 / Math.PI + 90;
    }

    public rotate(angle: number): Vector2 {
        const dum = this.clone();
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);
        dum.x = this.x * cos - this.y * sin;
        dum.y = this.x * sin + this.y * cos;
        return dum;
    }

    public lerp(v: Vector2, t: number): Vector2 {
        const dum = this.clone();
        dum.x = this.x + (v.x - this.x) * t;
        dum.y = this.y + (v.y - this.y) * t;
        return dum;
    }
    
    public equals(v: Vector2): boolean {
        return this.x === v.x && this.y === v.y;
    }
    
    public toString(): string {
        return `Vector2(${this.x}, ${this.y})`;
    }
    
    public toArray(): number[] {
        return [this.x, this.y];
    }

    public normalize(): Vector2 {
        const dum = this.clone();
        const len = Math.sqrt(dum.x * dum.x + dum.y * dum.y);
        dum.x /= len;
        dum.y /= len;
        return dum;
    }
    
}