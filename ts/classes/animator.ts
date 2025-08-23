import { TickerReturnData } from './ticker';

export interface AnimationParams {
    duration: number;
    mode?: 'linear' | 'wrap'; // Add animation mode,
    onChange?: (value: number) => void;
    scale?: number;
}

export class Animator {

    private params: AnimationParams;
    private _targetValue: number = 0;
    private _currentValue: number = 0;
    private _momentum: number = 0;
    
    get value() {
        return this._currentValue;
    }

    set force(v: number) {
        this._targetValue = v;
        this._currentValue = v;
        this._momentum = 0;
    }

    get target() {
        return this._targetValue;
    }

    set target(v: number) {
        this._targetValue = v;
    }

    set duration(duration: number) {
        this.params.duration = duration;
    }

    get duration() {
        return this.params.duration;
    }

    public constructor(params: AnimationParams) {
        this.params = { scale: 1, ...params }; // Default scale to 1
    }

    tick(obj: TickerReturnData) {

        const lastValue = this._currentValue;
        const scale = this.params.scale || 1;

        // Handle instant animation (duration = 0)
        if (this.params.duration <= 0) {
            this._currentValue = this._targetValue;
            this._momentum = 0;
            if (this._currentValue !== lastValue) {
                this.params.onChange?.(this._currentValue);
            }
            return;
        }

        const delta = obj.interval / 1000; // Convert to seconds
        const mode = this.params.mode || 'linear';
        
        // Check if we've reached target (with wrap-aware distance check)
        const distanceToTarget = this.getWrappedDistance(this._currentValue, this._targetValue, mode === 'wrap', scale);
        if (Math.abs(distanceToTarget) < 0.0001) {
            this._currentValue = this._targetValue;
            // Gradually reduce momentum when at target
            this._momentum *= Math.pow(0.1, delta);
            if (Math.abs(this._momentum) < 0.0001) {
                this._momentum = 0;
            }
            return;
        }

        const absDistance = Math.abs(distanceToTarget);
        
        // Calculate desired velocity based on distance and duration
        // For full scale distance, we want to complete in the specified duration
        const baseSpeed = scale / (this.params.duration / 1000); // units per second for full range
        const targetVelocity = Math.sign(distanceToTarget) * baseSpeed * (absDistance / scale);
        
        // Apply momentum smoothing - gradually adjust velocity toward target velocity
        const momentumSmoothing = 5.0; // Higher = faster momentum changes
        const velocityDiff = targetVelocity - this._momentum;
        this._momentum += velocityDiff * momentumSmoothing * delta;
        
        // Apply velocity to position
        const newValue = this._currentValue + this._momentum * delta;
        
        if (mode === 'wrap') {
            // In wrap mode, just apply the movement and wrap if needed
            this._currentValue = newValue;
            
            // Wrap around if we go outside bounds
            while (this._currentValue > scale) {
                this._currentValue -= scale;
            }
            while (this._currentValue < 0) {
                this._currentValue += scale;
            }
            
            // Check if we've overshot and need to clamp to target
            const newDistanceToTarget = this.getWrappedDistance(this._currentValue, this._targetValue, true, scale);
            if (Math.sign(newDistanceToTarget) !== Math.sign(distanceToTarget) && Math.abs(newDistanceToTarget) > 0.0001) {
                // We've overshot, clamp to target
                this._currentValue = this._targetValue;
                this._momentum = 0;
            }
        } else {
            // Linear mode: clamp to prevent overshooting
            if (Math.sign(distanceToTarget) > 0) {
                this._currentValue = Math.min(newValue, this._targetValue);
            } else {
                this._currentValue = Math.max(newValue, this._targetValue);
            }
            
            // If we've reached the target, set exactly and clear momentum
            if (Math.abs(this._currentValue - this._targetValue) < 0.0001) {
                this._currentValue = this._targetValue;
                this._momentum = 0;
            }
        }

        if (this._currentValue !== lastValue) {
            this.params.onChange?.(this._currentValue);
        }
    }

    private getWrappedDistance(from: number, to: number, useWrapping: boolean, scale: number): number {
        if (!useWrapping) {
            return to - from;
        }
        
        // Calculate all possible distances in wrap mode
        const directDistance = to - from;
        const wrapDistanceRight = (scale - from) + to; // go up and wrap
        const wrapDistanceLeft = -(from + (scale - to)); // go down and wrap
        
        // Choose the shortest path
        const absDirectDistance = Math.abs(directDistance);
        const absWrapRight = Math.abs(wrapDistanceRight);
        const absWrapLeft = Math.abs(wrapDistanceLeft);
        
        if (absDirectDistance <= absWrapRight && absDirectDistance <= absWrapLeft) {
            return directDistance;
        } else if (absWrapRight <= absWrapLeft) {
            return wrapDistanceRight;
        } else {
            return wrapDistanceLeft;
        }
    }

}
