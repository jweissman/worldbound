import Stack, { StackLayers } from "../Stack";
import Grid from "../Grid";
import { Location } from '../../Location';
import { eachMatrixCoordinate } from "../../util/matrix";
import { WorldConfig, defaultConfig } from "./WorldConfig";
import { dimensions } from "./WorldSize";
import { flip } from "../../util/flip";
import { pick } from "../../util/pick";

type Evolution = (layers: StackLayers) => void
type Dimensions = { x: number, y: number }

export class World {
    private stack: Stack;
    private dims: Dimensions


    constructor(private config: WorldConfig = defaultConfig) {
        this.dims = dimensions[config.size]
        this.stack = new Stack({
            water: Grid.boolean(this.dims, 'blue', () => flip(true, false, config.waterRatio)),
            grass: Grid.boolean(this.dims, 'green', () => false), //flip(true, false, 0.00)),
            // trees: Grid.boolean(this.dims, 'dark-green', () => flip),
            // upperClouds: Grid.boolean(this.dims, 'gray', () => flip(true, false, config.cloudRatio), true),
            // animals: Grid.boolean(this.dims, 'orange', () => false)
            // people: Grid.boolean(this.dims, 'yellow', () => false)
            clouds: Grid.boolean(this.dims, 'white', () => flip(true, false, config.cloudRatio), true),
        })
    }

    get layers() { return this.stack.layers; }

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
        clouds.gol((cell, _neighbors, location) => {
            let community = clouds.gatherNeighbors(location,pick(1,3,5))
            let cs = // Grid.count(community, n => !!n) //clouds.isActive(n))
                // community.filter(Boolean).length 
                community.reduce((acc, curr) => curr ? ++acc : acc, 0)
            let ratio = cs / community.length
            let chance = Math.random() < 0.13
            let eps = 0.05
            if (!cell) {
                if (ratio > 0.5 + eps || (ratio > eps && chance) || (ratio > 2*eps && water.at(location) && chance)) {
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
            let sky = clouds.at(location)
            let ocean = water.at(location)
            let waterNeighbors: number = Grid.count(
                water.gatherNeighbors(location), n => !!n)
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
        })
    }

    static oceanLevelsRise(layers: StackLayers): void {
        console.log("OCEAN LEVELS RISE")
        let ocean: Location[] = [];
        let land: Location[] = [];
        let { water } = layers;
        eachMatrixCoordinate(water.structure, (x, y) => {
            let location = { x, y }
            let eps = 0.02
            let ns = water.gatherNeighbors(location, pick(1,2))
            let bc: number = ns.reduce((acc, curr) => curr ? ++acc : acc, 0)
            let ratio = bc / ns.length
            if (ratio < 0.5 - eps) { land.push(location); }
            if (ratio > 0.5 + eps) { ocean.push(location); }
        })
        ocean.forEach((loc: Location) => { water.activate(loc) })
        land.forEach((loc: Location) => { water.deactivate(loc) })
    }
}