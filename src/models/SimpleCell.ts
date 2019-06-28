import { GridCell } from "../models/Grid";
import { Location } from '../Location';
import { Color } from "../types/Palette";

export class SimpleCell implements GridCell {
    private isActive: boolean = false;
    constructor(public location: Location) {}
    get active() { return this.isActive; }
    get color(): Color {
        return 'white';
    }
    activate(): void {
        this.isActive = true;
    }
    deactivate(): void {
        this.isActive = false;
    }
}
