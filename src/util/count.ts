export function count(list: boolean[], property: (t: boolean) => boolean) {
    return list.reduce((acc, curr) => property(curr) ? ++acc : acc, 0);
}