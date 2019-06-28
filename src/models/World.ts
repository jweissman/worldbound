import Stack from "./Stack";
import { SimpleCell } from "./SimpleCell";
import { Grid } from "./Grid";
import { Location } from '../Location';
import { matrix } from "../util/matrix";
import { Color } from "../types/Palette";
import { assertNever } from "../util/assertNever";

function flip<T>(a: T, b: T, weight: number = 0.5): T { return Math.random() > weight ? a : b; }

class AtmosphereCell extends SimpleCell {}

type Terrain = 'clay' | 'mud' | 'dirt' | 'stone'

class TerrainCell extends SimpleCell {
    constructor(public location: Location, public kind: Terrain) {
        super(location);
        this.activate();
    }

    get color(): Color {
        switch (this.kind) {
            // case 'water': return 'blue';
            case 'mud': return 'brown';
            case 'dirt': return 'light-brown';
            case 'clay': return 'brown-red';
            case 'stone': return 'gray';
            default: return assertNever(this.kind);
        }
    }
}

type Vegetation = 'flower' | 'grass' | 'tree'

class VegetationCell extends SimpleCell {
    constructor(public location: Location, public kind: Vegetation) {
        super(location);
    }
    get color(): Color {
        switch(this.kind) {
          case 'grass': return 'green';
          case 'flower': return 'purple';
          case 'tree': return 'dark-green';
          default: return assertNever(this.kind);
        }
    }
}

class WaterCell extends SimpleCell {
    constructor(public location: Location) {
        super(location);
        if (Math.random() < 0.5) {
            this.activate()
        }
    }
    get color(): Color { return 'blue'; }
}

const dimensions = {
    tiny: { x: 40, y: 35 },
    small: { x: 60, y: 40 },
    medium: { x: 80, y: 65 },
    large: { x: 100, y: 80 },
    huge: { x: 120, y: 100 },
    gigantic: { x: 150, y: 120 },
    enormous: { x: 300, y: 240 },
}


export class World {
    dims: { x: number, y: number } = dimensions.enormous
    grid<T extends SimpleCell>(fn: (x: number, y: number) => T) {
        return new Grid<T>(this.dims.x,this.dims.y,fn)
    }

    stack: Stack;


    constructor() {
        this.stack = new Stack({
            terrain: this.grid<TerrainCell>((x, y) =>
                new TerrainCell({ x, y }, flip('mud', 'clay'))
            ),
            water: this.grid<WaterCell>((x,y) =>
                new WaterCell({ x, y })
            ),
            vegetation: this.grid<VegetationCell>((x, y) => {
                let cell = new VegetationCell({ x, y }, 'grass');
                return cell;
            }),
            atmosphere: this.grid<AtmosphereCell>((x, y) => {
                return new AtmosphereCell({ x, y })
            }),
        })

        for (let i=0; i<4; i++) this.oceanLevelsRise();
    }

    get layers() { return this.stack.layers; }

    get colorMap(): Color[][] {
        let { terrain, vegetation, atmosphere, water } = this.layers;
        const w: number = this.dims.x
        const h: number = this.dims.y
        return matrix<Color>(w,h,(x: number, y: number): Color => {
            let atmo = atmosphere.at({ x, y })
            if (atmo && atmo.active) {
                return atmo.color;
            }
            let veg = vegetation.at({ x, y })
            if (veg && veg.active) {
                return veg.color;
            }
            let h20 = water.at({ x, y })
            if (h20 && h20.active) {
                return h20.color;
            }

            let ground = terrain.at({ x, y })
            if (ground) {
                return ground.color;
            }
            return 'white'; //Color.Black;
        });
    };

    get colorEntries(): { [key: string]: Location[] } {
        let entries: { [key: string]: Location[] } = {}
        // return this.colorMap
        let m = this.colorMap;
        for (let i = 0; i < m.length; i++) {
            for (let j = 0; j < m[i].length; j++) {
                let x=i, y=j;
                let color = this.colorMap[i][j];
                entries[color] = entries[color] || []
                entries[color].push({x,y})

                // if (color !== this.lastFilled) {
                    // ctx.fillStyle = rgb(color);
                    // this.lastFilled = color;
                // }
                // ctx.fillRect(x * this.sz, y * this.sz, this.sz, this.sz);
            }
        }
        return entries;
    }

    ticks = 0;
    evolve(): boolean {
        let evolved = false;
        this.ticks += 1;
        if (this.ticks % 3 === 0) {
            this.cloudsGather();
            evolved = true;
        }
        if (this.ticks % 17 === 0) {
            this.grassGrows();
            evolved = true;
        }
        if (this.ticks % 13 === 0) {
            this.oceanLevelsRise();
            evolved = true;
        }
        return evolved;
    }

    cloudsGather() {
        let { atmosphere, terrain, water } = this.layers;
        atmosphere.gol((cell, neighbors) => {
            let ground: TerrainCell = terrain.at(cell.location);
            let ocean: WaterCell = water.at(cell.location);
            let chance = Math.random() < 0.02
            if (cell.active) {
                if (ground && ground.kind === 'mud') {
                    if (chance) {
                        return 'death';
                    }
                }
            } else {
                if (ocean && ocean.active) { //kind === 'water') {
                    if (chance) {
                        return 'birth';
                    }
                }
                if (neighbors > 3 || chance) {
                    return 'birth';
                }
            }
        })
        atmosphere.gol();
        atmosphere.gol();
    }

    grassGrows() {
        let { vegetation, atmosphere, terrain, water } = this.layers
        vegetation.gol((cell, neighbors) => {
            let { active, location } = cell;
            let chance = Math.random() < 0.18
            if (chance) {
                let sky: AtmosphereCell = atmosphere.at(location)
                let ground: TerrainCell = terrain.at(location)
                let ocean: WaterCell = water.at(location)
                if (active) {
                    if (Math.random() < 0.75) {
                        if (!sky.active && neighbors <= 1) {
                            return 'death';
                        }
                    }
                } else {
                    if (Math.random() < 0.43) {
                        if (ground && ground.kind === 'mud' && !ocean.active) {
                            if (
                                sky.active
                                || (neighbors >= 1)
                            ) {
                                return 'birth';
                            }
                        }
                    }
                }
            }
        })
    }

    oceanLevelsRise() {
        let ocean: Location[] = [];
        let land: Location[] = [];
        let { water } = this.layers;
        water.each((c: WaterCell) => {
            let ns = water.gatherNeighbors(c)
            let bc: number = Grid.count(ns, n => n.active)
            if (bc >= 6) { ocean.push(c.location); }
            if (bc <= 3) { land.push(c.location); }
        })
        ocean.forEach((loc: Location) => {
            let c = water.at(loc);
            if (c) { c.activate(); } //kind = 'water'; }
        })
        land.forEach((loc: Location) => {
            let c = water.at(loc);
            if (c) { c.deactivate(); } //kind = 'mud'; }
        })
        // terrain.gol()
    }


}