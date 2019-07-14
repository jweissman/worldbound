export function pick<T>(...list: T[]): T {
    let idx = Math.floor(Math.random() * list.length);
    return list[idx];
}