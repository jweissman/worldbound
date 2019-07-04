export function flip<T>(a: T, b: T, weight: number = 0.5): T { return Math.random() < weight ? a : b; }
