export const distance = (x1: number, x2: number, y1: number, y2: number): number => {
    let a = x1 - x2;
    let b = y1 - y2;
    let c = Math.sqrt(a*a + b*b);
    return c;
}