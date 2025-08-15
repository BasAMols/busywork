import { Vector2 } from './vector2';

export interface TransformOptions {
    position?: Vector2;
    scale?: Vector2;
    rotation?: number; // in degrees
    anchor?: Vector2; // anchor point for rotation and scale (0,0 = top-left, 0.5,0.5 = center, 1,1 = bottom-right)
    size?: Vector2; // size of the element for anchor point calculations
    parent?: Transform;
}


export class Transform {
    private _position: Vector2;
    private _scale: Vector2;
    private _rotation: number; // stored in degrees
    private _anchor: Vector2; // anchor point for transformations (relative 0-1)
    private _size: Vector2; // size of the element
    private _responders: (({ position, scale, rotation, matrix }: { position: Vector2, scale: Vector2, rotation: number, matrix: number[]; }) => void)[] = [];
    private _parent?: Transform;

    setParent(parent: Transform) {
        this._parent = parent;
        this._update();
    }

    public constructor(options: TransformOptions = {}) {
        this._position = options.position ?? new Vector2(0, 0);
        this._scale = options.scale ?? new Vector2(1, 1);
        this._rotation = options.rotation ?? 0;
        this._anchor = options.anchor ?? new Vector2(0, 0);
        this._size = options.size ?? new Vector2(0, 0);
        this._parent = options.parent;
    }

    public setResponder(responder: ({ position, scale, rotation }: { position: Vector2, scale: Vector2, rotation: number, matrix: number[]; }) => void) {
        this._responders.push(responder);
        responder({ position: this.position, scale: this.scale, rotation: this.rotation, matrix: this.matrix });
    }

    public get position() {
        return this._position;
    }

    public get scale() {
        return this._scale;
    }

    public get rotation() {
        return this._rotation % 360;
    }

    public get anchor() {
        return this._anchor;
    }

    public get size() {
        return this._size;
    }

    public setPosition(position: Vector2) {
        this._position = position;
        this._update();
    }

    public getAbsolutePosition(): {
        position: Vector2;
        scale: Vector2;
        rotation: number;
        matrix: number[];
    } {
        // Calculate the local transformation matrix with proper anchor handling
        const localMatrix = this.getLocalMatrix();

        // If we have a parent, multiply with parent's absolute matrix
        if (this._parent) {
            const parentAbsolute = this._parent.getAbsolutePosition();
            const absoluteMatrix = this.multiplyMatrices(parentAbsolute.matrix, localMatrix);

            return {
                position: this.extractPositionFromMatrix(absoluteMatrix),
                scale: this.extractScaleFromMatrix(absoluteMatrix),
                rotation: this.extractRotationFromMatrix(absoluteMatrix),
                matrix: absoluteMatrix
            };
        }

        // No parent, so local matrix is the absolute matrix
        return {
            position: this.extractPositionFromMatrix(localMatrix),
            scale: this.extractScaleFromMatrix(localMatrix),
            rotation: this.extractRotationFromMatrix(localMatrix),
            matrix: localMatrix
        };
    }

    private getLocalMatrix(): number[] {
        // Convert degrees to radians
        const radiansRotation = this._rotation * (Math.PI / 180);
        const cos = Math.cos(radiansRotation);
        const sin = Math.sin(radiansRotation);

        // Convert relative anchor (0-1) to absolute coordinates based on element size
        const anchorX = this._anchor.x * this._size.x;
        const anchorY = this._anchor.y * this._size.y;

        // Build transformation matrix directly: translate(pos + anchor) * rotate * scale * translate(-anchor)
        // This matches CSS transform-origin behavior
        const scaleX = this._scale.x;
        const scaleY = this._scale.y;
        
        const a = scaleX * cos;
        const b = scaleX * sin;
        const c = -scaleY * sin;
        const d = scaleY * cos;
        
        const tx = this._position.x + anchorX - (a * anchorX + c * anchorY);
        const ty = this._position.y + anchorY - (b * anchorX + d * anchorY);

        return [
            a, b, 0, 0,
            c, d, 0, 0,
            0, 0, 1, 0,
            tx, ty, 0, 1
        ];
    }

    private multiplyMatrices(a: number[], b: number[]): number[] {
        // Multiply two 4x4 matrices (stored as 16-element arrays in column-major order)
        const result = new Array(16);

        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                result[i * 4 + j] =
                    a[i * 4 + 0] * b[0 * 4 + j] +
                    a[i * 4 + 1] * b[1 * 4 + j] +
                    a[i * 4 + 2] * b[2 * 4 + j] +
                    a[i * 4 + 3] * b[3 * 4 + j];
            }
        }

        return result;
    }

    private extractPositionFromMatrix(matrix: number[]): Vector2 {
        // Position is stored in the last column (indices 12, 13)
        return new Vector2(matrix[12], matrix[13]);
    }

    private extractScaleFromMatrix(matrix: number[]): Vector2 {
        // Extract scale from the transformation matrix
        // Scale is the length of the first two column vectors
        const scaleX = Math.sqrt(matrix[0] * matrix[0] + matrix[1] * matrix[1]);
        const scaleY = Math.sqrt(matrix[4] * matrix[4] + matrix[5] * matrix[5]);
        return new Vector2(scaleX, scaleY);
    }

    private extractRotationFromMatrix(matrix: number[]): number {
        // Extract rotation from the transformation matrix
        // Use the first column vector to determine rotation
        const scaleX = Math.sqrt(matrix[0] * matrix[0] + matrix[1] * matrix[1]);
        const normalizedX = matrix[0] / scaleX;
        const normalizedY = matrix[1] / scaleX;

        // Calculate angle in radians, then convert to degrees
        const radiansRotation = Math.atan2(normalizedY, normalizedX);
        return (radiansRotation * 180 / Math.PI) % 360;
    }

    public get absolute(): {
        position: Vector2;
        scale: Vector2;
        rotation: number;
        matrix: number[];
    } {
        return this.getAbsolutePosition();
    }

    public setScale(scale: number, scaleY?: number): void;
    public setScale(scale: Vector2): void;
    public setScale(scale: Vector2 | number, scaleY?: number): void {
        if (typeof scale === 'number') {
            this._scale = new Vector2(scale, scaleY ?? scale);
        } else {
            this._scale = scale;
        }
        this._update();
    }

    public setRotation(rotation: number) {
        this._rotation = rotation;
        this._update();
    }

    public setAnchor(anchor: Vector2) {
        this._anchor = anchor;
        this._update();
    }

    public setSize(size: Vector2) {
        this._size = size;
        this._update();
    }

    public get matrix() {
        // Now that we handle anchor points mathematically instead of via CSS transform-origin,
        // the matrix getter should return the local matrix with proper anchor point handling
        return this.getLocalMatrix();
    }

    private _update() {
        this._responders.forEach(responder => {
            responder({ position: this.position, scale: this.scale, rotation: this.rotation, matrix: this.matrix });
        });
    }

}

