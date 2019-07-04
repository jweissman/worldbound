import { assertNever } from "../util/assertNever";
const primaryColors = <const> ['red', 'blue', 'green', 'black', 'white'];
const secondaryColors = <const> ['brown', 'dark-green'];
type Primary = typeof primaryColors[number];
type Secondary = typeof secondaryColors[number];

export type Color = Primary | Secondary

let scale = { dark: 40, lo: 80, mid: 160, hi: 240}
function toTriple(c: Color): number[] {
    let { hi, mid, lo, dark } = scale;
    let r = lo, g = lo, b = lo;
    switch (c) {
        case 'white': r = hi; g = hi; b = hi; break;
        case 'black': r = dark; g = dark; b = dark; break;
        case 'blue': b = hi; break;
        case 'red': r = hi; break;
        case 'green': g = hi; break;
        case 'brown': r = mid; g = lo; b= dark; break;
        case 'dark-green': r = dark; g = mid; b = dark; break;
        default: assertNever(c)
    }

    return [r,g,b]; //
}
let colorMap: { [key: string]: string } = {}
export function rgb(c: Color): string {
    if (!colorMap[c]) { //return colorMap[c]; }
        colorMap[c] = `rgb(${toTriple(c).join(',')})`
    }
    return colorMap[c];
}
