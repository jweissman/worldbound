import Stack, { StackLayers } from "../Stack";
// import { SimpleCell } from "../SimpleCell";
import { Grid } from "../Grid";
import { Location } from '../../Location';
import { matrix, eachMatrixEntry, eachMatrixCoordinate } from "../../util/matrix";
import { Color } from "../../types/Palette";
// import { TerrainCell, WaterCell, VegetationCell, AtmosphereCell } from '../Cells';
import { WorldConfig, defaultConfig } from "./WorldConfig";
import { dimensions } from "./WorldSize";
import { flip } from "../../util/flip";

type Evolution = (layers: StackLayers) => void
type Dimensions = { x: number, y: number }

export class World {
    private stack: Stack;
    private dims: Dimensions


    constructor(private config: WorldConfig = defaultConfig) {
        this.dims = dimensions[config.size]
        this.stack = new Stack({
            water: Grid.boolean(this.dims, 'blue', () => flip(true, false, config.waterRatio)),
            grass: Grid.boolean(this.dims, 'green', () => flip(true, false, 0.00)),
            clouds: Grid.boolean(this.dims, 'white', () => flip(true, false, config.cloudRatio), true),
        })
    }

    get layers() { return this.stack.layers; }

    get colorMap(): Color[][] {
        let { grass, clouds, water } = this.layers;
        const w: number = this.dims.x
        const h: number = this.dims.y
        const colorAtLocation = (layer: Grid<any>, location: Location): Color | undefined => {
            let c = layer.at(location)
            if (c && layer.isActive(c)) {
                return layer.colorFor(c);
            }
        }
        return matrix<Color>(w,h,(location: Location): Color => {
            let atmo = colorAtLocation(clouds, location)
            if (atmo) { return atmo; }
            let veg = colorAtLocation(grass, location)
            if (veg) { return veg; }
            let h20 = colorAtLocation(water, location)
            if (h20) { return h20; }
            return 'brown';
        });
    };

    ticks = 0;
    evolve(): boolean {
        let evolved = false;
        this.ticks += 1;
        let evolutionarySeries: Evolution[] = [
            World.oceanLevelsRise,
            World.cloudsGather,
            World.grassGrows,
        ]
        evolutionarySeries.forEach((evolution: Evolution, index: number) => {
            let interval = this.config.tickSeries[index];
            if (this.ticks % interval === 0) {
                if (evolution) {
                    evolution.call(this, this.layers);
                    evolved = true;
                }
            }
        })
        return evolved;
    }

    static cloudsGather(layers: StackLayers): void {
        let { clouds, water } = layers;
        clouds.gol((cell, neighbors, location) => {
            let community = clouds.gatherNeighbors(location, 2) //1+Math.floor(Math.random()*2))
            let cs = Grid.count(community, n => clouds.isActive(n))
            let ratio = cs / community.length
            let chance = Math.random() < 0.13
            let eps = 0.12
            if (!cell) {
                if (ratio > 0.5 + eps || (ratio > eps && chance) ) {
                    return 'birth'
                }
            } else if (cell) {
                if (ratio < 0.5 - eps || (ratio < 1-eps && chance)) { 
                    return 'death'
                }
            }
        })
        // clouds.gol()
    }

    static grassGrows(layers: StackLayers): void {
        let { grass, clouds, water } = layers
        grass.gol((cell, neighbors, location) => {
            // if (cell.kind !== 'grass') return;
            // let { active, location } = cell;
            // let chance = Math.random() < 0.78
            // if (chance) {
                let sky = clouds.at(location) //: AtmosphereCell | undefined = atmosphere.at(location)
                let ocean = water.at(location) //: WaterCell | undefined = water.at(location)
                let waterNeighbors: number = Grid.count(water.gatherNeighbors(location), n => !!n)
                if (cell) {
                    if (ocean || neighbors.length < 1) {
                        return 'death';
                    }
                    if (Math.random() < 0.01) {
                        return 'death'
                    }
                } else {
                    if (Math.random() < 0.28) {
                        if (!ocean) {
                            if (
                                sky && waterNeighbors > 0
                            ) {
                                return 'birth';
                            }
                            if (waterNeighbors > 0 && neighbors.length > 2) { 
                                return 'birth';
                            }

                            if (Math.random() < 0.05 && neighbors.length >= 2) {
                                return 'birth'
                            }
                        }
                    }
                }
                // }
            // } else {
            //     if (cell) {
            //         if (Math.random() < 0.01) {
            //             if (neighbors.length >= 3) { //vegetation.gatherNeighbors(cell))
            //                 // grow tree?
            //                 // cell.kind = 'tree'
            //             } else {
            //                 return flip('death', 'unchanged')
            //             }
            //         }
            //     }
            // }
        })
    }

    static oceanLevelsRise(layers: StackLayers): void {
        console.log("OCEAN LEVELS RISE")
        // let r = Math.floor(Math.random()*3);
        let ocean: Location[] = [];
        let land: Location[] = [];
        let { water } = layers;
        eachMatrixCoordinate(water.structure, (x, y) => {
        // for (let c of water.cellList) {
        // water.each((c: WaterCell) => {
            let location = {x,y}
            let eps = 0.02 //274
            let ns = water.gatherNeighbors(location, 4) //, 2) //, 1+2**r) //Math.floor(Math.random()*8))
            let bc: number = Grid.count(ns, n => water.isActive(n))
            let ratio = bc / ns.length
            // if (ns.length !== bc) { console.log({ ns, bc }) }
            // if (cell) {
            if (ratio < 0.5 - eps) { land.push(location); }
            // } else {
            if (ratio > 0.5 + eps) { ocean.push(location); }
            // }
        })
        // console.log({ ocean, land })
        ocean.forEach((loc: Location) => {
            water.activate(loc)
            // let c = water.at(loc);
            // if (c) { water.activate() //.a//c.active = true; } //(); }
        })
        land.forEach((loc: Location) => {
            water.deactivate(loc)
            // let c: WaterCell | undefined = water.at(loc);
            // if (c) { c.active = false; } //deactivate(); }
        })
    }
}