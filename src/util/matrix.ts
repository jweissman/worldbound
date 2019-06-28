import { iota } from './iota';

export function matrix<T>(
    m: number,
    n: number,
    fn: (x: number, y: number) => T,
): (T)[][] {
    return iota(m).map(i => iota(n).map((j) => {
        let elem = fn(i, j);
        return elem;
    }));
}

export function matrixWithBackingArray<T>(
    m: number,
    n: number,
    backingArray: T[],
    fn: (x: number, y: number) => T,
): (number)[][] {
    return iota(m).map(i => iota(n).map((j) => {
        let elem = fn(i, j);
        backingArray.push(elem);
        return backingArray.length - 1;
    }));
}

// export function eachMatrixEntry<T>(
//     m: T[][],
//     fn: (cell: T, i: number, j: number) => any
// ): void {
//     for (let i=0; i<m.length; i++) {
//         for (let j=0; j<m[i].length; j++) {
//             fn(m[i][j], i, j);
//         }
//     }
// }
