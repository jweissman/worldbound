import { Location } from '../Location';
import { matrixWithBackingArray } from '../util/matrix';
import { Color } from '../types/Palette';

type ConwayConfig = {
    active: boolean,
    neighbors: number,
    birth: number,
    lonely: number,
    starve: number,
}
type Conway = 'birth' | 'death' | 'unchanged'

type ConwayCallback<T> = (instance: T, neighbors: number) => Conway | undefined;

export abstract class GridCell {
    abstract get location(): Location;
    abstract get color(): Color; 
    abstract activate(): void;
    abstract deactivate(): void;
    abstract get active(): boolean;
}

export class Grid<T extends GridCell> {
    cellList: T[];
    structure: number[][];

    constructor(private m: number, private n: number, fn: (x: number, y: number) => T) {
        this.cellList = [];
        this.structure = matrixWithBackingArray<T>(m, n, this.cellList, fn);
    }

    list = (): T[] => {
        return this.cellList;
    }

    each = (fn: (e: T) => any) => {
        // eachMatrixEntry(this.structure, (idx) => {
        //     // let cell = this.cellList[idx];
        //     fn(this.cellList[idx]);
        // })
        // let m = this.structure;
        // for (let i = 0; i < m.length; i++) {
        //     for (let j = 0; j < m[i].length; j++) {
        //         let c = this.cellList[m[i][j]];
        //         fn(c); //m[i][j]); //, i, j);
        //     }
        // }
        for (let i=0; i<this.cellList.length-1;i++) {
            fn(this.cellList[i]);
        }
    }

    at(location: Location): T | undefined {
        let { x, y } = location;
        if (this.structure[x] && this.structure[x][y]) {
            // let idx = this.structure[x][y];
            return this.cellList[this.structure[x][y]];
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

    static conway({ active, neighbors, birth, lonely, starve }: ConwayConfig): Conway {
        if (active) {
            if (neighbors <= lonely || neighbors >= starve) {
                return 'death';
            }
        } else {
            if (neighbors === birth) {
                return 'birth';
            }
        }
        return 'unchanged';
    }

    static simpleConway<T extends GridCell>(
        birth: number = 3,
        lonely: number = 1,
        starve: number = 4
    ): ConwayCallback<T> {
        return (cell: T, neighbors: number) => {
            let { active } = cell;
            return Grid.conway({
                active,
                neighbors,
                birth,
                lonely,
                starve,
            });
        };
    }

    static count<T>(list: T[], property: (t: T) => boolean) {
        return list.reduce((acc, curr) => property(curr) ? ++acc : acc, 0); 
        // return list.filter(it => property(it)).length;
    }

    neighborsMap: T[][][] = []
    gatherNeighbors(cell: T): T[] {
        let { x, y } = cell.location
        let neighborCells;
        if (this.neighborsMap[x] && this.neighborsMap[x][y]) {
            neighborCells = this.neighborsMap[x][y]
        } else {
            this.neighborsMap[x] = this.neighborsMap[x] || []
            this.neighborsMap[x][y] = Grid.neighbors(cell.location)
                .map(loc => this.at(loc))
                .filter(neighbor => neighbor != undefined)
                .flat()
            neighborCells = this.neighborsMap[x][y]
        }
        return neighborCells;
    }
    judgeCell(cell: T, cb: ConwayCallback<T>, books: { life: Location[], death: Location[] }) {
        let neighborCells: T[] = this.gatherNeighbors(cell);
        let neighbors: number = Grid.count(neighborCells, (neighbor) => neighbor.active)
        let judgment: Conway | undefined = cb(cell, neighbors)

        if (judgment) {
            if (cell.active && judgment === 'death') {
                books.death.push(cell.location)
            } else if (!cell.active && judgment === 'birth') {
                books.life.push(cell.location)
            }
        }
    }

    gol(cellCallback: ConwayCallback<T> = Grid.simpleConway()) {
        let books: { life: Location[], death: Location[] } = { life: [], death: [] }
        this.each((cell: T) => this.judgeCell(cell, cellCallback, books))
        books.life.forEach((location: Location) => {
            let cell = this.at(location);
            if (cell) {
                cell.activate();
            }
        })

        books.death.forEach((location: Location) => {
            let cell = this.at(location);
            if (cell) {
                cell.deactivate();
            }
        })
    }
}
