import { assertNever } from "../util/assertNever";

export type Color = 'white'
                  | 'brown'
                  | 'blue'
                  | 'green'
                  | 'purple'
                  | 'dark-green'
                  | 'brown-red'
                  | 'light-brown'
                  | 'gray'

let scale = { dark: 40, lo: 80, mid: 160, hi: 240}
export function rgb(c: Color): string {
    switch(c) {
        case 'white': return `rgb(${scale.hi},${scale.hi},${scale.hi})`;
        case 'blue': return `rgb(${scale.lo},${scale.lo},${scale.hi})`;
        case 'light-brown': return `rgb(${scale.hi},${scale.mid},${scale.lo})`;
        case 'brown': return `rgb(${scale.mid},${scale.lo},${scale.dark})`;
        case 'brown-red': return `rgb(${scale.hi},${scale.lo},${scale.dark})`;
        case 'green': return `rgb(${scale.lo},${scale.hi},${scale.lo})`;
        case 'dark-green': return `rgb(${scale.dark},${scale.mid},${scale.hi})`;
        case 'purple': return `rgb(${scale.hi},${scale.lo},${scale.hi})`;
        case 'gray': return `rgb(${scale.lo},${scale.lo},${scale.lo})`;
        // case 'light-gray': return `rgb(${scale.mid},${scale.mid},${scale.mid})`;
        default: assertNever(c);
    }
    return '#fff';
}
