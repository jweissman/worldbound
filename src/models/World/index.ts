import Stack from "../Stack";
import Grid from "../Grid";
import { WorldConfig, defaultConfig } from "./WorldConfig";
import { dimensions } from "./WorldSize";
import { flip } from "../../util/flip";
import { iota } from "../../util/iota";
import { PlanetaryEvolution, Evolution } from "./Evolution";
import { Location } from '../../types/Location';

type Dimensions = { x: number, y: number }

class Person {
    constructor(private location: Location) {}
}

export class World {
    private player: Person = new Person({x:10,y:10})
    private stack: Stack;
    private dims: Dimensions
    private ticks = 0;

    private evolutionarySeries: Evolution[] = [
        PlanetaryEvolution.animalsWander,
        PlanetaryEvolution.cloudsGather,
        PlanetaryEvolution.windPushesClouds(-1,-1),
        PlanetaryEvolution.treesGrow,
        PlanetaryEvolution.cloudsForm,
        PlanetaryEvolution.grassGrows,
        PlanetaryEvolution.trailsDecay,
        // PlanetaryEvolution.oceanLevelsRise,
    ]

    constructor(private config: WorldConfig = defaultConfig) {
        this.dims = dimensions[config.size]
        console.log("Assembling world layers...")
        this.stack = new Stack({
            water: Grid.assemble(this.dims, 'blue', () => flip(true, false, config.waterRatio)),
            grass: Grid.assemble(this.dims, 'green', () => false),
            trees: Grid.assemble(this.dims, 'dark-green', () => false),
            // attach names?
            trail: Grid.assemble(this.dims, 'pink', () => false, true, false),
            path: Grid.assemble(this.dims, 'light-brown', () => false, false, false),
            animals: Grid.assemble(this.dims, 'white', () => flip(true, false, 0.01), false, true),
            humans: Grid.assemble(this.dims, 'white', () => false, false, true),
            clouds: Grid.assemble(this.dims, 'white', () => flip(true, false, config.cloudRatio), true),
        })
        console.log("World layers assembled!")
        // this.prepareLandscape();
    }

    private prepareLandscape() {
        let q=1, z = 1.3
        let n = 5 //0.07 * 10 ** 2
        for (let j of iota(q)) {
            for (let i of iota(n)) {
                PlanetaryEvolution.oceanLevelsRise(this.stack.layers)
                // this.evolve();
                console.log("startup evolution I", (i / n) * 100, j)
            }
            this.stack.layers.water.scale(z) ///q) //1.04) //z/q) //1.675)
            for (let i of iota(n)) {
                // this.evolve();
                PlanetaryEvolution.oceanLevelsRise(this.stack.layers)
                console.log("startup evolution II", (i / n) * 100, j)
            }
        }
    }

    get layers() { return this.stack.layers; }

    evolve(): boolean {
        let evolved = false;
        this.ticks += 1;
        if (this.ticks < 9) {
            if (this.ticks > 5) {
                this.prepareLandscape();
            }
            return true;
        } else {
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
}