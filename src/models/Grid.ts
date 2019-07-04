import { matrix, eachMatrixEntry } from '../util/matrix';
import { distance } from '../util/distance';
import { Location } from '../Location';
import { Color } from '../types/Palette';
import { flip } from '../util/flip';

type ConwayConfig<T> = {
    active: boolean,
    neighbors: T[],
    birth: number,
    lonely: number,
    starve: number,
}
type Conway = 'birth' | 'death' | 'unchanged'

type ConwayCallback<T> = (value: T, neighbors: T[], location: Location) => Conway | undefined;

//export abstract class GridCell {
//    public active: boolean = false;
//    abstract get location(): Location;
//    abstract get color(): Color; 
//}

// type GridValue = boolean | number

interface GridConfig<T> {
    initFn: (location: Location) => T
    color?: (value: T) => Color
    translucent?: boolean
    isActive?: (value: T) => boolean
    onActivate: (location: Location, grid: Grid<T>) => void
    onDeactivate: (location: Location, grid: Grid<T>) => void
}

export class Grid<T> {
    structure: T[][];
    static boolean(
        dims: { x: number, y: number },
        color: Color,
        initFn: (location: Location) => boolean = () => flip(true, false),
        translucent: boolean = false
    ) {
        return new Grid<boolean>(
            dims.x,
            dims.y,
            {
                initFn,
                color: (val: boolean) => { return val && color || 'black' },
                translucent,
                onActivate: (location: Location, g: Grid<boolean>) => { //boolean[][]) => {
                    if (g.withinBounds(location.x, location.y)) {
                        g.structure[location.x][location.y] = true;
                    }
                },
                onDeactivate: (location: Location, g: Grid<boolean>) => {
                    if (g.withinBounds(location.x, location.y)) {
                        g.structure[location.x][location.y] = false;
                    }
                }
            }
        )
    }
    // static integers(dims: { x: number, y: number }, color: Color, initFn: (location: Location) => number = () => Math.random(),
    //                     min: number = 0.0, max: number = 1.0, inc: number = 0.1) {
    //     return new Grid<number>(
    //         dims.x,
    //         dims.y,
    //         {
    //             initFn,
    //             color: (val: number) => { return val > min && color || 'black' },
    //             isActive: (value: number) => value > (max+min)/2,
    //             onActivate: (location: Location, s: number[][]) => {
    //                 s[location.x][location.y] += inc;
    //                 s[location.x][location.y] = Math.min(inc, max);
    //             },
    //             onDeactivate: (location: Location, s: number[][]) => {
    //                 s[location.x][location.y] -= inc;
    //                 s[location.x][location.y] = Math.max(inc, min);
    //             }
    //         }
    //     )
    // }

    constructor(
        public m: number,
        public n: number,
        public config: GridConfig<T>
    ) {
        this.structure = matrix<T>(m,n,config.initFn);
    }

    isActive(value: T) {
        if (this.config.isActive) {
            return this.config.isActive(value)
        } else {
            return !!value
        }
    }

    colorFor(value: T): Color {
        if (this.config.color) {
            return this.config.color(value)
        } else {
            return 'white';
        }
    }

    at(location: Location): T | undefined {
        let { x, y } = location;
        if (this.withinBounds(location.x, location.y) && this.structure[x]) {
            return this.structure[x][y];
        }
    }

    private get(x: number, y: number): T | undefined {
        return this.at({ x, y })
    }

    static neighborsMap: Location[][][] = []
    static neighbors(location: Location): Location[] {
        let {x,y} = location;
        if (Grid.neighborsMap[x] && Grid.neighborsMap[x][y]) {
            return Grid.neighborsMap[x][y]
        } else {
            let i = x, j = y;
            let list = [
                { x: i - 1, y: j },
                { x: i, y: j - 1 },
                { x: i, y: j + 1 },
                { x: i + 1, y: j },
                { x: i - 1, y: j - 1 },
                { x: i - 1, y: j + 1 },
                { x: i + 1, y: j - 1 },
                { x: i + 1, y: j + 1 },
            ];
            Grid.neighborsMap[x] = Grid.neighborsMap[x] || [];
            Grid.neighborsMap[x][y] = list;
            return list;
        }
    }

    conway({ active, neighbors, birth, lonely, starve }: ConwayConfig<T>): Conway {
        let ns = Grid.count(neighbors, n => this.isActive(n))
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

    simpleConway(
        birth: number = 3,
        lonely: number = 1,
        starve: number = 4
    ): ConwayCallback<T> {
        return (cell: T, neighbors: T[]) => {
            return this.conway({
                active: this.isActive(cell),
                neighbors,
                birth,
                lonely,
                starve,
            });
        };
    }

    static count<T>(list: T[], property: (t: T) => boolean) {
        return list.reduce((acc, curr) => property(curr) ? ++acc : acc, 0); 
    }

    withinBounds(x: number, y: number): boolean {
        return x >= 0 && y >= 0 && x <= this.m && y <= this.n
    }

    gatherNeighbors(location: Location, radius: number = 1): T[] {
        let neighborCells: T[] = [];
        let { x, y } = location
        if (radius === 1) {
            let neighbors = Grid.neighbors(location)
            neighbors.forEach(loc => {
                let val = this.at(loc)
                if (val !== undefined) {
                    neighborCells.push(val)
                }
            })
        } else {
            let r = radius;
            for (let i = x - r; i < x + r + 1; i++) {
                for (let j = y - r; j < y + r + 1; j++) {
                    let n = this.at({ x: i, y: j });
                    if (n !== undefined && distance(i, x, j, y) <= r) {
                        neighborCells.push(n)
                    }
                }
            }
        }
        return neighborCells;
    }

    judgeCell(location: Location, cell: T, cb: ConwayCallback<T>, books: { life: Location[], death: Location[] }) {
        let neighbors: T[] = this.gatherNeighbors(location)
        let judgment: Conway | undefined = cb(cell, neighbors, location)

        if (judgment) {
            if (judgment === 'death') {
                books.death.push(location)
            } else if (judgment === 'birth') {
                books.life.push(location)
            }
        }
    }

    gol(cellCallback: ConwayCallback<T> = this.simpleConway()) {
        let books: { life: Location[], death: Location[] } = { life: [], death: [] }
        eachMatrixEntry(this.structure, (cell: T, x: number, y: number) => {
            this.judgeCell({ x, y }, cell, cellCallback, books)
        })
        // console.log({books})
        books.life.forEach((location: Location) => {
            this.activate(location)
        })
        books.death.forEach((location: Location) => {
            this.deactivate(location)
        })
    }

    activate(location: Location) {
        if (this.withinBounds(location.x, location.y)) {
            this.config.onActivate(location, this)
        }
    }

    deactivate(location: Location) {
        if (this.withinBounds(location.x, location.y)) {
            this.config.onDeactivate(location, this)
        }
    }
}
