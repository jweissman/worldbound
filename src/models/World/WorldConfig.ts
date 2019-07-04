import { WorldSize } from "./WorldSize";
export type WorldConfig = {
    size: WorldSize;
    tickSeries: number[];
    waterRatio: number;
    cloudRatio: number;
};
export const defaultConfig: WorldConfig = {
    size: 'small',
    waterRatio: 0.48,
    cloudRatio: 0.5,
    tickSeries: [3, 5, 7, 11, 13, 17, 19, 23, 29, 31] //.map(t => t*9)
}
