// const _euclid = (x1: number, x2: number, y1: number, y2: number): number => {
//     let a = x1 - x2;
//     let b = y1 - y2;
//     let c = Math.sqrt(a*a + b*b);
//     return c;
// }
const manhattan = (x1: number, x2: number, y1: number, y2: number): number => {
    let dx = Math.abs(x1 - x2)
    let dy = Math.abs(y1 - y2)
    return dx - dy;
}

export const distance = manhattan;
// (x1: number, x2: number, y1: number, y2: number): number => {
// }
