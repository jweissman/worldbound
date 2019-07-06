import { matrix, eachMatrixEntry } from '../util/matrix';
import { distance } from '../util/distance';
import { Location } from '../types/Location';
import { Color } from '../types/Palette';
import { flip } from '../util/flip';
import { iota } from '../util/iota';
import { count } from '../util/count';
import { pick } from '../util/pick';
import BitArray from 'bit-array';

type ConwayConfig = {
    active: boolean,
    neighbors: boolean[],
    birth: number,
    lonely: number,
    starve: number,
}
type Conway = 'birth' | 'death' | 'unchanged'

type ConwayCallback = (value: boolean, neighbors: boolean[], location: Location) => Conway | undefined;

interface GridConfig {
    initFn: (location: Location) => boolean
    color?: Color
    translucent?: boolean
}

class GridStructure {
    private elements: BitArray
    constructor(private m: number, private n: number) {
        this.elements = new BitArray(m*n)
    }

    setAll(elems: boolean[]) {
        // this.elements = new BitArray(this.m*this.n)
        // this.elements.reset(); // = elems;
    }

    at(x: number, y: number): boolean {
        return this.elements.get(y * this.n + x);
    }

    set(x: number, y: number, value: boolean): void {
        this.elements.set(y*this.n+x, value);
    }
}

export default class Grid {
    static assemble(
        dims: { x: number, y: number },
        color: Color,
        initFn: (location: Location) => boolean = () => flip(true, false),
        translucent: boolean = false
    ) {
        console.log("assemble grid", { dims, color })
        return new Grid(
            dims.x,
            dims.y,
            { initFn, color, translucent, }
        )
    }

    private structure: GridStructure
    
    constructor(
        public m: number,
        public n: number,
        public config: GridConfig
    ) {
        this.structure = new GridStructure(m,n);
        iota(m).forEach(i => iota(n).forEach((j) => {
            let loc={x:i,y:j}
            this.put(loc, config.initFn(loc))
        }));
        // if (config.initFn) {}
    }

    //colorFor(value: T): Color {
    //    if (this.config.color) {
    //        return this.config.color(value)
    //    } else {
    //        return 'white';
    //    }
    //}

    at(location: Location): boolean | undefined { //} | undefined {
        let { x, y } = location;
        if (this.withinBounds(x,y)) {
            return this.structure.at(x,y)
        }
    }


    put(location: Location, value: boolean) {
        // console.log("PUT", { location, value, color: this.config.color })
        let { x, y } = location;
        return this.structure.set(x,y,value)
    }

    private get(x: number, y: number): boolean | undefined {
        return this.at({ x, y })
    }

    shift(dx: number, dy: number, empty: () => boolean = () => flip(true, false)) {
        let newElements = [];
        for (let i = 0; i < this.m; i++) {
            for (let j = 0; j < this.n; j++) {
                let x = i, y = j;
                let cell = this.at({x: x+dx,y: y+dy})
                if (cell !== undefined) {
                    newElements[y*this.m+x] = cell;
                } else {
                     newElements[y*this.m+x] = empty()
                }
            }
        }
        this.structure.setAll(newElements);
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

    static communityMap: Location[][][][] = []
    static community(location: Location, radius: number): Location[] {
        let {x,y} = location;
        let r = radius;
        if (r === 1) { return Grid.neighbors(location) }
        // if (Grid.communityMap[r] && Grid.communityMap[r][x] && Grid.communityMap[r][x][y]) {
        if (Grid.communityMap[x] && Grid.communityMap[x][y] && Grid.communityMap[x][y][r]) {
            return Grid.communityMap[x][y][r];
        } else {
            let r = radius;
            let list: Location[] = []
            for (let i = x - r; i < x + r + 1; i++) {
                for (let j = y - r; j < y + r + 1; j++) {
                    // let n = this.at({ x: i, y: j });
                    if (distance(i, x, j, y) <= r) {
                        let loc: Location = {x,y}
                        list.push(loc) //{x,y})
                    }
                }
            }

            Grid.communityMap[x] = Grid.communityMap[x] || [];
            Grid.communityMap[x][y] = Grid.communityMap[x][y] || [];
            Grid.communityMap[x][y][r] = list;

            return list;
        }
    }

    conway({ active, neighbors, birth, lonely, starve }: ConwayConfig): Conway {
        let ns = count(neighbors, Boolean) //n => n) //this.isActive(n))
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
    ): ConwayCallback {
        return (cell: boolean, neighbors: boolean[]) => {
            return this.conway({
                active: cell, //: this.isActive(cell),
                neighbors,
                birth,
                lonely,
                starve,
            });
        };
    }

    withinBounds(x: number, y: number): boolean {
        return x >= 0 && y >= 0 && x <= this.m && y <= this.n
    }

    gatherNeighbors(location: Location, radius: number = 1): boolean[] {
        if (radius < 1) { throw new Error("Neighborhoods must have a radius > 1")}
        let neighbors: Location[] = []
        if (radius === 1) {
            neighbors = Grid.neighbors(location)
        } else {
            neighbors = Grid.community(location, radius)
        }
        let neighborCells: boolean[] = [];
        for (let loc of neighbors) {
        // for (let i=0; i<neighbors.length; i++) {
        // neighbors.forEach(loc => {
            let val = this.at(loc) //neighbors[i])
            if (val !== undefined) {
                neighborCells.push(val)
            }
        }
        return neighborCells;
    }

    judgeCell(radius: number = 1, location: Location, cell: boolean, cb: ConwayCallback, books: { life: Location[], death: Location[] }) {
        let neighbors: boolean[] = this.gatherNeighbors(location, radius)
        let judgment: Conway | undefined = cb(cell, neighbors, location)

        if (judgment) {
            if (judgment === 'death') {
                books.death.push(location)
            } else if (judgment === 'birth') {
                books.life.push(location)
            }
        }
    }

    gol(cellCallback: ConwayCallback = this.simpleConway(), radius: number = 1) {
        let books: { life: Location[], death: Location[] } = { life: [], death: [] }
        for (let i = 0; i < this.m; i++) {
            for (let j = 0; j < this.n; j++) {
                let x = i, y = j;
                let cell = this.at({x,y})
                if (cell !== undefined) {
                    this.judgeCell(radius, { x, y }, cell, cellCallback, books)
                }
            }
        }
        books.life.forEach((location: Location) => {
            this.activate(location)
        })
        books.death.forEach((location: Location) => {
            this.deactivate(location)
        })
    }

    activate(location: Location) {
        if (this.withinBounds(location.x, location.y)) {
            this.put(location, true)
            // this.config.onActivate(location, this)
        }
    }

    deactivate(location: Location) {
        if (this.withinBounds(location.x, location.y)) {
            // this.config.onDeactivate(location, this)
            this.put(location, false)
        }
    }

    noise(fz=0.1) {
         for (let i = 0; i < this.m; i++) {
            for (let j = 0; j < this.n; j++) {
                if (Math.random() < fz) {
                    let x = i, y = j;
                    let cell = this.at({ x, y })
                    if (cell !== undefined) {
                        this.put({x,y}, flip(true, false))
                    }
                }
            }
        }
    }

    smooth(radius: number = pick(1, 2), eps = 0.25) {
        this.gol((cell, community, _location) => {
            // let community = this.gatherNeighbors(location, radius) //pick(2,3,4))
            let cs = community.reduce((acc, curr) => curr ? ++acc : acc, 0)
            let ratio = cs / community.length
            let base = 0.5 //, eps = 0.24
            if (!cell) {
                if (ratio > base + eps) {
                    return 'birth'
                }
            } else if (cell) {
                if (ratio < base - eps) {
                    return 'death'
                }
            }
        }, radius)
    }
}