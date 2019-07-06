import Stack from "../Stack";
import Grid from "../Grid";
import { WorldConfig, defaultConfig } from "./WorldConfig";
import { dimensions } from "./WorldSize";
import { flip } from "../../util/flip";
import { iota } from "../../util/iota";
import { PlanetaryEvolution, Evolution } from "./Evolution";

type Dimensions = { x: number, y: number }

export class World {
    private stack: Stack;
    private dims: Dimensions
    private ticks = 0;
    private evolutionarySeries: Evolution[] = [
        PlanetaryEvolution.cloudsForm,
        PlanetaryEvolution.cloudsGather,
        PlanetaryEvolution.oceanLevelsRise,
        PlanetaryEvolution.windPushesClouds(1, 1),
        PlanetaryEvolution.grassGrows,
    ]

    constructor(private config: WorldConfig = defaultConfig) {
        this.dims = dimensions[config.size]
        this.stack = new Stack({
            water: Grid.assemble(this.dims, 'blue', () => flip(true, false, config.waterRatio)),
            grass: Grid.assemble(this.dims, 'green', () => false),
            // trees: Grid.boolean(this.dims, 'dark-green', () => flip),
            // upperClouds: Grid.boolean(this.dims, 'gray', () => flip(true, false, config.cloudRatio), true),
            // animals: Grid.boolean(this.dims, 'orange', () => false)
            // people: Grid.boolean(this.dims, 'yellow', () => false)
            clouds: Grid.assemble(this.dims, 'white', () => flip(true, false, config.cloudRatio), true),
        })

        for (let i of iota(5)) { this.evolve() }
    }

    get layers() { return this.stack.layers; }
    
    evolve(): boolean {
        let evolved = false;
        this.ticks += 1;
        this.evolutionarySeries.forEach((evolution: Evolution, index: number) => {
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
}