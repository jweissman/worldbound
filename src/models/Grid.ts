import { distance } from '../util/distance';
import { Location } from '../types/Location';
import { Color } from '../types/Palette';
import { flip } from '../util/flip';
import { iota } from '../util/iota';
import { pick } from '../util/pick';
import BitArray from 'bit-array';
import { Conway, ConwayCallback, simpleConway } from './Conway';
import { eachMatrixCoordinate } from '../util/matrix';

interface GridConfig {
    initFn: (location: Location) => boolean
    color?: Color
    translucent?: boolean
    visible?: boolean
}

class GridStructure {
    private elements: BitArray // 224ms get on 62s profile
    constructor(private m: number, private n: number) {
        this.elements = new BitArray(m*n) //(m-1)*(n-1))
    }

    setAll(elems: boolean[]) {
        // this.elements = elems;
        this.elements.reset()
        elems.forEach((elem, idx) => this.elements.set(idx, elem))
    }

    at(x: number, y: number): boolean {
        // return this.elements[this.addr(x,y)]
        return this.elements.get(this.addr(x,y));
    }

    set(x: number, y: number, value: boolean): void {
        // this.elements[this.addr(x,y)] = value;
        this.elements.set(this.addr(x,y), value);
    }

    flip(x: number, y: number) {
        // this.set(x,y,!this.at(x,y))
        this.elements.toggle(this.addr(x,y))
    }

    addr(x: number, y: number) {
        return y * (this.m) + x;
    }
}

export default class Grid {
    static assemble(
        dims: { x: number, y: number },
        color: Color,
        initFn: (location: Location) => boolean = () => flip(true, false),
        translucent: boolean = false,
        visible: boolean = true,
        // scale: number = 64
    ) {
        // console.log("assemble grid", { dims, color })
        let g = new Grid(
            dims.x,
            dims.y,
            { initFn, color, translucent, visible }
        )
        // g.scale(scale)
        return g
    }

    private structure: GridStructure
    
    constructor(
        public m: number,
        public n: number,
        public config: GridConfig = {
            initFn: () => flip(true, false),
            color: 'red',
            translucent: true,
        }
    ) {
        this.structure = new GridStructure(m,n);
        iota(m).forEach(i => iota(n).forEach((j) => {
            let loc={x:i,y:j}
            this.put(loc, config.initFn(loc))
        }));
    }

    withinBounds(x: number, y: number): boolean {
        let x0 = 0, y0 = 0, x1 = this.m-1, y1 = this.n-1
        return x >= x0 && y >= y0 && x <= x1 && y <= y1
    }

    at(location: Location): boolean | undefined {
        let { x, y } = location;
        if (this.withinBounds(x,y)) {
            return this.structure.at(x,y)
        }
    }

    put(location: Location, value: boolean) {
        let { x, y } = location;
        if (this.withinBounds(x, y)) {
            this.structure.set(x, y, value)
            return true;
        }
        return false;
    }

    activate(location: Location) {
        this.put(location, true)
    }

    deactivate(location: Location) {
        this.put(location, false)
    }

    scale(z: number=2) {
        console.log("SCALE", {z })
        let newStructure: GridStructure = new GridStructure(this.m, this.n)
        // let newElements: boolean[] = [];
        eachMatrixCoordinate(this.m, this.n, (x: number, y: number) => {
            let x0 = Math.floor(x / z)
            let y0 = Math.floor(y / z)
            let c = this.at({ x: x0, y: y0 })
            if (c !== undefined) {
                newStructure.set(x,y,c)
                // newElements.push(c)
            }
        })
        this.structure = newStructure; //.setAll(newElements);
        return this;
    }

    shift(dx: number = 0, dy: number = 0, empty: () => boolean = () => flip(true, false)) {
        let newStructure: GridStructure = new GridStructure(this.m, this.n)
        eachMatrixCoordinate(this.m, this.n, (x: number, y: number) => {
            if (this.withinBounds(x + dx, y + dy)) {
                let cell = this.at({
                    x: x + dx,
                    y: y + dy
                })
                if (cell !== undefined) {
                    newStructure.set(x, y, cell)
                }
            } else {
                newStructure.set(x,y,empty())
            }
        })
        this.structure = newStructure;
        return this;
    }

    static neighborsMap: Location[][][] = []
    static neighbors(location: Location): Location[] {
        let { x, y } = location;
        if (Grid.neighborsMap[x] && Grid.neighborsMap[x][y]) {
            return Grid.neighborsMap[x][y]
        } else {
            let i = x, j = y;
            let list = [
                { x: i - 1, y: j },
                { x: i,     y: j - 1 },
                { x: i,     y: j + 1 },
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
            let val = this.at(loc)
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

    gol(cellCallback: ConwayCallback = simpleConway(), radius: number = 1) {
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


    noise(fz=0.1) {
         for (let i = 0; i < this.m; i++) {
            for (let j = 0; j < this.n; j++) {
                if (Math.random() < fz) {
                    let x = i, y = j;
                    let cell = this.at({ x, y })
                    if (cell !== undefined) {
                        this.structure.flip(x,y) //.put({x,y}, flip(true, false))
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