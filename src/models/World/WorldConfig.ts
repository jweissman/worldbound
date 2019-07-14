import { WorldSize } from "./WorldSize";
import { flip } from "../../util/flip";
import { pick } from "../../util/pick";
export type WorldConfig = {
    size: WorldSize;
    tickSeries: number[];
    waterRatio: number;
    cloudRatio: number;
};
export const defaultConfig: WorldConfig = {
    size: 'small',
    waterRatio: 0.5,
    cloudRatio: 0.38,
    tickSeries: [1,1,2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31].map(t => t**2)
}
