import { Utils } from './math/util';
import { TickerReturnData } from './ticker';

export interface AnimationParams {
    duration: number;
    mode?: 'linear' | 'wrap'; // Add animation mode,
    onChange?: (value: number) => void;
    scaleOut?: number;
    scaleIn?: number;
}

export class Animator {

    private params: AnimationParams;
    private _targetValue: number = 0;
    private _currentValue: number = 0;
    private _momentum: number = 0;
    
    get value() {
        return Utils.mod(this._currentValue, 1) * (this.params.scaleOut || 1);
    }

    set force(v: number) {
        this._targetValue = v * (this.params.scaleIn || 1);
        this._currentValue = v;
        this._momentum = 0;
    }

    get target() {
        return this._targetValue;
    }

    set target(v: number) {
        this._targetValue = v * (this.params.scaleIn || 1);
    }

    set duration(duration: number) {
        this.params.duration = duration;
    }

    get duration() {
        return this.params.duration;
    }

    public constructor(params: AnimationParams) {
        this.params = params;
    }

    tick(obj: TickerReturnData) {

        const lastValue = this._currentValue;

        // Handle instant animation (duration = 0)
        if (this.params.duration <= 0) {
            this._currentValue = this._targetValue;
            this._momentum = 0;
            if (this._currentValue !== lastValue) {
                this.params.onChange?.(this._currentValue * (this.params.scaleOut || 1));
            }
            return;
        }

        const delta = obj.interval / 1000; // Convert to seconds
        const mode = this.params.mode || 'linear';
        
        // Check if we've reached target (with wrap-aware distance check)
        const distanceToTarget = this.getWrappedDistance(this._currentValue, this._targetValue, mode === 'wrap');
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
        // For full distance (1.0), we want to complete in the specified duration
        const baseSpeed = 1 / (this.params.duration / 1000); // units per second for full range
        const targetVelocity = Math.sign(distanceToTarget) * baseSpeed * absDistance;
        
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
            while (this._currentValue > 1) {
                this._currentValue -= 1;
            }
            while (this._currentValue < 0) {
                this._currentValue += 1;
            }
            
            // Check if we've overshot and need to clamp to target
            const newDistanceToTarget = this.getWrappedDistance(this._currentValue, this._targetValue, true);
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
            this.params.onChange?.(this._currentValue * (this.params.scaleOut || 1));
        }
    }

    private getWrappedDistance(from: number, to: number, useWrapping: boolean): number {
        if (!useWrapping) {
            return to - from;
        }
        
        // Calculate all possible distances in wrap mode
        const directDistance = to - from;
        const wrapDistanceRight = (1 - from) + to; // go up and wrap
        const wrapDistanceLeft = -(from + (1 - to)); // go down and wrap
        
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
