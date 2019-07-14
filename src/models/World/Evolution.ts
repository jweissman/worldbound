import { StackLayers } from "../Stack";
import { flip } from "../../util/flip";
import { pick } from "../../util/pick";
import { count } from "../../util/count";
import { Location } from '../../types/Location';
import { iota } from "../../util/iota";
import { pathToFileURL } from "url";
import Grid from "../Grid";

export type Evolution = (layers: StackLayers) => void

export class PlanetaryEvolution {
    static windPushesClouds = (dx: number, dy: number) => (layers: StackLayers) => {
        layers.clouds.shift(dx, dy, () => flip(true, false, 0.4));
    }


    static cloudsGather(layers: StackLayers): void {
        let { clouds } = layers;
        // clouds.noise(0.00125)
        clouds.smooth(pick(1, 2, 4), 0.212)
        // PlanetaryEvolution.cloudsForm(layers)
    }

    static oceanLevelsRise(layers: StackLayers): void {
        let { water } = layers;
        let radius = pick(...iota(4).map(r => r + 1)) //1,2,3,4)
        let epsilon = 0.1185
        water.smooth(radius, epsilon)
    }

    static cloudsForm(layers: StackLayers): void {
        let { clouds, water } = layers;
        // clouds.smooth()
        clouds.gol((cell, ns, loc) => {
            let neighbors = count(ns, Boolean);
            if (cell) {
                // if (neighbors < 1) { return 'death' }
            } else {
                if (neighbors > 6) { return 'birth' }
                if (neighbors > 5 && water.at(loc)) {
                    //     // if (Math.random() < 0.05) {
                    return 'birth'
                    //     // }
                }
            }
        })
    }

    static treesGrow(layers: StackLayers): void {
        let { grass, clouds, water, trees } = layers;
        trees.gol((cell, ns, location) => {
            let neighbors = count(ns, Boolean)
            let ocean = count(water.gatherNeighbors(location), Boolean)
            let veg = count(grass.gatherNeighbors(location), Boolean) + neighbors
            if (cell) {
                if (ocean > 1) {
                    return 'death'
                }
                // if (Math.random() < 0.02) {
                //     return 'death'
                // }
            } else {
                if (ocean == 0) {
                    let chance = Math.random() < 0.1
                    if (chance) {
                        if (neighbors >= 1 && veg > 5) { //} && Math.random() < 0.2) { //} && Math.random() < 0.02) {
                            return 'birth'
                        } else {
                            if (veg > 7) { //} && Math.random() < 0.01) {
                                return 'birth'
                            }
                        }
                    }
                }
            }
        })
    }

    static grassGrows(layers: StackLayers): void {
        let { grass, clouds, water } = layers
        grass.gol((cell, ns, location) => {
            let neighbors = count(ns, Boolean)
            let sky = clouds.at(location)
            let ocean = water.at(location)
            let waterNeighbors: number = count(water.gatherNeighbors(location), Boolean) // n => !!n)
            if (cell) {
                if (ocean) { return 'death'; }
            } else {
                if (!ocean) {
                    let chance = true // Math.random() < 0.35
                    if (chance) {
                        if (waterNeighbors > 1 && sky) {
                            clouds.deactivate(location)
                            return 'birth';
                        }
                        if (waterNeighbors > 0 && neighbors > 0) {
                            return 'birth';
                        }
                        if (neighbors > 2) {
                            return 'birth'
                        }
                    }
                }
            }
        })
    }

    static trailsDecay(layers: StackLayers): void {
        let { trail, path } = layers;
        trail.gol((cell, ns, loc) => {
            if (cell) {
                if (Math.random() < 0.02) {
                    return 'death';
                }
            }
        })
        path.gol((cell, ns, loc) => {
            if (cell) {
                if (Math.random() < 0.002) {
                    return 'death';
                }
            }
        })
    }

    static animalsWander(layers: StackLayers): void {
        let { animals, water, trees, grass, trail, path } = layers;
        let movers: Location[] = []
        animals.gol((cell, ns, loc) => {
            if (cell) {
                let ocean = water.at(loc)
                if (ocean) {
                    // console.log("swimming!", { loc })
                    return 'death'
                }
                else {
                    if (Math.random() < 0.2) {
                        movers.push(loc)
                    }
                }
            }
        })
        movers.forEach(location => {
            let stepCandidates: Location[] = Grid.neighbors(location)
            stepCandidates = stepCandidates.filter(s =>
                animals.withinBounds(s.x, s.y) && !water.at(s) && !animals.at(s)
            )
            stepCandidates = stepCandidates.sort(() => Math.random() > 0.5 ? -1 : 1)
            let step = stepCandidates.find(s => path.at(s)) ||
                stepCandidates.find(s => trail.at(s))
            if (!step || Math.random() < 0.2) {
                step = pick(...stepCandidates)
            }
            if (step) {
                animals.deactivate(location);
                animals.activate(step);
                if (Math.random() < 0.01) {
                    if (trail.at(location)) {
                        path.activate(location)
                    } else {
                        trail.activate(location)

                    }
                }
            }
        })
    }
}
