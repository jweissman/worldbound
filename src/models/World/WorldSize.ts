const unit = 30;
export const dimensions = {
    tiny:     { x: unit*2, y: unit*1 },
    small:    { x: unit*4, y: unit*3 },
    medium:   { x: unit*6, y: unit*4 },
    large:    { x: unit*8, y: unit*6 },
    huge:     { x: unit*12, y: unit*8 },
    gigantic: { x: unit*16, y: unit*10 },
    enormous: { x: unit*21, y: unit*9 },
}
export type WorldSize = keyof typeof dimensions;
