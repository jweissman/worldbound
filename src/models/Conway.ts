import { Location } from '../types/Location';
import { count } from '../util/count';

export type ConwayConfig = {
    active: boolean,
    neighbors: boolean[],
    birth: number,
    lonely: number,
    starve: number,
}
export type Conway = 'birth' | 'death' | 'unchanged'

export type ConwayCallback = (value: boolean, neighbors: boolean[], location: Location) => Conway | undefined;

function conway({ active, neighbors, birth, lonely, starve }: ConwayConfig): Conway {
    let ns = count(neighbors, Boolean)
    if (active) {
        if (ns <= lonely || ns >= starve) {
            return 'death';
        }
    } else {
        if (ns === birth) {
            return 'birth';
        }
    }
    return 'unchanged';
}

export function simpleConway(
    birth: number = 3,
    lonely: number = 1,
    starve: number = 4
): ConwayCallback {
    return (cell: boolean, neighbors: boolean[]) => {
        return conway({
            active: cell,
            neighbors,
            birth,
            lonely,
            starve,
        });
    };
}