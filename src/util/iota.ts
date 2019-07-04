const indexSpaces: { [key: number]: number[] } = {}
export const iota = (i: number) => {
    if (!indexSpaces[i]) {
        // return new Array(i)
        let nums = [];
        for (let j = 0; j <= i; j++) {
            nums.push(j);
        }
        indexSpaces[i] = nums;
    }
    return indexSpaces[i];
};
