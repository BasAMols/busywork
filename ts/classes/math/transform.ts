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
    private _responders: (({ position, scale, rotation, matrix, size }: { position: Vector2, scale: Vector2, rotation: number, matrix: number[]; size: Vector2; }) => void)[] = [];
    private _parent?: Transform;

    setParent(parent: Transform) {
        this._parent = parent;
        this._update();
    }
    hasParent() {
        return this._parent !== undefined;
    }

    public constructor(options: TransformOptions = {}) {
        this._position = options.position ?? new Vector2(0, 0);
        this._scale = options.scale ?? new Vector2(1, 1);
        this._rotation = options.rotation ?? 0;
        this._anchor = options.anchor ?? new Vector2(0, 0);
        this._size = options.size;
        this._parent = options.parent;
    }

    public setResponder(responder: ({ position, scale, rotation, matrix, size }: { position: Vector2, scale: Vector2, rotation: number, matrix: number[]; size?: Vector2; }) => void) {
        this._responders.push(responder);
        responder({ position: this.position, scale: this.scale, rotation: this.rotation, matrix: this.matrix, size: this._size });
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
        return this._size ?? new Vector2(0, 0);
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

        // If we have a parent, we need to transform our logical values through the parent hierarchy
        if (this._parent) {
            const parentAbsolute = this._parent.getAbsolutePosition();
            const absoluteMatrix = this.multiplyMatrices(parentAbsolute.matrix, localMatrix);

            // Calculate absolute values by combining with parent
            const absolutePosition = this.transformPointThroughParent(this._position, parentAbsolute);
            const absoluteScale = new Vector2(
                this._scale.x * parentAbsolute.scale.x,
                this._scale.y * parentAbsolute.scale.y
            );
            const absoluteRotation = (this._rotation + parentAbsolute.rotation) % 360;

            return {
                position: absolutePosition,
                scale: absoluteScale,
                rotation: absoluteRotation,
                matrix: absoluteMatrix
            };
        }

        // No parent, so absolute values are just our local values
        return {
            position: this._position.clone(),
            scale: this._scale.clone(),
            rotation: this._rotation,
            matrix: localMatrix
        };
    }

    private transformPointThroughParent(point: Vector2, parentAbsolute: { position: Vector2; scale: Vector2; rotation: number }): Vector2 {
        // Apply parent's scale and rotation to the point, then add parent's position
        const radians = parentAbsolute.rotation * (Math.PI / 180);
        const cos = Math.cos(radians);
        const sin = Math.sin(radians);
        
        // Scale first
        const scaledX = point.x * parentAbsolute.scale.x;
        const scaledY = point.y * parentAbsolute.scale.y;
        
        // Then rotate
        const rotatedX = scaledX * cos - scaledY * sin;
        const rotatedY = scaledX * sin + scaledY * cos;
        
        // Finally translate by parent's position
        return new Vector2(
            rotatedX + parentAbsolute.position.x,
            rotatedY + parentAbsolute.position.y
        );
    }

    private getLocalMatrix(): number[] {
        // Convert degrees to radians
        const radiansRotation = this._rotation * (Math.PI / 180);
        const cos = Math.cos(radiansRotation);
        const sin = Math.sin(radiansRotation);

        // Convert relative anchor (0-1) to absolute coordinates based on element size
        const anchorX = this._anchor.x * (this._size?.x ?? 0);
        const anchorY = this._anchor.y * (this._size?.y ?? 0);

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
            responder({ position: this.position, scale: this.scale, rotation: this.rotation, matrix: this.matrix, size: this._size });
        });
    }

    public setMatrix(matrix: number[]) {
        if (matrix.length !== 16) {
            throw new Error('Matrix must be a 16-element array representing a 4x4 matrix');
        }

        // Extract components from the 4x4 matrix (column-major order)
        const a = matrix[0];  // scale_x * cos(rotation)
        const b = matrix[1];  // scale_x * sin(rotation)
        const c = matrix[4];  // -scale_y * sin(rotation)
        const d = matrix[5];  // scale_y * cos(rotation)
        const tx = matrix[12]; // translation x
        const ty = matrix[13]; // translation y

        // Decompose scale
        const scaleX = Math.sqrt(a * a + b * b);
        const scaleY = Math.sqrt(c * c + d * d);

        // Decompose rotation (in radians, then convert to degrees)
        const rotation = Math.atan2(b, a) * (180 / Math.PI);

        // Calculate position considering anchor point
        // Since the matrix includes anchor transformations, we need to reverse them
        const anchorX = this._anchor.x * this._size.x;
        const anchorY = this._anchor.y * this._size.y;
        
        // The matrix equation is: translate(pos + anchor) * rotate * scale * translate(-anchor)
        // So: tx = pos_x + anchor_x - (a * anchor_x + c * anchor_y)
        // Therefore: pos_x = tx - anchor_x + (a * anchor_x + c * anchor_y)
        const positionX = tx - anchorX + (a * anchorX + c * anchorY);
        const positionY = ty - anchorY + (b * anchorX + d * anchorY);

        // Update transform properties
        this._position = new Vector2(positionX, positionY);
        this._scale = new Vector2(scaleX, scaleY);
        this._rotation = rotation;
        
        this._update();
    }

    update() {
        this._update();
    }

}

